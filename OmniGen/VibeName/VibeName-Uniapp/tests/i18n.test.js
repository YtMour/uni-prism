import test from 'node:test'
import assert from 'node:assert/strict'

import { LOCALES, getLocaleDirection, messages, t } from '../src/app/i18n.js'

test('supports the mainstream app locale set', () => {
  const expectedLocales = [
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

  assert.deepEqual(
    LOCALES.map((locale) => locale.id),
    expectedLocales
  )
  assert.equal(LOCALES.find((locale) => locale.id === 'zh-Hans')?.label, '简体中文')
  assert.equal(LOCALES.find((locale) => locale.id === 'ar')?.label, 'العربية')
})

test('all locales include the same message keys', () => {
  const [baseLocale] = LOCALES
  const baseKeys = Object.keys(messages[baseLocale.id]).sort()

  for (const locale of LOCALES) {
    assert.deepEqual(Object.keys(messages[locale.id]).sort(), baseKeys)
  }
})

test('translation helper falls back to English and then key', () => {
  assert.equal(t('zh-Hans', 'settings.title'), '设置')
  assert.equal(t('missing-locale', 'settings.title'), 'Settings')
  assert.equal(t('zh-Hans', 'missing.key'), 'missing.key')
})

test('mainstream locales localize critical screen and legal copy', () => {
  const criticalKeys = [
    'generator.generate',
    'settings.title',
    'settings.language',
    'legal.privacyTitle',
    'legal.disclaimerBody'
  ]

  for (const locale of LOCALES.filter((item) => item.id !== 'en')) {
    for (const key of criticalKeys) {
      assert.notEqual(t(locale.id, key), t('en', key), `${locale.id} still falls back to English for ${key}`)
    }
  }
})

test('mainstream locales localize core interaction copy beyond the settings entry', () => {
  const coreInteractionKeys = [
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
    'common.creativeOnly'
  ]

  for (const locale of LOCALES.filter((item) => item.id !== 'en')) {
    for (const key of coreInteractionKeys) {
      assert.notEqual(t(locale.id, key), t('en', key), `${locale.id} still falls back to English for ${key}`)
    }
  }
})

test('mainstream locales localize visible option descriptions', () => {
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

  for (const locale of LOCALES.filter((item) => item.id !== 'en')) {
    for (const key of visibleDescriptionKeys) {
      assert.notEqual(t(locale.id, key), t('en', key), `${locale.id} still falls back to English for ${key}`)
    }
  }
})

test('locale direction is explicit for right-to-left languages', () => {
  assert.equal(getLocaleDirection('ar'), 'rtl')
  assert.equal(getLocaleDirection('en'), 'ltr')
  assert.equal(getLocaleDirection('missing-locale'), 'ltr')
})

test('legal copy includes privacy and creative-use disclaimers', () => {
  assert.match(t('en', 'legal.privacyBody'), /local device/i)
  assert.match(t('en', 'legal.disclaimerBody'), /trademark/i)
  assert.match(t('zh-Hans', 'legal.privacyBody'), /本地/)
  assert.match(t('zh-Hans', 'legal.disclaimerBody'), /商标/)
})

test('legal pages include detailed privacy and disclaimer clauses', () => {
  const detailedPrivacyKeys = [
    'legal.privacyIntro',
    'legal.privacyStoredBody',
    'legal.privacyNotCollectedBody',
    'legal.privacyUseBody',
    'legal.privacySharingBody',
    'legal.privacyRetentionBody',
    'legal.privacyControlsBody',
    'legal.privacySecurityBody',
    'legal.privacyChangesBody'
  ]
  const detailedDisclaimerKeys = [
    'legal.disclaimerIntro',
    'legal.disclaimerCreativeBody',
    'legal.disclaimerAvailabilityBody',
    'legal.disclaimerTrademarkBody',
    'legal.disclaimerNoAdviceBody',
    'legal.disclaimerNoWarrantyBody',
    'legal.disclaimerUserResponsibilityBody',
    'legal.disclaimerChangesBody'
  ]

  for (const key of [...detailedPrivacyKeys, ...detailedDisclaimerKeys]) {
    assert.notEqual(t('en', key), key, `missing ${key}`)
    assert.notEqual(t('zh-Hans', key), key, `missing zh-Hans ${key}`)
  }

  assert.match(t('en', 'legal.privacySharingBody'), /does not sell/i)
  assert.match(t('en', 'legal.privacyControlsBody'), /clear local data/i)
  assert.match(t('en', 'legal.disclaimerNoWarrantyBody'), /as-is/i)
  assert.match(t('zh-Hans', 'legal.privacySharingBody'), /不会出售/)
  assert.match(t('zh-Hans', 'legal.privacyControlsBody'), /清除本地数据/)
  assert.match(t('zh-Hans', 'legal.disclaimerNoWarrantyBody'), /按现状/)
})

test('interactive screen labels are covered by locale messages', () => {
  const requiredKeys = [
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
    'settings.disclaimer'
  ]

  for (const locale of LOCALES) {
    for (const key of requiredKeys) {
      assert.notEqual(t(locale.id, key), key, `${locale.id} missing ${key}`)
    }
  }
})
