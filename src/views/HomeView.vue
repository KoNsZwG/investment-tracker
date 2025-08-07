<script setup lang="ts">
import { useInvestmentStore } from '../stores/InvestmentStore' // Corrected path alias
import AddInvestmentForm from '@/components/AddInvestmentForm.vue'
import PortfolioPieChart from '@/components/PortfolioPieChart.vue' // Import the new chart component
import InvestmentCard from '@/components/InvestmentCard.vue'
import { onMounted } from 'vue'

const investmentStore = useInvestmentStore()

onMounted(() => {
  investmentStore.fetchAllLivePrices()
})
</script>

<template>
  <main class="p-4 md:p-8 max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold text-white mb-2 text-center">Portfolio Overview</h1>
    <p class="text-brand-secondary mb-8 text-center">Track your investments and performance</p>

    <AddInvestmentForm />

    <!-- Portfolio Summary Grid -->
    <h2 class="text-2xl font-bold text-white mb-4 mt-8">Portfolio Summary</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Card 1: Total Value -->
      <div class="bg-brand-card p-6 rounded-lg shadow-lg">
        <p class="text-sm text-brand-secondary mb-1">Total Value</p>
        <p class="text-3xl font-bold text-white">
          ${{ investmentStore.portfolioCurrentValue.toFixed(2) }}
        </p>
      </div>

      <!-- Card 2: Total Invested (Cost) -->
      <div class="bg-brand-card p-6 rounded-lg shadow-lg">
        <p class="text-sm text-brand-secondary mb-1">Total Invested</p>
        <p class="text-3xl font-bold text-white">
          ${{ investmentStore.portfolioTotalCost.toFixed(2) }}
        </p>
      </div>

      <!-- Card 3: Total Return -->
      <div class="bg-brand-card p-6 rounded-lg shadow-lg">
        <p class="text-sm text-brand-secondary mb-1">Total Return</p>
        <p
          class="text-3xl font-bold"
          :class="
            investmentStore.portfolioCurrentValue >= investmentStore.portfolioTotalCost
              ? 'text-brand-primary'
              : 'text-brand-danger'
          "
        >
          {{
            investmentStore.portfolioCurrentValue >= investmentStore.portfolioTotalCost ? '+' : ''
          }}${{
            (investmentStore.portfolioCurrentValue - investmentStore.portfolioTotalCost).toFixed(2)
          }}
        </p>
      </div>
    </div>

    <!-- NEW: Asset Allocation & Investments Section (Two-Column Layout) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- Left Column: Chart -->
      <div class="lg:col-span-1">
        <!-- The v-if is on the component itself, which is fine -->
        <PortfolioPieChart
          v-if="investmentStore.investments.length > 0"
          :investments="investmentStore.investments"
        />
        <div
          v-else
          class="bg-brand-card p-6 rounded-lg shadow-lg flex items-center justify-center text-gray-500 h-full"
        >
          Chart will appear here.
        </div>
      </div>

      <div class="lg:col-span-2">
        <h2 class="text-2xl font-bold text-white mb-4">Your Investments</h2>

        <div v-if="investmentStore.investments.length > 0">
          <!-- THIS IS THE WRAPPER FOR OUR ANIMATION -->
          <TransitionGroup name="fade" tag="div" class="space-y-4">
            <InvestmentCard
              v-for="investment in investmentStore.investments"
              :key="investment.id"
              :investment="investment"
            />
          </TransitionGroup>
        </div>

        <div v-else class="text-center text-gray-500 bg-brand-card p-8 rounded-lg">
          Your portfolio is empty. Add an investment to get started!
        </div>
      </div>
    </div>
  </main>
</template>

<!-- ADD THIS STYLE BLOCK AT THE VERY END OF THE FILE -->
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
