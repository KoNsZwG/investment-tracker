<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import { useAuthStore } from './stores/authStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="bg-brand-dark text-white min-h-screen">
    <!-- Only render the app content AFTER the initial auth check is complete -->
    <div v-if="authStore.authReady">
      <AppNavbar v-if="authStore.user" />
      <RouterView />
    </div>
    <div v-else class="flex items-center justify-center h-screen">
      <!-- Optional: Add a nice loading spinner here later -->
      <p>Loading Application...</p>
    </div>
  </div>
</template>
