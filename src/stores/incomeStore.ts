// src/stores/incomeStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Income } from '@/types'
import { db, auth } from '@/firebase'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

export const useIncomeStore = defineStore('income', () => {
  // --- STATE ---
  const incomeSources = ref<Income[]>([])

  // --- GETTERS ---
  const incomeByMonth = computed(() => {
    const monthlyData: Record<string, number> = {}
    incomeSources.value.forEach((inc) => {
      const month = inc.date.slice(0, 7)
      monthlyData[month] = (monthlyData[month] || 0) + inc.amount
    })
    return monthlyData
  })

  // --- ACTIONS ---

  // Fetches from Firestore
  async function fetchIncome() {
    const user = auth.currentUser
    if (!user) return

    incomeSources.value = []
    const incomeCollectionRef = collection(db, 'income')
    const q = query(incomeCollectionRef, where('userId', '==', user.uid))

    try {
      const querySnapshot = await getDocs(q)
      const fetchedIncome: Income[] = []
      querySnapshot.forEach((doc) => {
        fetchedIncome.push({
          ...(doc.data() as Omit<Income, 'firestoreId'>),
          firestoreId: doc.id,
        })
      })
      incomeSources.value = fetchedIncome
    } catch (error) {
      console.error('Error fetching income:', error)
    }
  }

  // Adds to Firestore
  async function addIncome(newIncomeData: Omit<Income, 'id' | 'userId' | 'firestoreId'>) {
    const user = auth.currentUser
    if (!user) return

    const incomeToAdd = {
      ...newIncomeData,
      id: uuidv4(),
      userId: user.uid,
    }

    try {
      const docRef = await addDoc(collection(db, 'income'), incomeToAdd)
      incomeSources.value.unshift({ ...incomeToAdd, firestoreId: docRef.id })
    } catch (error) {
      console.error('Error adding income:', error)
    }
  }

  // Deletes from Firestore
  async function deleteIncome(firestoreId: string) {
    try {
      await deleteDoc(doc(db, 'income', firestoreId))
      incomeSources.value = incomeSources.value.filter((inc) => inc.firestoreId !== firestoreId)
    } catch (error) {
      console.error('Error deleting income:', error)
    }
  }

  // Clears local state on logout
  function clearStore() {
    incomeSources.value = []
  }

  return {
    incomeSources,
    incomeByMonth,
    fetchIncome,
    addIncome,
    deleteIncome,
    clearStore,
  }
})
