// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { useInvestmentStore } from './investmentStore' // Import the other stores
// import { useExpenseStore } from './expenseStore'
// import { useIncomeStore } from './incomeStore'
import { ref } from 'vue'
import { auth } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  type User,
  updatePassword,
} from 'firebase/auth'
// NO MORE ROUTER IMPORT

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const authReady = ref(false)

  async function signUp(username: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    if (userCredential.user) {
      // After creating the user, update their profile with the display name
      await updateProfile(userCredential.user, {
        displayName: username,
      })
    } else {
      throw new Error('Could not create user.')
    }
  }

  async function logIn(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function logOut() {
    await signOut(auth)
  }

  function listenForAuthState() {
    onAuthStateChanged(auth, async (currentUser: User | null) => {
      const investmentStore = useInvestmentStore()
      // const expenseStore = useExpenseStore();
      // const incomeStore = useIncomeStore();

      if (currentUser) {
        await investmentStore.fetchInvestments()
        // await expenseStore.fetchExpenses();
        // await incomeStore.fetchIncome();
      } else {
        investmentStore.clearStore()
        // expenseStore.clearStore();
        // incomeStore.clearStore();
      }
      user.value = currentUser
      authReady.value = true
    })
  }

  async function updateUsername(newUsername: string) {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, {
          displayName: newUsername,
        })
        // Manually update the local user state to reflect the change instantly
        if (user.value) {
          user.value = { ...user.value, displayName: newUsername } as User
        }
        alert('Username updated successfully!')
      } catch (error: unknown) {
        console.error('Error updating username:', error)
        if (error instanceof Error) {
          alert(`Error updating username: ${error.message}`)
        } else {
          alert('Error updating username.')
        }
      }
    }
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

  return {
    user,
    authReady,
    signUp,
    logIn,
    logOut,
    listenForAuthState,
    updateUsername,
    changePassword,
  }
})
