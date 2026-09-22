<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../../services/authService'
import FormCard from '../../components/base/FormCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'

const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
})

const isSubmitting = ref(false)
const apiErrorMessage = ref('')

function validate() {
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  if (!form.fullName.trim()) {
    errors.fullName = 'O nome completo é obrigatório.'
  }

  if (form.username.trim().length < 3 || form.username.trim().length > 20) {
    errors.username = 'O nome de usuário deve ter entre 3 e 20 caracteres.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (form.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.'
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'As senhas não coincidem.'
  }

  return Object.values(errors).every((message) => message === '')
}

async function handleSubmit() {
  apiErrorMessage.value = ''

  if (!validate()) {
    return
  }

  isSubmitting.value = true

  try {
    await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      fullName: form.fullName.trim(),
    })

    router.push({ name: 'login' })
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
      <div class="col-12 col-sm-8 col-md-6 col-lg-5">
        <FormCard title="Criar Conta">
          <form @submit.prevent="handleSubmit" novalidate>
            <BaseInput
              id="fullName"
              label="Nome completo"
              v-model="form.fullName"
              :error="errors.fullName"
            />

            <BaseInput
              id="username"
              label="Usuário"
              v-model="form.username"
              :error="errors.username"
            />

            <BaseInput
              id="email"
              type="email"
              label="E-mail"
              v-model="form.email"
              :error="errors.email"
            />

            <BaseInput
              id="password"
              type="password"
              label="Senha"
              v-model="form.password"
              :error="errors.password"
            />

            <BaseInput
              id="confirmPassword"
              type="password"
              label="Confirmar senha"
              v-model="form.confirmPassword"
              :error="errors.confirmPassword"
            />

            <div v-if="apiErrorMessage" class="alert alert-danger py-2" role="alert">
              {{ apiErrorMessage }}
            </div>

            <BaseButton class="w-100" :loading="isSubmitting">
              {{ isSubmitting ? 'Criando conta...' : 'Criar Minha Conta' }}
            </BaseButton>
          </form>

          <p class="text-center mt-3 mb-0">
            Já tem conta?
            <router-link to="/login">Entrar</router-link>
          </p>
        </FormCard>
      </div>
    </div>
  </div>
</template>
