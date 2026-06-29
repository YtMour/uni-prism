import { describe, expect, it } from 'vitest'
import { TOP_ACTIONS } from '../common/topActions.js'

describe('top action semantics', () => {
  it('uses distinct icons for pocket and declaration actions', () => {
    expect(TOP_ACTIONS).toEqual({
      pocket: expect.objectContaining({
        icon: '▤',
        label: 'Pocket',
        role: 'open saved names'
      }),
      statement: expect.objectContaining({
        icon: 'i',
        label: 'Declaration',
        role: 'open settings and policy'
      })
    })
  })

  it('does not reuse the favorite star icon for the pocket entry', () => {
    expect(TOP_ACTIONS.pocket.icon).not.toBe('☆')
  })
})
