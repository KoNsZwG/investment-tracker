import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Investment } from '@/types'
import { supabase } from '@/lib/supabase'
import { fetchQuote } from '@/services/apiService'

const CACHE_DURATION_MS = 15 * 60 * 1000

type DbRow = Record<string, unknown>

function rowToInvestment(row: DbRow): Investment {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    symbol: row.symbol as string,
    name: row.name as string,
    shares: row.shares as number,
    purchasePrice: row.purchase_price as number,
    dateAdded: row.date_added as string,
  }
}

export const useInvestmentStore = defineStore('investment', () => {
  const investments = ref<Investment[]>([])
  const isLoading = ref(false)

  const portfolioTotalCost = computed(() =>
    investments.value.reduce((total, inv) => total + inv.shares * inv.purchasePrice, 0),
  )

  const portfolioCurrentValue = computed(() =>
    investments.value.reduce((total, inv) => {
      const price = inv.currentPrice ?? inv.purchasePrice
      return total + inv.shares * price
    }, 0),
  )

  const portfolioTodayGainLoss = computed(() =>
    investments.value.reduce((total, inv) => {
      if (inv.dailyChange) return total + inv.shares * inv.dailyChange
      return total
    }, 0),
  )

  const investmentsByMonth = computed(() => {
    const monthlyData: Record<string, number> = {}
    investments.value.forEach((inv) => {
      if (inv.dateAdded) {
        const month = inv.dateAdded.slice(0, 7)
        monthlyData[month] = (monthlyData[month] || 0) + inv.shares * inv.purchasePrice
      }
    })
    return monthlyData
  })

  async function fetchInvestments() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    isLoading.value = true
    investments.value = []

    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching investments:', error)
    } else {
      investments.value = (data ?? []).map(rowToInvestment)
      await fetchAllLivePrices()
    }
    isLoading.value = false
  }

  async function addInvestment(newData: {
    symbol: string
    name: string
    shares: number
    purchasePrice: number
  }) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('investments')
      .insert({
        user_id: user.id,
        symbol: newData.symbol.toUpperCase(),
        name: newData.name,
        shares: newData.shares,
        purchase_price: newData.purchasePrice,
        date_added: new Date().toISOString().slice(0, 10),
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding investment:', error)
      return
    }
    const newInvestment = rowToInvestment(data as DbRow)
    investments.value.unshift(newInvestment)
    await fetchSinglePrice(newInvestment)
  }

  async function deleteInvestment(id: string) {
    const { error } = await supabase.from('investments').delete().eq('id', id)
    if (error) {
      console.error('Error deleting investment:', error)
      return
    }
    investments.value = investments.value.filter((inv) => inv.id !== id)
  }

  async function updateInvestment(
    id: string,
    updatedData: { shares: number; purchasePrice: number },
  ) {
    const { error } = await supabase
      .from('investments')
      .update({ shares: updatedData.shares, purchase_price: updatedData.purchasePrice })
      .eq('id', id)

    if (error) {
      console.error('Error updating investment:', error)
      return
    }
    const inv = investments.value.find((i) => i.id === id)
    if (inv) {
      inv.shares = updatedData.shares
      inv.purchasePrice = updatedData.purchasePrice
    }
  }

  async function clearPortfolio() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    if (investments.value.length === 0) {
      alert('Portfolio is already empty.')
      return
    }

    const { error } = await supabase.from('investments').delete().eq('user_id', user.id)
    if (error) {
      console.error('Error clearing portfolio:', error)
      alert('Failed to clear portfolio.')
      return
    }
    investments.value = []
    alert('Portfolio cleared successfully.')
  }

  function clearStore() {
    investments.value = []
  }

  async function fetchSinglePrice(investment: Investment) {
    const now = Date.now()
    if (investment.lastFetched && now - investment.lastFetched < CACHE_DURATION_MS) return

    investment.error = undefined
    investment.currentPrice = undefined
    investment.dailyChange = undefined
    investment.dailyChangePercent = undefined

    try {
      const quote = await fetchQuote(investment.symbol)
      investment.currentPrice = quote.price
      investment.dailyChange = quote.change
      investment.dailyChangePercent = quote.changesPercentage
      investment.lastFetched = Date.now()
    } catch (error: unknown) {
      console.error(`Failed to fetch price for ${investment.symbol}:`, error)
      investment.error = error instanceof Error ? error.message : String(error)
    }
  }

  async function fetchAllLivePrices() {
    isLoading.value = true
    await Promise.all(investments.value.map((inv) => fetchSinglePrice(inv)))
    isLoading.value = false
  }

  return {
    investments,
    isLoading,
    portfolioTotalCost,
    portfolioCurrentValue,
    portfolioTodayGainLoss,
    investmentsByMonth,
    fetchInvestments,
    addInvestment,
    deleteInvestment,
    updateInvestment,
    clearPortfolio,
    clearStore,
    fetchAllLivePrices,
    fetchSinglePrice,
  }
})
