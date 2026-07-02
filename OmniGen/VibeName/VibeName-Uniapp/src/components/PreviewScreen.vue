<template>
  <section class="screen" data-testid="preview-screen">
    <div class="subpage-header">
      <button class="icon-button" type="button" @click="$emit('back')">‹</button>
      <h1 class="section-title">{{ t('preview.title') }}</h1>
      <button class="icon-button" type="button" @click="$emit('copy', candidate.name)">⧉</button>
    </div>

    <span class="muted preview-lead">{{ t('preview.lead') }}</span>
    <article class="preview-card">
      <img class="preview-bg" src="/static/concept-preview-panel.png" alt="" />
      <div class="preview-content">
        <strong class="preview-nav">{{ candidate.name }}</strong>
        <strong class="preview-name">{{ candidate.name }}</strong>
        <span class="preview-tagline">{{ tagline }}</span>
        <div class="tag-row is-center">
          <span class="tag">{{ label('styles', candidate.style) }}</span>
          <span class="tag">{{ label('industries', candidate.industries[0]) }}</span>
        </div>
        <button class="preview-cta" type="button">{{ t('preview.cta') }}</button>
      </div>
    </article>

    <div class="settings-list">
      <div class="settings-row">
        <span>{{ t('preview.style') }}</span>
        <span class="muted">{{ label('styles', candidate.style) }}</span>
      </div>
      <div class="settings-row">
        <span>{{ t('preview.accent') }}</span>
        <span class="muted">#004BFF</span>
      </div>
      <div class="settings-row">
        <span>{{ t('preview.tagline') }}</span>
        <span class="muted">{{ tagline }}</span>
      </div>
    </div>
    <span class="disclaimer">{{ t('common.creativeOnly') }}</span>
  </section>
</template>

<script>
export default {
  props: {
    candidate: { type: Object, required: true },
    tagline: { type: String, required: true },
    label: { type: Function, required: true },
    t: { type: Function, required: true }
  },
  emits: ['back', 'copy']
}
</script>
