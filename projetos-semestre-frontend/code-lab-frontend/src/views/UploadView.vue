<script setup>
import { reactive, ref } from 'vue'
import { createChallenge } from '../services/challengeService'
import FormCard from '../components/base/FormCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'

// Mesmas regras de config/constants.js (VALIDATION.TITLE_MAX/DESCRIPTION_MAX
// e UPLOAD.CHALLENGE_MAX_SIZE/CHALLENGE_EXTENSIONS) no back-end — cópia
// otimista só para dar feedback instantâneo, quem decide de verdade é a API.
const TITLE_MAX = 100
const DESCRIPTION_MAX = 500
const CHALLENGE_MAX_SIZE = 2 * 1024 * 1024 // 2MB
const CHALLENGE_EXTENSIONS = ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.cs', '.go', '.rb', '.php', '.txt']

const form = reactive({
  title: '',
  description: '',
})

const errors = reactive({
  title: '',
  description: '',
  sourceCode: '',
})

const selectedFile = ref(null)
const codePreview = ref(null)
const fileInput = ref(null)

const isSubmitting = ref(false)
const isProcessing = ref(false)
const uploadPercent = ref(0)
const apiErrorMessage = ref('')
const successMessage = ref('')

function getExtension(filename) {
  const dotIndex = filename.lastIndexOf('.')
  return dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : ''
}

async function handleFileChange(event) {
  const file = event.target.files[0]
  errors.sourceCode = ''
  codePreview.value = null
  selectedFile.value = null

  if (!file) {
    return
  }

  // Extensão e tamanho são checados ANTES de qualquer prévia — nenhuma
  // chamada de rede acontece em nenhum dos dois passos.
  const ext = getExtension(file.name)
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

  // Prévia local do código, sem nenhuma chamada de rede: só nome, tamanho
  // (KB) e as ~15 primeiras linhas, lidas com file.slice(...).text() (API
  // nativa de File, sem FileReader) e exibidas com interpolação de texto
  // simples no template — nunca com a diretiva que injeta HTML cru, por
  // segurança (código arbitrário do usuário poderia conter marcação/script).
  const text = await file.slice(0, 4096).text()
  // Se outro arquivo foi escolhido enquanto este era lido, descarta a prévia antiga.
  if (selectedFile.value !== file) {
    return
  }
  codePreview.value = {
    name: file.name,
    sizeKb: (file.size / 1024).toFixed(1),
    lines: text.split('\n').slice(0, 15).join('\n'),
  }
}

function validate() {
  errors.title = ''
  errors.description = ''

  const trimmedTitle = form.title.trim()
  if (!trimmedTitle) {
    errors.title = 'O título é obrigatório.'
  } else if (trimmedTitle.length > TITLE_MAX) {
    errors.title = `O título deve ter no máximo ${TITLE_MAX} caracteres.`
  }

  if (form.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `A descrição deve ter no máximo ${DESCRIPTION_MAX} caracteres.`
  }

  // Erro de extensão/tamanho já setado por handleFileChange; só adiciona o
  // "obrigatório" quando nenhum arquivo válido foi escolhido ainda.
  if (!selectedFile.value && !errors.sourceCode) {
    errors.sourceCode = 'O arquivo de código-fonte é obrigatório.'
  }

  return !errors.title && !errors.description && !errors.sourceCode
}

function resetForm() {
  form.title = ''
  form.description = ''
  selectedFile.value = null
  codePreview.value = null
  errors.title = ''
  errors.description = ''
  errors.sourceCode = ''
  uploadPercent.value = 0
  isProcessing.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  apiErrorMessage.value = ''
  successMessage.value = ''

  if (!validate()) {
    return
  }

  isSubmitting.value = true
  isProcessing.value = false
  uploadPercent.value = 0

  const formData = new FormData()
  formData.append('title', form.title.trim())
  formData.append('description', form.description.trim())
  formData.append('sourceCode', selectedFile.value)

  try {
    const response = await createChallenge(formData, (progressEvent) => {
      // total pode vir ausente (upload sem Content-Length computável);
      // sem ele não dá para calcular porcentagem, então a barra fica como
      // estava até a próxima chamada que já traga o total.
      if (!progressEvent.total) {
        return
      }

      uploadPercent.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)

      // 100% do corpo enviado não é "desafio salvo": o servidor ainda
      // valida, grava em disco e incrementa o contador do usuário.
      if (uploadPercent.value >= 100) {
        isProcessing.value = true
      }
    })

    successMessage.value = response.message || 'Desafio enviado com sucesso!'
    resetForm()
  } catch (error) {
    apiErrorMessage.value = error.message
  } finally {
    isSubmitting.value = false
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-12 col-sm-9 col-md-7 col-lg-6">
        <FormCard title="Enviar Desafio">
          <form @submit.prevent="handleSubmit" novalidate>
            <BaseInput id="title" label="Título" v-model="form.title" :error="errors.title" />

            <div class="mb-3">
              <label for="description" class="form-label">Descrição</label>
              <textarea
                id="description"
                class="form-control"
                :class="{ 'is-invalid': errors.description }"
                rows="3"
                v-model="form.description"
              ></textarea>
              <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
            </div>

            <div class="mb-3">
              <label for="sourceCode" class="form-label">Arquivo de código-fonte</label>
              <input
                id="sourceCode"
                ref="fileInput"
                type="file"
                class="form-control"
                :class="{ 'is-invalid': errors.sourceCode }"
                accept=".js,.ts,.py,.java,.c,.cpp,.cs,.go,.rb,.php,.txt"
                @change="handleFileChange"
              />
              <div v-if="errors.sourceCode" class="invalid-feedback">{{ errors.sourceCode }}</div>
            </div>

            <div v-if="codePreview" class="mb-3">
              <p class="mb-1 small text-muted">{{ codePreview.name }} — {{ codePreview.sizeKb }} KB</p>
              <pre class="code-preview">{{ codePreview.lines }}</pre>
            </div>

            <div v-if="isSubmitting" class="mb-3">
              <div
                class="progress"
                role="progressbar"
                aria-label="Progresso do envio"
                :aria-valuenow="uploadPercent"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div class="progress-bar" :style="{ width: uploadPercent + '%' }">{{ uploadPercent }}%</div>
              </div>
              <div v-if="isProcessing" class="text-muted small mt-1">Processando...</div>
            </div>

            <div v-if="apiErrorMessage" class="alert alert-danger py-2" role="alert">
              {{ apiErrorMessage }}
            </div>
            <div v-if="successMessage" class="alert alert-success py-2" role="alert">
              {{ successMessage }}
              <router-link :to="{ name: 'my-challenges' }" class="alert-link ms-1">Ver em Meus Itens</router-link>
            </div>

            <BaseButton class="w-100" :loading="isSubmitting">
              {{ isSubmitting ? 'Enviando...' : 'Enviar Desafio' }}
            </BaseButton>
          </form>
        </FormCard>
      </div>
    </div>
  </div>
</template>
