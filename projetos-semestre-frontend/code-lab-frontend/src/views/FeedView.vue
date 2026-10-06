<script setup>
import { onMounted, ref } from 'vue'
import { getFeed } from '../services/challengeService'
import ChallengeCard from '../components/ChallengeCard.vue'
import BaseButton from '../components/base/BaseButton.vue'

const PAGE_SIZE = 9

const items = ref([])
const page = ref(0)
const hasMore = ref(true)
const loading = ref(false)
const error = ref('')

async function loadMore() {
  if (loading.value) return
  loading.value = true
  error.value = ''

  try {
    const response = await getFeed({ page: page.value + 1, limit: PAGE_SIZE })
    items.value.push(...response.data.items)
    page.value = response.data.page
    hasMore.value = response.data.hasMore
  } catch (err) {
    error.value = err.message || 'Não foi possível carregar o feed.'
  } finally {
    loading.value = false
  }
}

onMounted(loadMore)
</script>

<template>
  <div class="p-4">
    <h1 class="h3 mb-4">Feed</h1>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <p v-if="!loading && !error && items.length === 0" class="text-muted">
      Nenhum desafio enviado ainda.
    </p>

    <div class="challenge-grid">
      <ChallengeCard v-for="challenge in items" :key="challenge.id" :challenge="challenge" />
    </div>

    <div class="text-center mt-4">
      <BaseButton v-if="hasMore && items.length > 0" :loading="loading" @click="loadMore">
        Carregar mais
      </BaseButton>
      <BaseButton v-else-if="error && items.length === 0" :loading="loading" @click="loadMore">
        Tentar novamente
      </BaseButton>
    </div>
  </div>
</template>
