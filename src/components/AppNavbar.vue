// src/components/AppNavbar.vue

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import {
  ChartBarIcon,
  //  Bars3Icon,
  XMarkIcon,
  ArrowLeftEndOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()
const isMobileMenuOpen = ref(false)
//const isNotificationMenuOpen = ref(false)
const isProfileMenuOpen = ref(false)

const handleLogout = async () => {
  await authStore.logOut()
  isProfileMenuOpen.value = false
  isMobileMenuOpen.value = false // Close mobile menu on logout
  router.push({ name: 'login' })
}
</script>

<template>
  <nav v-if="authStore.user" class="bg-brand-dark border-b border-brand-border">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- ... (Left Side: Logo and Links - NO CHANGES) ... -->
        <div class="flex items-center">
          <div class="flex-shrink-0 flex items-center">
            <ChartBarIcon class="h-8 w-8 text-brand-primary" />
            <h1 class="text-white text-xl font-bold ml-3">FAIE</h1>
          </div>
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

        <!-- ... (Right Side: Logout and Profile Icons - NO CHANGES) ... -->
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6 space-x-4">
            <!-- Notification Dropdown -->
            <!-- <div class="relative">
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
            </div> -->
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
                  {{
                    authStore.user.displayName?.charAt(0).toUpperCase() ||
                    authStore.user.email?.charAt(0).toUpperCase()
                  }}
                </div>
              </button>
              <div
                v-if="isProfileMenuOpen"
                @mouseleave="isProfileMenuOpen = false"
                class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-brand-card ring-1 ring-black ring-opacity-5"
              >
                <div class="px-4 py-2 border-b border-brand-border">
                  <p class="text-sm font-semibold text-white">
                    {{ authStore.user.displayName || 'No Name' }}
                  </p>
                  <p class="text-xs text-gray-400">{{ authStore.user.email }}</p>
                </div>
                <RouterLink
                  :to="{ name: 'profile' }"
                  @click="isProfileMenuOpen = false"
                  class="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  <Cog6ToothIcon class="h-5 w-5 mr-2" />
                  <span>Profile & Settings</span>
                </RouterLink>
                <a
                  href="#"
                  @click.prevent="handleLogout"
                  class="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  <ArrowLeftEndOnRectangleIcon class="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
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

    <!-- MODIFIED Mobile Menu Panel -->
    <div v-if="isMobileMenuOpen" class="md:hidden">
      <!-- Main Nav Links -->
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

      <!-- CORRECTED Profile Section for Mobile -->
      <div class="border-t border-gray-700 pt-4 pb-3">
        <div class="flex items-center px-5">
          <div
            class="h-10 w-10 rounded-full bg-brand-secondary flex items-center justify-center text-white font-bold"
          >
            {{
              authStore.user.displayName?.charAt(0).toUpperCase() ||
              authStore.user.email?.charAt(0).toUpperCase()
            }}
          </div>
          <div class="ml-3">
            <div class="text-base font-medium leading-none text-white">
              {{ authStore.user.displayName || 'No Name' }}
            </div>
            <!-- ADDED MARGIN-TOP FOR SPACING -->
            <div class="text-sm font-medium leading-none text-gray-400 mt-1">
              {{ authStore.user.email }}
            </div>
          </div>
        </div>
        <div class="mt-3 px-2 space-y-1">
          <!-- ADDED 'flex items-center' FOR ALIGNMENT -->
          <RouterLink
            :to="{ name: 'profile' }"
            class="mobile-nav-link flex items-center"
            @click="isMobileMenuOpen = false"
          >
            <Cog6ToothIcon class="h-6 w-6 mr-3" />
            <span>Profile & Settings</span>
          </RouterLink>
          <!-- ADDED 'flex items-center' FOR ALIGNMENT -->
          <button @click="handleLogout" class="mobile-nav-link w-full text-left flex items-center">
            <ArrowLeftEndOnRectangleIcon class="h-6 w-6 mr-3" />
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
  @apply text-gray-300 hover:bg-gray-700 hover:text-white flex px-3 py-2 rounded-md text-base font-medium;
}
.btn-secondary {
  @apply bg-brand-card hover:bg-gray-700 text-gray-300 font-medium py-2 px-4 rounded-lg text-sm transition-colors;
}
.router-link-exact-active {
  @apply bg-gray-900 text-white;
}
</style>
