// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
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

  return { user, authReady, signUp, logIn, logOut, listenForAuthState }
})
