// src/components/AddInvestmentForm.vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useInvestmentStore } from '@/stores/investmentStore'
import { searchSymbols } from '@/services/apiService' // Import the API service for searching symbols

import type { SearchResult } from '@/types' // Import the SearchResult type

const investmentStore = useInvestmentStore()

// --- FORM STATE ---
const ticker = ref('')
const name = ref('')
const shares = ref<number | null>(null)
const purchasePrice = ref<number | null>(null)

// --- AUTOCOMPLETE STATE ---
const searchResults = ref<SearchResult[]>([])
const isSearchLoading = ref(false)
const isDropdownVisible = ref(false)
let debounceTimer: number | undefined

// --- DEBOUNCE LOGIC using a watcher ---
watch(ticker, (newTicker) => {
  // Clear previous results and timer
  searchResults.value = []
  clearTimeout(debounceTimer)

  if (newTicker.length < 1) {
    isDropdownVisible.value = false
    return
  }

  isSearchLoading.value = true
  isDropdownVisible.value = true

  // Set a new timer
  debounceTimer = setTimeout(async () => {
    try {
      searchResults.value = await searchSymbols(newTicker) // <-- Use the service
    } catch (error) {
      console.error('Failed to fetch search results:', error)
    } finally {
      isSearchLoading.value = false
    }
  }, 300)
})

// --- EVENT HANDLERS ---
function handleResultClick(result: SearchResult) {
  ticker.value = result['1. symbol']
  name.value = result['2. name']
  isDropdownVisible.value = false // Hide dropdown after selection
}

function handleSubmit() {
  if (!ticker.value || !name.value || !shares.value || !purchasePrice.value) {
    alert('Please fill out all fields with valid numbers.')
    return
  }
  // This object now matches what the store's addInvestment function expects
  const newInvestmentData = {
    id: ticker.value,
    name: name.value,
    shares: shares.value,
    purchasePrice: purchasePrice.value,
  }
  investmentStore.addInvestment(newInvestmentData)

  // Reset form
  ticker.value = ''
  name.value = ''
  shares.value = null
  purchasePrice.value = null
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="card mb-8">
    <h2 class="text-2xl font-bold text-white mb-4">Add New Investment</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      <!-- Ticker Input with Autocomplete -->
      <div class="relative">
        <label for="ticker" class="block text-sm font-medium text-brand-secondary"
          >Ticker Symbol</label
        >
        <input
          v-model="ticker"
          @focus="isDropdownVisible = true"
          type="text"
          id="ticker"
          placeholder="e.g., AAPL"
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        />

        <!-- Autocomplete Dropdown -->
        <div
          v-if="isDropdownVisible && ticker.length > 0"
          class="absolute z-10 w-full mt-1 bg-brand-card border border-brand-border rounded-md shadow-lg"
        >
          <div v-if="isSearchLoading" class="px-4 py-2 text-sm text-gray-400">Searching...</div>
          <ul v-else-if="searchResults.length > 0">
            <li
              v-for="result in searchResults"
              :key="result['1. symbol']"
              @click="handleResultClick(result)"
              class="px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
            >
              <span class="font-bold">{{ result['1. symbol'] }}</span> -
              <span>{{ result['2. name'] }}</span>
            </li>
          </ul>
          <div v-else class="px-4 py-2 text-sm text-gray-400">No results found.</div>
        </div>
      </div>

      <!-- Name Input -->
      <div>
        <label for="name" class="block text-sm font-medium text-brand-secondary">Name</label>
        <input
          v-model="name"
          type="text"
          id="name"
          placeholder="e.g., Apple Inc."
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        />
      </div>
      <!-- Shares Input -->
      <div>
        <label for="shares" class="block text-sm font-medium text-brand-secondary"
          >Number of Shares</label
        >
        <input
          v-model.number="shares"
          type="number"
          id="shares"
          step="any"
          placeholder="e.g., 10"
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        />
      </div>
      <!-- Purchase Price Input -->
      <div>
        <label for="purchasePrice" class="block text-sm font-medium text-brand-secondary"
          >Average Purchase Price</label
        >
        <input
          v-model.number="purchasePrice"
          type="number"
          id="purchasePrice"
          step="any"
          placeholder="e.g., 150.00"
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        />
      </div>
    </div>
    <div class="mt-6">
      <button
        type="submit"
        class="w-full bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Add to Portfolio
      </button>
    </div>
  </form>
</template>
