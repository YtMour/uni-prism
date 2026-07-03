<template>
  <view class="app-shell">
    <view class="app-frame">
      <view class="topbar">
        <button class="plain-icon" type="button" aria-label="Go to generator" @click="state.activeTab = 'generate'">↻</button>
        <view class="brand-title-wrap">
          <image class="brand-mark" src="/static/brand/brand-glyph.png" mode="aspectFit" />
          <text class="brand-title">StrateName</text>
        </view>
        <button class="plain-icon" type="button" aria-label="Open settings" @click="state.activeTab = 'settings'">⚙</button>
      </view>

      <GeneratorScreen
        v-if="state.activeTab === 'generate'"
        :options="state.options"
        :naming-options="localizedNamingOptions"
        :candidates="state.candidates"
        :shortlist-ids="shortlistIds"
        :ui="uiText"
        @update-option="updateOption"
        @generate="generate"
        @open-detail="detailCandidate = $event"
        @copy="copyText"
        @toggle-save="toggleSave"
      />
      <ShortlistScreen
        v-else-if="state.activeTab === 'shortlist'"
        :shortlist="state.shortlist"
        :ui="uiText"
        @copy-all="copyShortlist"
        @clear="confirmClearShortlist"
        @remove="toggleSave"
        @note="updateNote"
        @proposal="openProposal"
      />
      <ProposalScreen
        v-else-if="state.activeTab === 'proposal'"
        :candidate="proposalCandidate"
        :candidates="candidatePool"
        :active-template="activeTemplate"
        :tagline="tagline"
        :ui="uiText"
        @select="selectProposalById"
        @template="activeTemplate = $event"
        @tagline="updateTagline"
        @copy="copyProposal"
        @save="toggleSave"
      />
      <LegalDocumentScreen
        v-else-if="state.activeTab === 'privacy' || state.activeTab === 'disclaimer'"
        :document="legalDocument"
        :locale="state.settings.legalLocale"
        :ui="uiText"
        @back="goTo('settings')"
      />
      <SettingsScreen
        v-else
        :options="state.options"
        :settings="state.settings"
        :naming-options="localizedNamingOptions"
        :legal-locales="legalLocales"
        :ui="uiText"
        @update-option="updateOption"
        @update-setting="updateSetting"
        @open-legal="openLegal"
        @clear-data="confirmClearAll"
      />

      <DetailSheet
        v-if="detailCandidate"
        :candidate="detailCandidate"
        :saved="shortlistIds.includes(detailCandidate.id)"
        :ui="uiText"
        @close="detailCandidate = null"
        @copy="copyText"
        @toggle-save="toggleSave"
        @proposal="openProposal"
      />

      <TabBar :active-tab="state.activeTab" :ui="uiText" @change="state.activeTab = $event" />
    </view>
  </view>
</template>

<script>
import { createInitialState, getProposalCandidate, selectProposalCandidate, toggleShortlist, updateShortlistNote } from '../app/appState.js'
import { getUiText, localizeCandidate, localizeNamingOptions } from '../app/uiText.js'
import { generateNames, namingOptions } from '../core/generator.js'
import { getLegalDocument, LEGAL_LOCALES } from '../data/legalContent.js'
import DetailSheet from './DetailSheet.vue'
import GeneratorScreen from './GeneratorScreen.vue'
import LegalDocumentScreen from './LegalDocumentScreen.vue'
import ProposalScreen from './ProposalScreen.vue'
import SettingsScreen from './SettingsScreen.vue'
import ShortlistScreen from './ShortlistScreen.vue'
import TabBar from './TabBar.vue'

const STORAGE_KEY = 'stratename.state.v1'
const DEFAULT_TAGLINE = 'Strategic advisory for long-term enterprise growth.'

export default {
  components: {
    DetailSheet,
    GeneratorScreen,
    LegalDocumentScreen,
    ProposalScreen,
    SettingsScreen,
    ShortlistScreen,
    TabBar
  },
  data() {
    return {
      state: createInitialState(),
      namingOptions,
      legalLocales: LEGAL_LOCALES,
      detailCandidate: null,
      activeTemplate: 'letterhead',
      tagline: DEFAULT_TAGLINE
    }
  },
  computed: {
    shortlistIds() {
      return this.state.shortlist.map((candidate) => candidate.id)
    },
    candidatePool() {
      const map = new Map()
      for (const candidate of this.state.candidates) map.set(candidate.id, candidate)
      for (const candidate of this.state.shortlist) map.set(candidate.id, candidate)
      return [...map.values()]
    },
    proposalCandidate() {
      return getProposalCandidate(this.state)
    },
    legalDocument() {
      return getLegalDocument(this.state.activeTab, this.state.settings.legalLocale)
    },
    uiText() {
      return getUiText(this.state.settings.legalLocale)
    },
    localizedNamingOptions() {
      return localizeNamingOptions(this.namingOptions, this.uiText)
    }
  },
  mounted() {
    this.restore()
  },
  methods: {
    generate() {
      const options = {
        ...this.state.options,
        count: this.state.settings.resultCount,
        strictness: this.state.settings.filterHighRisk ? 'standard' : 'loose'
      }
      this.state.candidates = generateNames(options)
      if (!this.state.proposalCandidateId && this.state.candidates[0]) {
        this.state.proposalCandidateId = this.state.candidates[0].id
      }
      this.persist()
    },
    updateOption({ key, value }) {
      this.state.options = { ...this.state.options, [key]: value }
      this.persist()
    },
    updateSetting({ key, value }) {
      this.state.settings = { ...this.state.settings, [key]: value }
      this.persist()
    },
    goTo(tab) {
      this.state.activeTab = tab
      this.persist()
    },
    openLegal(type) {
      this.goTo(type === 'disclaimer' ? 'disclaimer' : 'privacy')
    },
    toggleSave(candidate) {
      this.state = toggleShortlist(this.state, candidate)
      this.persist()
    },
    updateNote({ id, note }) {
      this.state = updateShortlistNote(this.state, id, note)
      this.persist()
    },
    openProposal(candidate) {
      this.state = selectProposalCandidate(this.state, candidate.id)
      this.state.activeTab = 'proposal'
      this.detailCandidate = null
      this.persist()
    },
    selectProposalById(id) {
      this.state = selectProposalCandidate(this.state, id)
      this.persist()
    },
    updateTagline(value) {
      this.tagline = value
      this.persist()
    },
    copyShortlist() {
      const text = this.state.shortlist.map((candidate) => {
        const localized = localizeCandidate(candidate, this.uiText)
        const note = candidate.note ? `\n${this.uiText.shortlist.notePlaceholder}: ${candidate.note}` : ''
        return `${localized.displayName} · ${localized.score}/100 · ${localized.riskLevel}${note}`
      }).join('\n\n')
      this.copyText(text)
    },
    copyProposal() {
      const candidate = localizeCandidate(this.proposalCandidate, this.uiText)
      const line = !this.tagline || this.tagline === DEFAULT_TAGLINE ? this.uiText.proposal.defaultTagline : this.tagline
      this.copyText([
        candidate.displayName,
        `${candidate.industryLabel} | ${candidate.styleLabel} | ${this.uiText.proposal.score} ${candidate.score}/100`,
        line,
        candidate.rationale.join(' '),
        candidate.disclaimer
      ].join('\n'))
    },
    copyText(text) {
      if (!text) return
      if (typeof uni !== 'undefined' && uni.setClipboardData) {
        uni.setClipboardData({ data: text, showToast: false })
        return
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(text)
      }
    },
    confirmClearShortlist() {
      this.confirm('Clear shortlist?', () => {
        this.state.shortlist = []
        this.persist()
      })
    },
    confirmClearAll() {
      this.confirm('Clear all local StrateName data?', () => {
        this.state = createInitialState()
        this.detailCandidate = null
        this.activeTemplate = 'letterhead'
        this.tagline = DEFAULT_TAGLINE
        this.persist()
      })
    },
    confirm(content, onConfirm) {
      if (typeof uni !== 'undefined' && uni.showModal) {
        uni.showModal({
          title: 'Confirm',
          content,
          success: (result) => {
            if (result.confirm) onConfirm()
          }
        })
        return
      }
      if (typeof window === 'undefined' || window.confirm(content)) onConfirm()
    },
    persist() {
      const payload = {
        state: {
          options: this.state.options,
          candidates: this.state.candidates,
          shortlist: this.state.shortlist,
          settings: this.state.settings,
          proposalCandidateId: this.state.proposalCandidateId,
          activeTab: this.state.activeTab
        },
        activeTemplate: this.activeTemplate,
        tagline: this.tagline
      }
      try {
        if (typeof uni !== 'undefined' && uni.setStorageSync) {
          uni.setStorageSync(STORAGE_KEY, payload)
        } else if (typeof localStorage !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        }
      } catch (error) {
        console.warn('Unable to persist StrateName state', error)
      }
    },
    restore() {
      try {
        const payload = typeof uni !== 'undefined' && uni.getStorageSync
          ? uni.getStorageSync(STORAGE_KEY)
          : JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
        if (!payload?.state) return
        this.state = createInitialState(payload.state)
        this.activeTemplate = payload.activeTemplate || this.activeTemplate
        this.tagline = payload.tagline || this.tagline
      } catch (error) {
        this.state = createInitialState()
      }
    }
  }
}
</script>
