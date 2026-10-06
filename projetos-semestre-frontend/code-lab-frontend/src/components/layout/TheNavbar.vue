<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useClickOutside } from '../../composables/useClickOutside'
import { getProfilePhotoUrl } from '../../utils/media'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

const menuOpen = ref(false)
const menuRoot = ref(null)

function closeMenu() {
  menuOpen.value = false
}

useClickOutside(menuRoot, closeMenu)

async function handleLogout() {
  closeMenu()
  await logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar navbar-expand-lg bg-brand">
    <div class="container">
      <router-link to="/" class="navbar-brand text-white fw-bold">Code-Lab</router-link>

      <nav class="navbar-nav flex-row gap-3 ms-auto align-items-center">
        <router-link to="/" class="nav-link text-white">Início</router-link>

        <template v-if="isAuthenticated">
          <router-link :to="{ name: 'challenge-upload' }" class="nav-link text-white">
            <i class="bi bi-cloud-arrow-up me-1"></i>Enviar Desafio
          </router-link>

          <div ref="menuRoot" class="avatar-menu" @keydown.esc="closeMenu">
            <button
              type="button"
              class="btn p-0 border-0 d-flex align-items-center gap-2 text-white"
              aria-haspopup="menu"
              :aria-expanded="menuOpen"
              @click="menuOpen = !menuOpen"
            >
              <img
                :src="getProfilePhotoUrl(user?.profilePicture)"
                alt="Menu do usuário"
                class="rounded-circle border border-light"
                width="36"
                height="36"
                style="object-fit: cover"
              />
              <span>{{ user?.username }}</span>
            </button>

            <div v-if="menuOpen" class="avatar-menu-list" role="menu" @click="closeMenu">
              <router-link :to="{ name: 'my-profile' }" class="dropdown-item" role="menuitem">Editar Perfil</router-link>
              <router-link
                :to="{ name: 'public-profile', params: { username: user?.username } }"
                class="dropdown-item"
                role="menuitem"
              >Ver Perfil</router-link>
              <router-link :to="{ name: 'my-challenges' }" class="dropdown-item" role="menuitem">Meus Itens</router-link>
              <button type="button" class="dropdown-item" role="menuitem" @click="handleLogout">Sair</button>
            </div>
          </div>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link text-white">Entrar</router-link>
          <router-link to="/register" class="nav-link text-white">Criar Conta</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>
