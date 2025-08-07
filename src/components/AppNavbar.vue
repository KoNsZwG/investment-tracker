<script setup lang="ts">
import { ChartBarIcon } from '@heroicons/vue/24/solid'
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
            <h1 class="text-white text-xl font-bold">Investr</h1>
          </div>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <a href="#" class="bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >Dashboard</a
            >
            <a
              href="#"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Portfolio</a
            >
            <a
              href="#"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >Research</a
            >
            <a
              href="#"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >News</a
            >
          </div>
        </div>

        <!-- Profile/Notifications (Placeholder) -->
        <div class="hidden md:block">
          <!-- Add notification bell and profile icon here later -->
        </div>
      </div>
    </div>
  </nav>
</template>
