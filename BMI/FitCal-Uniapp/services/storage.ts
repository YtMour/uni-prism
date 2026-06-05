import { CHART_SAMPLE_OPTIONS, DEFAULT_RECORDS, DEFAULT_RECORD_SETTINGS, LANGUAGE_OPTIONS, RECORD_LIMIT_OPTIONS, STORAGE_KEYS } from '../data/appData'
import type { AdTestState, AppLanguage, RecordSettings, ReminderSetting, Units, WeightRecord } from '../types/fitcal'

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

export function loadTargetWeight(): string {
  const storedTargetWeight = uni.getStorageSync(STORAGE_KEYS.targetWeight)
  return typeof storedTargetWeight === 'string' ? storedTargetWeight : ''
}

export function saveTargetWeight(targetWeight: string): void {
  uni.setStorageSync(STORAGE_KEYS.targetWeight, targetWeight)
}

export function loadReminderSetting(): ReminderSetting {
  const storedReminderSetting = uni.getStorageSync(STORAGE_KEYS.reminderSetting)
  return storedReminderSetting === 'weekly' || storedReminderSetting === 'monthly' ? storedReminderSetting : 'off'
}

export function saveReminderSetting(reminderSetting: ReminderSetting): void {
  uni.setStorageSync(STORAGE_KEYS.reminderSetting, reminderSetting)
}

export function loadAppLanguage(): AppLanguage {
  const storedLanguage = uni.getStorageSync(STORAGE_KEYS.appLanguage)
  return LANGUAGE_OPTIONS.some((option) => option.key === storedLanguage) ? storedLanguage as AppLanguage : 'en'
}

export function saveAppLanguage(appLanguage: AppLanguage): void {
  uni.setStorageSync(STORAGE_KEYS.appLanguage, appLanguage)
}

export function loadGuideUnlocked(): boolean {
  return uni.getStorageSync(STORAGE_KEYS.guideUnlocked) === true
}

export function saveGuideUnlocked(unlocked: boolean): void {
  uni.setStorageSync(STORAGE_KEYS.guideUnlocked, unlocked)
}

export function loadAdTestState(): AdTestState {
  const storedAdTestState = uni.getStorageSync<Partial<AdTestState>>(STORAGE_KEYS.adTestState)
  return {
    enabled: storedAdTestState?.enabled !== false,
    impressions: normalizeCounter(storedAdTestState?.impressions),
    dismissals: normalizeCounter(storedAdTestState?.dismissals)
  }
}

export function saveAdTestState(adTestState: AdTestState): void {
  uni.setStorageSync(STORAGE_KEYS.adTestState, adTestState)
}

export function loadAnalyticsVisitorId(): string {
  const storedVisitorId = uni.getStorageSync(STORAGE_KEYS.analyticsVisitorId)
  if (typeof storedVisitorId === 'string' && storedVisitorId) return storedVisitorId

  const visitorId = createLocalId('visitor')
  uni.setStorageSync(STORAGE_KEYS.analyticsVisitorId, visitorId)
  return visitorId
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

export function recordsToCsv(records: WeightRecord[], weightUnit: string): string {
  const rows = [
    ['date', `weight_${weightUnit}`, 'bmi'],
    ...records.map((record) => [record.date, record.weight, record.bmi])
  ]
  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n')
}

export function recordsFromCsv(csv: string): WeightRecord[] {
  const rows = parseCsv(csv).filter((row) => row.some((cell) => cell.trim()))
  if (rows.length < 2) return []
  const header = rows[0].map((cell) => cell.trim().toLowerCase())
  const dateIndex = header.indexOf('date')
  const bmiIndex = header.indexOf('bmi')
  const weightIndex = header.findIndex((cell) => cell === 'weight' || cell.startsWith('weight_'))
  if (dateIndex < 0 || weightIndex < 0 || bmiIndex < 0) return []

  return rows.slice(1).map((row, index) => {
    const date = normalizeCsvText(row[dateIndex])
    const weight = Number(row[weightIndex])
    const bmi = Number(row[bmiIndex])
    if (!date || !Number.isFinite(weight) || weight <= 0 || !Number.isFinite(bmi) || bmi <= 0) {
      return null
    }
    return {
      id: Date.now() + index,
      date,
      weight: weight.toFixed(1),
      bmi: bmi.toFixed(1)
    }
  }).filter((record): record is WeightRecord => Boolean(record))
}

function escapeCsvCell(value: string): string {
  if (!/[",\n\r]/.test(value)) return value
  return `"${value.replace(/"/g, '""')}"`
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index]
    const nextChar = csv[index + 1]
    if (quoted) {
      if (char === '"' && nextChar === '"') {
        cell += '"'
        index += 1
        continue
      }
      if (char === '"') {
        quoted = false
        continue
      }
      cell += char
      continue
    }
    if (char === '"') {
      quoted = true
      continue
    }
    if (char === ',') {
      row.push(cell)
      cell = ''
      continue
    }
    if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      continue
    }
    if (char !== '\r') {
      cell += char
    }
  }
  row.push(cell)
  rows.push(row)
  return rows
}

function normalizeCsvText(value: string | undefined): string {
  return typeof value === 'string' ? value.trim().slice(0, 32) : ''
}

function normalizeOption<T extends readonly number[]>(value: unknown, options: T | number[], fallback: number): number {
  return typeof value === 'number' && options.includes(value) ? value : fallback
}

function normalizeCounter(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0
}

function createLocalId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
