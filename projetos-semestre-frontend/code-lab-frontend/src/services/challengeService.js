import api from './api'

/**
 * Envia um novo Desafio (título, descrição opcional e o arquivo de
 * código-fonte) para a API. Recebe `onUploadProgress` como parâmetro — o
 * mesmo padrão de `updateProfile` (authService.js) — para que a tela,
 * e não este service, controle a barra de progresso.
 *
 * Content-Type sobrescrito igual a `updateProfile`: o FormData exige
 * multipart/form-data com um boundary gerado pelo navegador.
 */
export function createChallenge(formData, onUploadProgress) {
  return api.post('/challenges', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

/** Detalhe público de um Desafio (a API usa optionalAuth e devolve isOwner). */
export function getChallengeById(id) {
  return api.get(`/challenges/${id}`)
}

/** Uma página do feed (protegido). Resposta: { items, page, limit, hasMore }. */
export function getFeed({ page = 1, limit = 9 } = {}) {
  return api.get('/feed', { params: { page, limit } })
}

/** Itens do usuário logado, do mais novo para o mais antigo. */
export function getMyChallenges() {
  return api.get('/my-challenges')
}

/** Dados para pré-preencher o formulário de edição (só o dono; 403/404 caso contrário). */
export function getChallengeForEdit(id) {
  return api.get(`/challenges/${id}/edit`)
}

/** Edição com troca opcional do arquivo; multipart, como createChallenge. */
export function updateChallenge(id, formData) {
  return api.put(`/challenges/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function deleteChallenge(id) {
  return api.delete(`/challenges/${id}`)
}
