<template>
  <div class="sheet-backdrop" @click="$emit('close')">
    <section class="detail-sheet" data-testid="detail-sheet" @click.stop>
      <div class="sheet-handle" />
      <div class="candidate-main">
        <strong class="detail-name">{{ candidate.name }}</strong>
        <span v-if="showScoreDetails" class="score-pill is-large">{{ candidate.score.total }}</span>
      </div>
      <span class="candidate-reason">{{ reason }}</span>

      <div class="structure">
        <span class="field-label">{{ t('detail.structure') }} · {{ structureLabel }}</span>
        <span class="formula-line">{{ candidate.formula }}</span>
        <div class="tag-row">
          <span v-for="part in candidate.sourceParts" :key="part.value" class="tag">
            {{ part.value }} · {{ part.type }}
          </span>
        </div>
      </div>

      <div v-if="showScoreDetails" class="score-list">
        <div v-for="item in rows" :key="item.label" class="score-row">
          <span>{{ item.label }}</span>
          <span class="score-track">
            <span class="score-fill" :style="{ width: item.value + '%' }" />
          </span>
          <strong class="score-value">{{ item.value }}</strong>
        </div>
      </div>

      <div class="sheet-actions">
        <button class="secondary-button" type="button" data-testid="detail-save" @click="$emit('toggle-save', candidate)">
          {{ saved ? t('candidate.saved') : t('candidate.save') }}
        </button>
        <button class="secondary-button" type="button" @click="$emit('copy', candidate.name)">{{ t('candidate.copy') }}</button>
        <button class="primary-button is-inline" type="button" data-testid="detail-preview" @click="$emit('preview', candidate)">{{ t('detail.preview') }}</button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    candidate: { type: Object, required: true },
    saved: { type: Boolean, default: false },
    rows: { type: Array, required: true },
    structureLabel: { type: String, required: true },
    reason: { type: String, required: true },
    showScoreDetails: { type: Boolean, default: true },
    t: { type: Function, required: true }
  },
  emits: ['close', 'toggle-save', 'copy', 'preview']
}
</script>
