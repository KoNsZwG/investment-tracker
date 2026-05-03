import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Expense } from '@/types'
import { supabase } from '@/lib/supabase'

type DbRow = Record<string, unknown>

function rowToExpense(row: DbRow): Expense {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    amount: row.amount as number,
    category: row.category as string,
    date: row.date as string,
  }
}

export const useExpenseStore = defineStore('expense', () => {
  const expenses = ref<Expense[]>([])

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

  async function fetchExpenses() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    expenses.value = []

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error)
    } else {
      expenses.value = (data ?? []).map(rowToExpense)
    }
  }

  async function addExpense(newData: Omit<Expense, 'id' | 'userId'>) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        title: newData.title,
        amount: newData.amount,
        category: newData.category,
        date: newData.date,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding expense:', error)
      return
    }
    expenses.value.unshift(rowToExpense(data as DbRow))
  }

  async function deleteExpense(id: string) {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) {
      console.error('Error deleting expense:', error)
      return
    }
    expenses.value = expenses.value.filter((exp) => exp.id !== id)
  }

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
