import { describe, expect, it } from 'vitest'
import { buildRealmStatus } from '../common/realmStatus.js'

describe('realm status helper', () => {
  it('formats a compact non-interactive realm status for the top bar', () => {
    const status = buildRealmStatus({
      id: 'magic',
      shortLabel: 'Magic',
      description: 'ritual words from old codices'
    })

    expect(status).toEqual({
      glyph: '✧',
      label: 'Spell',
      caption: 'Active realm'
    })
  })

  it('falls back to a neutral glyph for unknown realm ids', () => {
    expect(buildRealmStatus({ id: 'unknown', shortLabel: 'Custom' }).glyph).toBe('✧')
  })
})
