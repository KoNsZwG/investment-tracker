// src/views/NewsView.vue
<script setup lang="ts">
// 1. Import the CORRECT function name
import { useNewsStore } from '@/stores/newsStore'
import { onMounted } from 'vue'

// 2. CALL the function to create the store instance
const newsStore = useNewsStore()

onMounted(() => {
  newsStore.fetchTopHeadlines()
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white mb-2">Business News</h1>
    <p class="text-brand-secondary mb-8">Top headlines from the world of finance.</p>

    <div v-if="newsStore.isLoading" class="text-center text-gray-400">Loading news...</div>
    <div v-else-if="newsStore.error" class="text-center text-red-400">{{ newsStore.error }}</div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <a
        v-for="(article, index) in newsStore.articles"
        :key="index"
        :href="article.url"
        target="_blank"
        rel="noopener noreferrer"
        class="card flex flex-col hover:border-brand-primary transition-colors"
      >
        <img
          v-if="article.urlToImage"
          :src="article.urlToImage"
          alt="Article image"
          class="w-full h-40 object-cover rounded-t-lg"
        />
        <div v-else class="w-full h-40 bg-gray-700 rounded-t-lg"></div>
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-lg font-bold text-white mb-2">{{ article.title }}</h3>
          <p class="text-brand-secondary text-sm flex-grow">{{ article.description }}</p>
          <p class="text-xs text-gray-500 mt-4">{{ article.source.name }}</p>
        </div>
      </a>
    </div>
  </main>
</template>
