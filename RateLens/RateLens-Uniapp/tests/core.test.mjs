import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  DEFAULT_CURRENCIES,
  DEFAULT_RATE_TABLE,
  convertAmount,
  parseAmountInput
} from '../core/currency.js'
import { formatCurrency } from '../core/format.js'
import { calculateTravelBill } from '../core/travel.js'

describe('currency core', () => {
  it('converts USD to a target currency with the USD rate table', () => {
    assert.equal(convertAmount(100, 'USD', 'CNY', DEFAULT_RATE_TABLE), 724.835)
  })

  it('converts between two non-USD currencies through the USD matrix', () => {
    const result = convertAmount(153.89, 'JPY', 'CNY', DEFAULT_RATE_TABLE)
    assert.equal(Number(result.toFixed(5)), 7.24835)
  })

  it('keeps every supported currency backed by a mock rate', () => {
    for (const currency of DEFAULT_CURRENCIES) {
      assert.equal(typeof DEFAULT_RATE_TABLE.rates[currency.code], 'number', currency.code)
    }
    assert.ok(DEFAULT_CURRENCIES.length >= 16)
  })

  it('converts newly added travel currencies', () => {
    assert.equal(Number(convertAmount(100, 'USD', 'SGD', DEFAULT_RATE_TABLE).toFixed(2)), 134.61)
    assert.equal(Number(convertAmount(1000, 'KRW', 'CNY', DEFAULT_RATE_TABLE).toFixed(2)), 5.22)
  })

  it('throws when a currency rate is missing', () => {
    assert.throws(() => convertAmount(100, 'USD', 'MXN', DEFAULT_RATE_TABLE), /Missing rate for MXN/)
  })

  it('parses empty and invalid user input as zero', () => {
    assert.equal(parseAmountInput(''), 0)
    assert.equal(parseAmountInput('abc'), 0)
    assert.equal(parseAmountInput('1,234.50'), 1234.5)
  })
})

describe('format core', () => {
  it('formats money through Intl.NumberFormat', () => {
    assert.equal(formatCurrency(724.835, 'CNY', 'en-US'), 'CN¥724.84')
    assert.equal(formatCurrency(5882.25, 'JPY', 'en-US'), '¥5,882')
    assert.equal(formatCurrency(23529, 'GBP', 'en-US'), '£23,529')
  })
})

describe('travel core', () => {
  it('calculates tax, then tip on the taxed subtotal, then split home cost', () => {
    const bill = calculateTravelBill({
      subtotal: 18600,
      currency: 'JPY',
      homeCurrency: 'CNY',
      taxRate: 10,
      tipRate: 15,
      peopleCount: 3,
      rateTable: DEFAULT_RATE_TABLE
    })

    assert.equal(bill.taxAmount, 1860)
    assert.equal(bill.tipAmount, 3069)
    assert.equal(bill.totalForeign, 23529)
    assert.equal(Number(bill.perPersonHome.toFixed(2)), 369.41)
  })
})
