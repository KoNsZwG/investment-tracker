// src/components/AddInvestmentForm.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useInvestmentStore } from '../stores/investmentStore'

const investmentStore = useInvestmentStore()

// Use ref() for each form field to bind to the <input> elements
const ticker = ref('')
const name = ref('')
const shares = ref<number | null>(null)
const purchasePrice = ref<number | null>(null)

function handleSubmit() {
  // Basic validation to make sure all fields are filled
  if (!ticker.value || !name.value || !shares.value || !purchasePrice.value) {
    alert('Please fill out all fields.')
    return
  }

  // Prepare new investment data omitting 'id' and 'dateAdded'
  const newInvestmentData = {
    name: name.value,
    shares: shares.value,
    purchasePrice: purchasePrice.value,
  }

  // Use ticker as the id argument
  investmentStore.addInvestment(ticker.value.toUpperCase(), newInvestmentData)

  // Clear the form fields for the next entry
  ticker.value = ''
  name.value = ''
  shares.value = null
  purchasePrice.value = null
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
    <h2 class="text-2xl font-bold text-white mb-4">Add New Investment</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Ticker Input -->
      <div>
        <label for="ticker" class="block text-sm font-medium text-gray-300">Ticker Symbol</label>
        <input
          v-model="ticker"
          type="text"
          id="ticker"
          placeholder="e.g., AAPL"
          class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-2 py-1"
        />
      </div>
      <!-- Name Input -->
      <div>
        <label for="name" class="block text-sm font-medium text-gray-300">Name</label>
        <input
          v-model="name"
          type="text"
          id="name"
          placeholder="e.g., Apple Inc."
          class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-2 py-1"
        />
      </div>
      <!-- Shares Input -->
      <div>
        <label for="shares" class="block text-sm font-medium text-gray-300">Number of Shares</label>
        <input
          v-model.number="shares"
          type="number"
          id="shares"
          step="any"
          placeholder="e.g., 10"
          class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-2 py-1"
        />
      </div>
      <!-- Purchase Price Input -->
      <div>
        <label for="purchasePrice" class="block text-sm font-medium text-gray-300"
          >Average Purchase Price</label
        >
        <input
          v-model.number="purchasePrice"
          type="number"
          id="purchasePrice"
          step="any"
          placeholder="e.g., 150.00"
          class="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-2 py-1"
        />
      </div>
    </div>
    <div class="mt-6">
      <button
        type="submit"
        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-800"
      >
        Add to Portfolio
      </button>
    </div>
  </form>
</template>
