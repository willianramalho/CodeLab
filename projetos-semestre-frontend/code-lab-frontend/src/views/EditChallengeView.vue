<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getChallengeForEdit, updateChallenge } from '../services/challengeService'
import FormCard from '../components/base/FormCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'

// Mesmas regras de config/constants.js no back-end (cópia otimista).
const TITLE_MAX = 100
const DESCRIPTION_MAX = 500
const CHALLENGE_MAX_SIZE = 2 * 1024 * 1024
const CHALLENGE_EXTENSIONS = ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.txt']

const route = useRoute()

const form = reactive({ title: '', description: '' })
const errors = reactive({ title: '', description: '', sourceCode: '' })

const currentFileName = ref('')
const selectedFile = ref(null)
const codePreview = ref(null)
const fileInput = ref(null)

const loading = ref(true)
const loadError = ref('')
const submitting = ref(false)
const apiErrorMessage = ref('')
const successMessage = ref('')

onMounted(async () => {
  try {
    const response = await getChallengeForEdit(route.params.id)
    form.title = response.data.title
    form.description = response.data.description || ''
    currentFileName.value = response.data.sourceCode
  } catch (err) {
    loadError.value = err.status === 403
      ? 'Você não tem permissão para editar este desafio.'
      : err.status === 404
        ? 'Desafio não encontrado.'
        : err.message || 'Não foi possível carregar o desafio.'
  } finally {
    loading.value = false
  }
})

async function handleFileChange(event) {
  const file = event.target.files[0]
  errors.sourceCode = ''
  codePreview.value = null
  selectedFile.value = null

  if (!file) return

  const dot = file.name.lastIndexOf('.')
  const ext = dot >= 0 ? file.name.slice(dot).toLowerCase() : ''
  if (!CHALLENGE_EXTENSIONS.includes(ext)) {
    errors.sourceCode = `Formato de arquivo inválido. Extensões permitidas: ${CHALLENGE_EXTENSIONS.join(', ')}.`
    event.target.value = ''
    return
  }
  if (file.size > CHALLENGE_MAX_SIZE) {
    errors.sourceCode = 'O arquivo deve ter no máximo 2MB.'
    event.target.value = ''
    return
  }

  selectedFile.value = file
  // Prévia local imediata, sem rede (texto simples, nunca v-html).
  const text = await file.slice(0, 4096).text()
  if (selectedFile.value !== file) return
  codePreview.value = {
    name: file.name,
    sizeKb: (file.size / 1024).toFixed(1),
    lines: text.split('\n').slice(0, 15).join('\n'),
  }
}

function validate() {
  errors.title = ''
  errors.description = ''

  const title = form.title.trim()
  if (!title) {
    errors.title = 'O título é obrigatório.'
  } else if (title.length > TITLE_MAX) {
    errors.title = `O título deve ter no máximo ${TITLE_MAX} caracteres.`
  }
  if (form.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `A descrição deve ter no máximo ${DESCRIPTION_MAX} caracteres.`
  }

  return !errors.title && !errors.description && !errors.sourceCode
}

async function handleSubmit() {
  apiErrorMessage.value = ''
  successMessage.value = ''

  if (!validate()) return

  submitting.value = true

  const formData = new FormData()
  formData.append('title', form.title.trim())
  formData.append('description', form.description.trim())
  if (selectedFile.value) {
    formData.append('sourceCode', selectedFile.value)
  }

  try {
    const response = await updateChallenge(route.params.id, formData)
    currentFileName.value = response.data.sourceCode
    selectedFile.value = null
    codePreview.value = null
    if (fileInput.value) fileInput.value.value = ''
    successMessage.value = response.message || 'Desafio atualizado com sucesso!'
  } catch (err) {
    apiErrorMessage.value = err.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-9 col-md-7 col-lg-6">
        <FormCard title="Editar Desafio">
          <div v-if="loading" class="text-center text-muted py-4">Carregando...</div>

          <div v-else-if="loadError" class="alert alert-danger" role="alert">
            {{ loadError }}
            <router-link :to="{ name: 'my-challenges' }" class="alert-link ms-1">Voltar para Meus Itens</router-link>
          </div>

          <form v-else novalidate @submit.prevent="handleSubmit">
            <BaseInput id="title" v-model="form.title" label="Título" :error="errors.title" />

            <div class="mb-3">
              <label for="description" class="form-label">Descrição</label>
              <textarea id="description" v-model="form.description" class="form-control" :class="{ 'is-invalid': errors.description }" rows="3"></textarea>
              <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
            </div>

            <div class="mb-3">
              <label for="sourceCode" class="form-label">Arquivo de código-fonte</label>
              <p class="small text-muted mb-1">Atual: {{ currentFileName }} (deixe em branco para manter)</p>
              <input
                id="sourceCode"
                ref="fileInput"
                type="file"
                class="form-control"
                :class="{ 'is-invalid': errors.sourceCode }"
                :accept="CHALLENGE_EXTENSIONS.join(',')"
                @change="handleFileChange"
              />
              <div v-if="errors.sourceCode" class="invalid-feedback">{{ errors.sourceCode }}</div>
            </div>

            <div v-if="codePreview" class="mb-3">
              <p class="mb-1 small text-muted">{{ codePreview.name }} — {{ codePreview.sizeKb }} KB</p>
              <pre class="code-preview">{{ codePreview.lines }}</pre>
            </div>

            <div v-if="apiErrorMessage" class="alert alert-danger py-2" role="alert">{{ apiErrorMessage }}</div>
            <div v-if="successMessage" class="alert alert-success py-2" role="alert">{{ successMessage }}</div>

            <BaseButton class="w-100" :loading="submitting">{{ submitting ? 'Salvando...' : 'Salvar alterações' }}</BaseButton>
          </form>
        </FormCard>
      </div>
    </div>
  </div>
</template>
