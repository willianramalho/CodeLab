import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const authStore = useAuthStore()
  const { user, isAuthenticated, isAdmin } = storeToRefs(authStore)

  return {
    user,
    isAuthenticated,
    isAdmin,
    login: authStore.login,
    logout: authStore.logout,
  }
}
