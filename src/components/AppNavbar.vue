// src/components/AppNavbar.vue

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  ChartBarIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const isNotificationMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const authStore = useAuthStore()
const router = useRouter()
const isMobileMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.logOut()
  router.push({ name: 'login' })
}
</script>

<template>
  <nav v-if="authStore.user" class="bg-brand-dark border-b border-brand-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- This is the main flex container -->
      <div class="flex items-center justify-between h-16">
        <!-- Left Side Group: Logo and Links -->
        <div class="flex items-center">
          <!-- Logo Section -->
          <div class="flex-shrink-0 flex items-center">
            <ChartBarIcon class="h-8 w-8 text-brand-primary" />
            <h1 class="text-white text-xl font-bold ml-3">FAIE</h1>
          </div>
          <!-- Desktop Navigation Links -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-center space-x-4">
              <RouterLink :to="{ name: 'dashboard' }" class="nav-link">Dashboard</RouterLink>
              <RouterLink :to="{ name: 'portfolio' }" class="nav-link">Portfolio</RouterLink>
              <RouterLink :to="{ name: 'income' }" class="nav-link">Income</RouterLink>
              <RouterLink :to="{ name: 'expenses' }" class="nav-link">Expenses</RouterLink>
              <RouterLink :to="{ name: 'analytics' }" class="nav-link">Analytics</RouterLink>
              <RouterLink :to="{ name: 'news' }" class="nav-link">News</RouterLink>
            </div>
          </div>
        </div>

        <!-- Right Side Group: Logout, Profile, Notifications -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6 space-x-4">
            <!-- Notification Dropdown -->
            <div class="relative">
              <button
                @click="isNotificationMenuOpen = !isNotificationMenuOpen"
                type="button"
                class="p-1 rounded-full text-gray-400 hover:text-white"
              >
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </button>
              <div
                v-if="isNotificationMenuOpen"
                @mouseleave="isNotificationMenuOpen = false"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-brand-card ring-1 ring-black ring-opacity-5"
              >
                <p class="block px-4 py-2 text-sm text-gray-400">No new notifications</p>
              </div>
            </div>
            <!-- Profile Dropdown -->
            <div class="ml-3 relative">
              <button
                @click="isProfileMenuOpen = !isProfileMenuOpen"
                type="button"
                class="max-w-xs bg-gray-800 rounded-full flex items-center text-sm"
              >
                <div
                  class="h-8 w-8 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold"
                >
                  {{ authStore.user.email?.charAt(0).toUpperCase() }}
                  <!-- Show first initial -->
                </div>
              </button>
              <div
                v-if="isProfileMenuOpen"
                @mouseleave="isProfileMenuOpen = false"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-brand-card ring-1 ring-black ring-opacity-5"
              >
                <div class="px-4 py-2 text-sm text-gray-400 border-b border-brand-border">
                  {{ authStore.user.email }}
                </div>
                <a
                  href="#"
                  @click.prevent="handleLogout"
                  class="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Button (Only shows on mobile) -->
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
      <!-- This closing div is for the main flex container -->
    </div>

    <!-- Mobile Menu Panel (This correctly sits outside the main flex container) -->
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
          :to="{ name: 'income' }"
          class="mobile-nav-link"
          @click="isMobileMenuOpen = false"
          >Income</RouterLink
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
      <div class="border-t border-gray-700 pt-4 pb-3">
        <div class="px-2 space-y-1">
          <button @click="handleLogout" class="mobile-nav-link w-full text-left flex items-center">
            <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors;
}
.mobile-nav-link {
  @apply text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium;
}
.btn-secondary {
  @apply bg-brand-card hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-lg text-sm transition-colors;
}
.router-link-exact-active {
  @apply bg-gray-900 text-white;
}
</style>
