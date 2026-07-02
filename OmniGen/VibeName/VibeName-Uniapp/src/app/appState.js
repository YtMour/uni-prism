import { generateNames } from '../core/generator.js'
import { normalizeLocale } from './i18n.js'

export function createInitialState(overrides = {}) {
  return {
    selectedStyle: 'micro-saas',
    selectedIndustry: 'ai',
    selectedLength: 'standard',
    candidates: [],
    saved: [],
    detailCandidate: null,
    activeCandidate: null,
    viewMode: 'generator',
    isGenerating: false,
    seedIndex: 1,
    resultCount: 8,
    useSeed: true,
    filterReadable: true,
    showScoreDetails: true,
    locale: 'en',
    ...overrides
  }
}

export function nextSeed(state) {
  if (state.useSeed === false) {
    return `vibename-${Date.now()}-${Math.random().toString(36).slice(2)}`
  }
  return `vibename-${state.seedIndex}`
}

export function generateCandidates(state) {
  const candidates = generateNames({
    style: state.selectedStyle,
    industry: state.selectedIndustry,
    length: state.selectedLength,
    count: state.resultCount || 8,
    seed: nextSeed(state),
    filterReadable: state.filterReadable !== false
  })

  return {
    ...state,
    candidates,
    seedIndex: state.useSeed === false ? state.seedIndex : state.seedIndex + 1,
    isGenerating: false
  }
}

export function setResultCount(state, count) {
  const normalized = Math.min(12, Math.max(4, Number(count) || 8))
  return {
    ...state,
    resultCount: normalized
  }
}

export function toggleSeedMode(state) {
  return {
    ...state,
    useSeed: !state.useSeed
  }
}

export function toggleReadableFilter(state) {
  return {
    ...state,
    filterReadable: !state.filterReadable
  }
}

export function toggleScoreDetails(state) {
  return {
    ...state,
    showScoreDetails: !state.showScoreDetails
  }
}

export function setLocale(state, locale) {
  return {
    ...state,
    locale: normalizeLocale(locale)
  }
}

export function isCandidateSaved(state, candidate) {
  return state.saved.some((item) => item.name === candidate.name)
}

export function toggleSavedCandidate(state, candidate) {
  if (isCandidateSaved(state, candidate)) {
    return removeSavedCandidate(state, candidate)
  }

  return {
    ...state,
    saved: [candidate, ...state.saved].slice(0, 24)
  }
}

export function removeSavedCandidate(state, candidate) {
  return {
    ...state,
    saved: state.saved.filter((item) => item.name !== candidate.name)
  }
}

export function setActiveCandidate(state, candidate) {
  return {
    ...state,
    activeCandidate: candidate,
    detailCandidate: null,
    viewMode: 'preview'
  }
}
