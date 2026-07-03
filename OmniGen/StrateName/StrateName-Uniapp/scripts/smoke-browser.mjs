import { chromium } from 'playwright'

const url = process.env.STRATENAME_SMOKE_URL || 'http://127.0.0.1:5193'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const consoleMessages = []
page.on('console', (message) => {
  if (['error', 'warning'].includes(message.type())) {
    consoleMessages.push(`${message.type()}: ${message.text()}`)
  }
})
page.on('pageerror', (error) => consoleMessages.push(`pageerror: ${error.message}`))

await page.goto(url, { waitUntil: 'networkidle' })
await page.getByText('Generate Names').click()
await page.getByText('candidates').waitFor({ timeout: 10000 })
await page.locator('[data-tab-id="shortlist"]').click()
await page.locator('[data-tab-id="proposal"]').click()
await page.locator('[data-tab-id="settings"]').click()
await page.locator('[data-legal-type="privacy"]').click()
await page.getByText('Privacy Policy').waitFor({ timeout: 10000 })
if (await page.getByText('Document language').count()) {
  throw new Error('Privacy page should not render a language selector.')
}
await page.locator('.legal-header .plain-icon').click()
await page.locator('[data-legal-type="disclaimer"]').click()
await page.getByText('Disclaimer').waitFor({ timeout: 10000 })
if (await page.getByText('Document language').count()) {
  throw new Error('Disclaimer page should not render a language selector.')
}
await page.locator('.legal-header .plain-icon').click()

const hasTitle = await page.locator('.settings-screen .page-title').isVisible()
await browser.close()

if (!hasTitle) throw new Error('Settings screen did not render in browser smoke.')
if (consoleMessages.length) {
  throw new Error(`Browser console issues:\n${consoleMessages.join('\n')}`)
}

console.log(`Browser smoke ok: ${url}`)
