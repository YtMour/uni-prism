<template>
  <div class="app-shell" :dir="localeDirection">
    <main class="app-frame">
      <header class="topbar">
        <div class="brand">
          <img class="brand-mark" src="/static/brand-glyph.png" alt="" />
          <div>
            <strong class="brand-title">VibeName</strong>
            <span class="brand-subtitle">{{ t('app.subtitle') }}</span>
          </div>
        </div>
        <button class="icon-button" type="button" :aria-label="t('nav.settings')" data-testid="settings-button" @click="$emit('open-settings')">☰</button>
      </header>
      <slot />
    </main>
  </div>
</template>

<script>
export default {
  props: {
    t: { type: Function, required: true },
    localeDirection: { type: String, default: 'ltr' }
  },
  emits: ['open-settings']
}
</script>
