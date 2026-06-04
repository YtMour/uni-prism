export type PolicyType = 'privacy' | 'disclaimer'

export interface PolicySection {
  heading: string
  body: string
}

export interface PolicyPageContent {
  title: string
  subtitle: string
  sections: PolicySection[]
}

const POLICY_PAGES: Record<PolicyType, PolicyPageContent> = {
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'FitCal is local-first in the MVP and does not require an account.',
    sections: [
      {
        heading: 'Local records',
        body: 'BMI, weight, unit preference, and calculator records are stored on this device only through local app storage.'
      },
      {
        heading: 'No account required',
        body: 'The MVP does not ask users to sign in and does not send calculator records to a FitCal server.'
      },
      {
        heading: 'Data control',
        body: 'Users can clear local records from Settings. Clearing records keeps the history empty until the user adds a new record.'
      },
      {
        heading: 'Android permissions',
        body: 'The current MVP does not request Android camera, contacts, phone state, WiFi management, log access, system settings, or location permissions.'
      },
      {
        heading: 'Advertising readiness',
        body: 'Current builds show ad placeholders only and do not integrate a production ad SDK. Any future ad SDK must be reviewed so the privacy text matches the shipped behavior.'
      }
    ]
  },
  disclaimer: {
    title: 'Disclaimer',
    subtitle: 'FitCal provides general wellness estimates, not medical advice.',
    sections: [
      {
        heading: 'Wellness estimates',
        body: 'BMI, BMR, TDEE, calorie targets, and guidance are estimates for general wellness reference.'
      },
      {
        heading: 'Not a diagnosis',
        body: 'FitCal does not diagnose, treat, cure, or prevent any disease or medical condition.'
      },
      {
        heading: 'Personal judgment',
        body: 'Users should consider their own health context and speak with a qualified professional before making major diet, weight, or activity changes.'
      },
      {
        heading: 'Emergency and medical needs',
        body: 'FitCal is not designed for urgent health decisions, pregnancy nutrition, eating disorder care, pediatric care, or clinical nutrition planning.'
      }
    ]
  }
}

export function getPolicyPage(type: PolicyType): PolicyPageContent {
  return POLICY_PAGES[type] || POLICY_PAGES.privacy
}

export function policyContent(title: string): string {
  const page = title === 'Disclaimer' ? getPolicyPage('disclaimer') : getPolicyPage('privacy')
  return page.sections.map((section) => `${section.heading}: ${section.body}`).join('\n\n')
}
