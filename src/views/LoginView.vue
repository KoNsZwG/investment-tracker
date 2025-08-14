// src/views/LoginView.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  // Make the handler async
  try {
    await authStore.logIn(email.value, password.value)
    router.push({ name: 'dashboard' }) // Redirect on success
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error logging in: ${error.message}`) // Show alert on failure
    } else {
      alert('Error logging in: Unknown error')
    }
  }
}
</script>

<template>
  <div v-if="authStore.authReady" class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md card">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Login to FAIE</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-brand-secondary">Email</label>
          <input v-model="email" type="email" id="email" class="input-field" required />
        </div>
        <div class="mb-6">
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
      <p class="text-center text-sm text-brand-secondary mt-4">
        Don't have an account?
        <RouterLink
          :to="{ name: 'register' }"
          class="font-medium text-brand-primary hover:underline"
          >Register</RouterLink
        >
      </p>
    </div>
  </div>
  <div v-else class="text-center p-8">Loading...</div>
</template>
<style scoped>
.input-field {
  @apply mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2;
}
.btn-primary {
  @apply w-full bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg;
}
</style>
