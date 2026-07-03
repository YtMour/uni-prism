import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist/build/h5')
const reportDir = resolve(root, 'reports/visual-audit')
const reportPath = resolve(root, 'reports/visual-audit.json')
const externalUrl = process.env.STRATENAME_AUDIT_URL

const viewports = [
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'desktop-1280', width: 1280, height: 720 }
]

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
}

function startStaticServer() {
  if (!existsSync(resolve(dist, 'index.html'))) {
    throw new Error('dist/build/h5/index.html is missing. Run npm run build:h5 before audit:visual.')
  }

  const server = createServer((request, response) => {
    const url = new URL(request.url || '/', 'http://127.0.0.1')
    const requested = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)
    const filePath = resolve(dist, `.${requested}`)
    const safe = filePath.startsWith(dist)
    const finalPath = safe && existsSync(filePath) ? filePath : resolve(dist, 'index.html')
    response.setHeader('Content-Type', mimeTypes[extname(finalPath)] || 'application/octet-stream')
    createReadStream(finalPath).pipe(response)
  })

  return new Promise((resolveServer) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      resolveServer({ server, url: `http://127.0.0.1:${address.port}` })
    })
  })
}

async function assertNoHorizontalScroll(page, label) {
  const metrics = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    body: document.body.scrollWidth,
    html: document.documentElement.scrollWidth
  }))
  const overflow = Math.max(metrics.body, metrics.html) - metrics.innerWidth
  if (overflow > 2) {
    throw new Error(`${label} has horizontal overflow: ${overflow}px`)
  }
}

async function run() {
  mkdirSync(reportDir, { recursive: true })
  const runtime = externalUrl ? { url: externalUrl, server: null } : await startStaticServer()
  const browser = await chromium.launch({ headless: true })
  const findings = []

  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } })
      const consoleIssues = []
      page.on('console', (message) => {
        if (['error', 'warning'].includes(message.type())) {
          consoleIssues.push(`${message.type()}: ${message.text()}`)
        }
      })
      page.on('pageerror', (error) => consoleIssues.push(`pageerror: ${error.message}`))

      await page.goto(runtime.url, { waitUntil: 'networkidle' })
      await page.getByRole('button', { name: /Generate Names|Generate Again/ }).click()
      await page.getByText('candidates').waitFor({ timeout: 10000 })
      await assertNoHorizontalScroll(page, viewport.name)

      const hasCompactFilters = await page.locator('.active-filter-chips').isVisible()
      const fullFilterVisible = await page.locator('.filter-panel').isVisible()
      if (!hasCompactFilters || fullFilterVisible) {
        findings.push(`${viewport.name}: generated results must show compact filter chips and hide the full filter panel.`)
      }

      if (viewport.name === 'mobile-390') {
        await page.locator('.candidate-card').first().click()
        await page.locator('.detail-sheet').waitFor({ timeout: 10000 })
        const malformedRows = await page.locator('.structure-row').evaluateAll((rows) => {
          return rows.filter((row) => {
            const label = row.querySelector('.structure-label')
            const value = row.querySelector('.structure-value')
            if (!label || !value) return true
            const styles = window.getComputedStyle(row)
            return styles.display !== 'grid' || Number.parseFloat(styles.columnGap || '0') < 12
          }).length
        })
        if (malformedRows) {
          findings.push('mobile-390: Candidate Detail structure rows need separate label/value grid columns.')
        }
        await page.locator('.sheet-top .plain-icon').first().click()

        await page.locator('[data-tab-id="proposal"]').click()
        await page.locator('.proposal-screen').waitFor({ timeout: 10000 })
        const copyButton = page.getByRole('button', { name: /Copy proposal text/ })
        await copyButton.waitFor({ timeout: 10000 })
        const copyBox = await copyButton.boundingBox()
        if (!copyBox || copyBox.y + copyBox.height > viewport.height - 78) {
          findings.push('mobile-390: Copy proposal text must be visible above the tab bar on the first Proposal viewport.')
        }
        await page.screenshot({ path: join(reportDir, 'proposal-first-viewport-390x844.png'), fullPage: true })
      }

      if (consoleIssues.length) {
        findings.push(`${viewport.name}: console issues\n${consoleIssues.join('\n')}`)
      }
      await page.screenshot({ path: join(reportDir, `${viewport.name}.png`), fullPage: true })
      await page.close()
    }
  } finally {
    await browser.close()
    runtime.server?.close()
  }

  const report = {
    generatedAt: new Date().toISOString(),
    url: runtime.url,
    viewports,
    findings
  }
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  if (findings.length) {
    throw new Error(`Visual audit failed:\n${findings.join('\n')}`)
  }

  console.log(`Visual audit ok: ${viewports.length} viewports checked.`)
}

await run()
