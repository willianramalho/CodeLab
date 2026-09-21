<script setup>
defineProps({
  variant: {
    type: String,
    default: 'brand',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'submit',
  },
})
</script>

<template>
  <button :type="type" class="btn" :class="`btn-${variant}`" :disabled="loading">
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    <slot />
  </button>
</template>
