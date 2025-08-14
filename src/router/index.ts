// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('../views/ExpensesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('../views/NewsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/income',
      name: 'income',
      component: () => import('../views/IncomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// --- NAVIGATION GUARD ---
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // This is the key: if the auth state is not yet ready, we wait for it.
  // We use a Vue 'watch' to see when authReady becomes true.
  if (!authStore.authReady) {
    await new Promise((resolve) => {
      const unwatch = authStore.$subscribe((mutation, state) => {
        if (state.authReady) {
          unwatch() // Stop watching once it's ready
          resolve(undefined)
        }
      })
    })
  }

  const isLoggedIn = !!authStore.user

  if (to.meta.requiresAuth && !isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isLoggedIn) {
    // If route is for guests and user is logged in, redirect to dashboard
    next({ name: 'dashboard' })
  } else {
    // Otherwise, allow navigation
    next()
  }
})

export default router
