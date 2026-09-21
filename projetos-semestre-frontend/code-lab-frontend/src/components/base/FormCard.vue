<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="card shadow-sm border-top-0 mt-5" style="border-top: 3px solid var(--brand-color)">
    <div class="card-body p-4">
      <slot name="title">
        <h1 v-if="title" class="h3 text-brand text-center mb-4">{{ title }}</h1>
      </slot>
      <slot />
    </div>
  </div>
</template>
