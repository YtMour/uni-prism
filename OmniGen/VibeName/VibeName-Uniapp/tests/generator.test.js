import test from 'node:test'
import assert from 'node:assert/strict'

import {
  generateNames,
  scoreName,
  isReadableName
} from '../src/core/generator.js'

test('generates eight unique scored startup names for selected filters', () => {
  const result = generateNames({
    style: 'micro-saas',
    industry: 'ai',
    length: 'standard',
    count: 8,
    seed: 'vibename-mvp'
  })

  assert.equal(result.length, 8)
  assert.equal(new Set(result.map((item) => item.name.toLowerCase())).size, 8)

  for (const candidate of result) {
    assert.equal(candidate.style, 'micro-saas')
    assert.ok(candidate.industries.includes('ai'))
    assert.ok(candidate.name.length >= 4)
    assert.ok(candidate.name.length <= 16)
    assert.ok(candidate.score.total >= 60)
    assert.ok(candidate.reason.includes('AI'))
  }
})

test('reuses the same seed to produce stable results', () => {
  const options = {
    style: 'action-driven',
    industry: 'devtools',
    length: 'standard',
    count: 6,
    seed: 'stable-seed'
  }

  assert.deepEqual(
    generateNames(options).map((item) => item.name),
    generateNames(options).map((item) => item.name)
  )
})

test('style choices produce distinct naming structures and explanations', () => {
  const shared = {
    industry: 'devtools',
    length: 'standard',
    count: 8,
    seed: 'style-difference'
  }
  const saas = generateNames({ ...shared, style: 'micro-saas' })
  const abstract = generateNames({ ...shared, style: 'abstract' })
  const action = generateNames({ ...shared, style: 'action-driven' })

  assert.ok(saas.every((candidate) => candidate.structure === 'compound-saas'))
  assert.ok(abstract.every((candidate) => candidate.structure === 'coined-abstract'))
  assert.ok(action.every((candidate) => candidate.structure === 'verb-noun'))
  assert.ok(saas.some((candidate) => candidate.reason.includes('suffix')))
  assert.ok(abstract.some((candidate) => candidate.reason.includes('coined')))
  assert.ok(action.some((candidate) => candidate.reason.includes('action verb')))
  assert.notDeepEqual(
    saas.map((candidate) => candidate.name),
    abstract.map((candidate) => candidate.name)
  )
  assert.notDeepEqual(
    action.map((candidate) => candidate.name),
    saas.map((candidate) => candidate.name)
  )
})

test('length choices change the generated name shape instead of only filtering results', () => {
  const shared = {
    style: 'micro-saas',
    industry: 'fintech',
    count: 8,
    seed: 'length-difference'
  }
  const short = generateNames({ ...shared, length: 'short' })
  const standard = generateNames({ ...shared, length: 'standard' })
  const descriptive = generateNames({ ...shared, length: 'descriptive' })

  assert.ok(short.every((candidate) => candidate.name.length <= 10))
  assert.ok(short.every((candidate) => candidate.sourceParts.length <= 2))
  assert.ok(standard.some((candidate) => candidate.name.length > 10 || candidate.sourceParts.length === 2))
  assert.ok(descriptive.every((candidate) => candidate.sourceParts.length >= 3))
  assert.ok(descriptive.some((candidate) => candidate.reason.includes('descriptive')))
  assert.ok(
    descriptive.reduce((sum, candidate) => sum + candidate.name.length, 0) >
      short.reduce((sum, candidate) => sum + candidate.name.length, 0)
  )
})

test('multi-part names keep readable word boundaries and grammar in explanations', () => {
  const action = generateNames({
    style: 'action-driven',
    industry: 'ai',
    length: 'descriptive',
    count: 8,
    seed: 'readable-action'
  })

  assert.ok(action.some((candidate) => /[a-z][A-Z]/.test(candidate.name)))
  assert.ok(action.every((candidate) => !candidate.reason.includes('a AI')))
  assert.ok(action.every((candidate) => candidate.reason.includes('descriptive')))
})

test('candidate explanations cite the actual source parts and formula', () => {
  const [candidate] = generateNames({
    style: 'action-driven',
    industry: 'ai',
    length: 'descriptive',
    count: 1,
    seed: 'explain-real-parts'
  })

  const sourceValues = candidate.sourceParts.map((part) => part.value)

  assert.equal(candidate.formula, 'action + industry + benefit')
  assert.ok(sourceValues.some((value) => candidate.reason.includes(value)))
  assert.ok(candidate.reason.includes('benefit'))
})

test('candidate explanations use correct grammar for AI roots', () => {
  const candidates = generateNames({
    style: 'micro-saas',
    industry: 'ai',
    length: 'standard',
    count: 8,
    seed: 'ai-article-grammar'
  })

  assert.ok(candidates.every((candidate) => !candidate.reason.includes('a AI')))
  assert.ok(candidates.every((candidate) => candidate.reason.includes('an AI')))
})

test('short AI SaaS explanations do not duplicate articles', () => {
  const candidates = generateNames({
    style: 'micro-saas',
    industry: 'ai',
    length: 'short',
    count: 8,
    seed: 'short-ai-article-grammar'
  })

  assert.ok(candidates.every((candidate) => !candidate.reason.includes('a clear an')))
  assert.ok(candidates.every((candidate) => candidate.reason.includes('a clear AI root')))
})

test('abstract names avoid single-letter syllable fragments', () => {
  const lengths = ['short', 'standard', 'descriptive']
  const industries = ['ai', 'devtools', 'fintech', 'creator']
  for (let sample = 0; sample < 8; sample += 1) {
    for (const industry of industries) {
      for (const length of lengths) {
        const candidates = generateNames({
          style: 'abstract',
          industry,
          length,
          count: 8,
          seed: `abstract-readable-${sample}-${industry}-${length}`
        })

        for (const candidate of candidates) {
          assert.ok(candidate.sourceParts.every((part) => part.value.length > 1))
        }
      }
    }
  }
})

test('generator keeps cross-seed duplicate rate under the public H5 target', () => {
  const styles = ['micro-saas', 'abstract', 'action-driven']
  const industries = ['ai', 'devtools', 'fintech', 'creator']
  const lengths = ['short', 'standard', 'descriptive']
  const seen = new Set()
  let total = 0
  let duplicates = 0

  for (let sample = 0; sample < 40; sample += 1) {
    for (const style of styles) {
      for (const industry of industries) {
        for (const length of lengths) {
          const batch = generateNames({
            style,
            industry,
            length,
            count: 8,
            seed: `public-dup-rate-${sample}-${style}-${industry}-${length}`
          })
          for (const candidate of batch) {
            total += 1
            const key = candidate.name.toLowerCase()
            if (seen.has(key)) duplicates += 1
            seen.add(key)
          }
        }
      }
    }
  }

  assert.ok(duplicates / total <= 0.08)
})

test('generator keeps cross-seed duplicate rate under the MVP preview threshold', () => {
  const styles = ['micro-saas', 'abstract', 'action-driven']
  const industries = ['ai', 'devtools', 'fintech', 'creator']
  const lengths = ['short', 'standard', 'descriptive']
  const seen = new Set()
  let total = 0
  let duplicates = 0

  for (let sample = 0; sample < 10; sample += 1) {
    for (const style of styles) {
      for (const industry of industries) {
        for (const length of lengths) {
          const batch = generateNames({
            style,
            industry,
            length,
            count: 8,
            seed: `dup-rate-${sample}-${style}-${industry}-${length}`
          })
          for (const candidate of batch) {
            total += 1
            const key = candidate.name.toLowerCase()
            if (seen.has(key)) duplicates += 1
            seen.add(key)
          }
        }
      }
    }
  }

  assert.ok(duplicates / total <= 0.15)
})

test('scores short readable names higher than difficult long names', () => {
  const good = scoreName('Flowbase', {
    style: 'micro-saas',
    industry: 'productivity',
    parts: ['Flow', 'base']
  })
  const bad = scoreName('Qrrxxzzstackcloud', {
    style: 'micro-saas',
    industry: 'productivity',
    parts: ['Qrrxxzz', 'stackcloud']
  })

  assert.ok(good.total > bad.total)
  assert.ok(isReadableName('Flowbase'))
  assert.equal(isReadableName('Qrrxxzzstackcloud'), false)
})
