export function formatCurrency(amount, currency, locale = 'en-US') {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) {
    return ''
  }

  const isIntegerAmount = Number.isInteger(numericAmount)
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: isIntegerAmount ? 0 : undefined,
    maximumFractionDigits: isIntegerAmount ? 0 : undefined
  }).format(numericAmount)
}

export function formatNumber(amount, locale = 'en-US') {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) {
    return ''
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.abs(numericAmount) >= 10000 ? 0 : 2
  }).format(numericAmount)
}
