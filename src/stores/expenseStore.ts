// src/stores/expenseStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Expense } from '@/types'
import { v4 as uuidv4 } from 'uuid' // We'll use a library to generate unique IDs

const EXPENSE_STORAGE_KEY = 'my_expense_list'

export const useExpenseStore = defineStore('expense', () => {
  // --- STATE ---
  const initialData = localStorage.getItem(EXPENSE_STORAGE_KEY)
  const expenses = ref<Expense[]>(initialData ? JSON.parse(initialData) : [])

  // --- WATCHER ---
  // Automatically save to local storage whenever the expenses array changes
  watch(
    expenses,
    (newExpenses) => {
      localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(newExpenses))
    },
    { deep: true },
  )

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

  // --- ACTIONS ---
  function addExpense(newExpenseData: Omit<Expense, 'id'>) {
    const newExpense: Expense = {
      ...newExpenseData,
      id: uuidv4(), // Generate a unique ID
    }
    expenses.value.unshift(newExpense) // unshift() adds to the beginning of the array
  }

  function deleteExpense(expenseId: string) {
    expenses.value = expenses.value.filter((exp) => exp.id !== expenseId)
  }

  return {
    expenses,
    totalExpensesThisMonth,
    addExpense,
    deleteExpense,
  }
})
