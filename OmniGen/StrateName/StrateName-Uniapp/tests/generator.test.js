import test from 'node:test'
import assert from 'node:assert/strict'

import { generateNames, isReadableName } from '../src/core/generator.js'

test('generates deterministic boardroom candidates for the same seed', () => {
  const options = {
    industry: 'finance',
    style: 'globalVenture',
    entitySuffix: 'Partners',
    legalSuffix: 'LLC',
    tone: 'boardroom',
    length: 'standard',
    count: 8,
    seed: 'board-42',
    useSeed: true
  }

  const first = generateNames(options)
  const second = generateNames(options)

  assert.equal(first.length, 8)
  assert.deepEqual(first.map((candidate) => candidate.displayName), second.map((candidate) => candidate.displayName))
  assert.ok(first.every((candidate) => candidate.industry === 'finance'))
  assert.ok(first.every((candidate) => candidate.style === 'globalVenture'))
  assert.ok(first.every((candidate) => candidate.legalSuffix === 'LLC'))
  assert.ok(first.every((candidate) => candidate.score >= 78))
})

test('ignores stored seed when seed mode is off', () => {
  const originalNow = Date.now
  const options = {
    industry: 'finance',
    style: 'globalVenture',
    entitySuffix: 'Partners',
    legalSuffix: 'none',
    tone: 'boardroom',
    length: 'standard',
    count: 8,
    seed: 'stale-hidden-seed',
    useSeed: false
  }

  try {
    Date.now = () => 1000
    const first = generateNames(options).map((candidate) => candidate.displayName)
    const second = generateNames(options).map((candidate) => candidate.displayName)

    assert.notDeepEqual(first, second)
  } finally {
    Date.now = originalNow
  }
})

test('uses stored seed only when seed mode is on', () => {
  const options = {
    industry: 'finance',
    style: 'globalVenture',
    entitySuffix: 'Partners',
    legalSuffix: 'none',
    tone: 'boardroom',
    length: 'standard',
    count: 8,
    seed: 'intentional-seed',
    useSeed: true
  }

  const first = generateNames(options).map((candidate) => candidate.displayName)
  const second = generateNames(options).map((candidate) => candidate.displayName)

  assert.deepEqual(first, second)
})

test('returns explainable candidates with risk disclaimer and score dimensions', () => {
  const [candidate] = generateNames({
    industry: 'realEstate',
    style: 'heritageIndustrial',
    entitySuffix: 'Trust',
    tone: 'premium',
    length: 'formal',
    count: 1,
    seed: 'proposal-7',
    useSeed: true
  })

  assert.ok(candidate.name)
  assert.ok(candidate.displayName)
  assert.ok(candidate.structure.root)
  assert.ok(candidate.structure.semanticSuffix)
  assert.ok(candidate.rationale.length >= 2)
  assert.match(candidate.disclaimer, /Verify company registration, trademark and domain availability/i)
  assert.deepEqual(Object.keys(candidate.breakdown), [
    'professionalFit',
    'trustSignal',
    'industryMatch',
    'readability',
    'distinctiveness',
    'riskControl'
  ])
})

test('filters banned fragments and unreadable names', () => {
  assert.equal(isReadableName('ScamBridge'), false)
  assert.equal(isReadableName('Crrrst Holdings'), false)
  assert.equal(isReadableName('Crestway Partners'), true)

  const results = generateNames({
    industry: 'logistics',
    style: 'heritageIndustrial',
    entitySuffix: 'Trading',
    tone: 'conservative',
    length: 'standard',
    count: 20,
    seed: 'risk-11',
    useSeed: true
  })

  assert.equal(results.length, 20)
  assert.equal(results.some((candidate) => /scam|fraud|collapse|google|amazon/i.test(candidate.displayName)), false)
})
