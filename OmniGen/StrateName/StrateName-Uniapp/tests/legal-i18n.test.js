import test from 'node:test'
import assert from 'node:assert/strict'

import {
  LEGAL_LOCALES,
  REQUIRED_LEGAL_LOCALE_IDS,
  getLegalDocument,
  getLegalLocale
} from '../src/data/legalContent.js'

test('legal documents cover major mainstream locales', () => {
  const localeIds = LEGAL_LOCALES.map((locale) => locale.id)

  assert.ok(LEGAL_LOCALES.length >= 15)
  assert.deepEqual(localeIds.filter((id) => REQUIRED_LEGAL_LOCALE_IDS.includes(id)), REQUIRED_LEGAL_LOCALE_IDS)
  assert.ok(getLegalLocale('ar').rtl)

  for (const locale of LEGAL_LOCALES) {
    for (const type of ['privacy', 'disclaimer']) {
      const document = getLegalDocument(type, locale.id)
      assert.equal(document.locale, locale.id)
      assert.ok(document.title)
      assert.ok(document.summary)
      assert.ok(document.updated)
      assert.ok(document.sections.length >= 3, `${locale.id} ${type} should have at least 3 sections`)
      for (const section of document.sections) {
        assert.ok(section.heading)
        assert.ok(section.body)
      }
    }
  }
})

test('legal document lookup falls back to English for unknown locales', () => {
  const document = getLegalDocument('privacy', 'unknown-locale')

  assert.equal(document.locale, 'en')
  assert.match(document.title, /Privacy Policy/i)
})
