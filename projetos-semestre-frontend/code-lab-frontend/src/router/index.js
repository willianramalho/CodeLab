import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'landing', component: () => import('../views/LandingView.vue') },

  { path: '/login', name: 'login', component: () => import('../views/auth/LoginView.vue') },
  { path: '/register', name: 'register', component: () => import('../views/auth/RegisterView.vue') },

  { path: '/feed', name: 'feed', component: () => import('../views/FeedView.vue'), meta: { requiresAuth: true } },

  { path: '/challenges/upload', name: 'challenge-upload', component: () => import('../views/UploadView.vue'), meta: { requiresAuth: true } },
  { path: '/challenges/:id', name: 'challenge-detail', component: () => import('../views/ChallengeDetailView.vue') },
  { path: '/challenges/:id/edit', name: 'challenge-edit', component: () => import('../views/EditChallengeView.vue'), meta: { requiresAuth: true } },
  { path: '/my-challenges', name: 'my-challenges', component: () => import('../views/MyChallengesView.vue'), meta: { requiresAuth: true } },

  { path: '/profile/me', name: 'my-profile', component: () => import('../views/profile/MyProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/profile/:username', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },

  { path: '/search', name: 'search', component: () => import('../views/SearchView.vue') },
  { path: '/notifications', name: 'notifications', component: () => import('../views/NotificationsView.vue'), meta: { requiresAuth: true } },

  { path: '/admin/dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/reports', name: 'admin-reports', component: () => import('../views/admin/AdminReportsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/challenges', name: 'admin-challenges', component: () => import('../views/admin/AdminChallengesView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// useAuthStore() só pode ser chamada aqui dentro (depois do Pinia já estar
// registrado em main.js), nunca no topo do arquivo.
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return { name: 'feed' }
  }
})

export default router