import type {
  ActivityKey,
  BmiCategory,
  BmiResult,
  CaloriesResult,
  Goal,
  MeasurementState,
  Sex,
  Units
} from '../types/fitcal'
import { ACTIVITY_OPTIONS } from '../data/appData'

export function unitsLabel(units: Units): string {
  return units === 'metric' ? 'Metric' : 'Imperial'
}

export function heightUnit(units: Units): string {
  return units === 'metric' ? 'cm' : 'in'
}

export function weightUnit(units: Units): string {
  return units === 'metric' ? 'kg' : 'lb'
}

export function convertMeasurements(nextUnits: Units, currentUnits: Units, values: MeasurementState): MeasurementState {
  if (nextUnits === currentUnits) return values

  const height = Number(values.height)
  const weight = Number(values.weight)

  if (nextUnits === 'imperial') {
    return {
      height: height ? String(Math.round(height / 2.54)) : '',
      weight: weight ? String(Math.round(weight * 2.20462)) : ''
    }
  }

  return {
    height: height ? String(Math.round(height * 2.54)) : '',
    weight: weight ? String(Math.round(weight / 2.20462)) : ''
  }
}

export function calculateBmi(heightValue: string, weightValue: string, units: Units): BmiResult | null {
  const height = Number(heightValue)
  const weight = Number(weightValue)
  if (!height || !weight) return null

  const meters = units === 'metric' ? height / 100 : height * 0.0254
  const kilograms = units === 'metric' ? weight : weight * 0.453592
  const bmi = kilograms / (meters * meters)

  return {
    value: bmi.toFixed(1),
    category: getBmiCategory(bmi)
  }
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obesity'
}

export function calculateCalories(params: {
  age: string
  height: string
  weight: string
  units: Units
  sex: Sex
  activity: ActivityKey
  goal: Goal
}): CaloriesResult | null {
  const age = Number(params.age)
  const height = Number(params.height)
  const weight = Number(params.weight)
  if (!age || !height || !weight) return null

  const centimeters = params.units === 'metric' ? height : height * 2.54
  const kilograms = params.units === 'metric' ? weight : weight * 0.453592
  const base = params.sex === 'male'
    ? 10 * kilograms + 6.25 * centimeters - 5 * age + 5
    : 10 * kilograms + 6.25 * centimeters - 5 * age - 161

  const activity = ACTIVITY_OPTIONS.find((item) => item.key === params.activity) || ACTIVITY_OPTIONS[1]
  const tdee = base * activity.factor
  const offset = params.goal === 'lose' ? -150 : params.goal === 'gain' ? 200 : 0

  return {
    bmr: formatNumber(base),
    tdee: formatNumber(tdee),
    calorieTarget: formatNumber(tdee + offset)
  }
}

export function healthyRange(heightValue: string, units: Units): string {
  const height = Number(heightValue)
  if (!height) return units === 'metric' ? '56.7-76.3 kg' : '125-168 lb'

  const meters = units === 'metric' ? height / 100 : height * 0.0254
  const min = 18.5 * meters * meters
  const max = 24.9 * meters * meters

  if (units === 'metric') return `${min.toFixed(1)}-${max.toFixed(1)} kg`
  return `${Math.round(min * 2.20462)}-${Math.round(max * 2.20462)} lb`
}

export function bmiMarkerLeft(bmiValue: string): string {
  const value = Number(bmiValue)
  const min = 14
  const max = 36
  const clamped = Math.max(min, Math.min(max, value))
  return `${((clamped - min) / (max - min) * 100).toFixed(0)}%`
}

export function goalTitle(goal: Goal): string {
  if (goal === 'gain') return 'Lean Gain Plan'
  if (goal === 'maintain') return 'Maintenance Plan'
  return 'Weight Loss Plan'
}

export function formatNumber(value: number): string {
  return Math.max(0, Math.round(value)).toLocaleString('en-US')
}
