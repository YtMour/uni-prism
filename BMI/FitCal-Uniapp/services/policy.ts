import type { AppLanguage } from '../types/fitcal'
import { t } from './i18n'

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

const sectionKeys: Record<PolicyType, string[]> = {
  privacy: ['local', 'account', 'control', 'permissions', 'ads'],
  disclaimer: ['estimates', 'diagnosis', 'judgment', 'emergency']
}

export function getPolicyPage(type: PolicyType, language: AppLanguage = 'en'): PolicyPageContent {
  const pageType = type === 'disclaimer' ? 'disclaimer' : 'privacy'
  return {
    title: t(language, `policy.${pageType}.title`),
    subtitle: t(language, `policy.${pageType}.subtitle`),
    sections: sectionKeys[pageType].map((sectionKey) => ({
      heading: t(language, `policy.${pageType}.${sectionKey}.heading`),
      body: t(language, `policy.${pageType}.${sectionKey}.body`)
    }))
  }
}

export function policyContent(title: string, language: AppLanguage = 'en'): string {
  const page = title === t(language, 'policy.disclaimer.title') || title === 'Disclaimer'
    ? getPolicyPage('disclaimer', language)
    : getPolicyPage('privacy', language)
  return page.sections.map((section) => `${section.heading}: ${section.body}`).join('\n\n')
}
