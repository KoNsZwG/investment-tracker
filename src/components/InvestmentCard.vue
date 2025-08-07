// src/components/InvestmentCard.vue
<script setup lang="ts">
import { useInvestmentStore } from '../stores/InvestmentStore' // Corrected path alias
import type { Investment } from '@/types'

// This component receives the specific investment object as a prop
defineProps<{
  investment: Investment
}>()

const investmentStore = useInvestmentStore()
</script>

<template>
  <div class="bg-gray-700 p-4 rounded-lg shadow-md grid grid-cols-3 gap-4 items-center">
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
            investment.currentPrice >= investment.purchasePrice ? 'text-green-400' : 'text-red-400'
          "
        >
          ${{ investment.currentPrice.toFixed(2) }}
        </p>
        <p
          class="text-xs"
          :class="
            investment.currentPrice >= investment.purchasePrice ? 'text-green-500' : 'text-red-500'
          "
        >
          {{
            (
              ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) *
              100
            ).toFixed(2)
          }}%
        </p>
      </div>
      <div v-else class="text-gray-500 text-sm animate-pulse">Fetching...</div>
    </div>

    <!-- Column 3: Action Buttons -->
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
</template>
