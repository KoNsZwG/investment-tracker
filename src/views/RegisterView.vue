// src/views/RegisterView.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, RouterLink } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

// CORRECTED: This is the handler for the registration form
const handleRegister = async () => {
  try {
    // CORRECTED: Calls the signUp action from the store
    await authStore.signUp(email.value, password.value)
    // On success, redirect to the dashboard
    router.push({ name: 'dashboard' })
  } catch (error: unknown) {
    // On failure, show the error message
    if (error instanceof Error) {
      alert(`Error signing up: ${error.message}`)
    } else {
      alert('Error signing up: Unknown error')
    }
  }
}
</script>

<template>
  <!-- The v-if check is correct -->
  <div v-if="authStore.authReady" class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md card">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Create an Account</h2>
      <!-- CORRECTED: The form now correctly calls handleRegister -->
      <form @submit.prevent="handleRegister">
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
        <button type="submit" class="btn-primary w-full">Register</button>
      </form>
      <p class="text-center text-sm text-brand-secondary mt-4">
        Already have an account?
        <RouterLink :to="{ name: 'login' }" class="font-medium text-brand-primary hover:underline"
          >Log In</RouterLink
        >
      </p>
    </div>
  </div>
  <!-- Add a loading state for a better UX -->
  <div v-else class="flex items-center justify-center h-screen">
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.input-field {
  @apply mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2;
}
.btn-primary {
  @apply w-full bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg;
}
</style>
