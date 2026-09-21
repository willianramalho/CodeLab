<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const router = useRouter()
const { user, isAuthenticated, logout } = useAuth()

async function handleLogout() {
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
          <router-link :to="{ name: 'my-profile' }" class="nav-link text-white">Meu Perfil</router-link>
          <span class="text-white">Olá, {{ user?.username }}</span>
          <button type="button" class="btn btn-sm btn-light" @click="handleLogout">Sair</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link text-white">Entrar</router-link>
          <router-link to="/register" class="nav-link text-white">Criar Conta</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>
