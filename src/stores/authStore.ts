// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
// NO MORE ROUTER IMPORT

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const authReady = ref(false)

  async function signUp(email: string, password: string) {
    // No more try/catch or router.push here. We let the component handle it.
    await createUserWithEmailAndPassword(auth, email, password)
  }

  async function logIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logOut() {
    await signOut(auth)
  }

  function listenForAuthState() {
    onAuthStateChanged(auth, (currentUser: User | null) => {
      user.value = currentUser
      authReady.value = true
    })
  }

  async function changePassword(newPassword: string) {
    if (auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, newPassword)
        alert('Password updated successfully!')
      } catch (error: unknown) {
        console.error('Error updating password:', error)
        // Firebase often requires recent login for this.
        if (error instanceof Error) {
          alert(
            `Error updating password: ${error.message}. You may need to log out and log back in.`,
          )
        } else {
          alert('Error updating password. You may need to log out and log back in.')
        }
      }
    }
  }

  return { user, authReady, signUp, logIn, logOut, listenForAuthState, changePassword }
})
