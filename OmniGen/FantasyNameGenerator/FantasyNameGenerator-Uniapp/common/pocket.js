export const POCKET_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'elf', label: 'Elf' },
  { id: 'dragon', label: 'Dragon' },
  { id: 'magic', label: 'Spell' }
]

export function getFavoriteRealmLabel(favorite) {
  return favorite.realm?.shortLabel === 'Magic' ? 'Spell' : favorite.realm?.shortLabel || 'Realm'
}

export function filterFavoritesByRealm(favorites, realmId = 'all') {
  if (realmId === 'all') {
    return favorites
  }
  return favorites.filter((favorite) => favorite.realm?.id === realmId)
}
