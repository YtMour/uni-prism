import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { chromium } from 'playwright'

const targetUrl = process.env.VIBENAME_SMOKE_URL || 'http://127.0.0.1:5191/'
const reportPath = resolve('reports/browser-smoke.json')

async function readMetrics(page) {
  return page.evaluate(() => {
    const appFrame = document.querySelector('.app-frame')?.getBoundingClientRect()
    const detailSheet = document.querySelector('[data-testid="detail-sheet"]')?.getBoundingClientRect()
    return {
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      appFrameWidth: Math.round(appFrame?.width || 0),
      candidateCardCount: document.querySelectorAll('[data-testid="candidate-card"]').length,
      detailSheetWidth: Math.round(detailSheet?.width || 0),
      detailFormula: document.querySelector('.formula-line')?.textContent || '',
      scorePills: document.querySelectorAll('.score-pill').length,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
      previewVisible: !!document.querySelector('[data-testid="preview-screen"]'),
      whiteboardVisible: !!document.querySelector('[data-testid="whiteboard-screen"]'),
      settingsVisible: !!document.querySelector('[data-testid="settings-screen"]'),
      legalVisible: !!document.querySelector('[data-testid="legal-screen"]'),
      appDirection: document.querySelector('.app-shell')?.getAttribute('dir') || ''
    }
  })
}

async function resetLocalState(page) {
  await page.evaluate(() => {
    try {
      localStorage.clear()
      if (typeof uni !== 'undefined' && uni.clearStorageSync) {
        uni.clearStorageSync()
      }
    } catch (error) {
      // Best-effort cleanup. The smoke still validates the visible state after reload.
    }
  })
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
const logs = []
page.on('console', (message) => {
  if (['warning', 'error'].includes(message.type())) {
    logs.push({ type: message.type(), text: message.text() })
  }
})

try {
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' })
  await resetLocalState(page)
  await page.reload({ waitUntil: 'domcontentloaded' })

  await page.locator('[data-testid="generate-button"]').click()
  await page.locator('[data-testid="candidate-card"]').first().waitFor({ state: 'visible' })
  const candidateCardCount = await page.locator('[data-testid="candidate-card"]').count()
  assert(candidateCardCount === 8, `expected 8 candidate cards, got ${candidateCardCount}`)

  await page.locator('[data-testid="candidate-card"]').first().click()
  await page.locator('[data-testid="detail-sheet"]').waitFor({ state: 'visible' })
  let metrics = await readMetrics(page)
  assert(metrics.detailFormula.length > 0, 'detail formula is missing')
  assert(!metrics.overflowX, 'detail screen has horizontal overflow')

  await page.locator('[data-testid="detail-save"]').click()
  await page.locator('[data-testid="detail-preview"]').click()
  await page.locator('[data-testid="preview-screen"]').waitFor({ state: 'visible' })
  metrics = await readMetrics(page)
  assert(metrics.previewVisible, 'preview screen did not open')
  assert(!metrics.overflowX, 'preview screen has horizontal overflow')

  await page.getByRole('button', { name: '‹' }).click()
  await page.locator('[data-testid="generate-button"]').waitFor({ state: 'visible' })
  await page.locator('[data-testid="open-whiteboard"]').click()
  await page.locator('[data-testid="whiteboard-screen"]').waitFor({ state: 'visible' })
  const whiteboardCount = await page.locator('.board-row').count()
  assert(whiteboardCount >= 1, 'saved candidate did not appear in whiteboard')

  await page.getByRole('button', { name: '‹' }).click()
  await page.locator('[data-testid="settings-button"]').click()
  await page.locator('[data-testid="settings-screen"]').waitFor({ state: 'visible' })
  await page.locator('[data-testid="result-count-increase"]').click()
  await page.locator('[data-testid="result-count-increase"]').click()
  await page.locator('[data-testid="score-toggle"]').click()
  const languageControlVisible = await page.locator('[data-testid="language-control"]').isVisible()
  assert(languageControlVisible, 'language control is missing')
  const mainstreamLocaleCount = await page.locator('[data-testid="language-select"] option').count()
  assert(mainstreamLocaleCount >= 18, `expected at least 18 mainstream locales, got ${mainstreamLocaleCount}`)
  await page.locator('[data-testid="language-select"]').selectOption('ja')
  const japaneseVisible = await page.locator('[data-testid="settings-screen"]').getByText('設定').isVisible()
  assert(japaneseVisible, 'Japanese language switch did not update settings title')
  await page.locator('[data-testid="language-select"]').selectOption('ar')
  metrics = await readMetrics(page)
  assert(metrics.appDirection === 'rtl', `expected Arabic RTL direction, got ${metrics.appDirection}`)
  await page.locator('[data-testid="language-select"]').selectOption('zh-Hans')
  const settingsResultCount = await page.locator('[data-testid="result-count-control"] strong').textContent()
  const scoreToggleText = await page.locator('[data-testid="score-toggle"] .switch').textContent()
  const localeSwitched = await page.locator('[data-testid="settings-screen"]').getByText('设置').isVisible()
  assert(settingsResultCount === '12', `expected settings result count 12, got ${settingsResultCount}`)
  assert(scoreToggleText === '关', `expected score details 关, got ${scoreToggleText}`)
  assert(localeSwitched, 'language switch did not update settings copy')

  await page.locator('[data-testid="privacy-link"]').click()
  await page.locator('[data-testid="legal-screen"]').waitFor({ state: 'visible' })
  const privacyTitleText = await page.locator('[data-testid="legal-screen"] .section-title').textContent()
  const privacyVisible = privacyTitleText === '隐私政策'
  const privacyLocalCopy = await page.locator('[data-testid="legal-screen"]').getByText(/本地/).first().isVisible()
  const privacyNoSaleCopy = await page.locator('[data-testid="legal-screen"]').getByText(/不会出售/).first().isVisible()
  const privacyControlsCopy = await page.locator('[data-testid="legal-screen"]').getByText(/清除本地数据/).first().isVisible()
  const privacySectionCount = await page.locator('[data-testid="legal-section"]').count()
  metrics = await readMetrics(page)
  assert(privacyVisible && privacyLocalCopy && privacyNoSaleCopy && privacyControlsCopy, 'privacy policy page did not show detailed localized privacy copy')
  assert(privacySectionCount >= 8, `expected detailed privacy sections, got ${privacySectionCount}`)
  assert(!metrics.overflowX, 'privacy policy screen has horizontal overflow')

  await page.getByRole('button', { name: '‹' }).click()
  await page.locator('[data-testid="settings-screen"]').waitFor({ state: 'visible' })
  await page.locator('[data-testid="disclaimer-link"]').click()
  await page.locator('[data-testid="legal-screen"]').waitFor({ state: 'visible' })
  const disclaimerTitleText = await page.locator('[data-testid="legal-screen"] .section-title').textContent()
  const disclaimerVisible = disclaimerTitleText === '免责声明'
  const trademarkCopyVisible = await page.locator('[data-testid="legal-screen"]').getByText(/商标/).first().isVisible()
  const noWarrantyVisible = await page.locator('[data-testid="legal-screen"]').getByText(/按现状/).first().isVisible()
  const disclaimerSectionCount = await page.locator('[data-testid="legal-section"]').count()
  metrics = await readMetrics(page)
  assert(disclaimerVisible && trademarkCopyVisible && noWarrantyVisible, 'disclaimer page did not show detailed localized disclaimer copy')
  assert(disclaimerSectionCount >= 7, `expected detailed disclaimer sections, got ${disclaimerSectionCount}`)
  assert(!metrics.overflowX, 'disclaimer screen has horizontal overflow')

  await page.getByRole('button', { name: '‹' }).click()
  await page.locator('[data-testid="settings-screen"]').waitFor({ state: 'visible' })
  await page.getByRole('button', { name: '‹' }).click()
  await page.locator('[data-testid="generate-button"]').click()
  await page.waitForFunction(() => document.querySelectorAll('[data-testid="candidate-card"]').length === 12)
  metrics = await readMetrics(page)
  assert(metrics.candidateCardCount === 12, `expected 12 cards after settings, got ${metrics.candidateCardCount}`)
  assert(metrics.scorePills === 0, `expected score pills hidden, got ${metrics.scorePills}`)
  assert(!metrics.overflowX, 'settings result screen has horizontal overflow')

  const report = {
    generatedAt: new Date().toISOString(),
    targetUrl,
    candidateCardCount,
    settingsResultCount: Number(settingsResultCount),
    mainstreamLocaleCount,
    languageControlVisible,
    whiteboardCount,
    previewVisible: true,
    localeSwitched,
    privacyVisible,
    privacySectionCount,
    disclaimerVisible,
    disclaimerSectionCount,
    finalMetrics: metrics,
    logs
  }

  mkdirSync(dirname(reportPath), { recursive: true })
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`)

  assert(logs.length === 0, `browser console has warnings/errors: ${JSON.stringify(logs)}`)
  console.log(`Browser smoke passed. Report written to ${reportPath}`)
} finally {
  await browser.close()
}
