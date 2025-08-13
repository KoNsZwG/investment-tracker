// src/stores/newsStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null
  source: {
    name: string
  }
}

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
      const url = `/api/news`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch news headlines from our server.')

      const data = await response.json()
      if (data.error) throw new Error(data.error)

      articles.value = data.articles
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message
        console.error('Error fetching news:', err)
      } else {
        error.value = String(err)
        console.error('Error fetching news:', err)
      }
    } finally {
      isLoading.value = false
    }
  }

  return { articles, isLoading, error, fetchTopHeadlines }
})
