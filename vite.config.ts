// vite.config.ts
import { fileURLToPath, URL } from 'node:url' // <-- ADD THIS IMPORT

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // <-- ADD THIS WHOLE 'resolve' SECTION
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
