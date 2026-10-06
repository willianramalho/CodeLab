<script setup>
import { computed } from 'vue'

const props = defineProps({
  challenge: { type: Object, required: true },
  // Em telas que já são do próprio autor (Perfil, Meus Itens), o autor some.
  showAuthor: { type: Boolean, default: true },
})

const extension = computed(() => {
  const name = props.challenge.sourceCode || ''
  const dot = name.lastIndexOf('.')
  return dot >= 0 ? name.slice(dot) : ''
})

const createdAt = computed(() =>
  new Date(props.challenge.createdAt).toLocaleDateString('pt-BR'),
)

const authorUsername = computed(() => props.challenge.author?.username)
</script>

<template>
  <!-- <article>, não <a>: o card tem vários alvos clicáveis (detalhe, autor,
       ações). Um <a> externo não pode conter botões nem outros links. -->
  <article class="challenge-card">
    <router-link :to="`/challenges/${challenge.id}`" class="challenge-card-cover">
      {{ extension || '</>' }}
    </router-link>
    <div class="p-3">
      <h2 class="h6 mb-1 text-truncate">
        <router-link :to="`/challenges/${challenge.id}`" class="challenge-card-title">{{ challenge.title }}</router-link>
      </h2>
      <p class="small text-muted mb-2">
        <template v-if="showAuthor && authorUsername">
          por <router-link :to="`/profile/${authorUsername}`">@{{ authorUsername }}</router-link> ·
        </template>
        {{ createdAt }}
      </p>
      <p class="small mb-0 text-muted">
        <i class="bi bi-eye"></i> {{ challenge.viewsCount }}
      </p>
      <div v-if="$slots.actions" class="d-flex gap-2 mt-3">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>
