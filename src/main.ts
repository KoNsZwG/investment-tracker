// src/main.ts

import './assets/main.css' // <-- ADD THIS LINE

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
const authStore = useAuthStore()
authStore.listenForAuthState()
app.use(router)

app.mount('#app')
