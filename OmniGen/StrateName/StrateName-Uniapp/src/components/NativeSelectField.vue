<template>
  <view class="native-select-field" :class="className">
    <view class="native-dropdown" :class="{ 'is-open': isOpen }">
      <button
        class="native-dropdown-trigger"
        type="button"
        :aria-label="label"
        :aria-expanded="isOpen ? 'true' : 'false'"
        @click.stop="toggle"
      >
        <text class="select-label">{{ label }}</text>
        <text class="native-dropdown-value">{{ selectedLabel }}</text>
        <text class="select-chevron">⌄</text>
      </button>
      <view v-if="isOpen" class="native-dropdown-menu" role="listbox">
        <button
          v-for="option in options"
          :key="option.id"
          class="native-dropdown-option"
          :class="{ 'is-selected': option.id === selectedId }"
          type="button"
          :data-option-id="option.id"
          :aria-label="`${label}: ${option.label}`"
          @click.stop="choose(option.id)"
        >
          <text>{{ option.label }}</text>
          <text v-if="option.id === selectedId" class="native-dropdown-check">✓</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    modelValue: { type: String, required: true },
    options: { type: Array, required: true },
    className: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    selectedIndex() {
      const index = this.options.findIndex((option) => option.id === this.modelValue)
      return index >= 0 ? index : 0
    },
    selectedId() {
      return this.options[this.selectedIndex]?.id || ''
    },
    selectedLabel() {
      return this.options[this.selectedIndex]?.label || ''
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    choose(id) {
      const option = this.options.find((item) => item.id === id)
      if (option) this.$emit('update:modelValue', option.id)
      this.isOpen = false
    }
  }
}
</script>
