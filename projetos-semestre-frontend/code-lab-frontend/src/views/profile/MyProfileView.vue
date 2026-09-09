<script setup>
import { onMounted, reactive, ref } from 'vue'
import { getMyProfile, updateProfile } from '../../services/authService'
import { getProfilePhotoUrl } from '../../utils/media'

// Mesmo limite de config/constants.js (BIO_MAX) no back-end — cópia
// otimista só para dar feedback instantâneo, quem decide de verdade é a API.
const BIO_MAX = 255

const form = reactive({
  fullName: '',
  bio: '',
})

const errors = reactive({
  fullName: '',
  bio: '',
})

const currentPhotoUrl = ref('')
const previewUrl = ref('')
const selectedFile = ref(null)

const isLoading = ref(true)
const isSubmitting = ref(false)
const apiErrorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  try {
    const response = await getMyProfile()
    form.fullName = response.data.fullName || ''
    form.bio = response.data.bio || ''
    currentPhotoUrl.value = getProfilePhotoUrl(response.data.profilePicture)
  } catch (error) {
    apiErrorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})

function handlePhotoChange(event) {
  const file = event.target.files[0]
  if (!file) {
    return
  }

  // Só cria uma URL local apontando pro arquivo em memória — nenhuma
  // chamada de rede acontece aqui, o upload de verdade só ocorre no salvar.
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

function validate() {
  errors.fullName = ''
  errors.bio = ''

  if (!form.fullName.trim()) {
    errors.fullName = 'O nome completo é obrigatório.'
  }

  if (form.bio.length > BIO_MAX) {
    errors.bio = `A bio deve ter no máximo ${BIO_MAX} caracteres.`
  }

  return !errors.fullName && !errors.bio
}

async function handleSubmit() {
  apiErrorMessage.value = ''
  successMessage.value = ''

  if (!validate()) {
    return
  }

  isSubmitting.value = true

  const formData = new FormData()
  formData.append('fullName', form.fullName.trim())
  formData.append('bio', form.bio.trim())
  if (selectedFile.value) {
    formData.append('photo', selectedFile.value)
  }

  try {
    const response = await updateProfile(formData)
    currentPhotoUrl.value = getProfilePhotoUrl(response.data.profilePicture)
    previewUrl.value = ''
    selectedFile.value = null
    successMessage.value = response.message || 'Perfil atualizado com sucesso!'
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
      <div class="col-12 col-sm-9 col-md-6 col-lg-5">
        <div class="card shadow-sm mt-5">
          <div class="card-body p-4">
            <h1 class="h3 text-brand text-center mb-4">Meu Perfil</h1>

            <div v-if="isLoading" class="text-center text-muted py-4">Carregando...</div>

            <form v-else @submit.prevent="handleSubmit" novalidate>
              <div class="text-center mb-4">
                <img
                  :src="previewUrl || currentPhotoUrl"
                  alt="Foto de perfil"
                  class="rounded-circle border"
                  width="120"
                  height="120"
                  style="object-fit: cover"
                />
                <div class="mt-2">
                  <label for="photo" class="form-label d-block">Trocar foto</label>
                  <input
                    id="photo"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    class="form-control"
                    @change="handlePhotoChange"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label for="fullName" class="form-label">Nome completo</label>
                <input
                  id="fullName"
                  type="text"
                  class="form-control"
                  v-model="form.fullName"
                />
                <span v-if="errors.fullName" class="text-danger small">{{ errors.fullName }}</span>
              </div>

              <div class="mb-3">
                <label for="bio" class="form-label">Bio</label>
                <textarea
                  id="bio"
                  class="form-control"
                  rows="3"
                  v-model="form.bio"
                ></textarea>
                <span v-if="errors.bio" class="text-danger small">{{ errors.bio }}</span>
              </div>

              <div v-if="apiErrorMessage" class="alert alert-danger py-2" role="alert">
                {{ apiErrorMessage }}
              </div>
              <div v-if="successMessage" class="alert alert-success py-2" role="alert">
                {{ successMessage }}
              </div>

              <button type="submit" class="btn btn-brand w-100" :disabled="isSubmitting">
                {{ isSubmitting ? 'Salvando...' : 'Salvar alterações' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
