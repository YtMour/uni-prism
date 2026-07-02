import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/styles/app.css', import.meta.url), 'utf8')
const componentFiles = [
  '../src/components/AppShell.vue',
  '../src/components/GeneratorScreen.vue',
  '../src/components/CandidateCard.vue',
  '../src/components/DetailSheet.vue',
  '../src/components/PreviewScreen.vue',
  '../src/components/WhiteboardScreen.vue',
  '../src/components/SettingsScreen.vue',
  '../src/components/LegalScreen.vue'
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8')).join('\n')

function getRules(selector) {
  const rules = []
  const lines = css.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() !== `${selector} {`) continue
    const body = []
    for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
      if (lines[cursor].trim() === '}') break
      body.push(lines[cursor])
    }
    rules.push(body.join('\n'))
  }
  return rules
}

const whiteboardRules = getRules('.whiteboard-bar')
if (whiteboardRules.length === 0) {
  throw new Error('Missing .whiteboard-bar CSS rule')
}

if (whiteboardRules.some((rule) => /position\s*:\s*sticky/.test(rule) || /position\s*:\s*fixed/.test(rule))) {
  throw new Error('.whiteboard-bar must stay in normal flow to avoid overlapping result or empty-state content')
}

const requiredRules = ['.app-frame', '.segmented', '.chip-row', '.primary-button', '.empty-state']
for (const selector of requiredRules) {
  if (getRules(selector).length === 0) {
    throw new Error(`Missing required UI rule ${selector}`)
  }
}

const detailSheetRules = getRules('.detail-sheet')
if (detailSheetRules.length === 0) {
  throw new Error('Missing .detail-sheet CSS rule')
}

if (!detailSheetRules.some((rule) => /max-width\s*:\s*430px/.test(rule))) {
  throw new Error('.detail-sheet must be constrained to the 430px app frame width')
}

if (!detailSheetRules.some((rule) => /margin\s*:\s*0\s+auto/.test(rule))) {
  throw new Error('.detail-sheet must be horizontally centered inside the full-screen backdrop')
}

const requiredTestIds = [
  'settings-button',
  'style-control',
  'industry-control',
  'length-control',
  'generate-button',
  'candidate-card',
  'open-whiteboard',
  'detail-sheet',
  'detail-save',
  'detail-preview',
  'result-count-control',
  'result-count-decrease',
  'result-count-increase',
  'seed-toggle',
  'readability-toggle',
  'score-toggle',
  'language-control',
  'language-select',
  'privacy-link',
  'disclaimer-link',
  'legal-screen',
  'preview-screen',
  'whiteboard-screen',
  'settings-screen'
]

for (const testId of requiredTestIds) {
  if (!componentFiles.includes(`data-testid="${testId}"`)) {
    throw new Error(`Missing required data-testid="${testId}"`)
  }
}

const requiredComponentText = [
  'candidate.formula',
  'showScoreDetails',
  'settings.resultCount',
  'settings.useSeed',
  'settings.filterReadable',
  'settings.showScore',
  'settings.privacy',
  'settings.disclaimer'
]

for (const text of requiredComponentText) {
  if (!componentFiles.includes(text)) {
    throw new Error(`Missing required component text/contract: ${text}`)
  }
}

console.log('UI source audit passed')
