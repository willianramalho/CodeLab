<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { getMyProfile } from '../../services/authService'
import FormCard from '../../components/base/FormCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const { login } = useAuth()

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
    await login({ email: form.email.trim(), password: form.password })

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
        <FormCard title="Code-Lab">
          <p class="text-center text-muted mb-4">Entre na sua conta</p>

          <form @submit.prevent="handleSubmit" novalidate>
            <BaseInput id="email" type="email" label="E-mail" v-model="form.email" />

            <BaseInput id="password" type="password" label="Senha" v-model="form.password" />

            <div v-if="apiErrorMessage" class="alert alert-danger py-2" role="alert">
              {{ apiErrorMessage }}
            </div>

            <BaseButton class="w-100" :loading="isSubmitting">
              {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
            </BaseButton>
          </form>

          <p class="text-center mt-3 mb-0">
            Não tem conta?
            <router-link to="/register">Criar conta</router-link>
          </p>
        </FormCard>
      </div>
    </div>
  </div>
</template>
