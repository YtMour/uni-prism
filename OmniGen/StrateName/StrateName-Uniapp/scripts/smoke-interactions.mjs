import { createReadStream, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const dist = resolve(root, 'dist/build/h5')
const reportPath = resolve(root, 'reports/interaction-smoke.json')
const externalUrl = process.env.STRATENAME_SMOKE_URL

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

async function clickUnique(page, selector, label) {
  const locator = page.locator(selector)
  const count = await locator.count()
  if (count !== 1) throw new Error(`${label} expected 1 match, found ${count}.`)
  await locator.click()
}

async function candidateNames(page) {
  return page.locator('.candidate-name').allTextContents()
}

async function run() {
  const runtime = externalUrl ? { url: externalUrl, server: null } : await startStaticServer()
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const consoleIssues = []
  const checkpoints = []

  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleIssues.push(`${message.type()}: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => consoleIssues.push(`pageerror: ${error.message}`))

  try {
    await page.goto(runtime.url, { waitUntil: 'networkidle' })
    await page.evaluate(() => localStorage.clear())
    await page.reload({ waitUntil: 'networkidle' })

    await page.getByRole('button', { name: /Generate Names|Generate Again/ }).click()
    await page.getByText('candidates').waitFor({ timeout: 10000 })
    checkpoints.push('generated candidates')

    const initialNames = await candidateNames(page)
    await page.getByRole('button', { name: /Generate Again/ }).click()
    await page.waitForFunction((previousNames) => {
      const currentNames = Array.from(document.querySelectorAll('.candidate-name')).map((node) => node.textContent.trim())
      return JSON.stringify(currentNames) !== JSON.stringify(previousNames)
    }, initialNames, { timeout: 10000 })
    checkpoints.push('regenerated candidates changed')

    await page.locator('.candidate-card').first().click()
    await page.locator('.detail-sheet').waitFor({ timeout: 10000 })
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await page.getByRole('button', { name: 'Close candidate detail' }).click()
    checkpoints.push('saved from detail')

    await page.locator('[data-tab-id="shortlist"]').click()
    await page.getByText('1 saved names for review').waitFor({ timeout: 10000 })
    const note = 'Priority review'
    await page.getByPlaceholder('Add note').fill(note)
    checkpoints.push('note entered')

    await page.locator('[data-tab-id="proposal"]').click()
    await page.getByRole('button', { name: 'Lobby Wall' }).click()
    const lobbyActive = await page.locator('.proposal-preview.is-lobby').isVisible()
    if (!lobbyActive) throw new Error('Proposal template did not switch to Lobby Wall.')
    checkpoints.push('proposal template switched')

    await page.reload({ waitUntil: 'networkidle' })
    await page.locator('[data-tab-id="shortlist"]').click()
    await page.getByPlaceholder('Add note').waitFor({ timeout: 10000 })
    const persistedNote = await page.getByPlaceholder('Add note').inputValue()
    if (persistedNote !== note) {
      throw new Error(`Shortlist note did not persist. Expected "${note}", got "${persistedNote}".`)
    }
    checkpoints.push('note persisted after reload')

    page.once('dialog', async (dialog) => {
      if (dialog.type() !== 'confirm') throw new Error(`Unexpected dialog type: ${dialog.type()}`)
      await dialog.accept()
    })
    await page.getByRole('button', { name: 'Clear' }).click()
    await page.getByText('0 saved names for review').waitFor({ timeout: 10000 })
    checkpoints.push('clear shortlist confirmed')

    await page.locator('[data-tab-id="settings"]').click()
    await page.locator('.legal-language-select .native-dropdown-trigger').click()
    await page.locator('.legal-language-select [data-option-id="ar"]').click()
    await page.locator('[data-legal-type="privacy"]').click()
    await page.getByText('سياسة الخصوصية').waitFor({ timeout: 10000 })
    const privacyRtl = await page.locator('.legal-screen.is-rtl').isVisible()
    if (!privacyRtl) throw new Error('Arabic privacy policy did not render in RTL mode.')
    const documentLanguageControls = await page.getByText('Document language').count()
    if (documentLanguageControls !== 0) throw new Error('Legal document page should not render a language selector.')
    await page.locator('.legal-header .plain-icon').click()
    checkpoints.push('privacy page language switched')

    await page.locator('[data-legal-type="disclaimer"]').click()
    await page.getByText('إخلاء المسؤولية').waitFor({ timeout: 10000 })
    await page.locator('.legal-header .plain-icon').click()
    checkpoints.push('disclaimer page opened')

    if (consoleIssues.length) {
      throw new Error(`Browser console issues:\n${consoleIssues.join('\n')}`)
    }
  } finally {
    await browser.close()
    runtime.server?.close()
  }

  const report = {
    generatedAt: new Date().toISOString(),
    url: runtime.url,
    checkpoints,
    consoleIssues
  }
  mkdirSync(dirname(reportPath), { recursive: true })
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  console.log(`Interaction smoke ok: ${checkpoints.length} checkpoints.`)
}

await run()
