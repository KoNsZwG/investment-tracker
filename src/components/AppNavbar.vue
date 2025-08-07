<script setup lang="ts">
import { ChartBarIcon, BellIcon } from '@heroicons/vue/24/solid'
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="bg-brand-dark shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo Section -->
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <ChartBarIcon class="h-8 w-8 text-brand-primary" />
          </div>
          <div class="ml-3">
            <h1 class="text-white text-xl font-bold">FAIE</h1>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <RouterLink :to="{ name: 'dashboard' }" class="nav-link">Dashboard</RouterLink>
            <RouterLink :to="{ name: 'portfolio' }" class="nav-link">Portfolio</RouterLink>
            <RouterLink :to="{ name: 'expenses' }" class="nav-link">Expenses</RouterLink>
            <RouterLink :to="{ name: 'analytics' }" class="nav-link">Analytics</RouterLink>
            <a href="#" class="nav-link-disabled">Research</a>
            <a href="#" class="nav-link-disabled">News</a>
          </div>
        </div>

        <!-- Profile/Notifications (Placeholder) -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6 space-x-4">
            <button
              type="button"
              class="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown placeholder -->
            <div class="ml-3 relative">
              <div>
                <button
                  type="button"
                  class="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  <span class="sr-only">Open user menu</span>
                  <!-- Placeholder for profile image -->
                  <div class="h-8 w-8 rounded-full bg-brand-secondary"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium;
}
.nav-link-disabled {
  @apply text-gray-500 px-3 py-2 rounded-md text-sm font-medium cursor-not-allowed;
}
/* This class is automatically applied by Vue Router to the active link */
.router-link-exact-active {
  @apply bg-gray-900 text-white;
}
</style>
