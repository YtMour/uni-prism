<template>
  <div class="segmented" :class="{ 'is-subtle': subtle }">
    <button
      v-for="option in options"
      :key="option.id"
      class="segment"
      :class="{ 'is-active': modelValue === option.id }"
      type="button"
      @click="$emit('update:modelValue', option.id)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { type: String, required: true },
    options: { type: Array, required: true },
    subtle: { type: Boolean, default: false }
  },
  emits: ['update:modelValue']
}
</script>
