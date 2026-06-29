import { describe, expect, it } from 'vitest'
import {
  FAVORITES_KEY,
  limitFavorites,
  removeFavoriteById,
  toggleFavorite
} from '../common/favorites.js'

const sample = (id) => ({
  id,
  name: `Name ${id}`,
  realm: { id: 'elf', label: 'Elf Names', shortLabel: 'Elf' },
  metadata: 'Elegant · Holy · Neutral'
})

describe('favorite helpers', () => {
  it('uses a stable storage key for local favorites', () => {
    expect(FAVORITES_KEY).toBe('mythosgen:favorites')
  })

  it('toggles a generated result without duplicating it', () => {
    const result = sample('elf-1')
    const added = toggleFavorite([], result)

    expect(added).toHaveLength(1)
    expect(toggleFavorite(added, result)).toHaveLength(0)
  })

  it('removes favorites by id', () => {
    const favorites = [sample('elf-1'), sample('dragon-2')]

    expect(removeFavoriteById(favorites, 'elf-1')).toEqual([sample('dragon-2')])
  })

  it('limits favorites to the newest 24 items', () => {
    const favorites = Array.from({ length: 30 }, (_, index) => sample(`id-${index}`))

    expect(limitFavorites(favorites)).toHaveLength(24)
    expect(limitFavorites(favorites)[0].id).toBe('id-0')
  })
})
