import {
  BANNED_FRAGMENTS,
  BRIDGES,
  DEFAULT_OPTIONS,
  ENTERPRISE_ENDINGS,
  INDUSTRIES,
  LEGAL_SUFFIXES,
  LENGTHS,
  QUALIFIERS,
  ROOTS,
  SEMANTIC_SUFFIXES,
  STYLES,
  TONES,
  findOption
} from '../data/lexicon.js'

const DIMENSION_MAX = {
  professionalFit: 25,
  trustSignal: 20,
  industryMatch: 20,
  readability: 15,
  distinctiveness: 10,
  riskControl: 10
}

let sessionSeedCounter = 0

function createSessionSeed() {
  sessionSeedCounter = (sessionSeedCounter + 1) % Number.MAX_SAFE_INTEGER
  return `session-${Date.now()}-${sessionSeedCounter}`
}

function hashSeed(seed) {
  const text = String(seed || 'stratename')
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

function pickBridge(rootToken, random, length) {
  const pool = length === 'standard' ? [...BRIDGES].reverse() : BRIDGES
  const root = String(rootToken || '').toLowerCase()
  let bridge = pick(pool, random)
  let attempts = 0
  while (attempts < 8 && root.endsWith(bridge.toLowerCase())) {
    bridge = pick(pool, random)
    attempts += 1
  }
  if (length !== 'formal') return bridge

  let second = pick([...BRIDGES].reverse(), random)
  attempts = 0
  while (attempts < 8 && (second === bridge || bridge.toLowerCase().endsWith(second.toLowerCase()))) {
    second = pick([...BRIDGES].reverse(), random)
    attempts += 1
  }
  return `${bridge}${titleCase(second)}`
}

function normalizeName(value) {
  return String(value || '').replace(/[^a-z]/gi, '').toLowerCase()
}

function compactSpaces(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function countSyllables(value) {
  return Math.max(1, (String(value).match(/[aeiouy]+/gi) || []).length)
}

function titleCase(value) {
  const text = String(value || '')
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

function getLabel(options, id) {
  return findOption(options, id)?.label || id
}

function qualifierFor(base, suffix, options, random) {
  const pool = QUALIFIERS[options.industry] || []
  if (!pool.length || !suffix?.id) return ''

  const shouldUse = options.length === 'formal' ||
    (options.length === 'standard' && random() > 0.04) ||
    (options.length === 'short' && random() > 0.34)
  if (!shouldUse) return ''

  const baseKey = normalizeName(base)
  let qualifier = pick(pool, random)
  let attempts = 0
  while (attempts < 10 && (baseKey.includes(normalizeName(qualifier)) || normalizeName(suffix.id).includes(normalizeName(qualifier)))) {
    qualifier = pick(pool, random)
    attempts += 1
  }

  const candidate = `${base} ${qualifier} ${suffix.id}`
  const maxLength = options.length === 'short' ? 26 : 32
  return normalizeName(candidate).length <= maxLength ? qualifier : ''
}

function composeCorporateName(base, suffix, options, random) {
  const qualifier = qualifierFor(base, suffix, options, random)
  return {
    qualifier,
    name: compactSpaces([base, qualifier, suffix.id].filter(Boolean).join(' '))
  }
}

function rootsFor(options) {
  const exact = ROOTS.filter((root) => {
    return (
      root.industries.includes(options.industry) &&
      root.styles.includes(options.style) &&
      root.tones.includes(options.tone)
    )
  })
  if (exact.length >= 4) return exact

  const relaxedTone = ROOTS.filter((root) => {
    return root.industries.includes(options.industry) && root.styles.includes(options.style)
  })
  if (relaxedTone.length >= 4) return relaxedTone

  const relaxedStyle = ROOTS.filter((root) => root.industries.includes(options.industry))
  return relaxedStyle.length ? relaxedStyle : ROOTS
}

function semanticSuffixesFor(options) {
  if (options.entitySuffix && options.entitySuffix !== 'auto') {
    const requested = SEMANTIC_SUFFIXES.find((suffix) => suffix.id === options.entitySuffix)
    if (requested) return [requested]
  }
  const eligible = SEMANTIC_SUFFIXES.filter((suffix) => {
    if (suffix.id === 'auto') return false
    return suffix.industries.includes(options.industry) && suffix.styles.includes(options.style)
  })
  const specific = eligible.filter((suffix) => suffix.id !== 'Group')
  if (specific.length >= 2) return specific
  if (eligible.length) return eligible
  return SEMANTIC_SUFFIXES.filter((suffix) => suffix.id !== 'auto')
}

function legalSuffixFor(options) {
  const suffix = LEGAL_SUFFIXES.find((item) => item.id === options.legalSuffix)
  return suffix && suffix.id !== 'none' ? suffix.id : ''
}

function joinDisplayName(name, legalSuffix) {
  return compactSpaces([name, legalSuffix].filter(Boolean).join(' '))
}

function buildGlobalVenture(options, random) {
  const root = pick(rootsFor(options), random)
  const suffix = pick(semanticSuffixesFor(options), random)
  const bridge = pickBridge(root.token, random, options.length)
  const maxBridgeRootLength = options.length === 'short' ? 10 : 14
  const base = bridge && root.token.length <= maxBridgeRootLength
    ? `${root.token}${titleCase(bridge)}`
    : root.token
  const composed = composeCorporateName(base, suffix, options, random)
  const baseTemplate = bridge && root.token.length <= maxBridgeRootLength ? '{root}{bridge}' : '{root}'
  return {
    root,
    bridge,
    qualifier: composed.qualifier,
    semanticSuffix: suffix.id,
    name: composed.name,
    template: composed.qualifier
      ? `${baseTemplate} {qualifier} {suffix}`
      : bridge ? '{root}{bridge} {suffix}' : '{root} {suffix}'
  }
}

function buildHeritageIndustrial(options, random) {
  const roots = rootsFor(options)
  const first = pick(roots, random)
  const second = pick(roots.filter((root) => root.token !== first.token) || roots, random)
  const suffix = pick(semanticSuffixesFor(options), random)
  const bridge = options.length === 'short' || options.length === 'formal' || (options.length === 'standard' && random() > 0.48)
    ? pickBridge(first.token, random, options.length)
    : ''
  const base = options.length === 'short'
    ? `${first.token}${first.token.length <= 10 ? titleCase(bridge) : ''}`
    : `${first.token}${bridge ? titleCase(bridge) : second.token}`
  const composed = composeCorporateName(base, suffix, options, random)
  const baseTemplate = bridge ? '{materialRoot}{bridge}' : '{root}{secondaryRoot}'
  return {
    root: first,
    secondaryRoot: second,
    bridge,
    qualifier: composed.qualifier,
    semanticSuffix: suffix.id,
    name: composed.name,
    template: composed.qualifier
      ? `${baseTemplate} {qualifier} {suffix}`
      : bridge ? '{materialRoot}{bridge} {suffix}' : '{root}{secondaryRoot} {suffix}'
  }
}

function buildNeoEnterprise(options, random) {
  const root = pick(rootsFor(options), random)
  const suffix = pick(semanticSuffixesFor(options), random)
  const ending = pick(ENTERPRISE_ENDINGS, random)
  if (options.length === 'short') {
    return {
      root,
      bridge: ending,
      semanticSuffix: '',
      name: `${root.token}${titleCase(ending)}`,
      template: '{latinRoot}{ending}'
    }
  }
  const base = `${root.token}${titleCase(ending)}`
  const composed = composeCorporateName(base, suffix, options, random)
  return {
    root,
    bridge: ending,
    qualifier: composed.qualifier,
    semanticSuffix: suffix.id,
    name: composed.name,
    template: composed.qualifier ? '{root}{ending} {qualifier} {suffix}' : '{root}{ending} {suffix}'
  }
}

function buildName(options, random) {
  if (options.style === 'heritageIndustrial') return buildHeritageIndustrial(options, random)
  if (options.style === 'neoEnterprise') return buildNeoEnterprise(options, random)
  return buildGlobalVenture(options, random)
}

export function isReadableName(name) {
  const text = compactSpaces(name).replace(/\b(LLC|Ltd\.|Inc\.|Corp\.)$/i, '').trim()
  const normalized = normalizeName(text)
  if (normalized.length < 3 || normalized.length > 32) return false
  if (/(.)\1\1/.test(normalized)) return false
  if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(normalized)) return false
  if (/[aeiouy]{4,}/i.test(normalized)) return false
  return !BANNED_FRAGMENTS.some((fragment) => text.toLowerCase().includes(fragment))
}

function riskFlagsFor(displayName) {
  const flags = []
  if (!isReadableName(displayName)) flags.push('Readability review')
  if (/\b(llc|inc\.|ltd\.|corp\.)\b/i.test(displayName)) flags.push('Legal suffix preview')
  return flags
}

function scoreCandidate(built, displayName, options) {
  const root = built.root
  const readable = isReadableName(displayName)
  const syllables = countSyllables(displayName)
  const length = normalizeName(displayName).length
  const genericPair = /^(global group|prime capital|capital group)$/i.test(built.name)

  const professionalFit = Math.min(
    DIMENSION_MAX.professionalFit,
    18 + (root.styles.includes(options.style) ? 4 : 0) + (built.semanticSuffix ? 2 : 0) + (options.tone === 'boardroom' ? 1 : 0)
  )
  const trustSignal = Math.min(
    DIMENSION_MAX.trustSignal,
    14 + (root.tones.includes(options.tone) ? 3 : 1) + (['conservative', 'boardroom', 'premium'].includes(options.tone) ? 2 : 1)
  )
  const industryMatch = Math.min(DIMENSION_MAX.industryMatch, root.industries.includes(options.industry) ? 18 : 13)
  const readability = readable
    ? Math.max(10, DIMENSION_MAX.readability - Math.abs(syllables - 4))
    : 6
  const distinctiveness = Math.max(5, DIMENSION_MAX.distinctiveness - (genericPair ? 3 : 0) - (length > 24 ? 1 : 0))
  const riskControl = Math.max(5, DIMENSION_MAX.riskControl - riskFlagsFor(displayName).length)

  const breakdown = {
    professionalFit,
    trustSignal,
    industryMatch,
    readability,
    distinctiveness,
    riskControl
  }
  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0)
  return { breakdown, total }
}

function rationaleFor(built, options) {
  const industryLabel = getLabel(INDUSTRIES, options.industry)
  const styleLabel = getLabel(STYLES, options.style)
  const suffixText = built.semanticSuffix
    ? `${built.semanticSuffix} gives the name a familiar corporate role.`
    : 'The coined form keeps the name compact while staying enterprise-oriented.'
  return [
    `${built.root.token} suggests ${built.root.meaning}.`,
    suffixText,
    `${styleLabel} aligns the candidate with ${industryLabel.toLowerCase()} contexts.`
  ]
}

function tagsFor(built, options) {
  const industry = findOption(INDUSTRIES, options.industry)
  const tone = findOption(TONES, options.tone)
  const length = findOption(LENGTHS, options.length)
  return [industry.tag, tone.label, length.label].filter(Boolean).slice(0, 3)
}

function makeCandidate(built, options, seed, index) {
  const legalSuffix = legalSuffixFor(options)
  const name = compactSpaces(built.name)
  const displayName = joinDisplayName(name, legalSuffix)
  const { breakdown, total } = scoreCandidate(built, displayName, options)
  const riskFlags = riskFlagsFor(displayName)

  return {
    id: `${seed}-${index}-${normalizeName(displayName)}`,
    name,
    displayName,
    industry: options.industry,
    industryLabel: getLabel(INDUSTRIES, options.industry),
    style: options.style,
    styleLabel: getLabel(STYLES, options.style),
    tone: options.tone,
    toneLabel: getLabel(TONES, options.tone),
    length: options.length,
    semanticSuffix: built.semanticSuffix,
    legalSuffix,
    score: total,
    breakdown,
    scoreMax: DIMENSION_MAX,
    tags: tagsFor(built, options),
    riskLevel: riskFlags.length ? 'Needs verification' : 'Low structural risk',
    riskFlags,
    structure: {
      root: built.root.token,
      bridge: built.bridge || '',
      secondaryRoot: built.secondaryRoot?.token || '',
      qualifier: built.qualifier || '',
      semanticSuffix: built.semanticSuffix || 'None',
      legalSuffix: legalSuffix || 'None',
      template: built.template
    },
    rationale: rationaleFor(built, options),
    disclaimer: 'Creative naming suggestion only. Verify company registration, trademark and domain availability before use.',
    createdAt: 0
  }
}

function normalizeOptions(options = {}) {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    count: Math.min(24, Math.max(1, Number(options.count || DEFAULT_OPTIONS.count))),
    seed: String(options.seed || DEFAULT_OPTIONS.seed || 'session')
  }
}

export function generateNames(options = {}) {
  const normalized = normalizeOptions(options)
  const effectiveSeed = normalized.useSeed
    ? normalized.seed || 'stratename-seed'
    : createSessionSeed()
  const random = createRandom(
    `${effectiveSeed}:${normalized.industry}:${normalized.style}:${normalized.entitySuffix}:${normalized.legalSuffix}:${normalized.tone}:${normalized.length}`
  )
  const results = []
  const seen = new Set()
  let attempts = 0

  while (results.length < normalized.count && attempts < normalized.count * 80) {
    attempts += 1
    const built = buildName(normalized, random)
    const candidate = makeCandidate(built, normalized, effectiveSeed, results.length)
    const key = normalizeName(candidate.displayName)
    if (seen.has(key)) continue
    if (normalized.strictness !== 'loose' && !isReadableName(candidate.displayName)) continue
    if (normalized.length === 'short' && normalizeName(candidate.name).length > 24) continue
    if (normalized.length === 'standard' && normalizeName(candidate.name).length > 30) continue
    seen.add(key)
    results.push(candidate)
  }

  return results.sort((a, b) => b.score - a.score)
}

export const namingOptions = {
  industries: INDUSTRIES,
  styles: STYLES,
  tones: TONES,
  lengths: LENGTHS,
  semanticSuffixes: SEMANTIC_SUFFIXES,
  legalSuffixes: LEGAL_SUFFIXES,
  defaults: DEFAULT_OPTIONS
}

export function buildProposalSummary(candidate, tagline = '') {
  if (!candidate) return ''
  const line = tagline || `Strategic advisory for long-term enterprise growth.`
  return [
    candidate.displayName,
    `${candidate.industryLabel} | ${candidate.styleLabel} | Score ${candidate.score}/100`,
    line,
    candidate.rationale.join(' '),
    candidate.disclaimer
  ].join('\n')
}
