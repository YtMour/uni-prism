<template>
  <view class="tabbar">
    <button
      v-for="item in items"
      :key="item.id"
      class="tab-button"
      :class="{ 'is-active': item.id === activeTab }"
      type="button"
      :data-tab-id="item.id"
      :aria-label="item.label"
      :aria-current="item.id === activeTab ? 'page' : null"
      @click="$emit('change', item.id)"
    >
      <view :class="['tab-icon', `tab-icon-${item.id}`]" aria-hidden="true">
        <text v-if="item.icon">{{ item.icon }}</text>
      </view>
      <text class="tab-label">{{ item.label }}</text>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    activeTab: { type: String, required: true },
    ui: { type: Object, required: true }
  },
  emits: ['change'],
  computed: {
    items() {
      return [
        { id: 'generate', label: this.ui.tabs.generate, icon: '✦' },
        { id: 'shortlist', label: this.ui.tabs.shortlist, icon: '' },
        { id: 'proposal', label: this.ui.tabs.proposal, icon: '▤' },
        { id: 'settings', label: this.ui.tabs.settings, icon: '⚙' }
      ]
    }
  }
}
</script>
