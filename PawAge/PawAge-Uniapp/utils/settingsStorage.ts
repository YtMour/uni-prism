import type { LanguageCode } from '../data/i18n'

const STORAGE_KEY = 'pawage.settings.v1'
const STORAGE_VERSION = 1

export interface AppSettings {
  version: typeof STORAGE_VERSION
  language: LanguageCode
  remindersEnabled: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  version: STORAGE_VERSION,
  language: 'en',
  remindersEnabled: false
}

export interface SettingsStorageAdapter {
  getStorageSync(key: string): unknown
  setStorageSync(key: string, value: unknown): void
}

export function loadAppSettings(storage: SettingsStorageAdapter = uni): AppSettings {
  try {
    const saved = storage.getStorageSync(STORAGE_KEY)

    if (isAppSettings(saved)) {
      return saved
    }
  } catch {
    return DEFAULT_SETTINGS
  }

  return DEFAULT_SETTINGS
}

export function saveAppSettings(settings: AppSettings, storage: SettingsStorageAdapter = uni): void {
  storage.setStorageSync(STORAGE_KEY, settings)
}

export function updateAppSettings(
  patch: Partial<Pick<AppSettings, 'language' | 'remindersEnabled'>>,
  storage: SettingsStorageAdapter = uni
): AppSettings {
  const next: AppSettings = {
    ...loadAppSettings(storage),
    ...patch,
    version: STORAGE_VERSION
  }

  saveAppSettings(next, storage)
  return next
}

function isAppSettings(value: unknown): value is AppSettings {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<AppSettings>
  return (
    candidate.version === STORAGE_VERSION &&
    (candidate.language === 'en' ||
      candidate.language === 'ja' ||
      candidate.language === 'de' ||
      candidate.language === 'fr' ||
      candidate.language === 'es') &&
    typeof candidate.remindersEnabled === 'boolean'
  )
}
