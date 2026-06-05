import type { ActivityOption, LanguageOption, MealFocus, RecordSettings, TabItem, WeightRecord } from '../types/fitcal'

export const STORAGE_KEYS = {
  records: 'fitcal_records',
  units: 'fitcal_units',
  recordSettings: 'fitcal_record_settings',
  targetWeight: 'fitcal_target_weight',
  reminderSetting: 'fitcal_reminder_setting',
  appLanguage: 'fitcal_app_language',
  guideUnlocked: 'fitcal_guide_unlocked',
  adTestState: 'fitcal_ad_test_state',
  analyticsVisitorId: 'fitcal_analytics_visitor_id'
} as const

export const REMINDER_OPTIONS = [
  { key: 'off', label: 'Off' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' }
] as const

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { key: 'en', label: 'English' },
  { key: 'zh-Hans', label: '简体中文' },
  { key: 'zh-Hant', label: '繁體中文' },
  { key: 'es', label: 'Español' },
  { key: 'fr', label: 'Français' },
  { key: 'de', label: 'Deutsch' },
  { key: 'ja', label: '日本語' },
  { key: 'ko', label: '한국어' },
  { key: 'pt', label: 'Português' },
  { key: 'id', label: 'Bahasa Indonesia' },
  { key: 'th', label: 'ไทย' },
  { key: 'vi', label: 'Tiếng Việt' }
]

export const RECORD_LIMIT_OPTIONS = [5, 10, 20, 50] as const

export const CHART_SAMPLE_OPTIONS = [5, 10, 20] as const

export const DEFAULT_RECORD_SETTINGS: RecordSettings = {
  maxSavedRecords: 10,
  chartSampleLimit: 5
}

export const TABS: TabItem[] = [
  { key: 'bmi', labelKey: 'tab.bmi', icon: '/static/icons/calculator.svg', activeIcon: '/static/icons/calculator-active.svg' },
  { key: 'calories', labelKey: 'tab.calories', icon: '/static/icons/flame.svg', activeIcon: '/static/icons/flame-active.svg' },
  { key: 'guidance', labelKey: 'tab.guidance', icon: '/static/icons/compass.svg', activeIcon: '/static/icons/compass-active.svg' },
  { key: 'records', labelKey: 'tab.records', icon: '/static/icons/bars.svg', activeIcon: '/static/icons/bars-active.svg' },
  { key: 'settings', labelKey: 'tab.settings', icon: '/static/icons/settings.svg', activeIcon: '/static/icons/settings-active.svg' }
]

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  { key: 'light', label: 'Light', factor: 1.375 },
  { key: 'moderate', label: 'Moderate', factor: 1.55 },
  { key: 'active', label: 'Active', factor: 1.725 }
]

export const MEALS: MealFocus[] = [
  { key: 'B', titleKey: 'meal.breakfast', copyKey: 'meal.breakfastCopy' },
  { key: 'L', titleKey: 'meal.lunch', copyKey: 'meal.lunchCopy' },
  { key: 'D', titleKey: 'meal.dinner', copyKey: 'meal.dinnerCopy' }
]

export const DEFAULT_RECORDS: WeightRecord[] = [
  { id: 1, weight: '65.0', bmi: '22.5', date: '2026-06-05' },
  { id: 2, weight: '65.6', bmi: '22.7', date: '2026-06-01' },
  { id: 3, weight: '66.1', bmi: '22.9', date: '2026-05-28' }
]
