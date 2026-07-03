export const INDUSTRIES = [
  {
    id: 'finance',
    label: 'Finance & Capital',
    tag: 'Capital-ready',
    proposalTag: 'FINANCE & CAPITAL',
    description: 'Capital, investment, advisory and asset-platform naming.'
  },
  {
    id: 'consulting',
    label: 'Consulting & Service',
    tag: 'Professional Services',
    proposalTag: 'CONSULTING & SERVICE',
    description: 'Advisory, strategy, service and operating partner naming.'
  },
  {
    id: 'realEstate',
    label: 'Real Estate & Construction',
    tag: 'Built Environment',
    proposalTag: 'REAL ESTATE & CONSTRUCTION',
    description: 'Development, property, civic and construction naming.'
  },
  {
    id: 'logistics',
    label: 'Logistics & Trade',
    tag: 'Trading / Logistics',
    proposalTag: 'LOGISTICS & TRADE',
    description: 'Cross-border trade, transport, distribution and route naming.'
  }
]

export const STYLES = [
  {
    id: 'globalVenture',
    label: 'Global Venture',
    fullLabel: 'Global Venture & Capital',
    description: 'Precise, capital-aware and internationally credible.'
  },
  {
    id: 'heritageIndustrial',
    label: 'Heritage Industrial',
    fullLabel: 'Heritage Industrial',
    description: 'Grounded, durable and asset-backed.'
  },
  {
    id: 'neoEnterprise',
    label: 'Neo-Enterprise',
    fullLabel: 'Neo-Enterprise Blend',
    description: 'Modern enterprise tone without consumer-app playfulness.'
  }
]

export const TONES = [
  { id: 'conservative', label: 'Conservative', description: 'Quiet, established and low-risk.' },
  { id: 'boardroom', label: 'Boardroom', description: 'Formal enough for investor and board materials.' },
  { id: 'modern', label: 'Modern', description: 'Clean and contemporary while staying corporate.' },
  { id: 'premium', label: 'Premium', description: 'Elevated, selective and proposal-ready.' }
]

export const LENGTHS = [
  { id: 'short', label: 'Short', description: 'One compact root with a semantic suffix.' },
  { id: 'standard', label: 'Standard', description: 'Balanced compound or root-plus-suffix structure.' },
  { id: 'formal', label: 'Formal Compound', description: 'Longer institutional names for formal contexts.' }
]

export const SEMANTIC_SUFFIXES = [
  { id: 'auto', label: 'Auto', industries: ['finance', 'consulting', 'realEstate', 'logistics'], styles: ['globalVenture', 'heritageIndustrial', 'neoEnterprise'] },
  { id: 'Group', label: 'Group', industries: ['finance', 'consulting', 'realEstate', 'logistics'], styles: ['globalVenture', 'heritageIndustrial', 'neoEnterprise'] },
  { id: 'Holdings', label: 'Holdings', industries: ['finance', 'realEstate'], styles: ['globalVenture', 'heritageIndustrial'] },
  { id: 'Capital', label: 'Capital', industries: ['finance'], styles: ['globalVenture'] },
  { id: 'Partners', label: 'Partners', industries: ['finance', 'consulting'], styles: ['globalVenture', 'neoEnterprise'] },
  { id: 'Industries', label: 'Industries', industries: ['realEstate', 'logistics'], styles: ['heritageIndustrial'] },
  { id: 'Trading', label: 'Trading', industries: ['logistics'], styles: ['heritageIndustrial', 'globalVenture'] },
  { id: 'Trust', label: 'Trust', industries: ['finance', 'realEstate', 'consulting'], styles: ['heritageIndustrial', 'globalVenture'] },
  { id: 'Advisory', label: 'Advisory', industries: ['finance', 'consulting'], styles: ['globalVenture', 'neoEnterprise'] },
  { id: 'Global', label: 'Global', industries: ['finance', 'logistics', 'realEstate'], styles: ['globalVenture', 'heritageIndustrial'] }
]

export const LEGAL_SUFFIXES = [
  { id: 'none', label: 'None' },
  { id: 'LLC', label: 'LLC' },
  { id: 'Ltd.', label: 'Ltd.' },
  { id: 'Inc.', label: 'Inc.' },
  { id: 'Corp.', label: 'Corp.' }
]

export const BRIDGES = [
  'way',
  'bridge',
  'field',
  'stone',
  'river',
  'mark',
  'line',
  'crest',
  'gate',
  'point',
  'stead',
  'hall',
  'ridge',
  'port',
  'vale',
  'worth',
  'cross',
  'mount',
  'haven',
  'forge',
  'square',
  'court',
  'yard',
  'bank',
  'lane',
  'works',
  'anchor',
  'pillar',
  'crown',
  'harbor',
  'vector',
  'axis',
  'union',
  'scope',
  'sector',
  'civic',
  'ledger',
  'matrix',
  'signal',
  'tower',
  'plaza',
  'station',
  'frontier',
  'horizon',
  'compass',
  'summit',
  'urban',
  'terra',
  'fleet',
  'gateway',
  'corridor',
  'route'
]

export const ENTERPRISE_ENDINGS = [
  'terra',
  'vora',
  'forma',
  'nex',
  'via',
  'core',
  'vera',
  'mark',
  'line',
  'nova',
  'axis',
  'ora',
  'mont',
  'ward',
  'stead',
  'port',
  'bridge',
  'point',
  'hall',
  'crest',
  'field',
  'gate',
  'works',
  'cove',
  'scope',
  'prism',
  'forge',
  'signal',
  'tower',
  'sector',
  'matrix',
  'ledger',
  'plaza',
  'anchor',
  'pillar',
  'union',
  'summit',
  'vector',
  'compass',
  'gateway',
  'fleet',
  'route',
  'urban',
  'terra',
  'harbor',
  'civic',
  'frontier',
  'horizon'
]

export const QUALIFIERS = {
  finance: ['Asset', 'Reserve', 'Portfolio', 'Equity', 'Ledger', 'Regent', 'Meridian', 'Value', 'Capital', 'Principal', 'Steward', 'Market'],
  consulting: ['Advisory', 'Strategy', 'Method', 'Practice', 'Accord', 'Clarity', 'Operating', 'Executive', 'Service', 'Insight', 'Partner', 'Systems'],
  realEstate: ['Property', 'Urban', 'Civic', 'Build', 'Estate', 'Landmark', 'Terrace', 'Project', 'Asset', 'Development', 'Works', 'District'],
  logistics: ['Trade', 'Route', 'Port', 'Gateway', 'Transit', 'Fleet', 'Corridor', 'Supply', 'Global', 'Freight', 'Network', 'Forward']
}

export const BANNED_FRAGMENTS = [
  'scam',
  'fraud',
  'collapse',
  'debttrap',
  'debt trap',
  'hate',
  'weapon',
  'google',
  'amazon',
  'microsoft',
  'apple',
  'meta',
  'tesla',
  'coca',
  'nike'
]

export const ROOTS = [
  {
    token: 'Crest',
    type: 'prestige',
    industries: ['finance', 'consulting'],
    styles: ['globalVenture'],
    tones: ['boardroom', 'premium'],
    meaning: 'authority, elevation and established ambition'
  },
  {
    token: 'Meridian',
    type: 'directional',
    industries: ['finance', 'logistics'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['boardroom', 'premium'],
    meaning: 'global balance, orientation and long-range reach'
  },
  {
    token: 'Slate',
    type: 'material',
    industries: ['finance', 'consulting', 'realEstate'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'clean foundation, restraint and practical strength'
  },
  {
    token: 'Apex',
    type: 'prestige',
    industries: ['finance', 'holding', 'consulting'],
    styles: ['globalVenture'],
    tones: ['boardroom', 'premium'],
    meaning: 'a high point, focused ambition and leadership'
  },
  {
    token: 'Vanguard',
    type: 'directional',
    industries: ['finance', 'logistics'],
    styles: ['globalVenture'],
    tones: ['boardroom', 'modern'],
    meaning: 'forward movement and category leadership'
  },
  {
    token: 'Northstar',
    type: 'directional',
    industries: ['finance', 'consulting', 'logistics'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['boardroom', 'premium'],
    meaning: 'navigation, trust and long-term direction'
  },
  {
    token: 'Prime',
    type: 'prestige',
    industries: ['finance', 'consulting'],
    styles: ['globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'first-tier quality and concise professional intent'
  },
  {
    token: 'Ledger',
    type: 'abstract',
    industries: ['finance'],
    styles: ['globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'accountability, records and financial discipline'
  },
  {
    token: 'Sterling',
    type: 'prestige',
    industries: ['finance', 'consulting'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['boardroom', 'premium'],
    meaning: 'quality, reliability and formal business trust'
  },
  {
    token: 'Keystone',
    type: 'foundation',
    industries: ['consulting', 'realEstate'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'central support, structure and durable trust'
  },
  {
    token: 'Civic',
    type: 'foundation',
    industries: ['consulting', 'realEstate'],
    styles: ['heritageIndustrial', 'neoEnterprise'],
    tones: ['conservative', 'boardroom', 'modern'],
    meaning: 'public trust, service orientation and institutional clarity'
  },
  {
    token: 'Clarity',
    type: 'abstract',
    industries: ['consulting'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'clear advisory thinking and decision support'
  },
  {
    token: 'Summit',
    type: 'geography',
    industries: ['realEstate', 'finance'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['boardroom', 'premium'],
    meaning: 'elevation, permanence and strategic perspective'
  },
  {
    token: 'Stone',
    type: 'material',
    industries: ['realEstate', 'industrial'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'durability, grounded assets and construction strength'
  },
  {
    token: 'Harbor',
    type: 'geography',
    industries: ['realEstate', 'logistics', 'finance'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'safe arrival, trade flow and reliable shelter'
  },
  {
    token: 'Cedar',
    type: 'material',
    industries: ['realEstate'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'premium'],
    meaning: 'warm permanence, built quality and natural stability'
  },
  {
    token: 'Iron',
    type: 'material',
    industries: ['realEstate', 'logistics'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'strength, industrial reliability and operational discipline'
  },
  {
    token: 'Foundation',
    type: 'foundation',
    industries: ['realEstate', 'consulting'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'base strength, structure and long-term support'
  },
  {
    token: 'Beacon',
    type: 'directional',
    industries: ['logistics', 'consulting', 'realEstate'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'guidance, visibility and trusted direction'
  },
  {
    token: 'Atlas',
    type: 'geography',
    industries: ['logistics', 'finance'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['boardroom', 'premium'],
    meaning: 'global scale, routes and operational coverage'
  },
  {
    token: 'Bridge',
    type: 'foundation',
    industries: ['logistics', 'consulting'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['boardroom', 'modern'],
    meaning: 'connection, cross-border flow and practical coordination'
  },
  {
    token: 'Route',
    type: 'directional',
    industries: ['logistics'],
    styles: ['heritageIndustrial', 'neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'movement, delivery clarity and operational pathfinding'
  },
  {
    token: 'Pioneer',
    type: 'directional',
    industries: ['logistics', 'realEstate'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['modern', 'boardroom'],
    meaning: 'expansion, initiative and market entry'
  },
  {
    token: 'Transit',
    type: 'directional',
    industries: ['logistics'],
    styles: ['heritageIndustrial', 'neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'movement, trade routes and dependable delivery'
  },
  {
    token: 'Global',
    type: 'abstract',
    industries: ['finance', 'logistics'],
    styles: ['globalVenture'],
    tones: ['boardroom', 'premium'],
    meaning: 'international reach and cross-market presence'
  },
  {
    token: 'Union',
    type: 'foundation',
    industries: ['finance', 'consulting', 'logistics'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'coordination, alignment and institutional scale'
  },
  {
    token: 'Vista',
    type: 'geography',
    industries: ['realEstate', 'finance'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['premium', 'boardroom'],
    meaning: 'wide view, planning horizon and strategic perspective'
  },
  {
    token: 'Stratis',
    type: 'latin',
    industries: ['consulting', 'finance'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'strategy, structure and modern advisory clarity'
  },
  {
    token: 'Novaterra',
    type: 'latin',
    industries: ['realEstate', 'logistics'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'premium'],
    meaning: 'new ground, expansion and enterprise renewal'
  },
  {
    token: 'Integra',
    type: 'latin',
    industries: ['consulting', 'finance'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'integration, completeness and operating discipline'
  },
  {
    token: 'Civora',
    type: 'latin',
    industries: ['consulting', 'realEstate'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'civic trust blended with contemporary enterprise tone'
  },
  {
    token: 'Alloy',
    type: 'material',
    industries: ['realEstate', 'logistics'],
    styles: ['heritageIndustrial', 'neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'combined strength, practical engineering and resilience'
  },
  {
    token: 'Regent',
    type: 'prestige',
    industries: ['finance'],
    styles: ['globalVenture'],
    tones: ['conservative', 'premium'],
    meaning: 'formal stewardship, seniority and capital discipline'
  },
  {
    token: 'Sovereign',
    type: 'prestige',
    industries: ['finance'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['conservative', 'premium'],
    meaning: 'independence, authority and long-term financial control'
  },
  {
    token: 'Cardinal',
    type: 'directional',
    industries: ['finance', 'consulting'],
    styles: ['globalVenture'],
    tones: ['boardroom', 'premium'],
    meaning: 'principal direction, priority and executive clarity'
  },
  {
    token: 'Argent',
    type: 'prestige',
    industries: ['finance'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['boardroom', 'premium'],
    meaning: 'silver-toned value, restraint and formal capital presence'
  },
  {
    token: 'Verity',
    type: 'abstract',
    industries: ['finance', 'consulting'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['conservative', 'boardroom'],
    meaning: 'truthfulness, audit confidence and accountable decisions'
  },
  {
    token: 'Equity',
    type: 'abstract',
    industries: ['finance'],
    styles: ['globalVenture'],
    tones: ['boardroom', 'modern'],
    meaning: 'ownership, fairness and direct financial relevance'
  },
  {
    token: 'Pillar',
    type: 'foundation',
    industries: ['finance', 'realEstate'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'support, strength and institutional permanence'
  },
  {
    token: 'Monarch',
    type: 'prestige',
    industries: ['finance', 'holding'],
    styles: ['globalVenture'],
    tones: ['premium', 'boardroom'],
    meaning: 'senior authority, selective positioning and formal stature'
  },
  {
    token: 'Accord',
    type: 'abstract',
    industries: ['consulting'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['conservative', 'boardroom'],
    meaning: 'alignment, agreement and productive advisory outcomes'
  },
  {
    token: 'Method',
    type: 'abstract',
    industries: ['consulting'],
    styles: ['neoEnterprise', 'globalVenture'],
    tones: ['modern', 'boardroom'],
    meaning: 'structured thinking, repeatable practice and operating clarity'
  },
  {
    token: 'Principle',
    type: 'abstract',
    industries: ['consulting'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'disciplined standards and trusted professional judgment'
  },
  {
    token: 'Anchor',
    type: 'foundation',
    industries: ['consulting', 'logistics'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'stability, reference point and dependable coordination'
  },
  {
    token: 'Compass',
    type: 'directional',
    industries: ['consulting', 'logistics'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['boardroom', 'modern'],
    meaning: 'navigation, advice and clear strategic orientation'
  },
  {
    token: 'Adroit',
    type: 'abstract',
    industries: ['consulting'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'premium'],
    meaning: 'skillful execution and composed professional capability'
  },
  {
    token: 'Praxis',
    type: 'latin',
    industries: ['consulting'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'practical application of strategy and operating knowledge'
  },
  {
    token: 'Vector',
    type: 'directional',
    industries: ['consulting', 'logistics'],
    styles: ['neoEnterprise', 'globalVenture'],
    tones: ['modern', 'boardroom'],
    meaning: 'direction, force and measurable progress'
  },
  {
    token: 'Quarry',
    type: 'material',
    industries: ['realEstate'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'stone, source material and durable built assets'
  },
  {
    token: 'Mason',
    type: 'material',
    industries: ['realEstate'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'craft, construction discipline and built reliability'
  },
  {
    token: 'Pinnacle',
    type: 'geography',
    industries: ['realEstate', 'finance'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['premium', 'boardroom'],
    meaning: 'high-value positioning, elevation and premium perspective'
  },
  {
    token: 'Terrace',
    type: 'geography',
    industries: ['realEstate'],
    styles: ['heritageIndustrial', 'neoEnterprise'],
    tones: ['conservative', 'premium'],
    meaning: 'place, architecture and refined property presence'
  },
  {
    token: 'Landmark',
    type: 'foundation',
    industries: ['realEstate'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['boardroom', 'premium'],
    meaning: 'recognizable location, asset value and civic permanence'
  },
  {
    token: 'Crown',
    type: 'prestige',
    industries: ['realEstate', 'finance'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['premium', 'boardroom'],
    meaning: 'premium status, completion and elevated asset quality'
  },
  {
    token: 'Hearth',
    type: 'foundation',
    industries: ['realEstate'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'premium'],
    meaning: 'settled place, enduring shelter and human-scale trust'
  },
  {
    token: 'Urban',
    type: 'geography',
    industries: ['realEstate', 'logistics'],
    styles: ['neoEnterprise', 'globalVenture'],
    tones: ['modern', 'boardroom'],
    meaning: 'city systems, development context and modern infrastructure'
  },
  {
    token: 'Portage',
    type: 'directional',
    industries: ['logistics'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'movement across routes and dependable transfer'
  },
  {
    token: 'Waypoint',
    type: 'directional',
    industries: ['logistics'],
    styles: ['neoEnterprise', 'globalVenture'],
    tones: ['modern', 'boardroom'],
    meaning: 'route planning, progress markers and delivery control'
  },
  {
    token: 'Relay',
    type: 'directional',
    industries: ['logistics'],
    styles: ['neoEnterprise', 'heritageIndustrial'],
    tones: ['modern', 'boardroom'],
    meaning: 'handoff, speed and coordinated operating flow'
  },
  {
    token: 'Fleet',
    type: 'abstract',
    industries: ['logistics'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'boardroom'],
    meaning: 'transport capacity, scale and coordinated movement'
  },
  {
    token: 'Gateway',
    type: 'geography',
    industries: ['logistics', 'realEstate'],
    styles: ['globalVenture', 'heritageIndustrial'],
    tones: ['boardroom', 'premium'],
    meaning: 'market entry, route access and controlled passage'
  },
  {
    token: 'Corridor',
    type: 'geography',
    industries: ['logistics', 'realEstate'],
    styles: ['heritageIndustrial'],
    tones: ['conservative', 'boardroom'],
    meaning: 'trade lane, infrastructure and dependable movement'
  },
  {
    token: 'Horizon',
    type: 'directional',
    industries: ['logistics', 'finance'],
    styles: ['globalVenture', 'neoEnterprise'],
    tones: ['modern', 'premium'],
    meaning: 'forward view, expansion and cross-market ambition'
  },
  {
    token: 'Mariner',
    type: 'geography',
    industries: ['logistics'],
    styles: ['heritageIndustrial', 'globalVenture'],
    tones: ['conservative', 'premium'],
    meaning: 'trade movement, port confidence and global routes'
  },
  {
    token: 'Quantara',
    type: 'latin',
    industries: ['finance', 'consulting'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'premium'],
    meaning: 'measured enterprise intelligence and precise analysis'
  },
  {
    token: 'Solvian',
    type: 'latin',
    industries: ['consulting', 'finance'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'solution-oriented advisory and composed execution'
  },
  {
    token: 'Asterra',
    type: 'latin',
    industries: ['realEstate', 'finance'],
    styles: ['neoEnterprise'],
    tones: ['premium', 'modern'],
    meaning: 'elevated terrain and refined enterprise presence'
  },
  {
    token: 'Navora',
    type: 'latin',
    industries: ['logistics', 'consulting'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'navigation, guidance and clear movement'
  },
  {
    token: 'Corevia',
    type: 'latin',
    industries: ['consulting', 'logistics'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'core operations, route clarity and enterprise systems'
  },
  {
    token: 'Valora',
    type: 'latin',
    industries: ['finance', 'realEstate'],
    styles: ['neoEnterprise'],
    tones: ['premium', 'boardroom'],
    meaning: 'value, quality and polished institutional tone'
  },
  {
    token: 'Terranova',
    type: 'latin',
    industries: ['realEstate', 'logistics'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'premium'],
    meaning: 'new territory, expansion and asset development'
  },
  {
    token: 'Operis',
    type: 'latin',
    industries: ['consulting', 'logistics'],
    styles: ['neoEnterprise'],
    tones: ['modern', 'boardroom'],
    meaning: 'operations, disciplined delivery and enterprise work'
  }
]

export const DEFAULT_OPTIONS = {
  industry: 'finance',
  style: 'globalVenture',
  entitySuffix: 'Partners',
  legalSuffix: 'none',
  tone: 'boardroom',
  length: 'standard',
  count: 8,
  seed: '',
  useSeed: false,
  strictness: 'standard'
}

export function findOption(options, id, fallbackIndex = 0) {
  return options.find((option) => option.id === id) || options[fallbackIndex]
}
