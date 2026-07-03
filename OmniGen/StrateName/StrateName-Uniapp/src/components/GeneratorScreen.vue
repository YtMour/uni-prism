<template>
  <view class="screen generate-screen">
    <view class="hero-title">
      <text class="eyebrow">{{ ui.generate.eyebrow }}</text>
      <text class="page-title">{{ ui.generate.title }}</text>
    </view>

    <view v-if="candidates.length" class="active-filter-chips">
      <text class="filter-chip">{{ selectedIndustryLabel }}</text>
      <text class="filter-chip">{{ selectedStyleLabel }}</text>
      <text class="filter-chip">{{ selectedToneLabel }}</text>
      <text class="filter-chip">{{ selectedLengthLabel }}</text>
      <button class="chip-edit" type="button" @click="filtersOpen = !filtersOpen">
        {{ filtersOpen ? ui.generate.hideFilters : ui.generate.editFilters }}
      </button>
    </view>

    <view v-if="!candidates.length || filtersOpen" class="filter-panel">
      <SelectField
        icon="▥"
        :label="ui.generate.industryLabel"
        :model-value="options.industry"
        :options="namingOptions.industries"
        @update:model-value="updateOption('industry', $event)"
      />
      <SelectField
        icon="◎"
        :label="ui.generate.styleLabel"
        :model-value="options.style"
        :options="namingOptions.styles"
        @update:model-value="updateOption('style', $event)"
      />
      <SelectField
        icon="▦"
        :label="ui.generate.entityLabel"
        :model-value="options.entitySuffix"
        :options="entityOptions"
        @update:model-value="updateOption('entitySuffix', $event)"
      />
      <SelectField
        icon="◌"
        :label="ui.generate.toneLabel"
        :model-value="options.tone"
        :options="namingOptions.tones"
        @update:model-value="updateOption('tone', $event)"
      />
      <SelectField
        icon="☰"
        :label="ui.generate.lengthLabel"
        :model-value="options.length"
        :options="namingOptions.lengths"
        @update:model-value="updateOption('length', $event)"
      />
    </view>

    <view class="generate-row">
      <button class="primary-button" type="button" @click="generate">
        <text>{{ candidates.length ? ui.generate.generateAgain : ui.generate.generateNames }}</text>
        <text>→</text>
      </button>
      <button class="seed-toggle" type="button" :class="{ 'is-on': options.useSeed }" @click="updateOption('useSeed', !options.useSeed)">
        {{ options.useSeed ? ui.generate.seedOn : ui.generate.seedOff }}
      </button>
    </view>

    <view v-if="options.useSeed" class="seed-input-row">
      <text class="seed-label">{{ ui.generate.seed }}</text>
      <input class="seed-input" :value="options.seed" placeholder="boardroom-01" @input="updateSeed" />
    </view>

    <view v-if="!candidates.length" class="empty-state">
      <image class="empty-art" src="/static/brand/empty-letterhead.png" mode="aspectFit" />
      <text class="empty-title">{{ ui.generate.emptyTitle }}</text>
      <text class="empty-copy">{{ ui.generate.emptyCopy }}</text>
    </view>

    <view v-else class="results-stack">
      <view class="results-header">
        <text class="section-title">{{ ui.generate.candidates(candidates.length) }}</text>
        <text class="muted">{{ selectedIndustryLabel }}</text>
      </view>
      <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        :saved="shortlistIds.includes(candidate.id)"
        :ui="ui"
        @open="$emit('open-detail', $event)"
        @copy="$emit('copy', $event)"
        @toggle-save="$emit('toggle-save', $event)"
      />
      <view class="risk-notice">
        <text class="notice-icon">△</text>
        <text>{{ ui.generate.riskNotice }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import CandidateCard from './CandidateCard.vue'
import SelectField from './SelectField.vue'

export default {
  components: { CandidateCard, SelectField },
  props: {
    options: { type: Object, required: true },
    namingOptions: { type: Object, required: true },
    candidates: { type: Array, required: true },
    shortlistIds: { type: Array, required: true },
    ui: { type: Object, required: true }
  },
  emits: ['update-option', 'generate', 'open-detail', 'copy', 'toggle-save'],
  data() {
    return {
      filtersOpen: false
    }
  },
  computed: {
    entityOptions() {
      return this.namingOptions.semanticSuffixes
    },
    selectedIndustryLabel() {
      return this.namingOptions.industries.find((item) => item.id === this.options.industry)?.label || ''
    },
    selectedStyleLabel() {
      return this.namingOptions.styles.find((item) => item.id === this.options.style)?.label || ''
    },
    selectedToneLabel() {
      return this.namingOptions.tones.find((item) => item.id === this.options.tone)?.label || ''
    },
    selectedLengthLabel() {
      return this.namingOptions.lengths.find((item) => item.id === this.options.length)?.label || ''
    }
  },
  methods: {
    updateOption(key, value) {
      this.$emit('update-option', { key, value })
    },
    updateSeed(event) {
      this.updateOption('seed', event.detail?.value ?? event.target?.value ?? '')
    },
    generate() {
      this.filtersOpen = false
      this.$emit('generate')
    }
  }
}
</script>
