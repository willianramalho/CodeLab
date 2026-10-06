<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getChallengeById } from '../services/challengeService'
import { getChallengeFileUrl } from '../utils/media'

const route = useRoute()

const challenge = ref(null)
const code = ref('')
const isOwner = ref(false) // Guardado para a Aula 09 (sem uso visual ainda).
const loading = ref(true)
const error = ref('')

async function load(id) {
  loading.value = true
  error.value = ''
  challenge.value = null
  code.value = ''

  try {
    const response = await getChallengeById(id)
    challenge.value = response.data
    isOwner.value = response.data.isOwner

    // Sempre o caminho estático /uploads, nunca uma rota protegida.
    const file = await fetch(getChallengeFileUrl(response.data.sourceCode))
    code.value = file.ok ? await file.text() : '(Não foi possível carregar o arquivo.)'
  } catch (err) {
    error.value = err.status === 404
      ? 'Desafio não encontrado.'
      : err.message || 'Não foi possível carregar o desafio.'
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, load, { immediate: true })
</script>

<template>
  <div class="p-4">
    <p v-if="loading" class="text-muted">Carregando...</p>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
      <router-link to="/feed" class="alert-link ms-2">Voltar ao feed</router-link>
    </div>

    <article v-else-if="challenge">
      <h1 class="h3">{{ challenge.title }}</h1>
      <p class="text-muted">
        por
        <router-link :to="`/profile/${challenge.author.username}`">@{{ challenge.author.username }}</router-link>
        · {{ new Date(challenge.createdAt).toLocaleDateString('pt-BR') }}
        · <i class="bi bi-eye"></i> {{ challenge.viewsCount }}
      </p>
      <p v-if="challenge.description">{{ challenge.description }}</p>

      <pre class="code-view">{{ code }}</pre>

      <a :href="getChallengeFileUrl(challenge.sourceCode)" download class="btn btn-brand mt-3">
        <i class="bi bi-download"></i> Baixar arquivo
      </a>
    </article>
  </div>
</template>
