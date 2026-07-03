<template>
  <view class="sheet-backdrop" @click.self="$emit('close')">
    <view class="detail-sheet">
      <view class="sheet-handle"></view>
      <view class="sheet-top">
        <button class="plain-icon" type="button" :aria-label="ui.candidate.closeDetail" @click="$emit('close')">‹</button>
        <text class="sheet-title">{{ ui.candidate.closeDetail }}</text>
        <view class="plain-icon"></view>
      </view>

      <view class="detail-hero">
        <view class="detail-copy">
          <text class="detail-name">{{ candidate.displayName }}</text>
          <view class="tag-row">
            <text class="tag">{{ viewCandidate.industryLabel }}</text>
            <text class="tag">{{ viewCandidate.styleLabel }}</text>
            <text class="tag">{{ viewCandidate.toneLabel }}</text>
          </view>
        </view>
        <view class="detail-score">
          <text class="score-caption">{{ ui.candidate.totalScore }}</text>
          <text class="score-large">{{ candidate.score }}</text>
          <text class="score-caption">{{ ui.candidate.scoreOutOf }}</text>
        </view>
      </view>

      <view class="info-section">
        <text class="section-title small">{{ ui.candidate.nameStructure }}</text>
        <view class="structure-table">
          <view v-for="row in structureRows" :key="row.label" class="structure-row">
            <text class="structure-label">{{ row.label }}</text>
            <text class="structure-value">{{ row.value }}</text>
          </view>
        </view>
      </view>

      <view class="info-section">
        <text class="section-title small">{{ ui.candidate.scoreBreakdown }}</text>
        <view v-for="row in scoreRows" :key="row.key" class="score-row">
          <text class="score-label">{{ row.label }}</text>
          <view class="score-track">
            <view class="score-fill" :style="{ width: row.percent + '%' }"></view>
          </view>
          <text class="score-value">{{ row.value }}/{{ row.max }}</text>
        </view>
      </view>

      <view class="info-section">
        <text class="section-title small">{{ ui.candidate.whyItWorks }}</text>
        <view v-for="reason in viewCandidate.rationale" :key="reason" class="reason-row">
          <text class="reason-dot">✓</text>
          <text>{{ reason }}</text>
        </view>
      </view>

      <view class="risk-notice">
        <text class="notice-icon">△</text>
        <text>{{ viewCandidate.disclaimer }}</text>
      </view>

      <view class="sheet-actions">
        <button class="secondary-button" type="button" @click="$emit('copy', candidate.displayName)">{{ ui.candidate.copy }}</button>
        <button class="secondary-button" type="button" @click="$emit('toggle-save', candidate)">{{ saved ? ui.candidate.saved : ui.candidate.save }}</button>
        <button class="primary-button inline" type="button" @click="$emit('proposal', candidate)">{{ ui.candidate.proposal }}</button>
      </view>
    </view>
  </view>
</template>

<script>
import { localizeCandidate } from '../app/uiText.js'

export default {
  props: {
    candidate: { type: Object, required: true },
    saved: { type: Boolean, default: false },
    ui: { type: Object, required: true }
  },
  emits: ['close', 'copy', 'toggle-save', 'proposal'],
  computed: {
    viewCandidate() {
      return localizeCandidate(this.candidate, this.ui)
    },
    structureRows() {
      const structure = this.viewCandidate.structure
      return [
        { label: this.ui.candidate.structureLabels.root, value: structure.root },
        { label: this.ui.candidate.structureLabels.bridge, value: structure.bridge || structure.secondaryRoot || this.ui.candidate.none },
        { label: this.ui.candidate.structureLabels.modifier, value: structure.qualifier || this.ui.candidate.none },
        { label: this.ui.candidate.structureLabels.semanticSuffix, value: structure.semanticSuffix },
        { label: this.ui.candidate.structureLabels.legalSuffix, value: structure.legalSuffix === this.ui.candidate.none ? this.ui.candidate.none : `${structure.legalSuffix} (${this.ui.candidate.previewOnly})` }
      ]
    },
    scoreRows() {
      return Object.entries(this.candidate.breakdown).map(([key, value]) => {
        const max = this.candidate.scoreMax[key]
        return {
          key,
          label: this.ui.candidate.scoreLabels[key],
          value,
          max,
          percent: Math.round((value / max) * 100)
        }
      })
    }
  }
}
</script>
