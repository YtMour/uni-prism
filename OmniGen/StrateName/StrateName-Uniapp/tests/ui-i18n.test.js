import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { getUiText, localizeCandidate, localizeNamingOptions } from '../src/app/uiText.js'

const candidate = {
  displayName: 'GlobalCrest Partners',
  industry: 'finance',
  industryLabel: 'Finance & Capital',
  style: 'globalVenture',
  styleLabel: 'Global Venture',
  tone: 'boardroom',
  toneLabel: 'Boardroom',
  length: 'standard',
  semanticSuffix: 'Partners',
  score: 96,
  tags: ['Capital-ready', 'Boardroom', 'Standard'],
  riskLevel: 'Needs verification',
  rationale: [
    'Global suggests international reach and cross-market presence.',
    'Partners gives the name a familiar corporate role.'
  ],
  disclaimer: 'Creative naming suggestion only. Verify company registration, trademark and domain availability before use.',
  structure: {
    root: 'Global',
    bridge: 'crest',
    secondaryRoot: '',
    qualifier: '',
    semanticSuffix: 'Partners',
    legalSuffix: 'None',
    template: '{root}{bridge} {suffix}'
  },
  breakdown: {
    professionalFit: 25,
    trustSignal: 19,
    industryMatch: 18,
    readability: 14,
    distinctiveness: 10,
    riskControl: 10
  },
  scoreMax: {
    professionalFit: 25,
    trustSignal: 20,
    industryMatch: 20,
    readability: 15,
    distinctiveness: 10,
    riskControl: 10
  }
}

test('ui text falls back to English and localizes visible language feedback', () => {
  const english = getUiText('en')
  const simplifiedChinese = getUiText('zh-Hans')
  const spanish = getUiText('es')
  const fallback = getUiText('unknown-locale')

  assert.equal(english.settings.title, 'Settings')
  assert.equal(simplifiedChinese.settings.title, '设置')
  assert.equal(simplifiedChinese.generate.title, '商业名称生成器')
  assert.equal(simplifiedChinese.generate.generateAgain, '再次生成')
  assert.equal(simplifiedChinese.generate.seedOff, '种子关闭')
  assert.equal(simplifiedChinese.settings.languageLabel, '应用和法律语言')
  assert.equal(simplifiedChinese.tabs.shortlist, '收藏')
  assert.equal(spanish.settings.privacyPolicy, 'Política de privacidad')
  assert.equal(fallback.settings.title, 'Settings')
})

test('generate screen options and candidate explanation localize visible English UI text', () => {
  const ui = getUiText('zh-Hans')
  const localizedOptions = localizeNamingOptions({
    industries: [{ id: 'finance', label: 'Finance & Capital', tag: 'Capital-ready', description: 'Capital naming.' }],
    styles: [{ id: 'globalVenture', label: 'Global Venture', description: 'Global style.' }],
    tones: [{ id: 'boardroom', label: 'Boardroom', description: 'Formal.' }],
    lengths: [{ id: 'standard', label: 'Standard', description: 'Balanced.' }],
    semanticSuffixes: [{ id: 'Partners', label: 'Partners' }],
    legalSuffixes: [{ id: 'none', label: 'None' }]
  }, ui)
  const localizedCandidate = localizeCandidate(candidate, ui)

  assert.equal(localizedOptions.industries[0].label, '金融与资本')
  assert.equal(localizedOptions.styles[0].label, '全球企业')
  assert.equal(localizedOptions.tones[0].label, '董事会风格')
  assert.equal(localizedOptions.lengths[0].label, '标准')
  assert.deepEqual(localizedCandidate.tags, ['资本适配', '董事会风格', '标准'])
  assert.equal(localizedCandidate.riskLevel, '需要核验')
  assert.match(localizedCandidate.rationale.join(' '), /Global 传达/)
  assert.doesNotMatch(localizedCandidate.rationale.join(' '), /suggests|gives|familiar corporate role/i)
  assert.doesNotMatch(localizedCandidate.disclaimer, /Creative naming suggestion/i)
})

test('app shell passes localized ui labels into settings, legal pages, and tabbar', () => {
  const appShell = readFileSync(resolve('src/components/AppShell.vue'), 'utf8')
  const tabBar = readFileSync(resolve('src/components/TabBar.vue'), 'utf8')
  const settings = readFileSync(resolve('src/components/SettingsScreen.vue'), 'utf8')
  const legal = readFileSync(resolve('src/components/LegalDocumentScreen.vue'), 'utf8')

  assert.match(appShell, /import \{ getUiText, localizeCandidate, localizeNamingOptions \} from '\.\.\/app\/uiText\.js'/)
  assert.match(appShell, /uiText\(\)\s*\{\s*return getUiText\(this\.state\.settings\.legalLocale\)/s)
  assert.match(appShell, /<TabBar[^>]*:ui="uiText"/s)
  assert.match(appShell, /<GeneratorScreen[^>]*:ui="uiText"/s)
  assert.match(appShell, /<GeneratorScreen[^>]*:naming-options="localizedNamingOptions"/s)
  assert.match(appShell, /<ShortlistScreen[^>]*:ui="uiText"/s)
  assert.match(appShell, /<ProposalScreen[^>]*:ui="uiText"/s)
  assert.match(appShell, /<DetailSheet[^>]*:ui="uiText"/s)
  assert.match(appShell, /<SettingsScreen[^>]*:ui="uiText"/s)
  assert.match(appShell, /<LegalDocumentScreen[^>]*:ui="uiText"/s)
  assert.match(tabBar, /ui: \{ type: Object, required: true \}/)
  assert.match(settings, /ui: \{ type: Object, required: true \}/)
  assert.match(settings, /:label="ui\.settings\.languageLabel"/)
  assert.match(legal, /\{\{ ui\.legal\.reviewNotice \}\}/)
})
