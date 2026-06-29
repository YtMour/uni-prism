export const FAVORITES_KEY = 'mythosgen:favorites'
export const MAX_FAVORITES = 24

export function limitFavorites(favorites) {
  return normalizeFavorites(favorites).slice(0, MAX_FAVORITES)
}

export function toggleFavorite(favorites, result) {
  const normalized = normalizeFavorites(favorites)
  const exists = normalized.some((item) => item.id === result.id)
  return exists
    ? removeFavoriteById(normalized, result.id)
    : limitFavorites([result, ...normalized])
}

export function isFavorite(favorites, result) {
  return normalizeFavorites(favorites).some((item) => item.id === result.id)
}

export function removeFavoriteById(favorites, id) {
  return normalizeFavorites(favorites).filter((item) => item.id !== id)
}

function normalizeFavorites(favorites) {
  return Array.isArray(favorites)
    ? favorites.filter((item) => item && item.id && item.name)
    : []
}
