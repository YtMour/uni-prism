export type TabKey = 'bmi' | 'calories' | 'guidance' | 'records' | 'settings'

export type Units = 'metric' | 'imperial'

export type Sex = 'female' | 'male'

export type ActivityKey = 'light' | 'moderate' | 'active'

export type Goal = 'maintain' | 'lose' | 'gain'

export type TrendMode = 'weight' | 'bmi'

export type RecordFilter = 'all' | 'last5' | 'highBmi'

export type ReminderSetting = 'off' | 'weekly' | 'monthly'

export type AppLanguage = 'en' | 'zh-Hans' | 'zh-Hant' | 'es' | 'fr' | 'de' | 'ja' | 'ko' | 'pt' | 'id' | 'th' | 'vi'

export interface AdTestState {
  enabled: boolean
  impressions: number
  dismissals: number
}

export interface OpsConfig {
  adPlaceholderEnabled: boolean
  h5Version: string
  releaseNote: string
  testAnnouncement: string
  showTestAnnouncement: boolean
  updatedAt: string
}

export type BmiCategory = 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity'

export interface TabItem {
  key: TabKey
  labelKey: string
  icon: string
  activeIcon: string
}

export interface ActivityOption {
  key: ActivityKey
  label: string
  factor: number
}

export interface MealFocus {
  key: string
  titleKey: string
  copyKey: string
}

export interface LanguageOption {
  key: AppLanguage
  label: string
}

export interface SevenDayGuideItem {
  day: string
  title: string
  focus: string
  action: string
}

export interface WeightRecord {
  id: number
  weight: string
  bmi: string
  date: string
}

export interface RecordSettings {
  maxSavedRecords: number
  chartSampleLimit: number
}

export interface TargetProgress {
  hasTarget: boolean
  targetText: string
  differenceText: string
  statusText: string
}

export interface RecordProgressSummary {
  recordCountText: string
  changeText: string
  directionText: string
  periodText: string
}

export interface BmiResult {
  value: string
  category: BmiCategory
}

export interface CaloriesResult {
  bmr: string
  tdee: string
  calorieTarget: string
}

export interface MeasurementState {
  height: string
  weight: string
}

export interface TrendPoint {
  id: number
  x: number
  y: number
}

export interface TrendSummary {
  title: string
  unit: string
  latestValue: string
  rangeText: string
  startLabel: string
  endLabel: string
  yLabels: string[]
}
