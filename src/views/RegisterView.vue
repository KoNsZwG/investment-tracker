// src/views/RegisterView.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('') // <-- NEW
const email = ref('')
const password = ref('')
const confirmPassword = ref('') // <-- NEW

const handleRegister = async () => {
  // --- NEW VALIDATION ---
  if (!username.value || !email.value || !password.value) {
    alert('Please fill out all fields.')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }
  if (password.value.length < 6) {
    alert('Password must be at least 6 characters long.')
    return
  }

  try {
    // We'll update the signUp action in the next step
    await authStore.signUp(username.value, email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (error: unknown) {
    const errorMsg =
      error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : String(error)
    alert(`Error signing up: ${errorMsg}`)
  }
}
</script>

<template>
  <div v-if="authStore.authReady" class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md card">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Create an Account</h2>
      <form @submit.prevent="handleRegister">
        <!-- NEW USERNAME FIELD -->
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-brand-secondary"
            >Username</label
          >
          <input v-model="username" type="text" id="username" class="input-field" required />
        </div>
        <!-- EMAIL FIELD -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-brand-secondary">Email</label>
          <input v-model="email" type="email" id="email" class="input-field" required />
        </div>
        <!-- PASSWORD FIELD -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-brand-secondary"
            >Password</label
          >
          <input v-model="password" type="password" id="password" class="input-field" required />
        </div>
        <!-- NEW CONFIRM PASSWORD FIELD -->
        <div class="mb-6">
          <label for="confirm-password" class="block text-sm font-medium text-brand-secondary"
            >Confirm Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            id="confirm-password"
            class="input-field"
            required
          />
        </div>
        <button type="submit" class="btn-primary w-full flex items-center justify-center">
          <ArrowRightEndOnRectangleIcon class="h-5 w-5 mr-2" />
          <span>Register</span>
        </button>
      </form>
      <p class="text-center text-sm text-brand-secondary mt-4">
        Already have an account?
        <RouterLink :to="{ name: 'login' }" class="font-medium text-brand-primary hover:underline"
          >Log In</RouterLink
        >
      </p>
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
