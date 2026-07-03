<template>
  <view class="candidate-card" @click="$emit('open', candidate)">
    <view class="candidate-main">
      <view class="candidate-copy">
        <text class="candidate-name">{{ candidate.displayName }}</text>
        <view class="tag-row">
            <text v-for="tag in viewCandidate.tags" :key="tag" class="tag">{{ tag }}</text>
        </view>
      </view>
      <text class="score-number">{{ candidate.score }}</text>
    </view>
    <view class="hairline"></view>
    <text class="candidate-rationale">{{ shortReason }}</text>
    <view class="card-actions">
      <button class="icon-action" type="button" :aria-label="ui.candidate.copyCandidate" @click.stop="$emit('copy', candidate.displayName)">⧉</button>
      <button class="icon-action" type="button" :aria-label="ui.candidate.saveCandidate" @click.stop="$emit('toggle-save', candidate)">
        {{ saved ? '◆' : '◇' }}
      </button>
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
  emits: ['open', 'copy', 'toggle-save'],
  computed: {
    viewCandidate() {
      return localizeCandidate(this.candidate, this.ui)
    },
    shortReason() {
      return this.viewCandidate.rationale.slice(0, 2).join(' ')
    }
  }
}
</script>
