/**
 * Instância única e configurada do Axios — o único arquivo do projeto que
 * importa 'axios' diretamente. Todo o resto do front importa `api` a partir
 * daqui, nunca `axios` diretamente.
 *
 * O interceptor de resposta abaixo normaliza QUALQUER erro (validação,
 * autenticação ou rede) no mesmo formato { message, errors, status },
 * para que nenhuma tela precise tratar erro do seu próprio jeito:
 *
 * - Sucesso ((response) => response.data): "descasca" um nível — cada
 *   chamada feita através de `api` já recebe diretamente { success, message,
 *   data }, sem precisar escrever `response.data` toda vez.
 * - error.response: a API respondeu, mas com um status de erro (4xx/5xx).
 *   O erro já formatado pelo nosso apiResponse.js (back-end) é reaproveitado.
 * - error.request: a requisição foi enviada, mas nenhuma resposta chegou
 *   (API fora do ar, ou sem conexão) — não existe error.response.data para
 *   ler, por isso a mensagem é genérica.
 * - else: erro raro, na própria montagem da requisição (configuração inválida).
 */

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Interceptor de requisição: anexa o token no header Authorization sempre
 * que existir um. O token é lido diretamente do localStorage (e não da
 * store de autenticação) para evitar uma dependência circular: a store
 * chama métodos deste arquivo (api.js) para fazer login/logout, então este
 * arquivo não pode importar a store de volta.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // A API respondeu, mas com um status de erro (4xx ou 5xx)
      const apiError = error.response.data

      if (error.response.status === 401) {
        // Sessão expirada/inválida: limpa a sessão e força o logout.
        // Usa window.location (em vez de importar o router aqui) pelo mesmo
        // motivo do token acima: importar o router importaria a store, que
        // importa o authService, que importa este próprio arquivo de volta.
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }

      return Promise.reject({
        message: apiError.message || 'Ocorreu um erro na requisição.',
        errors: apiError.errors || [],
        status: error.response.status,
      })
    } else if (error.request) {
      // A requisição foi enviada, mas nenhuma resposta chegou (API fora do ar, sem rede)
      return Promise.reject({
        message: 'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.',
        errors: [],
        status: null,
      })
    } else {
      // Erro ao montar a própria requisição (configuração inválida, por exemplo)
      return Promise.reject({
        message: 'Erro inesperado ao preparar a requisição.',
        errors: [],
        status: null,
      })
    }
  }
)

export default api
