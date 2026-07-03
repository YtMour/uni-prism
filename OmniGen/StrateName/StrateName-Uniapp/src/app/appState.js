import { DEFAULT_OPTIONS } from '../data/lexicon.js'

const DEFAULT_SETTINGS = {
  resultCount: DEFAULT_OPTIONS.count,
  filterHighRisk: true,
  showScoreDetails: true,
  acceptedDisclaimer: false,
  legalLocale: 'en'
}

export function createInitialState(overrides = {}) {
  const { options = {}, settings = {}, ...stateOverrides } = overrides
  return {
    activeTab: 'generate',
    options: { ...DEFAULT_OPTIONS, ...options },
    candidates: [],
    selectedCandidateId: '',
    proposalCandidateId: '',
    shortlist: [],
    settings: { ...DEFAULT_SETTINGS, ...settings },
    ...stateOverrides
  }
}

function snapshotCandidate(candidate) {
  return {
    ...candidate,
    note: candidate.note || '',
    savedAt: candidate.savedAt || 0
  }
}

export function toggleShortlist(state, candidate) {
  const exists = state.shortlist.some((item) => item.id === candidate.id)
  return {
    ...state,
    shortlist: exists
      ? state.shortlist.filter((item) => item.id !== candidate.id)
      : [snapshotCandidate(candidate), ...state.shortlist]
  }
}

export function updateShortlistNote(state, candidateId, note) {
  return {
    ...state,
    shortlist: state.shortlist.map((item) => {
      if (item.id !== candidateId) return item
      return { ...item, note: String(note || '').slice(0, 140) }
    })
  }
}

export function selectProposalCandidate(state, candidateId) {
  return {
    ...state,
    proposalCandidateId: candidateId
  }
}

export function isShortlisted(state, candidateId) {
  return state.shortlist.some((item) => item.id === candidateId)
}

export function getAllCandidates(state) {
  const byId = new Map()
  for (const candidate of state.candidates) byId.set(candidate.id, candidate)
  for (const candidate of state.shortlist) byId.set(candidate.id, candidate)
  return [...byId.values()]
}

export function getCandidateById(state, candidateId) {
  return getAllCandidates(state).find((candidate) => candidate.id === candidateId) || null
}

export function getProposalCandidate(state) {
  return getCandidateById(state, state.proposalCandidateId) || state.shortlist[0] || state.candidates[0] || null
}
