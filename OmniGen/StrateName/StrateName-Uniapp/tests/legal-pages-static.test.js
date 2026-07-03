import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('privacy and disclaimer render through a standalone legal document screen', () => {
  const legalScreenPath = resolve('src/components/LegalDocumentScreen.vue')
  const appShell = readFileSync(resolve('src/components/AppShell.vue'), 'utf8')
  const settings = readFileSync(resolve('src/components/SettingsScreen.vue'), 'utf8')
  const nativeSelect = readFileSync(resolve('src/components/NativeSelectField.vue'), 'utf8')
  const legalScreen = existsSync(legalScreenPath) ? readFileSync(legalScreenPath, 'utf8') : ''

  assert.equal(existsSync(legalScreenPath), true)
  assert.match(appShell, /LegalDocumentScreen/)
  assert.match(appShell, /activeTab === 'privacy'/)
  assert.match(appShell, /activeTab === 'disclaimer'/)
  assert.match(settings, /open-legal/)
  assert.match(settings, /NativeSelectField/)
  assert.match(settings, /legal-language-select/)
  assert.match(nativeSelect, /native-dropdown-trigger/)
  assert.match(nativeSelect, /v-if="isOpen"/)
  assert.match(nativeSelect, /data-option-id/)
  assert.match(nativeSelect, /choose\(option\.id\)/)
  assert.doesNotMatch(nativeSelect, /<select\b/)
  assert.doesNotMatch(nativeSelect, /<option\b/)
  assert.doesNotMatch(nativeSelect, /<picker\b/)
  assert.doesNotMatch(settings, /icon="言"/)
  assert.doesNotMatch(legalScreen, /Document language/)
  assert.doesNotMatch(legalScreen, /SelectField/)
  assert.doesNotMatch(legalScreen, /update-locale/)
  assert.doesNotMatch(legalScreen, /icon="言"/)
  assert.doesNotMatch(settings, /Data stored locally/)
  assert.doesNotMatch(settings, /Creative suggestions only<\/text>/)
})

test('legal language dropdown is visible above settings cards and tabbar', () => {
  const settings = readFileSync(resolve('src/components/SettingsScreen.vue'), 'utf8')
  const nativeSelect = readFileSync(resolve('src/components/NativeSelectField.vue'), 'utf8')
  const styles = readFileSync(resolve('src/styles/app.css'), 'utf8')

  assert.match(settings, /class="settings-group legal-settings-group"/)
  assert.match(nativeSelect, /native-dropdown"\s+:class="\{ 'is-open': isOpen \}"/)
  assert.match(styles, /\.legal-settings-group\s*\{[^}]*overflow:\s*visible/s)
  assert.match(styles, /\.native-dropdown\.is-open\s*\{[^}]*z-index:\s*(?:[3-9]\d|[1-9]\d{2,})/s)
  assert.match(styles, /\.native-dropdown-menu\s*\{[^}]*z-index:\s*(?:[3-9]\d|[1-9]\d{2,})/s)
})
