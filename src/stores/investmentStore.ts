// src/stores/investmentStore.ts

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Investment } from '@/types'
import { db, auth } from '@/firebase' // Import Firestore and Auth
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { fetchQuote } from '@/services/apiService'

const CACHE_DURATION_MS = 15 * 60 * 1000 // 15 minutes

export const useInvestmentStore = defineStore('investment', () => {
  // --- STATE ---
  const investments = ref<Investment[]>([])
  const isLoading = ref(false)

  // --- GETTERS ---
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
      if (inv.dailyChange) {
        return total + inv.shares * inv.dailyChange
      }
      return total
    }, 0),
  )

  const investmentsByMonth = computed(() => {
    const monthlyData: Record<string, number> = {}
    investments.value.forEach((inv) => {
      if (inv.dateAdded) {
        const month = inv.dateAdded.slice(0, 7)
        const cost = inv.shares * inv.purchasePrice
        monthlyData[month] = (monthlyData[month] || 0) + cost
      }
    })
    return monthlyData
  })

  // --- ACTIONS ---

  // Fetches from Firestore for the currently logged-in user
  async function fetchInvestments() {
    const user = auth.currentUser
    if (!user) return

    investments.value = []
    isLoading.value = true

    const investmentsCollectionRef = collection(db, 'investments')
    const q = query(investmentsCollectionRef, where('userId', '==', user.uid))

    try {
      const querySnapshot = await getDocs(q)
      const fetchedInvestments: Investment[] = []
      querySnapshot.forEach((doc) => {
        fetchedInvestments.push({
          ...(doc.data() as Omit<Investment, 'firestoreId'>),
          firestoreId: doc.id,
        })
      })
      investments.value = fetchedInvestments
      await fetchAllLivePrices()
    } catch (error) {
      console.error('Error fetching investments from Firestore:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Adds a new investment to Firestore
  async function addInvestment(newInvestmentData: {
    id: string
    name: string
    shares: number
    purchasePrice: number
  }) {
    const user = auth.currentUser
    if (!user) return

    const investmentToAdd = {
      ...newInvestmentData,
      id: newInvestmentData.id.toUpperCase(), // This is now safe
      dateAdded: new Date().toISOString().slice(0, 10),
      userId: user.uid,
    }

    try {
      const docRef = await addDoc(collection(db, 'investments'), investmentToAdd)
      const newInvestment = { ...investmentToAdd, firestoreId: docRef.id }
      investments.value.unshift(newInvestment)
      await fetchSinglePrice(newInvestment)
    } catch (error) {
      console.error('Error adding investment:', error)
    }
  }

  // Deletes an investment from Firestore
  async function deleteInvestment(firestoreId: string) {
    try {
      await deleteDoc(doc(db, 'investments', firestoreId))
      investments.value = investments.value.filter((inv) => inv.firestoreId !== firestoreId)
    } catch (error) {
      console.error('Error deleting investment from Firestore:', error)
    }
  }

  // Updates an investment in Firestore
  async function updateInvestment(
    firestoreId: string,
    updatedData: { shares: number; purchasePrice: number },
  ) {
    const investmentDocRef = doc(db, 'investments', firestoreId)
    try {
      await updateDoc(investmentDocRef, updatedData)
      const investmentInState = investments.value.find((inv) => inv.firestoreId === firestoreId)
      if (investmentInState) {
        investmentInState.shares = updatedData.shares
        investmentInState.purchasePrice = updatedData.purchasePrice
      }
    } catch (error) {
      console.error('Error updating investment in Firestore:', error)
    }
  }

  async function clearPortfolio() {
    const user = auth.currentUser
    if (!user) return

    const investmentsCollectionRef = collection(db, 'investments')
    const q = query(investmentsCollectionRef, where('userId', '==', user.uid))

    try {
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) {
        alert('Portfolio is already empty.')
        return
      }

      const batch = writeBatch(db)
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref)
      })
      await batch.commit()

      investments.value = [] // Clear local state
      alert('Portfolio cleared successfully.')
    } catch (error) {
      console.error('Error clearing portfolio:', error)
      alert('Failed to clear portfolio.')
    }
  }

  // Clears the local state when a user logs out
  function clearStore() {
    investments.value = []
  }

  // --- API Fetching Actions (Internal) ---

  async function fetchSinglePrice(investment: Investment) {
    const now = Date.now()
    if (investment.lastFetched && now - investment.lastFetched < CACHE_DURATION_MS) {
      return
    }

    investment.error = undefined
    investment.currentPrice = undefined
    investment.dailyChange = undefined
    investment.dailyChangePercent = undefined

    try {
      const quote = await fetchQuote(investment.id)
      investment.currentPrice = quote.price
      investment.dailyChange = quote.change
      investment.dailyChangePercent = quote.changesPercentage
      investment.lastFetched = Date.now()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Failed to fetch price for ${investment.id}:`, error)
      investment.error = error.message
    }
  }

  async function fetchAllLivePrices() {
    isLoading.value = true
    const pricePromises = investments.value.map((inv) => fetchSinglePrice(inv))
    await Promise.all(pricePromises)
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
