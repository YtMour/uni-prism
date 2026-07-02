import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const reportDir = resolve('reports/visual')
const reportPath = resolve(reportDir, 'layout-report.json')
const requiredScreenshots = [
  'desktop-1280x720.png',
  'mobile-390x844.png',
  'mobile-360x800.png'
]

if (!existsSync(reportPath)) {
  throw new Error('Missing reports/visual/layout-report.json. Run the browser visual capture before audit:visual.')
}

for (const file of requiredScreenshots) {
  if (!existsSync(resolve(reportDir, file))) {
    throw new Error(`Missing visual screenshot: reports/visual/${file}`)
  }
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'))
const requiredViewports = ['desktop-1280x720', 'mobile-390x844', 'mobile-360x800']

for (const viewport of requiredViewports) {
  const item = report.viewports?.find((entry) => entry.id === viewport)
  if (!item) {
    throw new Error(`Missing visual viewport entry: ${viewport}`)
  }
  if (item.overflowX) {
    throw new Error(`${viewport} has horizontal overflow`)
  }
  if (item.candidateCardCount !== 8) {
    throw new Error(`${viewport} expected 8 candidate cards, got ${item.candidateCardCount}`)
  }
  if (item.appFrameWidth > item.viewportWidth) {
    throw new Error(`${viewport} app frame is wider than viewport`)
  }
  if (item.detailSheetWidth > Math.min(430, item.viewportWidth)) {
    throw new Error(`${viewport} detail sheet exceeds app frame width`)
  }
}

console.log('Visual report audit passed')
