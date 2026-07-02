<template>
  <button class="candidate-card" type="button" data-testid="candidate-card" @click="$emit('open', candidate)">
    <div class="candidate-main">
      <div>
        <strong class="candidate-name">{{ candidate.name }}</strong>
        <span class="candidate-reason">{{ reason }}</span>
      </div>
      <span v-if="showScore" class="score-pill">{{ candidate.score.total }}</span>
    </div>
    <div class="card-footer">
      <div class="tag-row">
        <span class="tag is-neutral">{{ structureLabel }}</span>
        <span class="tag">{{ styleLabel }}</span>
        <span class="tag">{{ industryLabel }}</span>
      </div>
      <div class="card-actions">
        <button class="text-icon" type="button" @click.stop="$emit('toggle-save', candidate)">
          {{ saved ? '★' : '☆' }}
        </button>
        <button class="text-icon" type="button" @click.stop="$emit('copy', candidate.name)">⧉</button>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    candidate: { type: Object, required: true },
    saved: { type: Boolean, default: false },
    styleLabel: { type: String, required: true },
    industryLabel: { type: String, required: true },
    structureLabel: { type: String, required: true },
    reason: { type: String, required: true },
    showScore: { type: Boolean, default: true }
  },
  emits: ['open', 'toggle-save', 'copy']
}
</script>
