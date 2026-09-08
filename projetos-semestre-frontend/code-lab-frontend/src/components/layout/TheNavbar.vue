<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar">
    <strong class="text-brand">Code-Lab</strong>
    <nav>
      <router-link to="/">Início</router-link>

      <template v-if="authStore.isAuthenticated">
        <span>Olá, {{ authStore.user?.username }}</span>
        <button type="button" class="btn btn-sm btn-brand" @click="handleLogout">Sair</button>
      </template>
      <template v-else>
        <router-link to="/login">Entrar</router-link>
        <router-link to="/register">Criar Conta</router-link>
      </template>
    </nav>
  </header>
</template>
