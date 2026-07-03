<template>
  <view class="screen">
    <view class="subpage-header">
      <text class="page-title">{{ ui.shortlist.title }}</text>
      <view class="header-actions">
        <button class="text-button" type="button" :disabled="!shortlist.length" @click="$emit('copy-all')">{{ ui.shortlist.copyAll }}</button>
        <button class="plain-icon danger" type="button" :disabled="!shortlist.length" :aria-label="ui.shortlist.clearAria" @click="$emit('clear')">{{ ui.shortlist.clear }}</button>
      </view>
    </view>
    <text class="subtle-center">{{ ui.shortlist.count(shortlist.length) }}</text>

    <view v-if="!shortlist.length" class="empty-state">
      <image class="empty-art" src="/static/brand/empty-letterhead.png" mode="aspectFit" />
      <text class="empty-title">{{ ui.shortlist.emptyTitle }}</text>
      <text class="empty-copy">{{ ui.shortlist.emptyCopy }}</text>
    </view>

    <view v-else class="shortlist-table">
      <view v-for="item in localizedShortlist" :key="item.id" class="shortlist-card">
        <button class="remove-cell" type="button" :aria-label="ui.shortlist.removeAria" @click="$emit('remove', item.raw)">×</button>
        <view class="shortlist-main" @click="$emit('proposal', item)">
          <text class="shortlist-name">{{ item.displayName }}</text>
          <view class="tag-row">
            <text v-for="tag in item.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</text>
          </view>
          <input
            class="note-input"
            :value="item.note"
            :placeholder="ui.shortlist.notePlaceholder"
            @click.stop
            @input="updateNote(item.id, $event)"
          />
        </view>
        <view class="shortlist-score">
          <text class="score-number small">{{ item.score }}</text>
          <text class="risk-chip">{{ item.riskLevel }}</text>
        </view>
      </view>

      <view class="decision-card">
        <text class="section-title small">{{ ui.shortlist.decisionSignals }}</text>
        <view v-for="signal in decisionSignals" :key="signal.label" class="decision-row">
          <text>{{ signal.label }}</text>
          <text>{{ signal.value }}</text>
        </view>
      </view>

      <view class="risk-notice">
        <text class="notice-icon">△</text>
        <text>{{ ui.shortlist.localNotice }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { localizeCandidate } from '../app/uiText.js'

export default {
  props: {
    shortlist: { type: Array, required: true },
    ui: { type: Object, required: true }
  },
  emits: ['copy-all', 'clear', 'remove', 'note', 'proposal'],
  computed: {
    localizedShortlist() {
      return this.shortlist.map((item) => ({ ...localizeCandidate(item, this.ui), raw: item }))
    },
    decisionSignals() {
      const sorted = [...this.localizedShortlist].sort((a, b) => b.score - a.score)
      const advisory = this.localizedShortlist.find((item) => /Partners|Advisory/i.test(item.displayName)) || sorted[0]
      const stable = [...this.localizedShortlist].sort((a, b) => b.breakdown.trustSignal - a.breakdown.trustSignal)[0]
      const industrial = this.localizedShortlist.find((item) => /Trading|Industries|Trust/i.test(item.displayName)) || sorted[0]
      return [
        { label: this.ui.shortlist.bestForAdvisory, value: advisory?.displayName || '-' },
        { label: this.ui.shortlist.mostStable, value: stable?.displayName || '-' },
        { label: this.ui.shortlist.bestForAssets, value: industrial?.displayName || '-' }
      ]
    }
  },
  methods: {
    updateNote(id, event) {
      this.$emit('note', { id, note: event.detail?.value ?? event.target?.value ?? '' })
    }
  }
}
</script>
