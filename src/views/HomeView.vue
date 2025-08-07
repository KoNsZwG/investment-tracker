// src/views/HomeView.vue

<script setup lang="ts">
import { useInvestmentStore } from '../stores/InvestmentStore' // Corrected path alias
import AddInvestmentForm from '@/components/AddInvestmentForm.vue'
import PortfolioPieChart from '@/components/PortfolioPieChart.vue' // Import the new chart component
import { onMounted } from 'vue'

const investmentStore = useInvestmentStore()

onMounted(() => {
  investmentStore.fetchLivePrices()
})
</script>

<template>
  <main class="p-4 md:p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold text-green-400 mb-6 text-center">My Portfolio</h1>

    <AddInvestmentForm />

    <!-- NEW: Grid layout for Summary and Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Portfolio Summary Card -->
      <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-white">Portfolio Summary</h2>
          <button
            @click="investmentStore.fetchLivePrices"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="investmentStore.isLoading"
          >
            {{ investmentStore.isLoading ? 'Refreshing...' : 'Refresh Prices' }}
          </button>
        </div>
        <div class="space-y-2">
          <p class="text-gray-400 flex justify-between">
            <span>Total Cost:</span>
            <span class="font-bold text-gray-300"
              >${{ investmentStore.portfolioTotalCost.toFixed(2) }}</span
            >
          </p>
          <p class="text-gray-400 flex justify-between">
            <span>Current Value:</span>
            <span class="font-bold text-green-500"
              >${{ investmentStore.portfolioCurrentValue.toFixed(2) }}</span
            >
          </p>
        </div>
      </div>

      <!-- Portfolio Chart Card -->
      <PortfolioPieChart
        v-if="investmentStore.investments.length > 0"
        :investments="investmentStore.investments"
      />
      <!-- Show a placeholder if the portfolio is empty -->
      <div
        v-else
        class="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center text-gray-500"
      >
        Chart will appear here once you add an investment.
      </div>
    </div>

    <!-- The list of investments -->
    <div class="space-y-4">
      <!-- Show a message if there are no investments -->
      <div
        v-if="investmentStore.investments.length === 0"
        class="text-center text-gray-500 bg-gray-800 p-8 rounded-lg"
      >
        Your portfolio is empty. Add an investment to get started!
      </div>

      <div
        v-else
        v-for="investment in investmentStore.investments"
        :key="investment.id"
        class="bg-gray-700 p-4 rounded-lg shadow-md grid grid-cols-3 gap-4 items-center"
      >
        <!-- Column 1: Name and Shares -->
        <div class="col-span-1">
          <h3 class="text-lg font-bold text-white">{{ investment.name }} ({{ investment.id }})</h3>
          <p class="text-sm text-gray-300">Shares: {{ investment.shares }}</p>
          <p class="text-sm text-gray-300">Avg. Cost: ${{ investment.purchasePrice.toFixed(2) }}</p>
        </div>

        <!-- Column 2: Live Price and Gain/Loss -->
        <div class="col-span-1 text-center">
          <div v-if="investment.error" class="text-red-400 text-sm">
            <p class="font-bold">Error</p>
            <p>{{ investment.error }}</p>
          </div>
          <div v-else-if="investment.currentPrice" class="text-right">
            <p
              class="text-xl font-semibold"
              :class="
                investment.currentPrice >= investment.purchasePrice
                  ? 'text-green-400'
                  : 'text-red-400'
              "
            >
              ${{ investment.currentPrice.toFixed(2) }}
            </p>
            <p
              class="text-xs"
              :class="
                investment.currentPrice >= investment.purchasePrice
                  ? 'text-green-500'
                  : 'text-red-500'
              "
            >
              {{
                (
                  ((investment.currentPrice - investment.purchasePrice) /
                    investment.purchasePrice) *
                  100
                ).toFixed(2)
              }}%
            </p>
          </div>
          <div v-else class="text-gray-500 text-sm animate-pulse">Fetching...</div>
        </div>

        <!-- Column 3: Delete Button -->
        <div class="col-span-1 flex justify-end">
          <button
            @click="investmentStore.deleteInvestment(investment.id)"
            class="bg-red-600 hover:bg-red-800 text-white font-bold p-2 rounded-full h-10 w-10 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
