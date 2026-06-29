import { describe, expect, it } from 'vitest'
import { POCKET_FILTERS, filterFavoritesByRealm, getFavoriteRealmLabel } from '../common/pocket.js'

const favorite = (id, realmId, shortLabel) => ({
  id,
  name: `Name ${id}`,
  realm: { id: realmId, shortLabel },
  metadata: 'Elegant · Holy · Neutral'
})

describe('pocket helpers', () => {
  it('provides stable realm filters for the pocket panel', () => {
    expect(POCKET_FILTERS).toEqual([
      { id: 'all', label: 'All' },
      { id: 'elf', label: 'Elf' },
      { id: 'dragon', label: 'Dragon' },
      { id: 'magic', label: 'Spell' }
    ])
  })

  it('filters favorites by realm while keeping all as the default', () => {
    const favorites = [
      favorite('1', 'elf', 'Elf'),
      favorite('2', 'dragon', 'Dragon'),
      favorite('3', 'magic', 'Magic')
    ]

    expect(filterFavoritesByRealm(favorites, 'all')).toHaveLength(3)
    expect(filterFavoritesByRealm(favorites, 'dragon')).toEqual([favorites[1]])
  })

  it('uses Spell as the display label for magic favorites', () => {
    expect(getFavoriteRealmLabel(favorite('3', 'magic', 'Magic'))).toBe('Spell')
  })
})
