import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FILTERS,
  generateName,
  getRealmById
} from '../common/generator.js'

describe('mythos generator', () => {
  it('generates readable results with realm metadata and seed', () => {
    const result = generateName({
      realmId: 'elf',
      filters: DEFAULT_FILTERS,
      seed: 1207
    })

    expect(result.realm.id).toBe('elf')
    expect(result.name.length).toBeGreaterThanOrEqual(5)
    expect(result.name.length).toBeLessThanOrEqual(16)
    expect(result.seed).toBe(1207)
    expect(result.metadata).toContain('Elegant')
  })

  it('uses a two word structure for magic names', () => {
    const result = generateName({
      realmId: 'magic',
      filters: { gender: 'Neutral', alignment: 'Shadow', tone: 'Ancient' },
      seed: 4419
    })

    expect(result.name.split(' ')).toHaveLength(2)
    expect(result.name.length).toBeLessThanOrEqual(24)
    expect(result.metadata).toContain('Shadow')
  })

  it('falls back to elf realm when an unknown realm is requested', () => {
    expect(getRealmById('unknown').id).toBe('elf')
  })
})
