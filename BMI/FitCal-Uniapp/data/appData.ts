import type { ActivityOption, MealFocus, RecordSettings, TabItem, WeightRecord } from '../types/fitcal'

export const STORAGE_KEYS = {
  records: 'fitcal_records',
  units: 'fitcal_units',
  recordSettings: 'fitcal_record_settings'
} as const

export const RECORD_LIMIT_OPTIONS = [5, 10, 20, 50] as const

export const CHART_SAMPLE_OPTIONS = [5, 10, 20] as const

export const DEFAULT_RECORD_SETTINGS: RecordSettings = {
  maxSavedRecords: 10,
  chartSampleLimit: 5
}

export const TABS: TabItem[] = [
  { key: 'bmi', label: 'BMI', icon: '/static/icons/calculator.svg', activeIcon: '/static/icons/calculator-active.svg' },
  { key: 'calories', label: 'Calories', icon: '/static/icons/flame.svg', activeIcon: '/static/icons/flame-active.svg' },
  { key: 'guidance', label: 'Guidance', icon: '/static/icons/compass.svg', activeIcon: '/static/icons/compass-active.svg' },
  { key: 'records', label: 'Records', icon: '/static/icons/bars.svg', activeIcon: '/static/icons/bars-active.svg' },
  { key: 'settings', label: 'Settings', icon: '/static/icons/settings.svg', activeIcon: '/static/icons/settings-active.svg' }
]

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  { key: 'light', label: 'Light', factor: 1.375 },
  { key: 'moderate', label: 'Moderate', factor: 1.55 },
  { key: 'active', label: 'Active', factor: 1.725 }
]

export const MEALS: MealFocus[] = [
  { key: 'B', title: 'Breakfast', copy: 'Protein, fruit, slow carbs.' },
  { key: 'L', title: 'Lunch', copy: 'Lean protein and vegetables.' },
  { key: 'D', title: 'Dinner', copy: 'Light carbs, balanced fats.' }
]

export const DEFAULT_RECORDS: WeightRecord[] = [
  { id: 1, weight: '65.0', bmi: '22.5', date: 'Today' },
  { id: 2, weight: '65.6', bmi: '22.7', date: 'Jun 01' },
  { id: 3, weight: '66.1', bmi: '22.9', date: 'May 28' }
]
