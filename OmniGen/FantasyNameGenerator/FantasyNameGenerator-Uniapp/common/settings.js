export const SETTINGS_KEY = 'mythosgen:settings'

export const DEFAULT_SETTINGS = {
  defaultRealm: 'elf',
  haptics: true,
  animation: 'balanced'
}

const allowedRealms = ['elf', 'dragon', 'magic']
const allowedAnimations = ['reduced', 'balanced', 'expressive']

export function normalizeSettings(settings = {}) {
  return {
    defaultRealm: allowedRealms.includes(settings.defaultRealm)
      ? settings.defaultRealm
      : DEFAULT_SETTINGS.defaultRealm,
    haptics: typeof settings.haptics === 'boolean'
      ? settings.haptics
      : DEFAULT_SETTINGS.haptics,
    animation: allowedAnimations.includes(settings.animation)
      ? settings.animation
      : DEFAULT_SETTINGS.animation
  }
}

export function updateSetting(settings, key, value) {
  return normalizeSettings({
    ...settings,
    [key]: value
  })
}
