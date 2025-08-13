// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        // This key should match the start of the request path from the client
        '/api/news': {
          // <-- Make the key more specific
          target: 'https://newsapi.org',
          changeOrigin: true,
          // We rewrite to the full, correct endpoint path here
          rewrite: () =>
            `/v2/top-headlines?country=us&category=business&apiKey=${env.VITE_NEWS_API_KEY}`,
        },
      },
    },
  }
})
