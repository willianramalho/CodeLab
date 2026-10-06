<script setup>
import { onMounted, ref } from 'vue'
import { getMyChallenges, deleteChallenge } from '../services/challengeService'
import ChallengeCard from '../components/ChallengeCard.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseButton from '../components/base/BaseButton.vue'

const challenges = ref([])
const loading = ref(true)
const error = ref('')

const modalOpen = ref(false)
const challengeToDelete = ref(null)
const busy = ref(false)
const deleteError = ref('')

onMounted(async () => {
  try {
    const response = await getMyChallenges()
    challenges.value = response.data
  } catch (err) {
    error.value = err.message || 'Não foi possível carregar seus desafios.'
  } finally {
    loading.value = false
  }
})

function askDelete(challenge) {
  challengeToDelete.value = challenge
  deleteError.value = ''
  modalOpen.value = true
}

async function confirmDelete() {
  busy.value = true
  deleteError.value = ''

  try {
    await deleteChallenge(challengeToDelete.value.id)
    // Remoção local: o item some sem recarregar nem refazer a consulta.
    challenges.value = challenges.value.filter((c) => c.id !== challengeToDelete.value.id)
    modalOpen.value = false
  } catch (err) {
    deleteError.value = err.message || 'Não foi possível excluir o desafio.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-4">Meus Itens</h1>

    <p v-if="loading" class="text-muted">Carregando...</p>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <p v-else-if="challenges.length === 0" class="text-muted">
      Você ainda não enviou nenhum desafio.
      <router-link :to="{ name: 'challenge-upload' }">Enviar o primeiro</router-link>
    </p>

    <div v-else class="challenge-grid">
      <ChallengeCard v-for="challenge in challenges" :key="challenge.id" :challenge="challenge" :show-author="false">
        <template #actions>
          <router-link :to="{ name: 'challenge-edit', params: { id: challenge.id } }" class="btn btn-sm btn-outline-secondary">
            <i class="bi bi-pencil"></i> Editar
          </router-link>
          <button type="button" class="btn btn-sm btn-outline-danger" @click="askDelete(challenge)">
            <i class="bi bi-trash"></i> Excluir
          </button>
        </template>
      </ChallengeCard>
    </div>

    <!-- Um único modal, fora do v-for e fora de qualquer card. -->
    <BaseModal v-model="modalOpen" title="Excluir desafio" :busy="busy">
      <p class="mb-0">
        Tem certeza que deseja excluir <strong>{{ challengeToDelete?.title }}</strong>? Essa ação não pode ser desfeita.
      </p>
      <div v-if="deleteError" class="alert alert-danger py-2 mt-3 mb-0" role="alert">{{ deleteError }}</div>
      <template #footer>
        <button type="button" class="btn btn-outline-secondary" :disabled="busy" @click="modalOpen = false">Cancelar</button>
        <BaseButton type="button" variant="danger" :loading="busy" @click="confirmDelete">Excluir</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>
