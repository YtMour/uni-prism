export function policyContent(title: string): string {
  if (title === 'Privacy Policy') {
    return 'FitCal stores records locally on your device and does not require an account for MVP use.'
  }

  return 'FitCal provides general wellness estimates only and is not medical advice.'
}
