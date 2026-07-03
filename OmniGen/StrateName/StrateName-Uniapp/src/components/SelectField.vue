<template>
  <view class="select-field">
    <button class="select-trigger" type="button" @click="open = !open">
      <text class="select-symbol">{{ icon }}</text>
      <view class="select-copy">
        <text class="select-label">{{ label }}</text>
        <text class="select-value">{{ selectedLabel }}</text>
      </view>
      <text class="select-chevron">{{ open ? '⌃' : '⌄' }}</text>
    </button>
    <view v-if="open" class="select-options">
      <button
        v-for="option in options"
        :key="option.id"
        class="select-option"
        :class="{ 'is-active': option.id === modelValue }"
        type="button"
        @click="select(option.id)"
      >
        <text class="option-label">{{ option.label }}</text>
        <text v-if="option.description" class="option-description">{{ option.description }}</text>
      </button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    icon: { type: String, default: '◇' },
    label: { type: String, required: true },
    modelValue: { type: String, required: true },
    options: { type: Array, required: true }
  },
  emits: ['update:modelValue'],
  data() {
    return { open: false }
  },
  computed: {
    selectedLabel() {
      const selected = this.options.find((option) => option.id === this.modelValue)
      return selected ? selected.label : 'Select'
    }
  },
  methods: {
    select(id) {
      this.$emit('update:modelValue', id)
      this.open = false
    }
  }
}
</script>
