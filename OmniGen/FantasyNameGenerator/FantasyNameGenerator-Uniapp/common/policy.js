export const PRIVACY_POLICY_SECTIONS = [
  {
    title: 'What stays on device',
    items: [
      'Fantasy name generation runs locally on this device in the current prototype.',
      'Saved favorites, default realm, haptic feedback, and animation preferences are kept in local storage.'
    ]
  },
  {
    title: 'What is not collected',
    items: [
      'No account, cloud sync, analytics, or online AI generation is used in this prototype.',
      'The app does not intentionally collect personal identity, contact, payment, or location data.'
    ]
  },
  {
    title: 'User control',
    items: [
      'Clearing browser or app storage removes local favorites and preferences.',
      'Future online features should be introduced behind an explicit notice before any data leaves the device.'
    ]
  }
]

export const DISCLAIMER_SECTIONS = [
  {
    title: 'Creative reference',
    items: [
      'Generated names are creative prompts, not legal, cultural, linguistic, or publishing advice.',
      'Please review each result before using it in published stories, games, products, or commercial materials.'
    ]
  },
  {
    title: 'Originality review',
    items: [
      'Users should check whether a selected name conflicts with existing characters, brands, trademarks, or community rules.',
      'The generator can suggest tone and structure, but it cannot guarantee uniqueness or suitability for every audience.'
    ]
  }
]

export const IMPLEMENTATION_SUMMARY = [
  {
    title: 'Local generator',
    copy: 'Realm-based name patterns, filters, and regenerate flow are implemented without a network dependency.'
  },
  {
    title: 'Favorites pocket',
    copy: 'Selected names can be saved locally and reviewed from the pocket panel.'
  },
  {
    title: 'Settings page',
    copy: 'Default realm, haptic preference, animation mode, privacy policy, disclaimer, status, and next steps are centralized here.'
  }
]

export const NEXT_STEPS = [
  {
    title: 'Quality sampling',
    copy: 'Run broader quality sampling across realms and filters to remove repetitive or awkward results.'
  },
  {
    title: 'Export workflow',
    copy: 'Replace the current prototype export surface with a real export path for saved names.'
  },
  {
    title: 'Dependency lockfile',
    copy: 'Stabilize installation with a committed lockfile once the current alpha uni-app dependency set is settled.'
  },
  {
    title: 'Asset polish',
    copy: 'Finalize asset cropping, density checks, and mobile spacing against the design references.'
  }
]
