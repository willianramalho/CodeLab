<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  id: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: '',
  },
})

const model = defineModel({ type: [String, Number], default: '' })
</script>

<template>
  <div class="mb-3">
    <label v-if="label" :for="id" class="form-label">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      class="form-control"
      :class="{ 'is-invalid': error }"
      v-model="model"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>
