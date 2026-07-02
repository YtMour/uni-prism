import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

test('release scripts include browser smoke and dependency audit gates', () => {
  assert.equal(packageJson.scripts['smoke:browser'], 'node scripts/smoke-browser.mjs')
  assert.equal(packageJson.scripts['audit:i18n'], 'node scripts/audit-i18n.mjs')
  assert.equal(packageJson.scripts['audit:deps'], 'node scripts/audit-deps.mjs')
  assert.ok(packageJson.scripts.check.includes('npm run smoke:browser'))
  assert.ok(packageJson.scripts.check.includes('npm run audit:i18n'))
  assert.ok(packageJson.scripts.check.includes('npm run audit:deps'))
})

test('browser smoke script verifies the interactive MVP flow', () => {
  const script = readFileSync(new URL('../scripts/smoke-browser.mjs', import.meta.url), 'utf8')
  const requiredTerms = [
    'data-testid="generate-button"',
    'candidateCardCount',
    'settingsResultCount',
    'whiteboardCount',
    'previewVisible',
    'localeSwitched',
    'privacyVisible',
    'privacySectionCount',
    'disclaimerVisible',
    'disclaimerSectionCount',
    'language-control',
    'language-select',
    'mainstreamLocaleCount',
    'selectOption',
    'privacy-link',
    'disclaimer-link',
    'legal-screen',
    'waitForFunction',
    'reports/browser-smoke.json'
  ]

  for (const term of requiredTerms) {
    assert.ok(script.includes(term), `missing ${term}`)
  }
})

test('i18n audit script guards language and legal-page wiring', () => {
  const script = readFileSync(new URL('../scripts/audit-i18n.mjs', import.meta.url), 'utf8')
  const requiredTerms = [
    'messages',
    'LOCALES',
    'GeneratorScreen.vue',
    'DetailSheet.vue',
    'PreviewScreen.vue',
    'SettingsScreen.vue',
    'LegalScreen.vue',
    'language-control',
    'language-select',
    'privacy-link',
    'disclaimer-link',
    'legal-screen',
    'noEnglishFallbackKeys',
    'visibleDescriptionKeys',
    'detailedLegalKeys',
    'legal.privacySharingBody',
    'legal.disclaimerNoWarrantyBody',
    'options.styles.micro-saas.description',
    'options.lengths.descriptive.description',
    'getLocaleDirection',
    't('
  ]

  for (const term of requiredTerms) {
    assert.ok(script.includes(term), `missing ${term}`)
  }
})

test('dependency audit script records current uni toolchain risk without forcing upgrades', () => {
  const script = readFileSync(new URL('../scripts/audit-deps.mjs', import.meta.url), 'utf8')
  const requiredTerms = [
    'npm audit --json',
    'reports/dependency-audit.json',
    'allowVulnerabilities',
    'npm_execpath',
    'npm.cmd',
    'process.execPath',
    '@dcloudio',
    'vite'
  ]

  for (const term of requiredTerms) {
    assert.ok(script.includes(term), `missing ${term}`)
  }
})
