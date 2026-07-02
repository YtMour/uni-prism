<template>
  <div class="chip-row">
    <button
      v-for="option in options"
      :key="option.id"
      class="chip"
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
    options: { type: Array, required: true }
  },
  emits: ['update:modelValue']
}
</script>
