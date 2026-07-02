import {
  ABSTRACT_ENDS,
  ABSTRACT_MIDDLES,
  ABSTRACT_STARTS,
  ACTION_WORDS,
  BANNED_FRAGMENTS,
  BENEFIT_WORDS,
  DOMAIN_ROOTS,
  INDUSTRY_LABELS,
  INDUSTRY_NOUNS,
  LENGTH_LABELS,
  SAAS_SUFFIXES,
  SHORT_ACTION_WORDS,
  SHORT_DOMAIN_ROOTS,
  SHORT_SUFFIXES
} from '../data/lexicon.js'

function hashSeed(seed) {
  const text = String(seed || Date.now())
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function createRandom(seed) {
  let state = hashSeed(seed)
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function pick(items, random) {
  return items[Math.floor(random() * items.length) % items.length]
}

function capitalize(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

function joinParts(parts) {
  return parts.map((part) => capitalize(part.value)).join('')
}

function countSyllables(value) {
  return Math.max(1, (value.match(/[aeiouy]+/gi) || []).length)
}

export function isReadableName(name) {
  const value = String(name || '').toLowerCase()
  if (value.length < 3 || value.length > 24) return false
  if (/(.)\1\1/.test(value)) return false
  if (/[bcdfghjklmnpqrstvwxyz]{4,}/i.test(value)) return false
  if (/[aeiouy]{4,}/i.test(value)) return false
  return !BANNED_FRAGMENTS.some((fragment) => value.includes(fragment))
}

export function scoreName(name, context = {}) {
  const length = name.length
  const readable = isReadableName(name)
  const syllables = countSyllables(name)
  const parts = context.parts || []

  const readability = readable
    ? Math.max(62, 98 - Math.abs(syllables - 3) * 5)
    : 28
  const brandability = Math.min(96, 66 + parts.length * 8 + (/[vxz]/i.test(name) ? 6 : 0))
  const industryFit = context.industry ? 88 : 70
  const brevity = length <= 10 ? 94 : Math.max(45, 102 - length * 4)
  const distinctiveness = /ly$|ify$|hub$/i.test(name) ? 72 : 88
  const total = Math.round(
    readability * 0.3 +
      brandability * 0.25 +
      industryFit * 0.2 +
      brevity * 0.15 +
      distinctiveness * 0.1
  )

  return {
    readability: Math.round(readability),
    brandability: Math.round(brandability),
    industryFit: Math.round(industryFit),
    brevity: Math.round(brevity),
    distinctiveness: Math.round(distinctiveness),
    total
  }
}

function formulaLabel(parts) {
  return parts.map((part) => part.type).join(' + ')
}

function sentenceList(parts) {
  return parts.map((part) => `${capitalize(part.value)} (${part.type})`).join(', ')
}

function buildReason(style, industry, length, structure, parts) {
  const industryLabel = INDUSTRY_LABELS[industry] || 'startup'
  const article = /^[aeiou]/i.test(industryLabel) ? 'an' : 'a'
  const lengthLabel = LENGTH_LABELS[length] || 'standard'
  const sourceSummary = sentenceList(parts)
  if (structure === 'coined-abstract') {
    return `A coined ${lengthLabel} name from ${sourceSummary}, tuned for a subtle ${industryLabel} signal.`
  }
  if (structure === 'verb-noun') {
    if (length === 'descriptive') {
      return `A descriptive action phrase from ${sourceSummary}, combining an action verb, ${article} ${industryLabel} noun, and a benefit cue.`
    }
    if (length === 'standard') {
      return `A standard action phrase from ${sourceSummary}, combining an action verb, ${article} ${industryLabel} noun, and a short benefit cue.`
    }
    return `Uses ${sourceSummary} so the name feels active and outcome-led.`
  }
  if (length === 'standard') {
    return `A standard SaaS compound from ${sourceSummary}, with ${article} ${industryLabel} root, product suffix, and optional benefit cue.`
  }
  if (length === 'descriptive') {
    return `A descriptive compound from ${sourceSummary}, combining ${article} ${industryLabel} root, benefit word, and product suffix.`
  }
  return `A ${lengthLabel} SaaS compound from ${sourceSummary}, with a clear ${industryLabel} root and product suffix.`
}

function createSourceParts(parts, options) {
  return parts.map((part) => ({
    value: part.value,
    type: part.type,
    tags: [options.industry, options.style, options.length],
    weight: part.type === 'industry' ? 1 : 0.8
  }))
}

function createCandidate(name, options, built, seed, index) {
  const partValues = built.parts.map((part) => part.value)
  const score = scoreName(name, {
    style: options.style,
    industry: options.industry,
    parts: partValues
  })

  return {
    id: `${seed}-${index}-${name.toLowerCase()}`,
    name,
    style: options.style,
    industries: [options.industry],
    length: options.length,
    structure: built.structure,
    formula: built.formula || formulaLabel(built.parts),
    syllables: partValues,
    sourceParts: createSourceParts(built.parts, options),
    score,
    reason: buildReason(options.style, options.industry, options.length, built.structure, built.parts),
    seed,
    createdAt: 0
  }
}

function buildName(options, random) {
  const industryRoots = DOMAIN_ROOTS[options.industry] || DOMAIN_ROOTS.productivity
  const shortRoots = SHORT_DOMAIN_ROOTS[options.industry] || SHORT_DOMAIN_ROOTS.productivity
  const industryNouns = INDUSTRY_NOUNS[options.industry] || INDUSTRY_NOUNS.productivity
  const benefitWords = BENEFIT_WORDS[options.industry] || BENEFIT_WORDS.productivity

  if (options.style === 'abstract') {
    const abstractParts = options.length === 'short'
      ? [pick(ABSTRACT_STARTS, random), pick(ABSTRACT_ENDS, random)]
      : [pick(ABSTRACT_STARTS, random), pick(ABSTRACT_MIDDLES, random), pick(ABSTRACT_ENDS, random)]
    const parts = abstractParts.map((value) => ({ value, type: 'syllable' }))
    if (options.length === 'descriptive') {
      parts.push({ value: pick(industryRoots, random), type: 'industry' })
    }
    return { name: joinParts(parts), parts, structure: 'coined-abstract', formula: formulaLabel(parts) }
  }

  if (options.style === 'action-driven') {
    const actionPool = options.length === 'short' ? SHORT_ACTION_WORDS : ACTION_WORDS
    const parts = [
      { value: pick(actionPool, random), type: 'action' },
      { value: options.length === 'short' ? pick(shortRoots, random) : pick(industryNouns, random), type: 'industry' }
    ]
    if (options.length === 'short' && random() > 0.62) {
      parts.push({ value: pick(SHORT_SUFFIXES, random), type: 'suffix' })
    }
    if (options.length === 'standard' || options.length === 'descriptive') {
      parts.push({ value: pick(benefitWords, random), type: 'benefit' })
    }
    return { name: joinParts(parts), parts, structure: 'verb-noun', formula: formulaLabel(parts) }
  }

  const root = pick(options.length === 'short' ? shortRoots : industryRoots, random)
  const suffix = pick(options.length === 'short' ? SHORT_SUFFIXES : SAAS_SUFFIXES, random)
  const parts = [
    { value: root, type: 'industry' },
    { value: suffix, type: 'suffix' }
  ]
  if (options.length === 'standard' && random() > 0.45) {
    parts.splice(1, 0, { value: pick(benefitWords, random), type: 'benefit' })
  }
  if (options.length === 'descriptive') {
    parts.splice(1, 0, { value: pick(benefitWords, random), type: 'benefit' })
  }
  return { name: joinParts(parts), parts, structure: 'compound-saas', formula: formulaLabel(parts) }
}

export function generateNames(options = {}) {
  const normalized = {
    style: options.style || 'micro-saas',
    industry: options.industry || 'ai',
    length: options.length || 'standard',
    count: options.count || 8,
    seed: options.seed || `seed-${Date.now()}`,
    filterReadable: options.filterReadable !== false
  }
  const random = createRandom(
    `${normalized.seed}:${normalized.style}:${normalized.industry}:${normalized.length}:${normalized.count}`
  )
  const results = []
  const seen = new Set()
  let attempts = 0

  while (results.length < normalized.count && attempts < normalized.count * 20) {
    attempts += 1
    const built = buildName(normalized, random)
    const name = built.name
    const key = name.toLowerCase()
    if (seen.has(key)) continue
    if (normalized.filterReadable && !isReadableName(name)) continue
    if (normalized.length === 'short' && name.length > 10) continue
    if (normalized.length === 'standard' && name.length > 16) continue

    seen.add(key)
    results.push(createCandidate(name, normalized, built, normalized.seed, results.length))
  }

  return results.sort((a, b) => b.score.total - a.score.total)
}

export const namingOptions = {
  styles: [
    { id: 'micro-saas', label: 'SaaS', description: 'Industry root + product suffix, best for practical tools.' },
    { id: 'abstract', label: 'Abstract', description: 'Coined syllables, best for invented brand names.' },
    { id: 'action-driven', label: 'Action', description: 'Verb + industry noun, best for outcome-led products.' }
  ],
  industries: [
    { id: 'ai', label: 'AI', description: 'Prompt, model, agent, context and automation signals.' },
    { id: 'devtools', label: 'DevTools', description: 'Code, repo, deploy, runtime and workflow signals.' },
    { id: 'fintech', label: 'Fintech', description: 'Ledger, vault, wallet, capital and trust signals.' },
    { id: 'creator', label: 'Creator', description: 'Studio, canvas, audience, channel and launch signals.' }
  ],
  lengths: [
    { id: 'short', label: 'Short', description: 'Two compact parts, usually 4-10 characters.' },
    { id: 'standard', label: 'Standard', description: 'Balanced brandable names with clearer category hints.' },
    { id: 'descriptive', label: 'Descriptive', description: 'Three-part names that include a benefit or use-case cue.' }
  ]
}
