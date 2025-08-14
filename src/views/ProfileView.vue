// src/views/ProfileView.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const newPassword = ref('')
const confirmPassword = ref('')

async function handleChangePassword() {
  if (!newPassword.value) {
    alert('Please enter a new password.')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }
  if (newPassword.value.length < 6) {
    alert('Password must be at least 6 characters long.')
    return
  }

  // We'll create the 'changePassword' action in the next step
  await authStore.changePassword(newPassword.value)
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white">My Profile</h1>

    <div class="card mt-8 max-w-lg">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-white">Account Information</h2>
        <p class="text-brand-secondary mt-2">
          Email: <span class="font-medium text-white">{{ authStore.user?.email }}</span>
        </p>
      </div>

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
            />
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
            />
          </div>
        </div>
        <div class="mt-6">
          <button type="submit" class="btn-primary">Update Password</button>
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
