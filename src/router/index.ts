// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard', // We'll call our HomeView the 'dashboard'
      component: HomeView,
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      // This is a lazy-loaded component. It's a performance best practice.
      component: () => import('../views/PortfolioView.vue'),
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('../views/ExpensesView.vue'),
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
    },
  ],
})

export default router
