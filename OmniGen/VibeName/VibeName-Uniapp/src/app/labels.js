function translateIfAvailable(translate, key) {
  if (!translate) return ''
  const value = translate(key)
  return value === key ? '' : value
}

export function optionLabel(options, group, id, translate) {
  return translateIfAvailable(translate, `options.${group}.${id}.label`) ||
    options[group].find((item) => item.id === id)?.label ||
    id
}

export function optionDescription(options, group, id, translate) {
  return translateIfAvailable(translate, `options.${group}.${id}.description`) ||
    options[group].find((item) => item.id === id)?.description ||
    ''
}

export function structureLabel(candidate, translate) {
  const key = candidate?.structure ? `structure.${candidate.structure}` : 'structure.generated'
  return translateIfAvailable(translate, key) || translateIfAvailable(translate, 'structure.generated') || 'Generated name'
}

export function taglineFor(candidate, translate) {
  if (!candidate) return ''
  if (candidate.industries.includes('ai')) return translateIfAvailable(translate, 'tagline.ai') || 'Build smarter product workflows.'
  if (candidate.industries.includes('devtools')) return translateIfAvailable(translate, 'tagline.devtools') || 'Ship cleaner developer tools.'
  if (candidate.industries.includes('fintech')) return translateIfAvailable(translate, 'tagline.fintech') || 'Move money with clarity.'
  return translateIfAvailable(translate, 'tagline.default') || 'Build smoother workflows.'
}

export function scoreRows(candidate, translate) {
  return [
    { label: translateIfAvailable(translate, 'score.readability') || 'Readability', value: candidate.score.readability },
    { label: translateIfAvailable(translate, 'score.brand') || 'Brand', value: candidate.score.brandability },
    { label: translateIfAvailable(translate, 'score.industryFit') || 'Industry fit', value: candidate.score.industryFit },
    { label: translateIfAvailable(translate, 'score.brevity') || 'Brevity', value: candidate.score.brevity },
    { label: translateIfAvailable(translate, 'score.distinctiveness') || 'Distinctive', value: candidate.score.distinctiveness }
  ]
}

export function candidateReason(candidate, translate) {
  return translateIfAvailable(translate, `reason.${candidate?.structure}`) || candidate?.reason || ''
}
