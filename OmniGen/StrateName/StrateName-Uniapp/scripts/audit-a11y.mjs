import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist/build/h5')
const reportPath = resolve(root, 'reports/a11y-audit.json')
const externalUrl = process.env.STRATENAME_A11Y_URL

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
}

function startStaticServer() {
  if (!existsSync(resolve(dist, 'index.html'))) {
    throw new Error('dist/build/h5/index.html is missing. Run npm run build:h5 before audit:a11y.')
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

function isSymbolOnly(text) {
  return /^[^\p{L}\p{N}]{1,3}$/u.test(String(text || '').trim())
}

async function collectVisibleAudit(page, screen) {
  return page.evaluate((screenName) => {
    const buttons = [...document.querySelectorAll('button')]
      .filter((button) => {
        const rect = button.getBoundingClientRect()
        const styles = getComputedStyle(button)
        return rect.width > 0 && rect.height > 0 && styles.visibility !== 'hidden'
      })
      .map((button) => {
        const rect = button.getBoundingClientRect()
        const text = (button.textContent || '').replace(/\s+/g, ' ').trim()
        const aria = button.getAttribute('aria-label') || ''
        return {
          screen: screenName,
          text,
          aria,
          className: button.className || '',
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        }
      })
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
    return {
      title: document.title,
      description,
      buttons
    }
  }, screen)
}

async function run() {
  const runtime = externalUrl ? { url: externalUrl, server: null } : await startStaticServer()
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const findings = []
  const audits = []

  try {
    await page.goto(runtime.url, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /Generate Names|Generate Again/ }).click()
    await page.getByText('candidates').waitFor({ timeout: 10000 })
    await page.locator('.candidate-card').first().click()
    await page.locator('.detail-sheet').waitFor({ timeout: 10000 })
    audits.push(await collectVisibleAudit(page, 'candidate-detail'))
    await page.getByRole('button', { name: 'Close candidate detail' }).click()

    await page.locator('[data-tab-id="proposal"]').click()
    await page.getByText('Boardroom Proposal').waitFor({ timeout: 10000 })
    audits.push(await collectVisibleAudit(page, 'proposal'))

    await page.locator('[data-tab-id="settings"]').click()
    await page.getByText('Generation defaults').waitFor({ timeout: 10000 })
    audits.push(await collectVisibleAudit(page, 'settings'))

    await page.locator('[data-legal-type="privacy"]').click()
    await page.getByText('Privacy Policy').waitFor({ timeout: 10000 })
    audits.push(await collectVisibleAudit(page, 'privacy'))
    await page.locator('.legal-header .plain-icon').click()

    await page.locator('[data-legal-type="disclaimer"]').click()
    await page.getByText('Disclaimer').waitFor({ timeout: 10000 })
    audits.push(await collectVisibleAudit(page, 'disclaimer'))

    const audit = audits[0]

    if (audit.title !== 'StrateName') findings.push('Document title must be StrateName.')
    if (!audit.description.includes('Boardroom-ready')) findings.push('Document description meta is missing product context.')

    for (const button of audits.flatMap((item) => item.buttons)) {
      const name = button.aria || button.text
      if (!name) findings.push(`Button without accessible name: ${button.screen} ${button.className}`)
      if (isSymbolOnly(button.text) && !button.aria) {
        findings.push(`Symbol-only button needs aria-label: "${button.text}" (${button.screen} ${button.className})`)
      }
      if (/(plain-icon|icon-action|remove-cell|stepper|native-dropdown-trigger)/.test(button.className) && (button.width < 40 || button.height < 40)) {
        findings.push(`Icon/control button target too small: "${name}" ${button.screen} ${button.width}x${button.height}`)
      }
    }
  } finally {
    await browser.close()
    runtime.server?.close()
  }

  const report = {
    generatedAt: new Date().toISOString(),
    url: runtime.url,
    screens: audits.map((item) => item.buttons[0]?.screen).filter(Boolean),
    findings
  }
  mkdirSync(dirname(reportPath), { recursive: true })
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  if (findings.length) {
    throw new Error(`A11y audit failed:\n${findings.join('\n')}`)
  }

  console.log('A11y audit ok: labels, metadata and key touch targets checked.')
}

await run()
