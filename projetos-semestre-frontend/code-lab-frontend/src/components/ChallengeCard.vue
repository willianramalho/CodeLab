<script setup>
import { computed } from 'vue'

const props = defineProps({
  challenge: { type: Object, required: true },
})

const extension = computed(() => {
  const name = props.challenge.sourceCode || ''
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot) : ''
})

const createdAt = computed(() =>
  new Date(props.challenge.createdAt).toLocaleDateString('pt-BR'),
)
</script>

<template>
  <router-link :to="`/challenges/${challenge.id}`" class="challenge-card">
    <div class="challenge-card-cover">{{ extension || '</>' }}</div>
    <div class="p-3">
      <h2 class="h6 mb-1 text-truncate">{{ challenge.title }}</h2>
      <p class="small text-muted mb-2">
        por @{{ challenge.author?.username ?? 'desconhecido' }} · {{ createdAt }}
      </p>
      <p class="small mb-0 text-muted">
        <i class="bi bi-eye"></i> {{ challenge.viewsCount }}
      </p>
    </div>
  </router-link>
</template>
