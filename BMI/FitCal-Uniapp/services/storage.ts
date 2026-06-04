import { CHART_SAMPLE_OPTIONS, DEFAULT_RECORDS, DEFAULT_RECORD_SETTINGS, RECORD_LIMIT_OPTIONS, STORAGE_KEYS } from '../data/appData'
import type { RecordSettings, Units, WeightRecord } from '../types/fitcal'

export function loadUnits(): Units {
  const storedUnits = uni.getStorageSync(STORAGE_KEYS.units)
  return storedUnits === 'metric' || storedUnits === 'imperial' ? storedUnits : 'metric'
}

export function saveUnits(units: Units): void {
  uni.setStorageSync(STORAGE_KEYS.units, units)
}

export function loadRecordSettings(): RecordSettings {
  const storedSettings = uni.getStorageSync<Partial<RecordSettings>>(STORAGE_KEYS.recordSettings)
  const maxSavedRecords = normalizeOption(storedSettings?.maxSavedRecords, RECORD_LIMIT_OPTIONS, DEFAULT_RECORD_SETTINGS.maxSavedRecords)
  const chartSampleLimit = normalizeOption(
    storedSettings?.chartSampleLimit,
    CHART_SAMPLE_OPTIONS.filter((option) => option <= maxSavedRecords),
    Math.min(DEFAULT_RECORD_SETTINGS.chartSampleLimit, maxSavedRecords)
  )

  return {
    maxSavedRecords,
    chartSampleLimit
  }
}

export function saveRecordSettings(settings: RecordSettings): void {
  uni.setStorageSync(STORAGE_KEYS.recordSettings, settings)
}

export function loadRecords(): WeightRecord[] {
  const storedRecords = uni.getStorageSync(STORAGE_KEYS.records)
  return Array.isArray(storedRecords) ? storedRecords : [...DEFAULT_RECORDS]
}

export function saveRecords(records: WeightRecord[]): void {
  uni.setStorageSync(STORAGE_KEYS.records, records)
}

export function clearRecords(): void {
  uni.setStorageSync(STORAGE_KEYS.records, [])
}

function normalizeOption<T extends readonly number[]>(value: unknown, options: T | number[], fallback: number): number {
  return typeof value === 'number' && options.includes(value) ? value : fallback
}
