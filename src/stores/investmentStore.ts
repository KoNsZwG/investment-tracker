// src/stores/investmentStore.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue' // <-- Import 'watch'
import type { Investment } from '@/types'

const alphaVantageApiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY
const LOCAL_STORAGE_KEY = 'my_investment_portfolio'

export const useInvestmentStore = defineStore('investment', () => {
  // --- STATE ---
  // Try to load initial state from Local Storage, or use sample data as a fallback.
  const initialData = localStorage.getItem(LOCAL_STORAGE_KEY)
  const investments = ref<Investment[]>(
    initialData
      ? JSON.parse(initialData)
      : [
          { id: 'AAPL', name: 'Apple Inc.', shares: 10, purchasePrice: 150 },
          { id: 'GOOGL', name: 'Alphabet Inc.', shares: 5, purchasePrice: 120 },
          { id: 'VOO', name: 'Vanguard S&P 500 ETF', shares: 20, purchasePrice: 380 },
        ],
  )
  const isLoading = ref(false)

  // --- WATCHER ---
  // This is a powerful feature. It watches the 'investments' state and runs a function
  // whenever it changes.
  watch(
    investments,
    (newInvestments) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newInvestments))
    },
    { deep: true }, // 'deep: true' is crucial to watch for changes inside the array
  )

  // --- GETTERS ---
  // ... (portfolioTotalCost and portfolioCurrentValue are the same)
  const portfolioTotalCost = computed(() =>
    investments.value.reduce((total, inv) => total + inv.shares * inv.purchasePrice, 0),
  )
  const portfolioCurrentValue = computed(() =>
    investments.value.reduce((total, inv) => {
      const price = inv.currentPrice ?? inv.purchasePrice
      return total + inv.shares * price
    }, 0),
  )

  // --- ACTIONS ---
  async function fetchSinglePrice(investment: Investment) {
    if (!alphaVantageApiKey) return

    investment.error = undefined
    investment.currentPrice = undefined

    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${investment.id}&apikey=${alphaVantageApiKey}`
      const response = await fetch(url)
      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      const quote = data['Global Quote']

      if (data.Note) throw new Error('API limit reached.')
      if (quote && quote['05. price'] && Object.keys(quote).length > 0) {
        investment.currentPrice = parseFloat(quote['05. price'])
      } else {
        throw new Error('Invalid ticker.')
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to fetch price for ${investment.id}:`, error)
      investment.error = error.message
    }
  }
  function addInvestment(newInvestment: Investment) {
    // ... (existing addInvestment function is the same)
    const existing = investments.value.find((inv) => inv.id === newInvestment.id)
    if (existing) {
      alert('Investment already exists!')
      return
    }
    investments.value.push(newInvestment)
    fetchSinglePrice(newInvestment)
  }

  // NEW ACTION: Delete an investment by its ID
  function deleteInvestment(investmentId: string) {
    investments.value = investments.value.filter((inv) => inv.id !== investmentId)
  }

  // NEW ACTION: Find an investment by its ID and update its data
  function updateInvestment(
    investmentId: string,
    updatedData: { shares: number; purchasePrice: number },
  ) {
    const investment = investments.value.find((inv) => inv.id === investmentId)
    if (investment) {
      investment.shares = updatedData.shares
      investment.purchasePrice = updatedData.purchasePrice
      // After updating, let's re-fetch prices to update the current value
    }
  }

  async function fetchAllLivePrices() {
    if (!alphaVantageApiKey) {
      console.error('Alpha Vantage API key is missing!')
      return
    }
    if (investments.value.length === 0) return

    isLoading.value = true
    try {
      const pricePromises = investments.value.map(async (investment) => {
        // Clear any previous errors before fetching
        investment.error = undefined
        investment.currentPrice = undefined // Clear old price to show loading state

        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${investment.id}&apikey=${alphaVantageApiKey}`
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }
        const data = await response.json()

        const quote = data['Global Quote']

        // Alpha Vantage sends a "Note" when you hit the API limit
        if (data.Note) {
          throw new Error('API limit reached. Try again later.')
        }

        if (quote && quote['05. price'] && Object.keys(quote).length > 0) {
          investment.currentPrice = parseFloat(quote['05. price'])
        } else {
          // This means the ticker is likely invalid
          throw new Error('Invalid ticker or no data available.')
        }
      })

      // Promise.allSettled is better here than Promise.all
      // It will wait for ALL promises to finish, even if some fail.
      const results = await Promise.allSettled(pricePromises)

      // Log any individual errors that were caught
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          const investmentId = investments.value[index].id
          console.error(`Failed to fetch price for ${investmentId}:`, result.reason)
          // Store the error message on the specific investment
          investments.value[index].error = result.reason.message
        }
      })
    } catch (error) {
      // This catches network errors or other unexpected issues
      console.error('A general error occurred during fetch:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    investments,
    isLoading,
    portfolioTotalCost,
    portfolioCurrentValue,
    addInvestment,
    deleteInvestment,
    updateInvestment,
    fetchSinglePrice,
    fetchAllLivePrices,
  }
})
