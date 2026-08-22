<script setup>
import { ref, onMounted } from 'vue'
import { getApiStatus } from '../services/systemService'
import { search } from '../services/searchService'

const apiStatus = ref('verificando...')

onMounted(async () => {
  try {
    const response = await getApiStatus()
    apiStatus.value = response.data.status // "online"
  } catch (error) {
    apiStatus.value = 'offline'
    console.error('Erro ao consultar a API:', error.message)
  }

  search('a')
    .then((response) => {
      console.log('Busca OK:', response.data)
    })
    .catch((error) => {
      console.error('Erro na busca:', error.message)
    })
})
</script>

<template>
  <div class="landing">
    <h1>Bem-vindo à Code-Lab</h1>
    <p>Status da API: <strong>{{ apiStatus }}</strong></p>
  </div>
</template>
