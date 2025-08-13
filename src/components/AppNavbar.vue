// src/components/TheNavbar.vue

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChartBarIcon, BellIcon, Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <nav class="bg-brand-dark border-b border-brand-border">
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

        <!-- Desktop Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <RouterLink :to="{ name: 'dashboard' }" class="nav-link">Dashboard</RouterLink>
            <RouterLink :to="{ name: 'portfolio' }" class="nav-link">Portfolio</RouterLink>
            <RouterLink :to="{ name: 'expenses' }" class="nav-link">Expenses</RouterLink>
            <RouterLink :to="{ name: 'analytics' }" class="nav-link">Analytics</RouterLink>
            <RouterLink :to="{ name: 'news' }" class="nav-link">News</RouterLink>
          </div>
        </div>

        <!-- Desktop Profile/Notifications -->
        <div class="hidden md:block">
          <div class="hidden ml-4 flex items-center md:ml-6 space-x-4">
            <button type="button" class="p-1 rounded-full text-gray-400 hover:text-white">
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button>
            <div class="h-8 w-8 rounded-full bg-brand-secondary"></div>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <div class="-mr-2 flex md:hidden">
          <button
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            type="button"
            class="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!isMobileMenuOpen" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Panel -->
    <div v-if="isMobileMenuOpen" class="md:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink
          :to="{ name: 'dashboard' }"
          class="mobile-nav-link"
          @click="isMobileMenuOpen = false"
          >Dashboard</RouterLink
        >
        <RouterLink
          :to="{ name: 'portfolio' }"
          class="mobile-nav-link"
          @click="isMobileMenuOpen = false"
          >Portfolio</RouterLink
        >
        <RouterLink
          :to="{ name: 'expenses' }"
          class="mobile-nav-link"
          @click="isMobileMenuOpen = false"
          >Expenses</RouterLink
        >
        <RouterLink
          :to="{ name: 'analytics' }"
          class="mobile-nav-link"
          @click="isMobileMenuOpen = false"
          >Analytics</RouterLink
        >
        <RouterLink :to="{ name: 'news' }" class="mobile-nav-link" @click="isMobileMenuOpen = false"
          >News</RouterLink
        >
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors;
}
.nav-link-disabled {
  @apply text-gray-500 px-3 py-2 rounded-md text-sm font-medium cursor-not-allowed;
}
.mobile-nav-link {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium;
}
.router-link-exact-active {
  @apply bg-gray-900 text-white;
}
</style>
