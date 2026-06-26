import test from 'node:test'
import assert from 'node:assert/strict'
import { getPolicySections, languageOptions, messages, policySections, requiredMessageKeys, t } from '../i18n/messages.js'

test('supports mainstream MVP languages with fallback text', () => {
	assert.deepEqual(languageOptions.map((item) => item.key), ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'pt'])
	assert.equal(t('zh', 'settings'), '设置')
	assert.equal(t('es', 'privacy'), 'Privacidad')
	assert.equal(t('ja', 'disclaimer'), '免責事項')
	assert.equal(t('missing', 'settings'), 'Settings')
	assert.equal(t('en', 'missing.key'), 'missing.key')
})

test('provides translations for the full MVP interface', () => {
	for (const language of languageOptions.map((item) => item.key)) {
		for (const key of requiredMessageKeys) {
			assert.ok(Object.hasOwn(messages[language], key), `${language} is missing ${key}`)
			assert.ok(messages[language][key].trim().length > 0, `${language} has empty ${key}`)
		}
	}
	assert.equal(t('zh', 'tabLists'), '清单')
	assert.equal(t('es', 'templates'), 'Plantillas')
	assert.equal(t('ja', 'exportData'), 'データを書き出す')
})

test('provides detailed privacy and disclaimer sections for release review', () => {
	for (const language of languageOptions.map((item) => item.key)) {
		assert.ok(policySections[language], `${language} is missing policy sections`)
		const sections = getPolicySections(language)
		assert.ok(sections.privacy.length >= 5, `${language} needs detailed privacy sections`)
		assert.ok(sections.disclaimer.length >= 5, `${language} needs detailed disclaimer sections`)
		for (const section of [...sections.privacy, ...sections.disclaimer]) {
			assert.ok(section.title.trim().length > 0, `${language} has empty policy title`)
			assert.ok(section.body.trim().length > 50, `${language} policy body is too short: ${section.title}`)
		}
	}

	const english = getPolicySections('en')
	assert.ok(english.privacy.some((section) => section.body.includes('No account')))
	assert.ok(english.privacy.some((section) => section.body.includes('local storage')))
	assert.ok(english.disclaimer.some((section) => section.body.includes('emergency')))
	assert.equal(getPolicySections('missing').privacy[0].title, english.privacy[0].title)
})
