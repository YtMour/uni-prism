const glyphs = {
  elf: '♧',
  dragon: '♞',
  magic: '✧'
}

export function getRealmDisplayLabel(realm) {
  return realm.shortLabel === 'Magic' ? 'Spell' : realm.shortLabel
}

export function buildRealmStatus(realm) {
  return {
    glyph: glyphs[realm.id] || '✧',
    label: getRealmDisplayLabel(realm),
    caption: 'Active realm'
  }
}
