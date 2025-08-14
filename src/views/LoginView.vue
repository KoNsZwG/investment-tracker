// src/views/LoginView.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowRightEndOnRectangleIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    await authStore.logIn(email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error logging in: ${error.message}`)
    } else {
      alert('Error logging in: Unknown error')
    }
  }
}
</script>

<template>
  <div v-if="authStore.authReady" class="min-h-screen lg:grid lg:grid-cols-2">
    <!-- Left Side: Branding and Image -->
    <div
      class="hidden lg:flex flex-col items-center justify-center bg-brand-dark p-12 text-center relative bg-cover bg-center"
      style="
        background-image: url('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070');
      "
    >
      <div class="absolute inset-0 bg-brand-dark opacity-80"></div>
      <!-- Dark overlay for readability -->
      <div class="relative z-10">
        <div class="flex items-center justify-center mb-4">
          <ChartBarIcon class="h-12 w-12 text-brand-primary" />
          <h1 class="text-5xl font-bold text-white ml-4">FAIE</h1>
        </div>
        <p class="text-xl text-brand-secondary mt-2">Clarity for Your Investments and Expenses.</p>
      </div>
    </div>

    <!-- Right Side: Login Form -->
    <div class="flex items-center justify-center min-h-screen bg-brand-dark lg:bg-brand-card p-8">
      <div class="w-full max-w-sm">
        <h2 class="text-3xl font-bold text-white mb-6 text-center">Welcome Back</h2>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-brand-secondary">Email</label>
            <input v-model="email" type="email" id="email" class="input-field" required />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-brand-secondary"
              >Password</label
            >
            <input v-model="password" type="password" id="password" class="input-field" required />
          </div>
          <button type="submit" class="btn-primary w-full flex items-center justify-center">
            <ArrowRightEndOnRectangleIcon class="h-5 w-5 mr-2" />
            <span>Log In</span>
          </button>
        </form>
        <p class="text-center text-sm text-brand-secondary mt-6">
          Don't have an account?
          <RouterLink
            :to="{ name: 'register' }"
            class="font-medium text-brand-primary hover:underline"
            >Register</RouterLink
          >
        </p>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center h-screen"><p>Loading...</p></div>
</template>

<style scoped>
.input-field {
  @apply mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2;
}
.btn-primary {
  @apply w-full bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg;
}
</style>
