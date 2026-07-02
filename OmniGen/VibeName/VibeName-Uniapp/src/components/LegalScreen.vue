<template>
  <section class="screen" data-testid="legal-screen">
    <div class="subpage-header">
      <button class="icon-button" type="button" @click="$emit('back')">‹</button>
      <h1 class="section-title">{{ title }}</h1>
      <div class="header-spacer" />
    </div>

    <article class="legal-card">
      <p class="legal-meta">{{ t('legal.lastUpdatedLabel') }} {{ t('legal.lastUpdatedValue') }}</p>
      <p class="legal-intro">{{ intro }}</p>
      <div
        v-for="section in sections"
        :key="section.titleKey"
        class="legal-section"
        data-testid="legal-section"
      >
        <strong>{{ t(section.titleKey) }}</strong>
        <span>{{ t(section.bodyKey) }}</span>
      </div>
    </article>
  </section>
</template>

<script>
const LEGAL_SECTIONS = {
  privacy: [
    ['legal.privacyStoredTitle', 'legal.privacyStoredBody'],
    ['legal.privacyNotCollectedTitle', 'legal.privacyNotCollectedBody'],
    ['legal.privacyUseTitle', 'legal.privacyUseBody'],
    ['legal.privacySharingTitle', 'legal.privacySharingBody'],
    ['legal.privacyRetentionTitle', 'legal.privacyRetentionBody'],
    ['legal.privacyControlsTitle', 'legal.privacyControlsBody'],
    ['legal.privacySecurityTitle', 'legal.privacySecurityBody'],
    ['legal.privacyChangesTitle', 'legal.privacyChangesBody']
  ],
  disclaimer: [
    ['legal.disclaimerCreativeTitle', 'legal.disclaimerCreativeBody'],
    ['legal.disclaimerAvailabilityTitle', 'legal.disclaimerAvailabilityBody'],
    ['legal.disclaimerTrademarkTitle', 'legal.disclaimerTrademarkBody'],
    ['legal.disclaimerNoAdviceTitle', 'legal.disclaimerNoAdviceBody'],
    ['legal.disclaimerNoWarrantyTitle', 'legal.disclaimerNoWarrantyBody'],
    ['legal.disclaimerUserResponsibilityTitle', 'legal.disclaimerUserResponsibilityBody'],
    ['legal.disclaimerChangesTitle', 'legal.disclaimerChangesBody']
  ]
}

export default {
  props: {
    kind: { type: String, required: true },
    t: { type: Function, required: true }
  },
  emits: ['back'],
  computed: {
    title() {
      return this.kind === 'privacy'
        ? this.t('legal.privacyTitle')
        : this.t('legal.disclaimerTitle')
    },
    intro() {
      return this.kind === 'privacy'
        ? this.t('legal.privacyIntro')
        : this.t('legal.disclaimerIntro')
    },
    sections() {
      return (LEGAL_SECTIONS[this.kind] || LEGAL_SECTIONS.disclaimer).map(([titleKey, bodyKey]) => ({
        titleKey,
        bodyKey
      }))
    }
  }
}
</script>
