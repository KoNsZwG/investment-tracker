<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
</script>

<template>
  <div class="bg-brand-dark text-white min-h-screen">
    <AppNavbar />
    <RouterView />
  </div>
</template>
