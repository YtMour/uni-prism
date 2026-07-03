<template>
  <view class="screen settings-screen">
    <view class="subpage-header">
      <text class="page-title">{{ ui.settings.title }}</text>
    </view>

    <text class="settings-section-title">{{ ui.settings.generationDefaults }}</text>
    <view class="settings-group">
      <SelectField
        icon="▥"
        :label="ui.settings.defaultIndustry"
        :model-value="options.industry"
        :options="namingOptions.industries"
        @update:model-value="updateOption('industry', $event)"
      />
      <SelectField
        icon="◎"
        :label="ui.settings.defaultStyle"
        :model-value="options.style"
        :options="namingOptions.styles"
        @update:model-value="updateOption('style', $event)"
      />
      <SelectField
        icon="§"
        :label="ui.settings.legalSuffixPreview"
        :model-value="options.legalSuffix"
        :options="namingOptions.legalSuffixes"
        @update:model-value="updateOption('legalSuffix', $event)"
      />
      <view class="settings-row">
        <text>{{ ui.settings.resultCount }}</text>
        <view class="stepper">
          <button type="button" aria-label="Decrease result count" @click="setCount(settings.resultCount - 1)">−</button>
          <text>{{ settings.resultCount }}</text>
          <button type="button" aria-label="Increase result count" @click="setCount(settings.resultCount + 1)">＋</button>
        </view>
      </view>
      <button class="settings-row as-button" type="button" @click="toggle('filterHighRisk')">
        <text>{{ ui.settings.filterHighRisk }}</text>
        <text class="switch" :class="{ 'is-on': settings.filterHighRisk }">{{ settings.filterHighRisk ? ui.settings.on : ui.settings.off }}</text>
      </button>
      <button class="settings-row as-button" type="button" @click="toggle('showScoreDetails')">
        <text>{{ ui.settings.showScoreDetails }}</text>
        <text class="switch" :class="{ 'is-on': settings.showScoreDetails }">{{ settings.showScoreDetails ? ui.settings.on : ui.settings.off }}</text>
      </button>
    </view>

    <text class="settings-section-title">{{ ui.settings.legalAndPrivacy }}</text>
    <view class="settings-group legal-settings-group">
      <NativeSelectField
        class-name="legal-language-select"
        :label="ui.settings.languageLabel"
        :model-value="settings.legalLocale"
        :options="legalLocales"
        @update:model-value="updateSetting('legalLocale', $event)"
      />
    </view>
    <view class="compliance-card">
      <button class="compliance-row" type="button" data-legal-type="privacy" @click="$emit('open-legal', 'privacy')">
        <text>{{ ui.settings.privacyPolicy }}</text>
        <text>{{ ui.settings.open }}</text>
      </button>
      <button class="compliance-row" type="button" data-legal-type="disclaimer" @click="$emit('open-legal', 'disclaimer')">
        <text>{{ ui.settings.disclaimer }}</text>
        <text>{{ ui.settings.open }}</text>
      </button>
      <button class="compliance-row" type="button" @click="panel = panel === 'suffix' ? '' : 'suffix'">
        <text>{{ ui.settings.legalSuffixNote }}</text>
        <text>{{ panel === 'suffix' ? '⌃' : '⌄' }}</text>
      </button>
      <view v-if="panel === 'suffix'" class="compliance-copy">
        <text class="compliance-heading">{{ ui.settings.previewFormatting }}</text>
        <text>{{ ui.settings.previewFormattingBody }}</text>
        <text class="compliance-heading">{{ ui.settings.noFormationStatus }}</text>
        <text>{{ ui.settings.noFormationStatusBody }}</text>
      </view>
    </view>

    <view class="risk-notice large">
      <text class="notice-icon">△</text>
      <text>{{ ui.settings.riskNotice }}</text>
    </view>

    <text class="settings-section-title">{{ ui.settings.localData }}</text>
    <button class="danger-button" type="button" :aria-label="ui.settings.clearLocalData" @click="$emit('clear-data')">⌫ {{ ui.settings.clearLocalData }}</button>
  </view>
</template>

<script>
import NativeSelectField from './NativeSelectField.vue'
import SelectField from './SelectField.vue'

export default {
  components: { NativeSelectField, SelectField },
  props: {
    options: { type: Object, required: true },
    settings: { type: Object, required: true },
    namingOptions: { type: Object, required: true },
    legalLocales: { type: Array, required: true },
    ui: { type: Object, required: true }
  },
  emits: ['update-option', 'update-setting', 'clear-data', 'open-legal'],
  data() {
    return { panel: '' }
  },
  methods: {
    updateOption(key, value) {
      this.$emit('update-option', { key, value })
    },
    updateSetting(key, value) {
      this.$emit('update-setting', { key, value })
    },
    setCount(value) {
      this.updateSetting('resultCount', Math.min(12, Math.max(4, value)))
    },
    toggle(key) {
      this.updateSetting(key, !this.settings[key])
    }
  }
}
</script>
