<template>
  <AppShell :t="translate" :locale-direction="localeDirection" @open-settings="viewMode = 'settings'">
    <GeneratorScreen
      v-if="viewMode === 'generator'"
      :options="localizedOptions"
      :selected-style="selectedStyle"
      :selected-industry="selectedIndustry"
      :selected-length="selectedLength"
      :candidates="candidates"
      :saved-count="saved.length"
      :is-generating="isGenerating"
      :show-score-details="showScoreDetails"
      :is-saved="isSaved"
      :label="label"
      :describe-option="describeOption"
      :structure-label="structureLabel"
      :candidate-reason="candidateReason"
      :t="translate"
      @update:selected-style="selectedStyle = $event"
      @update:selected-industry="selectedIndustry = $event"
      @update:selected-length="selectedLength = $event"
      @generate="handleGenerate"
      @open-detail="detailCandidate = $event"
      @toggle-save="toggleSaved"
      @copy="copyText"
      @open-whiteboard="viewMode = 'whiteboard'"
    />

    <WhiteboardScreen
      v-else-if="viewMode === 'whiteboard'"
      :saved="sortedSaved"
      :label="label"
      :t="translate"
      @back="viewMode = 'generator'"
      @copy-all="copySaved"
      @preview="previewCandidate"
      @remove="removeSaved"
    />

    <PreviewScreen
      v-else-if="viewMode === 'preview' && activeCandidate"
      :candidate="activeCandidate"
      :tagline="taglineFor(activeCandidate)"
      :label="label"
      :t="translate"
      @back="viewMode = 'generator'"
      @copy="copyText"
    />

    <SettingsScreen
      v-else-if="viewMode === 'settings'"
      :selected-style="selectedStyle"
      :selected-industry="selectedIndustry"
      :saved-count="saved.length"
      :result-count="resultCount"
      :use-seed="useSeed"
      :filter-readable="filterReadable"
      :show-score-details="showScoreDetails"
      :locale="locale"
      :locales="locales"
      :label="label"
      :t="translate"
      @back="viewMode = 'generator'"
      @clear="clearLocalData"
      @update-result-count="updateResultCount"
      @toggle-seed-mode="toggleSeed"
      @toggle-readable-filter="toggleReadable"
      @toggle-score-details="toggleScores"
      @update-locale="updateLocale"
      @open-legal="openLegal"
    />

    <LegalScreen
      v-else-if="viewMode === 'legal'"
      :kind="legalKind"
      :t="translate"
      @back="viewMode = 'settings'"
    />

    <DetailSheet
      v-if="detailCandidate"
      :candidate="detailCandidate"
      :saved="isSaved(detailCandidate)"
      :rows="scoreRows(detailCandidate)"
      :structure-label="structureLabel(detailCandidate)"
      :reason="candidateReason(detailCandidate)"
      :show-score-details="showScoreDetails"
      :t="translate"
      @close="detailCandidate = null"
      @toggle-save="toggleSaved"
      @copy="copyText"
      @preview="previewCandidate"
    />
  </AppShell>
</template>

<script>
import {
  createInitialState,
  generateCandidates,
  isCandidateSaved,
  removeSavedCandidate,
  setActiveCandidate,
  setLocale,
  setResultCount,
  toggleReadableFilter,
  toggleSavedCandidate,
  toggleScoreDetails,
  toggleSeedMode
} from '../../src/app/appState.js'
import { LOCALES, getLocaleDirection, t } from '../../src/app/i18n.js'
import { candidateReason as formatCandidateReason, optionDescription, optionLabel, scoreRows, structureLabel, taglineFor } from '../../src/app/labels.js'
import { namingOptions } from '../../src/core/generator.js'
import AppShell from '../../src/components/AppShell.vue'
import DetailSheet from '../../src/components/DetailSheet.vue'
import GeneratorScreen from '../../src/components/GeneratorScreen.vue'
import LegalScreen from '../../src/components/LegalScreen.vue'
import PreviewScreen from '../../src/components/PreviewScreen.vue'
import SettingsScreen from '../../src/components/SettingsScreen.vue'
import WhiteboardScreen from '../../src/components/WhiteboardScreen.vue'
import '../../src/styles/app.css'

const STORAGE_KEY = 'vibename.saved'
const SETTINGS_KEY = 'vibename.settings'

export default {
  components: {
    AppShell,
    DetailSheet,
    GeneratorScreen,
    LegalScreen,
    PreviewScreen,
    SettingsScreen,
    WhiteboardScreen
  },
  data() {
    return {
      options: namingOptions,
      locales: LOCALES,
      legalKind: 'privacy',
      ...createInitialState()
    }
  },
  computed: {
    localeDirection() {
      return getLocaleDirection(this.locale)
    },
    localizedOptions() {
      return Object.fromEntries(
        Object.entries(this.options).map(([group, items]) => [
          group,
          items.map((item) => ({
            ...item,
            label: this.label(group, item.id),
            description: this.describeOption(group, item.id)
          }))
        ])
      )
    },
    sortedSaved() {
      return [...this.saved].sort((a, b) => b.score.total - a.score.total)
    }
  },
  mounted() {
    this.restoreSettings()
    this.restoreSaved()
  },
  methods: {
    handleGenerate() {
      this.isGenerating = true
      setTimeout(() => {
        Object.assign(this, generateCandidates(this.stateSnapshot()))
      }, 180)
    },
    toggleSaved(candidate) {
      Object.assign(this, toggleSavedCandidate(this.stateSnapshot(), candidate))
      this.persistSaved()
    },
    removeSaved(candidate) {
      Object.assign(this, removeSavedCandidate(this.stateSnapshot(), candidate))
      this.persistSaved()
    },
    isSaved(candidate) {
      return isCandidateSaved(this, candidate)
    },
    previewCandidate(candidate) {
      Object.assign(this, setActiveCandidate(this.stateSnapshot(), candidate))
    },
    copySaved() {
      this.copyText(this.saved.map((item) => item.name).join('\n'))
    },
    copyText(text) {
      if (!text) return
      if (typeof uni !== 'undefined' && uni.setClipboardData) {
        uni.setClipboardData({ data: text, showToast: false })
      } else if (navigator?.clipboard) {
        navigator.clipboard.writeText(text)
      }
    },
    clearLocalData() {
      this.saved = []
      this.persistSaved()
    },
    updateResultCount(count) {
      Object.assign(this, setResultCount(this.stateSnapshot(), count))
      this.persistSettings()
    },
    toggleSeed() {
      Object.assign(this, toggleSeedMode(this.stateSnapshot()))
      this.persistSettings()
    },
    toggleReadable() {
      Object.assign(this, toggleReadableFilter(this.stateSnapshot()))
      this.persistSettings()
    },
    toggleScores() {
      Object.assign(this, toggleScoreDetails(this.stateSnapshot()))
      this.persistSettings()
    },
    updateLocale(locale) {
      Object.assign(this, setLocale(this.stateSnapshot(), locale))
      this.persistSettings()
    },
    openLegal(kind) {
      this.legalKind = kind
      this.viewMode = 'legal'
    },
    persistSaved() {
      try {
        if (typeof uni !== 'undefined' && uni.setStorageSync) {
          uni.setStorageSync(STORAGE_KEY, this.saved)
        } else if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.saved))
        }
      } catch (error) {
        console.warn('Unable to persist saved names', error)
      }
    },
    restoreSaved() {
      try {
        const saved = typeof uni !== 'undefined' && uni.getStorageSync
          ? uni.getStorageSync(STORAGE_KEY)
          : JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        this.saved = Array.isArray(saved) ? saved : []
      } catch (error) {
        this.saved = []
      }
    },
    persistSettings() {
      const settings = {
        resultCount: this.resultCount,
        useSeed: this.useSeed,
        filterReadable: this.filterReadable,
        showScoreDetails: this.showScoreDetails,
        locale: this.locale
      }
      try {
        if (typeof uni !== 'undefined' && uni.setStorageSync) {
          uni.setStorageSync(SETTINGS_KEY, settings)
        } else if (typeof localStorage !== 'undefined') {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
        }
      } catch (error) {
        console.warn('Unable to persist settings', error)
      }
    },
    restoreSettings() {
      try {
        const settings = typeof uni !== 'undefined' && uni.getStorageSync
          ? uni.getStorageSync(SETTINGS_KEY)
          : JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
        if (settings && typeof settings === 'object') {
          const restored = createInitialState({
            ...this.stateSnapshot(),
            resultCount: settings.resultCount || this.resultCount,
            useSeed: settings.useSeed !== false,
            filterReadable: settings.filterReadable !== false,
            showScoreDetails: settings.showScoreDetails !== false
          })
          Object.assign(this, setLocale(restored, settings.locale || this.locale))
        }
      } catch (error) {
        this.resultCount = 8
        this.useSeed = true
        this.filterReadable = true
        this.showScoreDetails = true
        this.locale = 'en'
      }
    },
    label(group, id) {
      return optionLabel(this.options, group, id, this.translate)
    },
    describeOption(group, id) {
      return optionDescription(this.options, group, id, this.translate)
    },
    translate(key) {
      return t(this.locale, key)
    },
    stateSnapshot() {
      return {
        selectedStyle: this.selectedStyle,
        selectedIndustry: this.selectedIndustry,
        selectedLength: this.selectedLength,
        candidates: this.candidates,
        saved: this.saved,
        detailCandidate: this.detailCandidate,
        activeCandidate: this.activeCandidate,
        viewMode: this.viewMode,
        isGenerating: this.isGenerating,
        seedIndex: this.seedIndex,
        resultCount: this.resultCount,
        useSeed: this.useSeed,
        filterReadable: this.filterReadable,
        showScoreDetails: this.showScoreDetails,
        locale: this.locale
      }
    },
    taglineFor(candidate) {
      return taglineFor(candidate, this.translate)
    },
    structureLabel(candidate) {
      return structureLabel(candidate, this.translate)
    },
    scoreRows(candidate) {
      return scoreRows(candidate, this.translate)
    },
    candidateReason(candidate) {
      return formatCandidateReason(candidate, this.translate)
    }
  }
}
</script>
