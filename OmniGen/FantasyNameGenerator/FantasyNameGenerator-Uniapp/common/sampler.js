import { DEFAULT_FILTERS, FILTER_GROUPS, generateName, listRealms } from './generator.js'

export function sampleGenerationQuality({ perRealm = 100, seedStart = 1 } = {}) {
  const realms = listRealms().map((realm, realmIndex) => {
    const names = Array.from({ length: perRealm }, (_, index) => {
      const filters = buildSampleFilters(index)
      return generateName({
        realmId: realm.id,
        filters,
        seed: seedStart + realmIndex * perRealm + index
      }).name
    })
    return buildRealmReport(realm.id, names)
  })

  const allNames = realms.flatMap((realm) => realm.names)
  const total = allNames.length
  const unique = new Set(allNames).size

  return {
    generatedAt: new Date().toISOString(),
    perRealm,
    total,
    unique,
    duplicateRate: roundRate(1 - unique / Math.max(1, total)),
    realms: realms.map(({ names, ...realm }) => realm)
  }
}

function buildSampleFilters(index) {
  return {
    gender: pickFilter('gender', index),
    alignment: pickFilter('alignment', Math.floor(index / FILTER_GROUPS.gender.length)),
    tone: pickFilter('tone', Math.floor(index / (FILTER_GROUPS.gender.length * FILTER_GROUPS.alignment.length)))
  }
}

function pickFilter(key, index) {
  const options = FILTER_GROUPS[key] || [DEFAULT_FILTERS[key]]
  return options[index % options.length]
}

function buildRealmReport(id, names) {
  const unique = new Set(names).size
  const averageLength = names.reduce((sum, name) => sum + name.length, 0) / Math.max(1, names.length)
  return {
    id,
    samples: names.length,
    unique,
    duplicateRate: roundRate(1 - unique / Math.max(1, names.length)),
    averageLength: Number(averageLength.toFixed(2)),
    shortest: names.reduce((shortest, name) => name.length < shortest.length ? name : shortest, names[0] || ''),
    longest: names.reduce((longest, name) => name.length > longest.length ? name : longest, names[0] || ''),
    names
  }
}

function roundRate(value) {
  return Number(value.toFixed(4))
}
