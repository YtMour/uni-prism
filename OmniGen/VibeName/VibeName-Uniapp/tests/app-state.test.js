import test from 'node:test'
import assert from 'node:assert/strict'

import {
  createInitialState,
  generateCandidates,
  setLocale,
  setResultCount,
  toggleReadableFilter,
  toggleScoreDetails,
  toggleSeedMode,
  removeSavedCandidate,
  setActiveCandidate,
  toggleSavedCandidate
} from '../src/app/appState.js'

test('generates candidates from the selected naming controls', () => {
  const state = createInitialState()
  state.selectedStyle = 'action-driven'
  state.selectedIndustry = 'devtools'

  const next = generateCandidates(state)

  assert.equal(next.candidates.length, 8)
  assert.equal(next.candidates[0].style, 'action-driven')
  assert.ok(next.candidates[0].industries.includes('devtools'))
  assert.equal(next.seedIndex, 2)
})

test('result count setting changes the generated batch size', () => {
  const state = setResultCount(createInitialState(), 12)
  const next = generateCandidates(state)

  assert.equal(next.resultCount, 12)
  assert.equal(next.candidates.length, 12)
})

test('seed mode changes whether repeated generation is reproducible', () => {
  const seeded = createInitialState({ useSeed: true, seedIndex: 5 })
  const seededFirst = generateCandidates(seeded)
  const seededSecond = generateCandidates(seeded)

  const unseeded = toggleSeedMode(createInitialState({ useSeed: true }))
  const unseededFirst = generateCandidates(unseeded)
  const unseededSecond = generateCandidates(unseeded)

  assert.deepEqual(
    seededFirst.candidates.map((candidate) => candidate.name),
    seededSecond.candidates.map((candidate) => candidate.name)
  )
  assert.notDeepEqual(
    unseededFirst.candidates.map((candidate) => candidate.id),
    unseededSecond.candidates.map((candidate) => candidate.id)
  )
})

test('readability filter and score detail settings are real state toggles', () => {
  const state = createInitialState()
  const relaxed = toggleReadableFilter(state)
  const hiddenScores = toggleScoreDetails(state)

  assert.equal(relaxed.filterReadable, false)
  assert.equal(hiddenScores.showScoreDetails, false)
})

test('locale setting accepts supported languages and rejects unknown ids', () => {
  const state = createInitialState()
  const zh = setLocale(state, 'zh-Hans')
  const ar = setLocale(zh, 'ar')
  const fallback = setLocale(ar, 'unknown-locale')

  assert.equal(zh.locale, 'zh-Hans')
  assert.equal(ar.locale, 'ar')
  assert.equal(fallback.locale, 'en')
})

test('toggles saved candidates without duplicating names', () => {
  const state = createInitialState()
  const generated = generateCandidates(state)
  const candidate = generated.candidates[0]

  const savedOnce = toggleSavedCandidate(generated, candidate)
  const savedTwice = toggleSavedCandidate(savedOnce, candidate)

  assert.equal(savedOnce.saved.length, 1)
  assert.equal(savedOnce.saved[0].name, candidate.name)
  assert.equal(savedTwice.saved.length, 0)
})

test('removes saved candidates and sets preview candidate', () => {
  const state = createInitialState()
  const generated = generateCandidates(state)
  const candidate = generated.candidates[0]
  const saved = toggleSavedCandidate(generated, candidate)
  const preview = setActiveCandidate(saved, candidate)
  const removed = removeSavedCandidate(preview, candidate)

  assert.equal(preview.viewMode, 'preview')
  assert.equal(preview.activeCandidate.name, candidate.name)
  assert.equal(removed.saved.length, 0)
})
