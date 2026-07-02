<template>
  <section class="screen" data-testid="whiteboard-screen">
    <div class="subpage-header">
      <button class="icon-button" type="button" @click="$emit('back')">‹</button>
      <div>
        <h1 class="section-title">{{ t('whiteboard.title') }}</h1>
        <span class="muted">{{ saved.length }} {{ t('generator.savedCount') }}</span>
      </div>
      <button class="small-button" type="button" @click="$emit('copy-all')">{{ t('whiteboard.copyAll') }}</button>
    </div>

    <div v-if="saved.length === 0" class="empty-state is-tall">
      <img src="/static/empty-whiteboard.png" alt="" />
      <strong class="empty-title">{{ t('whiteboard.emptyTitle') }}</strong>
      <span class="muted">{{ t('whiteboard.emptyBody') }}</span>
    </div>

    <article v-for="candidate in saved" :key="candidate.id" class="board-row">
      <div>
        <strong class="candidate-name is-compact">{{ candidate.name }}</strong>
        <span class="candidate-reason">{{ label('industries', candidate.industries[0]) }} · {{ candidate.score.total }}</span>
      </div>
      <div class="card-actions">
        <button class="text-icon" type="button" @click="$emit('preview', candidate)">{{ t('detail.preview') }}</button>
        <button class="text-icon is-danger" type="button" @click="$emit('remove', candidate)">{{ t('whiteboard.remove') }}</button>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  props: {
    saved: { type: Array, required: true },
    label: { type: Function, required: true },
    t: { type: Function, required: true }
  },
  emits: ['back', 'copy-all', 'preview', 'remove']
}
</script>
