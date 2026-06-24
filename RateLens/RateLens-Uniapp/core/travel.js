import { convertAmount } from './currency.js'

export function calculateTravelBill({
  subtotal,
  currency,
  homeCurrency,
  taxRate,
  tipRate,
  peopleCount,
  rateTable
}) {
  const safeSubtotal = requireNonNegativeNumber(subtotal, 'subtotal')
  const safeTaxRate = requireNonNegativeNumber(taxRate, 'taxRate')
  const safeTipRate = requireNonNegativeNumber(tipRate, 'tipRate')
  const safePeopleCount = Math.max(1, Math.trunc(requireNonNegativeNumber(peopleCount, 'peopleCount')))

  const taxAmount = safeSubtotal * (safeTaxRate / 100)
  const taxedSubtotal = safeSubtotal + taxAmount
  const tipAmount = taxedSubtotal * (safeTipRate / 100)
  const totalForeign = taxedSubtotal + tipAmount
  const totalHome = convertAmount(totalForeign, currency, homeCurrency, rateTable)
  const perPersonForeign = totalForeign / safePeopleCount
  const perPersonHome = totalHome / safePeopleCount

  return {
    subtotal: safeSubtotal,
    taxAmount,
    tipAmount,
    totalForeign,
    totalHome,
    perPersonForeign,
    perPersonHome,
    peopleCount: safePeopleCount
  }
}

function requireNonNegativeNumber(value, label) {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    throw new Error(`${label} must be a non-negative number`)
  }

  return numericValue
}
