import * as assert from 'node:assert/strict'
import { createDefaultPetProfile, loadPetProfiles, savePetProfiles, type StorageAdapter } from '../utils/petStorage'
import { loadAppSettings, updateAppSettings, type SettingsStorageAdapter } from '../utils/settingsStorage'

class MemoryStorage implements StorageAdapter, SettingsStorageAdapter {
  private values = new Map<string, unknown>()

  getStorageSync(key: string): unknown {
    return this.values.get(key)
  }

  setStorageSync(key: string, value: unknown): void {
    this.values.set(key, value)
  }
}

const storage = new MemoryStorage()
const profile = createDefaultPetProfile()

savePetProfiles([profile], storage)
assert.deepEqual(loadPetProfiles(storage), [profile])

storage.setStorageSync('pawage.petProfiles.v1', [profile, { id: 123 }, null])
assert.deepEqual(loadPetProfiles(storage), [profile])

storage.setStorageSync('pawage.petProfiles.v1', {
  version: 1,
  profiles: [profile, { id: 'bad-profile' }]
})
assert.deepEqual(loadPetProfiles(storage), [profile])

storage.setStorageSync('pawage.petProfiles.v1', {
  version: 2,
  profiles: [profile]
})
assert.deepEqual(loadPetProfiles(storage), [])

assert.equal(loadAppSettings(storage).language, 'en')
assert.equal(loadAppSettings(storage).remindersEnabled, false)
assert.equal(updateAppSettings({ language: 'de' }, storage).language, 'de')
assert.equal(loadAppSettings(storage).language, 'de')
assert.equal(updateAppSettings({ remindersEnabled: true }, storage).remindersEnabled, true)
assert.equal(loadAppSettings(storage).remindersEnabled, true)

storage.setStorageSync('pawage.settings.v1', { version: 1, language: 'zh', remindersEnabled: false })
assert.equal(loadAppSettings(storage).language, 'en')

storage.setStorageSync('pawage.settings.v1', { version: 1, language: 'en' })
assert.equal(loadAppSettings(storage).language, 'en')

console.log('storage samples passed')
