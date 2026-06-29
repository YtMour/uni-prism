import { describe, expect, it } from 'vitest'
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  normalizeSettings,
  updateSetting
} from '../common/settings.js'

describe('settings helpers', () => {
  it('uses a stable storage key', () => {
    expect(SETTINGS_KEY).toBe('mythosgen:settings')
  })

  it('normalizes missing settings to defaults', () => {
    expect(normalizeSettings()).toEqual(DEFAULT_SETTINGS)
  })

  it('keeps invalid values from replacing defaults', () => {
    const settings = normalizeSettings({
      defaultRealm: 'unknown',
      haptics: 'yes',
      animation: 'fast'
    })

    expect(settings).toEqual(DEFAULT_SETTINGS)
  })

  it('updates one setting through normalization', () => {
    const settings = updateSetting(DEFAULT_SETTINGS, 'defaultRealm', 'magic')

    expect(settings.defaultRealm).toBe('magic')
    expect(settings.haptics).toBe(true)
  })
})
