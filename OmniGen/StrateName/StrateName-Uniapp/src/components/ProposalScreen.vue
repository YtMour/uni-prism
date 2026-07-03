<template>
  <view class="screen proposal-screen">
    <view class="subpage-header">
      <text class="page-title">{{ ui.proposal.title }}</text>
      <button class="plain-icon" type="button" :disabled="!candidate" :aria-label="ui.proposal.copyCurrentAria" @click="$emit('copy')">⇧</button>
    </view>

    <view v-if="!candidate" class="empty-state">
      <image class="empty-art" src="/static/brand/corporate-seal.png" mode="aspectFit" />
      <text class="empty-title">{{ ui.proposal.emptyTitle }}</text>
      <text class="empty-copy">{{ ui.proposal.emptyCopy }}</text>
    </view>

    <view v-else>
      <SelectField
        icon="▤"
        :label="ui.proposal.proposalName"
        :model-value="candidate.id"
        :options="candidateOptions"
        @update:model-value="$emit('select', $event)"
      />

      <view class="template-tabs">
        <button
          v-for="template in localizedTemplates"
          :key="template.id"
          type="button"
          class="template-tab"
          :class="{ 'is-active': template.id === activeTemplate }"
          @click="$emit('template', template.id)"
        >
          {{ template.label }}
        </button>
      </view>

      <view class="proposal-export-bar">
        <text class="section-title small">{{ ui.proposal.exportSummary }}</text>
        <view class="proposal-actions">
          <button class="secondary-button" type="button" @click="$emit('copy')">{{ ui.proposal.copyProposalText }}</button>
          <button class="primary-button inline" type="button" @click="$emit('save', candidate)">{{ ui.proposal.addToShortlist }}</button>
        </view>
      </view>

      <view class="proposal-preview" :class="'is-' + activeTemplate">
        <image class="proposal-bg" :src="templateSrc" mode="aspectFill" />
        <view class="proposal-overlay">
          <text class="proposal-name">{{ previewName }}</text>
          <view class="proposal-rule"></view>
          <text class="proposal-meta">{{ viewCandidate.industryLabel }} | {{ viewCandidate.tags[0] }}</text>
          <text class="proposal-subcopy">{{ localizedTagline }}</text>
          <image v-if="activeTemplate === 'cover'" class="seal-mark" src="/static/brand/corporate-seal.png" mode="aspectFit" />
        </view>
      </view>

      <view class="tagline-field">
        <text class="field-label">{{ ui.proposal.tagline }}</text>
        <input class="tagline-input" :value="tagline" @input="updateTagline" />
      </view>

      <view class="risk-notice">
        <text class="notice-icon">△</text>
        <text>{{ ui.proposal.riskNotice }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { localizeCandidate } from '../app/uiText.js'
import SelectField from './SelectField.vue'

export default {
  components: { SelectField },
  props: {
    candidate: { type: Object, default: null },
    candidates: { type: Array, required: true },
    activeTemplate: { type: String, required: true },
    tagline: { type: String, required: true },
    ui: { type: Object, required: true }
  },
  emits: ['select', 'template', 'tagline', 'copy', 'save'],
  data() {
    return {
      templates: [
        { id: 'letterhead', src: '/static/templates/letterhead-bg.png' },
        { id: 'lobby', src: '/static/templates/lobby-wall-bg.png' },
        { id: 'card', src: '/static/templates/business-card-bg.png' },
        { id: 'cover', src: '/static/templates/proposal-cover-bg.png' }
      ]
    }
  },
  computed: {
    viewCandidate() {
      return localizeCandidate(this.candidate, this.ui)
    },
    localizedTemplates() {
      return this.templates.map((template) => ({
        ...template,
        label: this.ui.proposal.templates[template.id]
      }))
    },
    candidateOptions() {
      return this.candidates.map((candidate) => ({
        id: candidate.id,
        label: `${candidate.displayName} · ${candidate.score}`,
        description: localizeCandidate(candidate, this.ui).industryLabel
      }))
    },
    templateSrc() {
      return this.templates.find((template) => template.id === this.activeTemplate)?.src || this.templates[0].src
    },
    previewName() {
      if (this.activeTemplate === 'letterhead') return this.candidate.name
      return this.candidate.displayName
    },
    localizedTagline() {
      return this.tagline === 'Strategic advisory for long-term enterprise growth.' ? this.ui.proposal.defaultTagline : this.tagline
    }
  },
  methods: {
    updateTagline(event) {
      this.$emit('tagline', event.detail?.value ?? event.target?.value ?? '')
    }
  }
}
</script>
