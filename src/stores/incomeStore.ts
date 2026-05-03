import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Income } from '@/types'
import { supabase } from '@/lib/supabase'

type DbRow = Record<string, unknown>

function rowToIncome(row: DbRow): Income {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    amount: row.amount as number,
    category: row.category as Income['category'],
    date: row.date as string,
  }
}

export const useIncomeStore = defineStore('income', () => {
  const incomeSources = ref<Income[]>([])

  const incomeByMonth = computed(() => {
    const monthlyData: Record<string, number> = {}
    incomeSources.value.forEach((inc) => {
      const month = inc.date.slice(0, 7)
      monthlyData[month] = (monthlyData[month] || 0) + inc.amount
    })
    return monthlyData
  })

  async function fetchIncome() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    incomeSources.value = []

    const { data, error } = await supabase
      .from('income')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching income:', error)
    } else {
      incomeSources.value = (data ?? []).map(rowToIncome)
    }
  }

  async function addIncome(newData: Omit<Income, 'id' | 'userId'>) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('income')
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
      console.error('Error adding income:', error)
      return
    }
    incomeSources.value.unshift(rowToIncome(data as DbRow))
  }

  async function deleteIncome(id: string) {
    const { error } = await supabase.from('income').delete().eq('id', id)
    if (error) {
      console.error('Error deleting income:', error)
      return
    }
    incomeSources.value = incomeSources.value.filter((inc) => inc.id !== id)
  }

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
