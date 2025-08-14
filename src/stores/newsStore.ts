// src/stores/newsStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchNewsHeadlines } from '@/services/apiService' // <-- Import the service
import type { NewsArticle } from '@/types'

// THIS IS THE WRAPPER THAT WAS LIKELY MISSING/MODIFIED
export const useNewsStore = defineStore('news', () => {
  const articles = ref<NewsArticle[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTopHeadlines() {
    if (articles.value.length > 0) return
    isLoading.value = true
    error.value = null
    try {
      articles.value = await fetchNewsHeadlines() // <-- Use the service
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
      } else {
        error.value = String(err)
      }
      console.error('Error fetching news:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { articles, isLoading, error, fetchTopHeadlines }
})
