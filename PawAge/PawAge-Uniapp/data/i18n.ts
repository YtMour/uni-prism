export type LanguageCode = 'en' | 'ja' | 'de' | 'fr' | 'es'

export interface LanguageOption {
  code: LanguageCode
  label: string
  nativeLabel: string
}

export interface LocaleMessages {
  settings: {
    title: string
    language: string
    localData: string
    privacy: string
    disclaimer: string
    reminder: string
    pro: string
    storedOnDevice: string
    off: string
    preview: string
    clearLocalData: string
    clearLocalDataTitle: string
    clearLocalDataMessage: string
    clearLocalDataConfirm: string
    localDataReset: string
    back: string
  }
}

export const languageOptions: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' }
]

export const messages: Record<LanguageCode, LocaleMessages> = {
  en: {
    settings: {
      title: 'Settings',
      language: 'Language',
      localData: 'Local data',
      privacy: 'Privacy',
      disclaimer: 'Disclaimer',
      reminder: 'Reminder',
      pro: 'PawAge Pro',
      storedOnDevice: 'Stored on device',
      off: 'Off',
      preview: 'Preview',
      clearLocalData: 'Clear local data',
      clearLocalDataTitle: 'Clear local data?',
      clearLocalDataMessage: 'This resets the pet profile stored on this device.',
      clearLocalDataConfirm: 'Clear',
      localDataReset: 'Local data reset',
      back: 'Back'
    }
  },
  ja: {
    settings: {
      title: 'Settings',
      language: 'Language',
      localData: 'Local data',
      privacy: 'Privacy',
      disclaimer: 'Disclaimer',
      reminder: 'Reminder',
      pro: 'PawAge Pro',
      storedOnDevice: 'Stored on device',
      off: 'Off',
      preview: 'Preview',
      clearLocalData: 'Clear local data',
      clearLocalDataTitle: 'Clear local data?',
      clearLocalDataMessage: 'This resets the pet profile stored on this device.',
      clearLocalDataConfirm: 'Clear',
      localDataReset: 'Local data reset',
      back: 'Back'
    }
  },
  de: {
    settings: {
      title: 'Settings',
      language: 'Language',
      localData: 'Local data',
      privacy: 'Privacy',
      disclaimer: 'Disclaimer',
      reminder: 'Reminder',
      pro: 'PawAge Pro',
      storedOnDevice: 'Stored on device',
      off: 'Off',
      preview: 'Preview',
      clearLocalData: 'Clear local data',
      clearLocalDataTitle: 'Clear local data?',
      clearLocalDataMessage: 'This resets the pet profile stored on this device.',
      clearLocalDataConfirm: 'Clear',
      localDataReset: 'Local data reset',
      back: 'Back'
    }
  },
  fr: {
    settings: {
      title: 'Settings',
      language: 'Language',
      localData: 'Local data',
      privacy: 'Privacy',
      disclaimer: 'Disclaimer',
      reminder: 'Reminder',
      pro: 'PawAge Pro',
      storedOnDevice: 'Stored on device',
      off: 'Off',
      preview: 'Preview',
      clearLocalData: 'Clear local data',
      clearLocalDataTitle: 'Clear local data?',
      clearLocalDataMessage: 'This resets the pet profile stored on this device.',
      clearLocalDataConfirm: 'Clear',
      localDataReset: 'Local data reset',
      back: 'Back'
    }
  },
  es: {
    settings: {
      title: 'Settings',
      language: 'Language',
      localData: 'Local data',
      privacy: 'Privacy',
      disclaimer: 'Disclaimer',
      reminder: 'Reminder',
      pro: 'PawAge Pro',
      storedOnDevice: 'Stored on device',
      off: 'Off',
      preview: 'Preview',
      clearLocalData: 'Clear local data',
      clearLocalDataTitle: 'Clear local data?',
      clearLocalDataMessage: 'This resets the pet profile stored on this device.',
      clearLocalDataConfirm: 'Clear',
      localDataReset: 'Local data reset',
      back: 'Back'
    }
  }
}
