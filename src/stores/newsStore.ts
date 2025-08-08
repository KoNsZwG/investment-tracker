// src/stores/newsStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

// A simple type for a news article
export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null
  source: {
    name: string
  }
}

const newsApiKey = import.meta.env.VITE_NEWS_API_KEY

export const useNewsStore = defineStore('news', () => {
  const articles = ref<NewsArticle[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTopHeadlines() {
    if (articles.value.length > 0) return // Simple cache to prevent re-fetching

    isLoading.value = true
    error.value = null
    try {
      if (!newsApiKey) throw new Error('News API key is missing.')

      const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${newsApiKey}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch news headlines.')

      const data = await response.json()
      articles.value = data.articles
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching news:', err)
    } finally {
      isLoading.value = false
    }
  }

  return { articles, isLoading, error, fetchTopHeadlines }
})
