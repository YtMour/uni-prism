const ABILITY_KEYS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

const races = [
  {
    id: 'human',
    name: 'Human',
    nameZh: '人类',
    abilityBonuses: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
    names: [['Arlen', 'Mira', 'Garrick', 'Elena'], ['Voss', 'Reed', 'Morn', 'Ashford']]
  },
  {
    id: 'elf',
    name: 'Elf',
    nameZh: '精灵',
    abilityBonuses: { DEX: 2, INT: 1 },
    names: [['Lyra', 'Aelar', 'Thia', 'Vaelis'], ['Starweave', 'Moonbrook', 'Silversong']]
  },
  {
    id: 'dwarf',
    name: 'Dwarf',
    nameZh: '矮人',
    abilityBonuses: { CON: 2, STR: 1 },
    names: [['Borin', 'Dagna', 'Korin', 'Hilda'], ['Deepgale', 'Ironroot', 'Stonehelm']]
  },
  {
    id: 'halfling',
    name: 'Halfling',
    nameZh: '半身人',
    abilityBonuses: { DEX: 2, CHA: 1 },
    names: [['Thalia', 'Perrin', 'Milo', 'Nissa'], ['Reed', 'Underbough', 'Quickstep']]
  },
  {
    id: 'tiefling',
    name: 'Tiefling',
    nameZh: '提夫林',
    abilityBonuses: { CHA: 2, INT: 1 },
    names: [['Nyx', 'Kael', 'Vesper', 'Ira'], ['Emberveil', 'Duskwrit', 'Sable']]
  },
  {
    id: 'dragonborn',
    name: 'Dragonborn',
    nameZh: '龙裔',
    abilityBonuses: { STR: 2, CHA: 1 },
    names: [['Rhogar', 'Akra', 'Daar', 'Sora'], ['Flamecrest', 'Bronzescale', 'Vermillion']]
  }
];

const classes = [
  {
    id: 'fighter',
    name: 'Fighter',
    nameZh: '战士',
    primaryAbilities: ['STR', 'CON', 'DEX'],
    proficiencies: ['Athletics', 'Intimidation', 'Survival'],
    gear: ['Longsword', 'Chain mail', "Explorer's pack", 'Shield'],
    flavor: 'disciplined veteran'
  },
  {
    id: 'rogue',
    name: 'Rogue',
    nameZh: '游荡者',
    primaryAbilities: ['DEX', 'CHA', 'INT'],
    proficiencies: ['Stealth', 'Acrobatics', 'Sleight of Hand'],
    gear: ['Rapier', 'Leather armor', "Burglar's pack", "Thieves' tools"],
    flavor: 'watchful survivor'
  },
  {
    id: 'wizard',
    name: 'Wizard',
    nameZh: '法师',
    primaryAbilities: ['INT', 'DEX', 'CON'],
    proficiencies: ['Arcana', 'Investigation', 'History'],
    gear: ['Quarterstaff', 'Spellbook', "Scholar's pack", 'Arcane focus'],
    flavor: 'restless scholar'
  },
  {
    id: 'cleric',
    name: 'Cleric',
    nameZh: '牧师',
    primaryAbilities: ['WIS', 'CON', 'STR'],
    proficiencies: ['Medicine', 'Religion', 'Insight'],
    gear: ['Mace', 'Scale mail', "Priest's pack", 'Holy symbol'],
    flavor: 'devoted wanderer'
  },
  {
    id: 'bard',
    name: 'Bard',
    nameZh: '吟游诗人',
    primaryAbilities: ['CHA', 'DEX', 'INT'],
    proficiencies: ['Performance', 'Persuasion', 'History'],
    gear: ['Rapier', 'Lute', "Diplomat's pack", 'Leather armor'],
    flavor: 'silver-tongued traveler'
  },
  {
    id: 'ranger',
    name: 'Ranger',
    nameZh: '游侠',
    primaryAbilities: ['DEX', 'WIS', 'CON'],
    proficiencies: ['Nature', 'Survival', 'Perception'],
    gear: ['Longbow', 'Shortswords', "Explorer's pack", 'Leather armor'],
    flavor: 'borderland scout'
  }
];

const backgrounds = [
  {
    id: 'soldier',
    name: 'Soldier',
    nameZh: '士兵',
    proficiencies: ['Athletics', 'Intimidation'],
    gear: ['Insignia of rank', 'Dice set'],
    origin: 'a hard garrison on the borderlands',
    desire: 'protecting people who cannot protect themselves',
    conflict: 'the commander who abandoned the last campaign',
    secret: 'an old battlefield oath is starting to demand payment'
  },
  {
    id: 'sage',
    name: 'Sage',
    nameZh: '学者',
    proficiencies: ['Arcana', 'History'],
    gear: ['Ink bottle', 'Small knife'],
    origin: 'a candlelit archive beneath an old university',
    desire: 'recovering a lost page from a forbidden chronicle',
    conflict: 'a rival scholar with better funding and fewer scruples',
    secret: 'the missing page describes their own birth'
  },
  {
    id: 'urchin',
    name: 'Urchin',
    nameZh: '流浪儿',
    proficiencies: ['Sleight of Hand', 'Stealth'],
    gear: ['City map', 'Pet mouse token'],
    origin: 'the alleys around a rain-soaked market district',
    desire: 'buying freedom for the only family they trust',
    conflict: 'a guild boss who never forgets a debt',
    secret: 'a stolen trinket whispers in dreams'
  },
  {
    id: 'acolyte',
    name: 'Acolyte',
    nameZh: '侍僧',
    proficiencies: ['Insight', 'Religion'],
    gear: ['Prayer book', 'Incense'],
    origin: 'a quiet shrine built over older ruins',
    desire: 'proving their faith beyond temple walls',
    conflict: 'a heresy hidden inside the order',
    secret: 'their last vision came from something below the shrine'
  },
  {
    id: 'noble',
    name: 'Noble',
    nameZh: '贵族',
    proficiencies: ['History', 'Persuasion'],
    gear: ['Signet ring', 'Fine clothes'],
    origin: 'a manor where every smile concealed a contract',
    desire: 'restoring a disgraced family name',
    conflict: 'a cousin who inherited the title through fraud',
    secret: 'the family crest marks a pact with an ancient power'
  }
];

const alignments = [
  'Lawful Good',
  'Neutral Good',
  'Chaotic Good',
  'Lawful Neutral',
  'True Neutral',
  'Chaotic Neutral',
  'Lawful Evil',
  'Neutral Evil',
  'Chaotic Evil'
];

export function modifierForScore(score) {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

export function createSeed() {
  return `df-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export function generateCharacter(seed = createSeed(), options = {}) {
  const rng = createRng(seed);
  const race = pick(races, rng);
  const characterClass = pick(classes, rng);
  const background = pick(backgrounds, rng);
  const alignment = options.alignment || pick(alignments, rng);
  const name = generateName(race, rng);
  const abilities = generateAbilities(rng, race, characterClass);
  const proficiencies = dedupeItems([
    ...characterClass.proficiencies.map((name) => ({ type: 'skill', name, source: 'class' })),
    ...background.proficiencies.map((name) => ({ type: 'skill', name, source: 'background' }))
  ], (item) => `${item.type}:${item.name}`);
  const gear = dedupeItems([
    ...characterClass.gear.map((name) => ({ category: inferGearCategory(name), name, source: 'class' })),
    ...background.gear.map((name) => ({ category: inferGearCategory(name), name, source: 'background' }))
  ], (item) => `${item.category}:${item.name}`);
  const backstory = generateBackstory(name.full, characterClass, background, alignment);

  const character = {
    id: `${seed}-${race.id}-${characterClass.id}-${background.id}`,
    seed,
    name,
    race: pickFields(race, ['id', 'name', 'nameZh']),
    class: pickFields(characterClass, ['id', 'name', 'nameZh', 'primaryAbilities']),
    background: pickFields(background, ['id', 'name', 'nameZh']),
    alignment,
    abilities,
    proficiencies,
    gear,
    backstory,
    createdAt: new Date(0).toISOString()
  };

  return {
    ...character,
    exportText: buildExportText(character)
  };
}

function generateAbilities(rng, race, characterClass) {
  const rolled = ABILITY_KEYS.map((key) => ({ key, ...rollAbility(rng) }));
  const sortedRolls = [...rolled].sort((a, b) => b.base - a.base);
  const priority = [
    ...characterClass.primaryAbilities,
    ...ABILITY_KEYS.filter((key) => !characterClass.primaryAbilities.includes(key))
  ];
  const assigned = {};

  priority.forEach((key, index) => {
    const roll = sortedRolls[index];
    const bonus = race.abilityBonuses[key] || 0;
    const total = roll.base + bonus;
    assigned[key] = {
      key,
      rolls: roll.rolls,
      dropped: roll.dropped,
      base: roll.base,
      bonus,
      total,
      modifier: modifierForScore(total)
    };
  });

  return assigned;
}

function rollAbility(rng) {
  const rolls = Array.from({ length: 4 }, () => 1 + Math.floor(rng() * 6));
  const dropped = Math.min(...rolls);
  const base = rolls.reduce((sum, roll) => sum + roll, 0) - dropped;
  return { rolls, dropped, base };
}

function generateName(race, rng) {
  const given = pick(race.names[0], rng);
  const family = pick(race.names[1], rng);
  return {
    full: `${given} ${family}`,
    given,
    family
  };
}

function generateBackstory(name, characterClass, background, alignment) {
  const first = `${name} grew up around ${background.origin}, becoming known as a ${characterClass.flavor}.`;
  const second = `Now they travel in pursuit of ${background.desire}, guided by a ${alignment.toLowerCase()} sense of purpose.`;
  const third = `They are still hunted by ${background.conflict}, and ${background.secret}.`;
  return {
    sentences: [first, second, third],
    tags: [characterClass.id, background.id, alignment],
    components: {
      origin: background.origin,
      desire: background.desire,
      conflict: background.conflict,
      secret: background.secret
    }
  };
}

function buildExportText(character) {
  const abilities = ABILITY_KEYS.map((key) => {
    const ability = character.abilities[key];
    return `${key}: ${ability.total} (${formatModifier(ability.modifier)})`;
  }).join('\n');
  const proficiencies = character.proficiencies.map((item) => `- ${item.name}`).join('\n');
  const gear = character.gear.map((item) => `- ${item.name}`).join('\n');
  const backstory = character.backstory.sentences.join(' ');

  return [
    'DiceForge Character',
    '===================',
    '',
    `Name: ${character.name.full}`,
    `Race/Class: ${character.race.name} ${character.class.name}`,
    `Background: ${character.background.name}`,
    `Alignment: ${character.alignment}`,
    '',
    'Abilities',
    '---------',
    abilities,
    '',
    'Proficiencies',
    '-------------',
    proficiencies,
    '',
    'Gear',
    '----',
    gear,
    '',
    'Backstory',
    '---------',
    backstory,
    '',
    `Seed: ${character.seed}`
  ].join('\n');
}

function createRng(seed) {
  let state = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    state ^= seed.charCodeAt(index);
    state = Math.imul(state, 16777619);
  }
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

function dedupeItems(items, keyOf) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyOf(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferGearCategory(name) {
  const lower = name.toLowerCase();
  if (lower.includes('armor') || lower.includes('mail')) return 'armor';
  if (lower.includes('sword') || lower.includes('mace') || lower.includes('bow') || lower.includes('staff')) return 'weapon';
  if (lower.includes('pack')) return 'pack';
  if (lower.includes('focus') || lower.includes('symbol')) return 'focus';
  if (lower.includes('tools') || lower.includes('set')) return 'tool';
  return 'misc';
}

function pickFields(source, keys) {
  return keys.reduce((result, key) => {
    result[key] = source[key];
    return result;
  }, {});
}
