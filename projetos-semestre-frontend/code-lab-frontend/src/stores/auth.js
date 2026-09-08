import { defineStore } from 'pinia'
import { login as loginRequest, logout as logoutRequest } from '../services/authService'

// Estas chaves precisam bater exatamente com as lidas em services/api.js.
export const TOKEN_KEY = 'auth_token'
export const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => !!state.user?.isAdmin,
  },

  actions: {
    async login(credentials) {
      const response = await loginRequest(credentials)
      this.setSession(response.data.token, response.data.user)
      return response
    },

    async logout() {
      try {
        await logoutRequest()
      } finally {
        this.clearSession()
      }
    },

    setSession(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    },

    clearSession() {
      this.token = null
      this.user = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    },
  },
})
