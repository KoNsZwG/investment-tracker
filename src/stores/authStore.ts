import { defineStore } from 'pinia'
import { useInvestmentStore } from './investmentStore'
import { useExpenseStore } from './expenseStore'
import { useIncomeStore } from './incomeStore'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const authReady = ref(false)

  const displayName = computed(
    () => user.value?.user_metadata?.display_name ?? user.value?.email ?? '',
  )

  async function signUp(username: string, email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } },
    })
    if (error) throw error
  }

  async function logIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function logOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  function listenForAuthState() {
    supabase.auth.onAuthStateChange(async (_event, session) => {
      const investmentStore = useInvestmentStore()
      const expenseStore = useExpenseStore()
      const incomeStore = useIncomeStore()

      if (session?.user) {
        user.value = session.user
        await Promise.all([
          investmentStore.fetchInvestments(),
          expenseStore.fetchExpenses(),
          incomeStore.fetchIncome(),
        ])
      } else {
        user.value = null
        investmentStore.clearStore()
        expenseStore.clearStore()
        incomeStore.clearStore()
      }
      authReady.value = true
    })
  }

  async function updateUsername(newUsername: string) {
    const { data, error } = await supabase.auth.updateUser({
      data: { display_name: newUsername },
    })
    if (error) throw error
    if (data.user) user.value = data.user
  }

  async function changePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  }

  return {
    user,
    authReady,
    displayName,
    signUp,
    logIn,
    logOut,
    listenForAuthState,
    updateUsername,
    changePassword,
  }
})
