import { DEFAULT_RECORDS, STORAGE_KEYS } from '../data/appData'
import type { Units, WeightRecord } from '../types/fitcal'

export function loadUnits(): Units {
  const storedUnits = uni.getStorageSync(STORAGE_KEYS.units)
  return storedUnits === 'metric' || storedUnits === 'imperial' ? storedUnits : 'metric'
}

export function saveUnits(units: Units): void {
  uni.setStorageSync(STORAGE_KEYS.units, units)
}

export function loadRecords(): WeightRecord[] {
  const storedRecords = uni.getStorageSync(STORAGE_KEYS.records)
  return Array.isArray(storedRecords) && storedRecords.length ? storedRecords : [...DEFAULT_RECORDS]
}

export function saveRecords(records: WeightRecord[]): void {
  uni.setStorageSync(STORAGE_KEYS.records, records)
}

export function clearRecords(): void {
  uni.removeStorageSync(STORAGE_KEYS.records)
}
