// src/views/RegisterView.vue
<script setup lang="ts">
import { ref, computed, watch } from 'vue' // Import computed and watch
import { useAuthStore } from '@/stores/authStore'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowRightEndOnRectangleIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

// --- Form State ---
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// --- Validation State ---
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// --- Validation Logic using Watchers ---
watch(username, (value) => {
  if (value && value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters.'
  } else {
    usernameError.value = ''
  }
})

watch(email, (value) => {
  // Simple email regex for basic validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (value && !emailRegex.test(value)) {
    emailError.value = 'Please enter a valid email address.'
  } else {
    emailError.value = ''
  }
})

watch(password, (value) => {
  if (value && value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long.'
  } else {
    passwordError.value = ''
  }
})

watch([password, confirmPassword], ([newPassword, newConfirm]) => {
  if (newConfirm && newPassword !== newConfirm) {
    confirmPasswordError.value = 'Passwords do not match.'
  } else {
    confirmPasswordError.value = ''
  }
})

// --- Computed Property to check overall form validity ---
const isFormValid = computed(() => {
  return (
    username.value.length >= 3 &&
    email.value &&
    !emailError.value &&
    password.value.length >= 6 &&
    confirmPassword.value === password.value &&
    !usernameError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) {
    alert('Please correct the errors before submitting.')
    return
  }
  try {
    await authStore.signUp(username.value, email.value, password.value)
    router.push({ name: 'dashboard' })
  } catch (error: unknown) {
    const errorMsg =
      typeof error === 'object' && error !== null && 'message' in error
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
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Username Field with Error Message -->
        <div>
          <label for="username" class="block text-sm font-medium text-brand-secondary"
            >Username</label
          >
          <input
            v-model="username"
            type="text"
            id="username"
            class="input-field"
            :class="{ 'border-red-500': usernameError }"
            required
          />
          <p v-if="usernameError" class="mt-1 text-sm text-red-400">{{ usernameError }}</p>
        </div>
        <!-- Email Field with Error Message -->
        <div>
          <label for="email" class="block text-sm font-medium text-brand-secondary">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="input-field"
            :class="{ 'border-red-500': emailError }"
            required
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-400">{{ emailError }}</p>
        </div>
        <!-- Password Field with Error Message -->
        <div>
          <label for="password" class="block text-sm font-medium text-brand-secondary"
            >Password</label
          >
          <input
            v-model="password"
            type="password"
            id="password"
            class="input-field"
            :class="{ 'border-red-500': passwordError }"
            required
          />
          <p v-if="passwordError" class="mt-1 text-sm text-red-400">{{ passwordError }}</p>
        </div>
        <!-- Confirm Password Field with Error Message -->
        <div>
          <label for="confirm-password" class="block text-sm font-medium text-brand-secondary"
            >Confirm Password</label
          >
          <input
            v-model="confirmPassword"
            type="password"
            id="confirm-password"
            class="input-field"
            :class="{ 'border-red-500': confirmPasswordError }"
            required
          />
          <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-400">
            {{ confirmPasswordError }}
          </p>
        </div>
        <!-- Disabled Submit Button -->
        <button
          type="submit"
          :disabled="!isFormValid"
          class="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
