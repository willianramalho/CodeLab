<script setup>
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  // Enquanto uma ação está em andamento, o modal não pode ser fechado.
  busy: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

function close() {
  if (!props.busy) {
    emit('update:modelValue', false)
  }
}

function onKeydown(event) {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- Teleport: o modal sai do card/lista e vai para o <body>, para não herdar
       overflow, transform nem o clique de um <a> ancestral. -->
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="close">
      <div class="modal-box" role="dialog" aria-modal="true" :aria-label="title" @click.stop>
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h2 class="h5 mb-0">{{ title }}</h2>
          <button type="button" class="btn-close" aria-label="Fechar" :disabled="busy" @click="close"></button>
        </div>
        <slot />
        <div class="d-flex justify-content-end gap-2 mt-4">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
