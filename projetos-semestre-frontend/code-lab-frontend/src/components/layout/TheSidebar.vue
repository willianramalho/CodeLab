<script setup>
import { useAuth } from '../../composables/useAuth'

const { isAuthenticated } = useAuth()
</script>

<template>
  <aside v-if="isAuthenticated" class="sidebar">
    <nav class="nav flex-column list-group">
      <router-link to="/feed" class="list-group-item list-group-item-action">
        <i class="bi bi-house-door me-2"></i>Feed
      </router-link>
      <router-link to="/search" class="list-group-item list-group-item-action">
        <i class="bi bi-search me-2"></i>Buscar
      </router-link>
      <router-link to="/my-challenges" class="list-group-item list-group-item-action">
        <i class="bi bi-trophy me-2"></i>Meus Desafios
      </router-link>
      <router-link to="/notifications" class="list-group-item list-group-item-action">
        <i class="bi bi-bell me-2"></i>Notificações
      </router-link>
    </nav>
  </aside>
</template>
