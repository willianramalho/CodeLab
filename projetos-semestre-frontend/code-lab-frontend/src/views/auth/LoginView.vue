<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { getMyProfile } from '../../services/authService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const apiErrorMessage = ref('')

async function handleSubmit() {
  apiErrorMessage.value = ''
  isSubmitting.value = true

  try {
    await authStore.login({ email: form.email.trim(), password: form.password })

    // Chamada extra só para provar, de ponta a ponta, que o interceptor de
    // requisição está anexando o token e que a rota protegida aceita.
    const profile = await getMyProfile()
    console.log('Perfil autenticado OK:', profile.data)

    const redirectTo = route.query.redirect || { name: 'feed' }
    router.push(redirectTo)
  } catch (error) {
    apiErrorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-8 col-md-5 col-lg-4">
        <div class="card shadow-sm mt-5">
          <div class="card-body p-4">
            <h1 class="h3 text-brand text-center mb-4">Code-Lab</h1>
            <p class="text-center text-muted mb-4">Entre na sua conta</p>

            <form @submit.prevent="handleSubmit" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">E-mail</label>
                <input
                  id="email"
                  type="email"
                  class="form-control"
                  v-model="form.email"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Senha</label>
                <input
                  id="password"
                  type="password"
                  class="form-control"
                  v-model="form.password"
                  required
                />
              </div>

              <div v-if="apiErrorMessage" class="alert alert-danger py-2" role="alert">
                {{ apiErrorMessage }}
              </div>

              <button type="submit" class="btn btn-brand w-100" :disabled="isSubmitting">
                {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
              </button>
            </form>

            <p class="text-center mt-3 mb-0">
              Não tem conta?
              <router-link to="/register">Criar conta</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
