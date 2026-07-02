<template>
  <section class="screen" data-testid="settings-screen">
    <div class="subpage-header">
      <button class="icon-button" type="button" @click="$emit('back')">‹</button>
      <h1 class="section-title">{{ t('settings.title') }}</h1>
      <div class="header-spacer" />
    </div>

    <div class="settings-list">
      <div class="settings-row">
        <span>{{ t('settings.defaultStyle') }}</span>
        <span class="muted">{{ label('styles', selectedStyle) }}</span>
      </div>
      <div class="settings-row">
        <span>{{ t('settings.defaultIndustry') }}</span>
        <span class="muted">{{ label('industries', selectedIndustry) }}</span>
      </div>
      <div class="settings-row">
        <span>{{ t('settings.resultCount') }}</span>
        <div class="stepper" data-testid="result-count-control">
          <button type="button" data-testid="result-count-decrease" @click="$emit('update-result-count', resultCount - 2)">-</button>
          <strong>{{ resultCount }}</strong>
          <button type="button" data-testid="result-count-increase" @click="$emit('update-result-count', resultCount + 2)">+</button>
        </div>
      </div>
      <div class="settings-row">
        <span>{{ t('settings.language') }}</span>
        <label class="language-row" data-testid="language-control">
          <select
            class="language-select"
            data-testid="language-select"
            :value="locale"
            @change="$emit('update-locale', $event.target.value)"
          >
            <option
            v-for="item in locales"
            :key="item.id"
            :value="item.id"
          >
            {{ item.label }}
            </option>
          </select>
        </label>
      </div>
    </div>

    <div class="settings-list">
      <button class="settings-row is-button" type="button" data-testid="seed-toggle" @click="$emit('toggle-seed-mode')">
        <span>{{ t('settings.useSeed') }}</span>
        <span class="switch" :class="{ 'is-on': useSeed }">{{ useSeed ? t('common.on') : t('common.off') }}</span>
      </button>
      <span class="settings-help">{{ t('settings.seedHelp') }}</span>
      <button class="settings-row is-button" type="button" data-testid="readability-toggle" @click="$emit('toggle-readable-filter')">
        <span>{{ t('settings.filterReadable') }}</span>
        <span class="switch" :class="{ 'is-on': filterReadable }">{{ filterReadable ? t('common.on') : t('common.off') }}</span>
      </button>
      <span class="settings-help">{{ t('settings.filterHelp') }}</span>
      <button class="settings-row is-button" type="button" data-testid="score-toggle" @click="$emit('toggle-score-details')">
        <span>{{ t('settings.showScore') }}</span>
        <span class="switch" :class="{ 'is-on': showScoreDetails }">{{ showScoreDetails ? t('common.on') : t('common.off') }}</span>
      </button>
      <span class="settings-help">{{ t('settings.scoreHelp') }}</span>
    </div>

    <div class="settings-list">
      <div class="settings-row">
        <span>{{ t('settings.savedNames') }}</span>
        <span class="muted">{{ savedCount }}</span>
      </div>
      <button class="settings-row is-button" type="button" data-testid="privacy-link" @click="$emit('open-legal', 'privacy')">
        <span>{{ t('settings.privacy') }}</span>
        <span class="bar-arrow">›</span>
      </button>
      <button class="settings-row is-button" type="button" data-testid="disclaimer-link" @click="$emit('open-legal', 'disclaimer')">
        <span>{{ t('settings.disclaimer') }}</span>
        <span class="bar-arrow">›</span>
      </button>
      <button class="danger-row" type="button" @click="$emit('clear')">{{ t('settings.clearData') }}</button>
    </div>

    <span class="disclaimer">{{ t('common.planning') }} · {{ t('common.creativeOnly') }}</span>
  </section>
</template>

<script>
export default {
  props: {
    selectedStyle: { type: String, required: true },
    selectedIndustry: { type: String, required: true },
    savedCount: { type: Number, required: true },
    resultCount: { type: Number, required: true },
    useSeed: { type: Boolean, required: true },
    filterReadable: { type: Boolean, required: true },
    showScoreDetails: { type: Boolean, required: true },
    locale: { type: String, required: true },
    locales: { type: Array, required: true },
    label: { type: Function, required: true },
    t: { type: Function, required: true }
  },
  emits: [
    'back',
    'clear',
    'update-result-count',
    'toggle-seed-mode',
    'toggle-readable-filter',
    'toggle-score-details',
    'update-locale',
    'open-legal'
  ]
}
</script>
