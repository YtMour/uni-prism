import { describe, expect, it } from 'vitest'
import { sampleGenerationQuality } from '../common/sampler.js'

describe('generation sampler', () => {
  it('reports quality metrics for every realm', () => {
    const report = sampleGenerationQuality({ perRealm: 12, seedStart: 100 })

    expect(report.total).toBe(36)
    expect(report.realms.map((realm) => realm.id)).toEqual(['elf', 'dragon', 'magic'])
    expect(report.duplicateRate).toBeGreaterThanOrEqual(0)
    expect(report.duplicateRate).toBeLessThanOrEqual(1)
    expect(report.realms[0]).toEqual(expect.objectContaining({
      id: 'elf',
      samples: 12,
      unique: expect.any(Number),
      duplicateRate: expect.any(Number),
      averageLength: expect.any(Number)
    }))
  })

  it('keeps the release sample duplicate rate below the public MVP gate', () => {
    const report = sampleGenerationQuality({ perRealm: 300, seedStart: 1000 })

    expect(report.duplicateRate).toBeLessThanOrEqual(0.35)
    expect(report.realms.every((realm) => realm.duplicateRate <= 0.45)).toBe(true)
  })
})
