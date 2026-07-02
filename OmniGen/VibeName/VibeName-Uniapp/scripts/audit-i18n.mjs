import { readFileSync } from 'node:fs'
import { LOCALES, getLocaleDirection, messages } from '../src/app/i18n.js'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

const baseKeys = Object.keys(messages.en).sort()
const expectedLocaleIds = [
  'en',
  'zh-Hans',
  'zh-Hant',
  'es',
  'fr',
  'de',
  'ja',
  'ko',
  'pt-BR',
  'ru',
  'it',
  'nl',
  'ar',
  'hi',
  'id',
  'vi',
  'th',
  'tr'
]

assert(JSON.stringify(LOCALES.map((locale) => locale.id)) === JSON.stringify(expectedLocaleIds), 'mainstream locale list changed unexpectedly')
assert(getLocaleDirection('ar') === 'rtl', 'Arabic locale must use RTL direction')

for (const locale of LOCALES) {
  const keys = Object.keys(messages[locale.id] || {}).sort()
  assert(JSON.stringify(keys) === JSON.stringify(baseKeys), `${locale.id} locale keys do not match en`)
}

const requiredMessageKeys = [
  'generator.length',
  'detail.structure',
  'candidate.copy',
  'candidate.save',
  'candidate.saved',
  'detail.preview',
  'preview.style',
  'preview.accent',
  'preview.tagline',
  'settings.language',
  'settings.privacy',
  'settings.disclaimer',
  'legal.privacyTitle',
  'legal.disclaimerTitle',
  'legal.privacyBody',
  'legal.disclaimerBody',
  'legal.dataListTitle',
  'legal.dataListBody',
  'legal.noAdviceTitle',
  'legal.noAdviceBody',
  'reason.compound-saas',
  'reason.coined-abstract',
  'reason.verb-noun'
]

const detailedLegalKeys = [
  'legal.lastUpdatedLabel',
  'legal.lastUpdatedValue',
  'legal.privacyIntro',
  'legal.privacyStoredTitle',
  'legal.privacyStoredBody',
  'legal.privacyNotCollectedTitle',
  'legal.privacyNotCollectedBody',
  'legal.privacyUseTitle',
  'legal.privacyUseBody',
  'legal.privacySharingTitle',
  'legal.privacySharingBody',
  'legal.privacyRetentionTitle',
  'legal.privacyRetentionBody',
  'legal.privacyControlsTitle',
  'legal.privacyControlsBody',
  'legal.privacySecurityTitle',
  'legal.privacySecurityBody',
  'legal.privacyChangesTitle',
  'legal.privacyChangesBody',
  'legal.disclaimerIntro',
  'legal.disclaimerCreativeTitle',
  'legal.disclaimerCreativeBody',
  'legal.disclaimerAvailabilityTitle',
  'legal.disclaimerAvailabilityBody',
  'legal.disclaimerTrademarkTitle',
  'legal.disclaimerTrademarkBody',
  'legal.disclaimerNoAdviceTitle',
  'legal.disclaimerNoAdviceBody',
  'legal.disclaimerNoWarrantyTitle',
  'legal.disclaimerNoWarrantyBody',
  'legal.disclaimerUserResponsibilityTitle',
  'legal.disclaimerUserResponsibilityBody',
  'legal.disclaimerChangesTitle',
  'legal.disclaimerChangesBody'
]

const visibleDescriptionKeys = [
  'options.styles.micro-saas.description',
  'options.styles.abstract.description',
  'options.styles.action-driven.description',
  'options.industries.ai.description',
  'options.industries.devtools.description',
  'options.industries.fintech.description',
  'options.industries.creator.description',
  'options.lengths.short.description',
  'options.lengths.standard.description',
  'options.lengths.descriptive.description'
]

const noEnglishFallbackKeys = [
  'app.subtitle',
  'generator.title',
  'generator.subtitle',
  'generator.emptyTitle',
  'generator.whiteboard',
  'whiteboard.title',
  'whiteboard.emptyBody',
  'preview.lead',
  'settings.defaultStyle',
  'settings.resultCount',
  'settings.useSeed',
  'settings.filterReadable',
  'settings.showScore',
  'legal.dataListTitle',
  'legal.noAdviceTitle',
  'score.readability',
  'score.industryFit',
  'reason.compound-saas',
  'common.creativeOnly',
  ...visibleDescriptionKeys
]

for (const key of [...requiredMessageKeys, ...detailedLegalKeys]) {
  for (const locale of LOCALES) {
    assert(messages[locale.id][key], `${locale.id} missing message key ${key}`)
  }
}

assert(/does not sell/i.test(messages.en['legal.privacySharingBody']), 'privacy policy must mention no sale/sharing in the current MVP')
assert(/clear local data/i.test(messages.en['legal.privacyControlsBody']), 'privacy policy must mention local data controls')
assert(/as-is/i.test(messages.en['legal.disclaimerNoWarrantyBody']), 'disclaimer must mention as-is availability')
assert(/不会出售/.test(messages['zh-Hans']['legal.privacySharingBody']), 'zh-Hans privacy policy must mention no sale/sharing')
assert(/清除本地数据/.test(messages['zh-Hans']['legal.privacyControlsBody']), 'zh-Hans privacy policy must mention local data controls')
assert(/按现状/.test(messages['zh-Hans']['legal.disclaimerNoWarrantyBody']), 'zh-Hans disclaimer must mention as-is availability')

for (const key of noEnglishFallbackKeys) {
  for (const locale of LOCALES.filter((item) => item.id !== 'en')) {
    assert(messages[locale.id][key] !== messages.en[key], `${locale.id} still falls back to English for ${key}`)
  }
}

const components = new Map([
  ['GeneratorScreen.vue', readFileSync(new URL('../src/components/GeneratorScreen.vue', import.meta.url), 'utf8')],
  ['DetailSheet.vue', readFileSync(new URL('../src/components/DetailSheet.vue', import.meta.url), 'utf8')],
  ['PreviewScreen.vue', readFileSync(new URL('../src/components/PreviewScreen.vue', import.meta.url), 'utf8')],
  ['SettingsScreen.vue', readFileSync(new URL('../src/components/SettingsScreen.vue', import.meta.url), 'utf8')],
  ['LegalScreen.vue', readFileSync(new URL('../src/components/LegalScreen.vue', import.meta.url), 'utf8')]
])

const requiredComponentTerms = {
  'GeneratorScreen.vue': ['t(\'generator.length\')', 'candidateReason', 't: { type: Function, required: true }'],
  'DetailSheet.vue': ['t(\'detail.structure\')', 't(\'candidate.copy\')', 't(\'candidate.save\')', 't(\'candidate.saved\')', 'reason: { type: String, required: true }'],
  'PreviewScreen.vue': ['t(\'preview.style\')', 't(\'preview.accent\')', 't(\'preview.tagline\')'],
  'SettingsScreen.vue': ['language-control', 'language-select', 'privacy-link', 'disclaimer-link', 't(\'settings.language\')'],
  'LegalScreen.vue': ['legal-screen', 'legal-section', 'LEGAL_SECTIONS', 'legal.privacyIntro', 'legal.disclaimerIntro']
}

for (const [file, terms] of Object.entries(requiredComponentTerms)) {
  const source = components.get(file)
  assert(source, `Missing ${file}`)
  for (const term of terms) {
    assert(source.includes(term), `${file} missing ${term}`)
  }
}

const forbiddenHardcodedText = {
  'GeneratorScreen.vue': ['>Length<'],
  'DetailSheet.vue': ['>Copy<', '>Preview<', '\'Saved\'', '\'Save\'', 'Structure ·'],
  'PreviewScreen.vue': ['>Style<', '>Accent<', '>Tagline<']
}

for (const [file, terms] of Object.entries(forbiddenHardcodedText)) {
  const source = components.get(file)
  for (const term of terms) {
    assert(!source.includes(term), `${file} still contains hardcoded UI text ${term}`)
  }
}

const pageSource = readFileSync(new URL('../pages/index/index.vue', import.meta.url), 'utf8')
for (const term of ['LOCALES', 'getLocaleDirection', 'setLocale', 'LegalScreen', 'openLegal', 'updateLocale', ':t="translate"', 'localizedOptions', 'localeDirection']) {
  assert(pageSource.includes(term), `pages/index/index.vue missing ${term}`)
}

const appStateSource = readFileSync(new URL('../src/app/appState.js', import.meta.url), 'utf8')
assert(appStateSource.includes('locale: \'en\''), 'app state must default locale to en')
assert(appStateSource.includes('normalizeLocale(locale)'), 'setLocale must normalize unknown locales')

console.log('i18n audit passed')
