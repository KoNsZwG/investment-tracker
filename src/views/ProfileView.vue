// src/views/ProfileView.vue
<script setup lang="ts">
import { ref, watch, computed } from 'vue' // Import watch and computed
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

// --- STATE for forms ---
const newUsername = ref(authStore.user?.displayName || '')
const newPassword = ref('')
const confirmPassword = ref('')

// --- STATE for validation ---
const usernameError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// --- VALIDATION LOGIC ---
watch(newUsername, (value) => {
  if (value && value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters.'
  } else {
    usernameError.value = ''
  }
})

watch(newPassword, (value) => {
  if (value && value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters long.'
  } else {
    passwordError.value = ''
  }
})

watch([newPassword, confirmPassword], ([newPass, confirmPass]) => {
  if (confirmPass && newPass !== confirmPass) {
    confirmPasswordError.value = 'Passwords do not match.'
  } else {
    confirmPasswordError.value = ''
  }
})

// --- COMPUTED properties for form validity ---
const isUsernameFormValid = computed(() => {
  return newUsername.value.length >= 3 && !usernameError.value
})

const isPasswordFormValid = computed(() => {
  return (
    newPassword.value.length >= 6 &&
    newPassword.value === confirmPassword.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  )
})

// --- HANDLERS ---
async function handleUpdateUsername() {
  if (!isUsernameFormValid.value) return
  await authStore.updateUsername(newUsername.value)
}

async function handleChangePassword() {
  if (!isPasswordFormValid.value) return
  await authStore.changePassword(newPassword.value)
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white">My Profile</h1>

    <div class="card mt-8 max-w-lg space-y-8">
      <!-- Account Info -->
      <div>
        <h2 class="text-xl font-bold text-white">Account Information</h2>
        <p class="text-brand-secondary mt-4">
          Email: <span class="font-medium text-white">{{ authStore.user?.email }}</span>
        </p>
      </div>

      <!-- Update Username Form -->
      <form @submit.prevent="handleUpdateUsername">
        <h2 class="text-xl font-bold text-white">Update Username</h2>
        <div class="mt-4">
          <label for="username" class="block text-sm font-medium text-brand-secondary"
            >Username</label
          >
          <input
            v-model="newUsername"
            type="text"
            id="username"
            class="input-field mt-1"
            :class="{ 'border-red-500': usernameError }"
          />
          <p v-if="usernameError" class="mt-1 text-sm text-red-400">{{ usernameError }}</p>
        </div>
        <div class="mt-6">
          <button
            type="submit"
            :disabled="!isUsernameFormValid"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Username
          </button>
        </div>
      </form>

      <!-- Change Password Form -->
      <form @submit.prevent="handleChangePassword">
        <h2 class="text-xl font-bold text-white">Change Password</h2>
        <div class="mt-4 space-y-4">
          <div>
            <label for="new-password" class="block text-sm font-medium text-brand-secondary"
              >New Password</label
            >
            <input
              v-model="newPassword"
              type="password"
              id="new-password"
              class="input-field mt-1"
              :class="{ 'border-red-500': passwordError }"
            />
            <p v-if="passwordError" class="mt-1 text-sm text-red-400">{{ passwordError }}</p>
          </div>
          <div>
            <label for="confirm-password" class="block text-sm font-medium text-brand-secondary"
              >Confirm New Password</label
            >
            <input
              v-model="confirmPassword"
              type="password"
              id="confirm-password"
              class="input-field mt-1"
              :class="{ 'border-red-500': confirmPasswordError }"
            />
            <p v-if="confirmPasswordError" class="mt-1 text-sm text-red-400">
              {{ confirmPasswordError }}
            </p>
          </div>
        </div>
        <div class="mt-6">
          <button
            type="submit"
            :disabled="!isPasswordFormValid"
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.input-field {
  @apply block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2;
}
.btn-primary {
  @apply bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg;
}
</style>
