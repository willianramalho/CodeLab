<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPublicProfile } from '../../services/authService'
import { getProfilePhotoUrl } from '../../utils/media'
import { useAuth } from '../../composables/useAuth'
import ChallengeCard from '../../components/ChallengeCard.vue'

const route = useRoute()
const { isAuthenticated } = useAuth()

const profile = ref(null)
const loading = ref(true)
const error = ref('')

async function load(username) {
  loading.value = true
  error.value = ''
  profile.value = null

  try {
    const response = await getPublicProfile(username)
    profile.value = response.data
  } catch (err) {
    error.value = err.status === 404
      ? 'Usuário não encontrado.'
      : err.message || 'Não foi possível carregar o perfil.'
  } finally {
    loading.value = false
  }
}

// O mesmo componente é reaproveitado ao clicar no autor de outro card:
// observar o parâmetro faz a tela trocar sem recarregar a página.
watch(() => route.params.username, load, { immediate: true })
</script>

<template>
  <div class="container py-4">
    <p v-if="loading" class="text-muted">Carregando...</p>

    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <template v-else-if="profile">
      <div class="d-flex align-items-center gap-3 mb-4">
        <img
          :src="getProfilePhotoUrl(profile.profilePicture)"
          alt="Foto de perfil"
          class="rounded-circle border"
          width="96"
          height="96"
          style="object-fit: cover"
        />
        <div class="flex-grow-1">
          <h1 class="h4 mb-0">{{ profile.fullName }}</h1>
          <p class="text-muted mb-1">@{{ profile.username }}</p>
          <p v-if="profile.bio" class="mb-1">{{ profile.bio }}</p>
          <p class="small text-muted mb-0">
            {{ profile.challengesCount }} desafios · {{ profile.followersCount }} seguidores · {{ profile.followingCount }} seguindo
          </p>
        </div>

        <router-link v-if="profile.isOwner" :to="{ name: 'my-profile' }" class="btn btn-outline-secondary">
          Editar Perfil
        </router-link>
        <!-- "Seguir" ainda não faz nada (chega em aula futura). -->
        <button v-else-if="isAuthenticated" type="button" class="btn btn-brand">Seguir</button>
      </div>

      <p v-if="profile.challenges.length === 0" class="text-muted">Nenhum desafio enviado ainda.</p>

      <div class="challenge-grid">
        <ChallengeCard v-for="challenge in profile.challenges" :key="challenge.id" :challenge="challenge" />
      </div>
    </template>
  </div>
</template>
