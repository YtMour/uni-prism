export const DEFAULT_FILTERS = {
  gender: 'Neutral',
  alignment: 'Holy',
  tone: 'Elegant'
}

export const FILTER_GROUPS = {
  gender: ['Masculine', 'Feminine', 'Neutral'],
  alignment: ['Holy', 'Shadow', 'Primal'],
  tone: ['Elegant', 'Harsh', 'Ancient']
}

const realms = [
  {
    id: 'elf',
    label: 'Elf Names',
    shortLabel: 'Elf',
    emblem: '/static/mythos/elven-leaf-crest.png',
    description: 'luminous woodland lineage',
    prefixes: [
      { text: 'Ae', tags: ['Feminine', 'Holy', 'Elegant'], weight: 3 },
      { text: 'Ere', tags: ['Neutral', 'Ancient', 'Elegant'], weight: 2 },
      { text: 'Cael', tags: ['Masculine', 'Holy', 'Ancient'], weight: 3 },
      { text: 'Lia', tags: ['Feminine', 'Primal', 'Elegant'], weight: 2 },
      { text: 'Thae', tags: ['Neutral', 'Holy', 'Ancient'], weight: 2 }
    ],
    cores: [
      { text: 'lia', tags: ['Feminine', 'Elegant'], weight: 3 },
      { text: 'thil', tags: ['Neutral', 'Ancient'], weight: 2 },
      { text: 'rion', tags: ['Masculine', 'Holy'], weight: 2 },
      { text: 'syl', tags: ['Primal', 'Elegant'], weight: 2 },
      { text: 'ael', tags: ['Holy', 'Ancient'], weight: 2 }
    ],
    suffixes: [
      { text: 'wind', tags: ['Primal', 'Elegant'], weight: 1 },
      { text: 'gorn', tags: ['Masculine', 'Ancient'], weight: 1 },
      { text: 'riel', tags: ['Feminine', 'Holy', 'Elegant'], weight: 3 },
      { text: 'thas', tags: ['Neutral', 'Ancient'], weight: 2 },
      { text: 'nor', tags: ['Masculine', 'Primal'], weight: 2 }
    ]
  },
  {
    id: 'dragon',
    label: 'Dragon Names',
    shortLabel: 'Dragon',
    emblem: '/static/mythos/compass-star.png',
    description: 'ancient fire and stone',
    prefixes: [
      { text: 'Ig', tags: ['Primal', 'Harsh'], weight: 2 },
      { text: 'Thor', tags: ['Masculine', 'Ancient'], weight: 3 },
      { text: 'Vol', tags: ['Shadow', 'Harsh'], weight: 2 },
      { text: 'Krag', tags: ['Primal', 'Harsh'], weight: 2 },
      { text: 'Draz', tags: ['Shadow', 'Ancient'], weight: 2 }
    ],
    cores: [
      { text: 'rax', tags: ['Harsh', 'Masculine'], weight: 3 },
      { text: 'vath', tags: ['Ancient', 'Shadow'], weight: 2 },
      { text: 'gor', tags: ['Primal', 'Harsh'], weight: 2 },
      { text: 'zhar', tags: ['Shadow', 'Harsh'], weight: 2 },
      { text: 'mord', tags: ['Ancient', 'Shadow'], weight: 1 }
    ],
    suffixes: [
      { text: 'os', tags: ['Masculine', 'Ancient'], weight: 2 },
      { text: 'or', tags: ['Primal', 'Harsh'], weight: 3 },
      { text: 'ath', tags: ['Shadow', 'Ancient'], weight: 2 },
      { text: 'ion', tags: ['Holy', 'Ancient'], weight: 1 },
      { text: 'urn', tags: ['Primal', 'Harsh'], weight: 2 }
    ]
  },
  {
    id: 'magic',
    label: 'Magic & Spells',
    shortLabel: 'Magic',
    emblem: '/static/mythos/open-book.png',
    description: 'ritual words from old codices',
    firstWords: [
      { text: 'Vortex', tags: ['Primal', 'Harsh'], weight: 2 },
      { text: 'Crux', tags: ['Holy', 'Ancient'], weight: 2 },
      { text: 'Astra', tags: ['Holy', 'Elegant'], weight: 3 },
      { text: 'Noctis', tags: ['Shadow', 'Ancient'], weight: 3 },
      { text: 'Sylva', tags: ['Primal', 'Elegant'], weight: 2 },
      { text: 'Eldritch', tags: ['Shadow', 'Harsh'], weight: 2 },
      { text: 'Seraph', tags: ['Holy', 'Elegant'], weight: 2 },
      { text: 'Runic', tags: ['Ancient', 'Neutral'], weight: 2 },
      { text: 'Ember', tags: ['Primal', 'Harsh'], weight: 2 },
      { text: 'Lunar', tags: ['Shadow', 'Elegant'], weight: 2 }
    ],
    secondWords: [
      { text: 'Lumina', tags: ['Holy', 'Elegant'], weight: 3 },
      { text: 'Mystica', tags: ['Ancient', 'Neutral'], weight: 2 },
      { text: 'Umbra', tags: ['Shadow', 'Ancient'], weight: 3 },
      { text: 'Aether', tags: ['Holy', 'Ancient'], weight: 2 },
      { text: 'Thorn', tags: ['Primal', 'Harsh'], weight: 2 },
      { text: 'Sigil', tags: ['Ancient', 'Neutral'], weight: 2 },
      { text: 'Crown', tags: ['Holy', 'Elegant'], weight: 2 },
      { text: 'Ash', tags: ['Shadow', 'Harsh'], weight: 2 },
      { text: 'Bloom', tags: ['Primal', 'Elegant'], weight: 2 },
      { text: 'Veil', tags: ['Shadow', 'Elegant'], weight: 2 }
    ]
  }
]

hydrateRealmLexicon(realms)

export function listRealms() {
  return realms.map((realm) => ({
    id: realm.id,
    label: realm.label,
    shortLabel: realm.shortLabel,
    emblem: realm.emblem,
    description: realm.description
  }))
}

export function getRealmById(realmId) {
  return realms.find((realm) => realm.id === realmId) || realms[0]
}

export function generateSeed() {
  return Math.floor(Date.now() % 1000000)
}

export function generateName({ realmId = 'elf', filters = DEFAULT_FILTERS, seed = generateSeed() } = {}) {
  const realm = getRealmById(realmId)
  const normalizedFilters = { ...DEFAULT_FILTERS, ...filters }
  const random = createSeededRandom(seed)
  const name = realm.id === 'magic'
    ? buildMagicName(realm, normalizedFilters, random)
    : buildRealmName(realm, normalizedFilters, random)

  return {
    id: `${realm.id}-${seed}`,
    name,
    realm: {
      id: realm.id,
      label: realm.label,
      shortLabel: realm.shortLabel
    },
    filters: normalizedFilters,
    seed,
    metadata: `${normalizedFilters.tone} · ${normalizedFilters.alignment} · ${normalizedFilters.gender}`,
    createdAt: new Date().toISOString()
  }
}

function buildRealmName(realm, filters, random) {
  const prefix = pickWeighted(realm.prefixes, filters, random)
  const core = pickWeighted(realm.cores, filters, random)
  const suffix = pickWeighted(realm.suffixes, filters, random)
  return cleanName(`${prefix.text}${core.text}${suffix.text}`, 16)
}

function buildMagicName(realm, filters, random) {
  const first = pickWeighted(realm.firstWords, filters, random)
  const second = pickWeighted(realm.secondWords, filters, random)
  return `${first.text} ${second.text}`.slice(0, 24).trim()
}

function pickWeighted(items, filters, random) {
  const weighted = items.map((item) => {
    const bonus = Object.values(filters).reduce((score, filter) => {
      return score + (item.tags.includes(filter) ? 2 : 0)
    }, 0)
    return { item, score: item.weight + bonus }
  })
  const total = weighted.reduce((sum, entry) => sum + entry.score, 0)
  let cursor = random() * total
  for (const entry of weighted) {
    cursor -= entry.score
    if (cursor <= 0) return entry.item
  }
  return weighted[0].item
}

function cleanName(value, maxLength) {
  const collapsed = value
    .replace(/([a-z])\1{2,}/gi, '$1$1')
    .replace(/aeae/gi, 'ae')
    .replace(/thth/gi, 'th')
  return collapsed.charAt(0).toUpperCase() + collapsed.slice(1, maxLength)
}

function createSeededRandom(seed) {
  let state = hashSeed(seed)
  return () => {
    state = (state + 0x6D2B79F5) | 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(seed) {
  const text = String(seed ?? 1)
  let hash = 2166136261
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash | 0
}

function hydrateRealmLexicon(targetRealms) {
  const elf = targetRealms.find((realm) => realm.id === 'elf')
  const dragon = targetRealms.find((realm) => realm.id === 'dragon')
  const magic = targetRealms.find((realm) => realm.id === 'magic')

  addTokens(elf.prefixes, [
    'Ari', 'Elar', 'Fae', 'Nim', 'Olor', 'Sae', 'Vael', 'Yll',
    'Ith', 'Lorien', 'Mira', 'Quel', 'Ryn', 'Shae', 'Tir', 'Wyn'
  ], [['Feminine', 'Elegant'], ['Holy', 'Ancient'], ['Primal', 'Neutral']])
  addTokens(elf.cores, [
    'wen', 'loth', 'mir', 'sari', 'vyr', 'neth', 'elor', 'quess',
    'dhel', 'fira', 'lain', 'orith', 'syl', 'ther', 'vaen', 'yra'
  ], [['Elegant', 'Holy'], ['Ancient', 'Neutral'], ['Primal', 'Feminine']])
  addTokens(elf.suffixes, [
    'wyn', 'dell', 'ion', 'ara', 'eth', 'lith', 'mere', 'sian',
    'vara', 'wynne', 'ael', 'isar', 'len', 'rith', 'sor', 'viel'
  ], [['Feminine', 'Holy'], ['Masculine', 'Ancient'], ['Primal', 'Elegant']])

  addTokens(dragon.prefixes, [
    'Az', 'Bal', 'Gor', 'Kaz', 'Mord', 'Rhaz', 'Skor', 'Tyr',
    'Vyr', 'Xal', 'Zor', 'Brak', 'Grav', 'Khar', 'Nox', 'Vor'
  ], [['Masculine', 'Harsh'], ['Shadow', 'Ancient'], ['Primal', 'Neutral']])
  addTokens(dragon.cores, [
    'drak', 'garn', 'khaz', 'mol', 'rath', 'skel', 'thurn', 'vok',
    'zurn', 'brim', 'korr', 'mag', 'rax', 'syr', 'torg', 'vhal'
  ], [['Harsh', 'Primal'], ['Ancient', 'Masculine'], ['Shadow', 'Neutral']])
  addTokens(dragon.suffixes, [
    'gash', 'kar', 'morn', 'nar', 'rul', 'skar', 'thar', 'vorn',
    'zhar', 'ak', 'dun', 'gor', 'kesh', 'mir', 'oth', 'vrax'
  ], [['Masculine', 'Ancient'], ['Primal', 'Harsh'], ['Shadow', 'Neutral']])

  addTokens(magic.firstWords, [
    'Arcana', 'Aurum', 'Celest', 'Cipher', 'Duskwind', 'Ebon', 'Glyph',
    'Helix', 'Iris', 'Obsidian', 'Oracle', 'Pyre', 'Quill', 'Rift',
    'Solaris', 'Tempest', 'Umbral', 'Verdant', 'Warden', 'Zephyr'
  ], [['Holy', 'Elegant'], ['Shadow', 'Ancient'], ['Primal', 'Harsh']])
  addTokens(magic.secondWords, [
    'Arcanum', 'Bellum', 'Chorus', 'Drift', 'Eclipse', 'Flare', 'Grimoire',
    'Halo', 'Invocation', 'Labyrinth', 'Mantle', 'Nexus', 'Omen', 'Pulse',
    'Reliquary', 'Sanctum', 'Tempora', 'Vesper', 'Ward', 'Zenith'
  ], [['Ancient', 'Neutral'], ['Holy', 'Elegant'], ['Shadow', 'Harsh'], ['Primal', 'Neutral']])
}

function addTokens(target, texts, tagSets) {
  const known = new Set(target.map((item) => item.text.toLowerCase()))
  for (const [index, text] of texts.entries()) {
    if (known.has(text.toLowerCase())) continue
    target.push({
      text,
      tags: tagSets[index % tagSets.length],
      weight: index % 5 === 0 ? 2 : 1
    })
  }
}
