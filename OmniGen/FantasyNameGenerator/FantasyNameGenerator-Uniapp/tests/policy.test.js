import { describe, expect, it } from 'vitest'
import {
  DISCLAIMER_SECTIONS,
  IMPLEMENTATION_SUMMARY,
  NEXT_STEPS,
  PRIVACY_POLICY_SECTIONS
} from '../common/policy.js'

const flattenItems = (sections) => sections.flatMap((section) => section.items)

describe('policy and declaration content', () => {
  it('states that generation and preference data stay local in the prototype', () => {
    const text = flattenItems(PRIVACY_POLICY_SECTIONS).join(' ')

    expect(text).toContain('locally on this device')
    expect(text).toContain('local storage')
    expect(text).toContain('No account, cloud sync, analytics, or online AI generation')
  })

  it('sets review expectations for generated names before publication or commercial use', () => {
    const text = flattenItems(DISCLAIMER_SECTIONS).join(' ')

    expect(text).toContain('creative prompts')
    expect(text).toContain('review')
    expect(text).toContain('published')
    expect(text).toContain('commercial')
  })

  it('summarizes current implementation in user-facing terms', () => {
    expect(IMPLEMENTATION_SUMMARY).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Local generator' }),
        expect.objectContaining({ title: 'Favorites pocket' }),
        expect.objectContaining({ title: 'Settings page' })
      ])
    )
  })

  it('keeps next improvements focused on release-blocking work', () => {
    const nextStepText = NEXT_STEPS.map((step) => `${step.title} ${step.copy}`).join(' ')

    expect(nextStepText).toContain('quality sampling')
    expect(nextStepText).toContain('export')
    expect(nextStepText).toContain('lockfile')
    expect(nextStepText).toContain('asset')
  })
})
