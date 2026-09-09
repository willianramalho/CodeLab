import api from './api'

export function register(payload) {
  return api.post('/register', payload)
}

export function login(payload) {
  return api.post('/login', payload)
}

export function logout() {
  return api.post('/logout')
}

export function getMyProfile() {
  return api.get('/profile/me')
}

// Única chamada da aplicação que precisa sobrescrever o Content-Type padrão
// (application/json) da instância `api`: o FormData exige multipart/form-data
// com um boundary gerado pelo navegador, então deixamos o header em branco
// para o Axios/navegador o preencherem sozinhos, em vez de usar o padrão fixo.
export function updateProfile(formData) {
  return api.put('/profile/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
