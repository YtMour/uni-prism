import { createReadStream, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist/build/h5')
const reportPath = resolve(root, 'reports/i18n-ui-audit.json')
const externalUrl = process.env.STRATENAME_I18N_URL

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
    throw new Error('dist/build/h5/index.html is missing. Run npm run build:h5 first.')
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

async function visibleText(page, selector) {
  return page.locator(selector).evaluate((node) => node.textContent.replace(/\s+/g, ' ').trim())
}

function findForbidden(screen, text) {
  const forbidden = [
    'Business Name Generator',
    'Generate Again',
    'Generate Names',
    'Seed off',
    'candidates',
    'Finance & Capital',
    'Global Venture',
    'Capital-ready',
    'Boardroom',
    'Standard',
    'suggests',
    'gives the name',
    'familiar corporate role',
    'Creative naming suggestion',
    'Verify company registration',
    'Candidate Detail',
    'Total Score',
    'Name structure',
    'Score breakdown',
    'Why it works',
    'Needs verification',
    'Add note',
    'Decision signals',
    'Shortlist is stored locally',
    'Boardroom Proposal',
    'Export summary',
    'Copy proposal text',
    'Add to Shortlist',
    'Tagline',
    'Preview only'
  ]
  return forbidden
    .filter((phrase) => text.includes(phrase))
    .map((phrase) => `${screen}: still contains "${phrase}"`)
}

async function run() {
  const runtime = externalUrl ? { url: externalUrl, server: null } : await startStaticServer()
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const findings = []
  const snapshots = {}

  try {
    await page.goto(runtime.url, { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'networkidle' })

    await page.locator('[data-tab-id="settings"]').click()
    await page.locator('.legal-language-select .native-dropdown-trigger').click()
    await page.locator('.legal-language-select [data-option-id="zh-Hans"]').click()
    await page.locator('[data-tab-id="generate"]').click()

    await page.getByRole('button', { name: '生成名称' }).click()
    await page.getByText('个候选').waitFor({ timeout: 10000 })
    snapshots.generate = await visibleText(page, '.generate-screen')
    findings.push(...findForbidden('generate', snapshots.generate))

    await page.locator('.candidate-card').first().click()
    await page.locator('.detail-sheet').waitFor({ timeout: 10000 })
    snapshots.detail = await visibleText(page, '.detail-sheet')
    findings.push(...findForbidden('detail', snapshots.detail))
    await page.getByRole('button', { name: '保存', exact: true }).click()
    await page.getByRole('button', { name: '关闭候选详情' }).click()

    await page.locator('[data-tab-id="shortlist"]').click()
    await page.getByText('个已保存名称待审核').waitFor({ timeout: 10000 })
    snapshots.shortlist = await visibleText(page, '.screen')
    findings.push(...findForbidden('shortlist', snapshots.shortlist))

    await page.locator('[data-tab-id="proposal"]').click()
    await page.getByText('董事会提案').waitFor({ timeout: 10000 })
    snapshots.proposal = await visibleText(page, '.proposal-screen')
    findings.push(...findForbidden('proposal', snapshots.proposal))
  } finally {
    await browser.close()
    runtime.server?.close()
  }

  const report = {
    generatedAt: new Date().toISOString(),
    url: runtime.url,
    locale: 'zh-Hans',
    findings,
    snapshots
  }
  mkdirSync(dirname(reportPath), { recursive: true })
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  if (findings.length) {
    throw new Error(`I18n UI audit failed:\n${findings.join('\n')}`)
  }

  console.log('I18n UI audit ok: zh-Hans visible app UI is localized across Generate, Detail, Shortlist and Proposal.')
}

await run()
