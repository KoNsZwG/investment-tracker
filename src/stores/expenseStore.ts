// src/stores/expenseStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Expense } from '@/types'
import { db, auth } from '@/firebase'
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid' // Still useful for the old 'id' field if needed

export const useExpenseStore = defineStore('expense', () => {
  // --- STATE ---
  const expenses = ref<Expense[]>([])

  // --- GETTERS ---
  const totalExpensesThisMonth = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return expenses.value
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      })
      .reduce((total, expense) => total + expense.amount, 0)
  })

  const expensesByMonth = computed(() => {
    const monthlyData: Record<string, number> = {}
    expenses.value.forEach((exp) => {
      const month = exp.date.slice(0, 7)
      monthlyData[month] = (monthlyData[month] || 0) + exp.amount
    })
    return monthlyData
  })

  // --- ACTIONS ---

  // Fetches from Firestore
  async function fetchExpenses() {
    const user = auth.currentUser
    if (!user) return

    expenses.value = []
    const expensesCollectionRef = collection(db, 'expenses')
    const q = query(expensesCollectionRef, where('userId', '==', user.uid))

    try {
      const querySnapshot = await getDocs(q)
      const fetchedExpenses: Expense[] = []
      querySnapshot.forEach((doc) => {
        fetchedExpenses.push({
          ...(doc.data() as Omit<Expense, 'firestoreId'>),
          firestoreId: doc.id,
        })
      })
      expenses.value = fetchedExpenses
    } catch (error) {
      console.error('Error fetching expenses:', error)
    }
  }

  // Adds to Firestore
  async function addExpense(newExpenseData: Omit<Expense, 'id' | 'userId' | 'firestoreId'>) {
    const user = auth.currentUser
    if (!user) return

    const expenseToAdd = {
      ...newExpenseData,
      id: uuidv4(),
      userId: user.uid,
    }

    try {
      const docRef = await addDoc(collection(db, 'expenses'), expenseToAdd)
      expenses.value.unshift({ ...expenseToAdd, firestoreId: docRef.id })
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  // Deletes from Firestore
  async function deleteExpense(firestoreId: string) {
    try {
      await deleteDoc(doc(db, 'expenses', firestoreId))
      expenses.value = expenses.value.filter((exp) => exp.firestoreId !== firestoreId)
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  // Clears local state on logout
  function clearStore() {
    expenses.value = []
  }

  return {
    expenses,
    totalExpensesThisMonth,
    expensesByMonth,
    fetchExpenses,
    addExpense,
    deleteExpense,
    clearStore,
  }
})
