export const DEFAULT_RATE_TABLE = {
  base: 'USD',
  rates: {
    USD: 1,
    EUR: 0.92241,
    JPY: 153.89,
    CNY: 7.24835,
    GBP: 0.78916,
    HKD: 7.8079,
    AUD: 1.5068,
    CAD: 1.3652,
    SGD: 1.3461,
    CHF: 0.8917,
    KRW: 1389.42,
    THB: 36.74,
    MYR: 4.711,
    TWD: 32.18,
    INR: 83.47,
    AED: 3.6725
  },
  fetchedAt: '2026-06-23T09:42:00+08:00',
  source: 'mock'
}

export const DEFAULT_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', tone: 'green' },
  { code: 'EUR', name: 'Euro', symbol: '€', tone: 'green' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', tone: 'slate' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', tone: 'sage' },
  { code: 'GBP', name: 'Pound Sterling', symbol: '£', tone: 'blue' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', tone: 'blue' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', tone: 'green' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', tone: 'blue' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', tone: 'sage' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', tone: 'slate' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', tone: 'slate' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', tone: 'sage' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', tone: 'green' },
  { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$', tone: 'blue' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', tone: 'sage' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', tone: 'slate' }
]

export function parseAmountInput(value) {
  const normalized = String(value ?? '').replace(/,/g, '').trim()
  if (normalized === '') {
    return 0
  }

  const amount = Number(normalized)
  return Number.isFinite(amount) && amount >= 0 ? amount : 0
}

export function convertAmount(amount, from, to, table = DEFAULT_RATE_TABLE) {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) {
    throw new Error('Amount must be a finite number')
  }

  const fromRate = getRate(table, from)
  const toRate = getRate(table, to)
  return numericAmount * (toRate / fromRate)
}

export function getRate(table, code) {
  if (!table || !table.rates || table.base !== 'USD') {
    throw new Error('Rate table must use USD as base')
  }

  const rate = table.rates[code]
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(`Missing rate for ${code}`)
  }

  return rate
}
