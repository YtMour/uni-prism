<template>
  <view class="screen legal-screen" :class="{ 'is-rtl': currentLocale.rtl }" :dir="currentLocale.rtl ? 'rtl' : 'ltr'">
    <view class="subpage-header legal-header">
      <button class="plain-icon" type="button" :aria-label="ui.legal.backToSettings" @click="$emit('back')">←</button>
      <text class="page-title">{{ document.title }}</text>
    </view>

    <view class="legal-summary">
      <text class="eyebrow">{{ currentLocale.label }} · {{ document.updated }}</text>
      <text class="legal-summary-text">{{ document.summary }}</text>
    </view>

    <view class="legal-card">
      <view v-for="section in document.sections" :key="section.heading" class="legal-section">
        <text class="compliance-heading">{{ section.heading }}</text>
        <text class="legal-copy">{{ section.body }}</text>
      </view>
    </view>

    <view class="risk-notice large">
      <text class="notice-icon">△</text>
      <text>{{ ui.legal.reviewNotice }}</text>
    </view>
  </view>
</template>

<script>
import { getLegalLocale } from '../data/legalContent.js'

export default {
  props: {
    document: { type: Object, required: true },
    locale: { type: String, required: true },
    ui: { type: Object, required: true }
  },
  emits: ['back'],
  computed: {
    currentLocale() {
      return getLegalLocale(this.locale)
    }
  }
}
</script>
