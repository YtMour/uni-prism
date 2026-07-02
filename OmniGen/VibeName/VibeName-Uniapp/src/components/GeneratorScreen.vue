<template>
  <section class="screen">
    <div class="section-header">
      <h1 class="section-title">{{ t('generator.title') }}</h1>
      <span class="muted">{{ t('generator.subtitle') }}</span>
    </div>

    <div data-testid="style-control">
      <SegmentedControl :model-value="selectedStyle" :options="options.styles" @update:model-value="$emit('update:selectedStyle', $event)" />
    </div>
    <span class="control-hint">{{ describeOption('styles', selectedStyle) }}</span>

    <div data-testid="industry-control">
      <FilterChips :model-value="selectedIndustry" :options="options.industries" @update:model-value="$emit('update:selectedIndustry', $event)" />
    </div>
    <span class="control-hint">{{ describeOption('industries', selectedIndustry) }}</span>

    <div class="field-block">
      <span class="field-label">{{ t('generator.length') }}</span>
      <div data-testid="length-control">
        <SegmentedControl
          :model-value="selectedLength"
          :options="options.lengths"
          subtle
          @update:model-value="$emit('update:selectedLength', $event)"
        />
      </div>
      <span class="control-hint">{{ describeOption('lengths', selectedLength) }}</span>
    </div>

    <button class="primary-button" type="button" :disabled="isGenerating" data-testid="generate-button" @click="$emit('generate')">
      <img v-if="isGenerating" class="button-spark" src="/static/generation-spark.png" alt="" />
      <span>{{ isGenerating ? t('generator.generating') : t('generator.generate') }}</span>
    </button>

    <div class="results-panel">
      <div v-if="candidates.length === 0" class="empty-state">
        <img src="/static/empty-candidates.png" alt="" />
        <strong class="empty-title">{{ t('generator.emptyTitle') }}</strong>
        <span class="muted">{{ t('generator.emptyBody') }}</span>
      </div>

      <CandidateCard
        v-for="candidate in candidates"
        :key="candidate.id"
        :candidate="candidate"
        :saved="isSaved(candidate)"
        :style-label="label('styles', candidate.style)"
        :industry-label="label('industries', candidate.industries[0])"
        :structure-label="structureLabel(candidate)"
        :reason="candidateReason(candidate)"
        :show-score="showScoreDetails"
        @open="$emit('open-detail', $event)"
        @toggle-save="$emit('toggle-save', $event)"
        @copy="$emit('copy', $event)"
      />
    </div>

    <button class="whiteboard-bar" type="button" data-testid="open-whiteboard" @click="$emit('open-whiteboard')">
      <span>
        <strong class="bar-title">{{ t('generator.whiteboard') }}</strong>
        <span class="caption">{{ savedCount }} {{ t('generator.savedCount') }}</span>
      </span>
      <span class="bar-arrow">›</span>
    </button>
  </section>
</template>

<script>
import CandidateCard from './CandidateCard.vue'
import FilterChips from './FilterChips.vue'
import SegmentedControl from './SegmentedControl.vue'

export default {
  components: { CandidateCard, FilterChips, SegmentedControl },
  props: {
    options: { type: Object, required: true },
    selectedStyle: { type: String, required: true },
    selectedIndustry: { type: String, required: true },
    selectedLength: { type: String, required: true },
    candidates: { type: Array, required: true },
    savedCount: { type: Number, required: true },
    isGenerating: { type: Boolean, default: false },
    showScoreDetails: { type: Boolean, default: true },
    isSaved: { type: Function, required: true },
    label: { type: Function, required: true },
    describeOption: { type: Function, required: true },
    structureLabel: { type: Function, required: true },
    candidateReason: { type: Function, required: true },
    t: { type: Function, required: true }
  },
  emits: [
    'update:selectedStyle',
    'update:selectedIndustry',
    'update:selectedLength',
    'generate',
    'open-detail',
    'toggle-save',
    'copy',
    'open-whiteboard'
  ]
}
</script>
