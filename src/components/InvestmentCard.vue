// src/components/InvestmentCard.vue
<script setup lang="ts">
import { computed } from 'vue'
// import { useInvestmentStore } from '../stores/InvestmentStore'
import type { Investment } from '@/types'

const props = defineProps<{
  investment: Investment
}>()

// const investmentStore = useInvestmentStore()

// --- NEW COMPUTED PROPERTIES ---
// Calculate the total initial cost for this specific holding
const totalCost = computed(() => props.investment.shares * props.investment.purchasePrice)

// Calculate the total current value for this specific holding
const totalValue = computed(() => {
  if (props.investment.currentPrice) {
    return props.investment.shares * props.investment.currentPrice
  }
  return totalCost.value // Fallback to cost if no live price
})

// Calculate the total gain/loss in dollars
const totalGainLoss = computed(() => totalValue.value - totalCost.value)

// Calculate the total gain/loss as a percentage
const totalGainLossPercent = computed(() => {
  if (totalCost.value === 0) return 0
  return (totalGainLoss.value / totalCost.value) * 100
})

// We'll add daily gain/loss later once we fetch that data
</script>

<template>
  <div class="bg-brand-card p-4 rounded-lg shadow-md text-white">
    <!-- Top Section: Ticker and Name -->
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-xl font-bold">{{ investment.id }}</h3>
      <!-- We can add a "Technology" tag here later -->
    </div>
    <p class="text-sm text-brand-secondary mb-4">{{ investment.name }}</p>

    <!-- Middle Section: Live Price and Daily Change (Placeholder for now) -->
    <div class="flex justify-between items-baseline mb-4">
      <p v-if="investment.currentPrice" class="text-3xl font-bold">
        ${{ investment.currentPrice.toFixed(2) }}
      </p>
      <p v-else class="text-3xl font-bold text-brand-secondary animate-pulse">$--.--</p>
      <!-- Placeholder for daily change -->
      <p class="text-sm text-brand-secondary">Daily change will go here</p>
    </div>

    <!-- Bottom Section: Your Holding Details -->
    <div class="border-t border-gray-600 pt-4">
      <div class="flex justify-between text-sm mb-2">
        <span class="text-brand-secondary">Shares</span>
        <span>{{ investment.shares }}</span>
      </div>
      <div class="flex justify-between text-sm mb-2">
        <span class="text-brand-secondary">Total Value</span>
        <span>${{ totalValue.toFixed(2) }}</span>
      </div>
      <div class="flex justify-between text-sm font-bold">
        <span class="text-brand-secondary">Total Gain/Loss</span>
        <span :class="totalGainLoss >= 0 ? 'text-brand-primary' : 'text-brand-danger'">
          {{ totalGainLoss >= 0 ? '+' : '' }}${{ totalGainLoss.toFixed(2) }} ({{
            totalGainLossPercent.toFixed(2)
          }}%)
        </span>
      </div>
    </div>

    <!-- We'll add the edit/delete buttons back in a cleaner way later -->
  </div>
</template>
