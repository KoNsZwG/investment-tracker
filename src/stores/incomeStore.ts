// src/stores/incomeStore.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Income } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { computed as vueComputed } from 'vue'

const INCOME_STORAGE_KEY = 'my_income_list'

export const useIncomeStore = defineStore('income', () => {
  // --- STATE ---
  const initialData = localStorage.getItem(INCOME_STORAGE_KEY)
  const incomeSources = ref<Income[]>(initialData ? JSON.parse(initialData) : [])

  // --- WATCHER ---
  watch(
    incomeSources,
    (newIncome) => {
      localStorage.setItem(INCOME_STORAGE_KEY, JSON.stringify(newIncome))
    },
    { deep: true },
  )

  // --- GETTERS ---
  const incomeByMonth = computed(() => {
    const monthlyData: Record<string, number> = {}
    incomeSources.value.forEach((inc) => {
      const month = inc.date.slice(0, 7) // 'YYYY-MM'
      monthlyData[month] = (monthlyData[month] || 0) + inc.amount
    })
    return monthlyData
  })

  // --- ACTIONS ---
  function addIncome(newIncomeData: Omit<Income, 'id'>) {
    const newIncome: Income = {
      ...newIncomeData,
      id: uuidv4(),
    }
    incomeSources.value.unshift(newIncome)
  }

  function deleteIncome(incomeId: string) {
    incomeSources.value = incomeSources.value.filter((inc) => inc.id !== incomeId)
  }

  return {
    incomeSources,
    incomeByMonth,
    addIncome,
    deleteIncome,
  }
})
function computed<T>(getter: () => T) {
  return vueComputed(getter)
}
