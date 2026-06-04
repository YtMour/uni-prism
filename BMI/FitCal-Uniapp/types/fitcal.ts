export type TabKey = 'bmi' | 'calories' | 'guidance' | 'records' | 'settings'

export type Units = 'metric' | 'imperial'

export type Sex = 'female' | 'male'

export type ActivityKey = 'light' | 'moderate' | 'active'

export type Goal = 'maintain' | 'lose' | 'gain'

export type TrendMode = 'weight' | 'bmi'

export type BmiCategory = 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity'

export interface TabItem {
  key: TabKey
  label: string
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
  title: string
  copy: string
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
