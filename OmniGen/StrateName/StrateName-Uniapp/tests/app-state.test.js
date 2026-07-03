import test from 'node:test'
import assert from 'node:assert/strict'

import {
  createInitialState,
  selectProposalCandidate,
  toggleShortlist,
  updateShortlistNote
} from '../src/app/appState.js'

const candidate = {
  id: 'crestway-partners-llc',
  name: 'Crestway Partners',
  displayName: 'Crestway Partners LLC',
  score: 88,
  tags: ['Capital-ready', 'Boardroom'],
  riskLevel: 'Needs verification'
}

test('shortlist toggle stores complete candidate snapshots locally', () => {
  const state = createInitialState()

  const saved = toggleShortlist(state, candidate)
  assert.equal(saved.shortlist.length, 1)
  assert.equal(saved.shortlist[0].displayName, 'Crestway Partners LLC')
  assert.equal(saved.shortlist[0].note, '')

  const removed = toggleShortlist(saved, candidate)
  assert.equal(removed.shortlist.length, 0)
})

test('notes and proposal selection are immutable state updates', () => {
  const state = toggleShortlist(createInitialState(), candidate)
  const noted = updateShortlistNote(state, candidate.id, 'Ask counsel to verify trademark.')
  const selected = selectProposalCandidate(noted, candidate.id)

  assert.notEqual(state, noted)
  assert.equal(noted.shortlist[0].note, 'Ask counsel to verify trademark.')
  assert.equal(selected.proposalCandidateId, candidate.id)
})

test('persisted partial settings are deep-merged with current defaults', () => {
  const state = createInitialState({
    options: { industry: 'finance' },
    settings: { acceptedDisclaimer: true }
  })

  assert.equal(state.options.industry, 'finance')
  assert.ok(state.options.style)
  assert.equal(state.settings.acceptedDisclaimer, true)
  assert.equal(state.settings.filterHighRisk, true)
  assert.equal(state.settings.showScoreDetails, true)
  assert.equal(state.settings.legalLocale, 'en')
})
