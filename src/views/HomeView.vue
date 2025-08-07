<script setup lang="ts">
import { useInvestmentStore } from '../stores/investmentStore' // Corrected path alias
import AddInvestmentForm from '@/components/AddInvestmentForm.vue'
import PortfolioPieChart from '@/components/PortfolioPieChart.vue' // Import the new chart component
import InvestmentCard from '@/components/InvestmentCard.vue'
import { computed, onMounted } from 'vue'
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from '@heroicons/vue/24/solid'

import { ref } from 'vue'

const investmentStore = useInvestmentStore()
const isAddFormVisible = ref(false)
const totalReturn = computed(
  () => investmentStore.portfolioCurrentValue - investmentStore.portfolioTotalCost,
)
onMounted(() => {
  investmentStore.fetchAllLivePrices()
})
</script>
<template>
  <!-- THIS IS THE KEY CHANGE: We use the same max-width and padding as the Navbar -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div class="text-left">
        <h1 class="text-3xl font-bold text-white">Financial Analyst of Investments and Expenses</h1>
        <p class="text-brand-secondary mt-2">Track your Investments and Performance</p>
      </div>

      <div>
        <button
          @click="isAddFormVisible = !isAddFormVisible"
          class="bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <span class="mr-2">+</span> Add Investment
        </button>
      </div>
    </div>

    <Transition name="fade">
      <AddInvestmentForm v-if="isAddFormVisible" class="mb-8" />
    </Transition>

    <!-- Portfolio Summary Grid -->

    <h2 class="text-2xl font-bold text-white mb-4 mt-8">Portfolio Summary</h2>
    <!-- CORRECTED GRID: Now uses lg:grid-cols-4 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Card 1: Total Value -->
      <div class="card">
        <p class="text-sm text-brand-secondary mb-1">Total Value</p>
        <p class="text-3xl font-bold text-white">
          ${{ investmentStore.portfolioCurrentValue.toFixed(2) }}
        </p>
      </div>
      <!-- Card 2: Today's Gain/Loss -->
      <div class="card">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-brand-secondary mb-1">Today's Gain/Loss</p>
            <p
              class="text-3xl font-bold"
              :class="
                investmentStore.portfolioTodayGainLoss >= 0
                  ? 'text-brand-primary'
                  : 'text-brand-danger'
              "
            >
              {{ investmentStore.portfolioTodayGainLoss >= 0 ? '+' : '' }}${{
                investmentStore.portfolioTodayGainLoss.toFixed(2)
              }}
            </p>
          </div>
          <component
            :is="
              investmentStore.portfolioTodayGainLoss >= 0
                ? ArrowTrendingUpIcon
                : ArrowTrendingDownIcon
            "
            class="h-6 w-6"
            :class="
              investmentStore.portfolioTodayGainLoss >= 0
                ? 'text-brand-primary'
                : 'text-brand-danger'
            "
          />
        </div>
      </div>
      <!-- Card 3: Total Invested -->
      <div class="card">
        <p class="text-sm text-brand-secondary mb-1">Total Invested</p>
        <p class="text-3xl font-bold text-white">
          ${{ investmentStore.portfolioTotalCost.toFixed(2) }}
        </p>
      </div>
      <!-- Card 4: Total Return -->
      <div class="card">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-brand-secondary mb-1">Total Return</p>
            <p
              class="text-3xl font-bold"
              :class="totalReturn >= 0 ? 'text-brand-primary' : 'text-brand-danger'"
            >
              {{ totalReturn >= 0 ? '+' : '' }}${{ totalReturn.toFixed(2) }}
            </p>
          </div>
          <component
            :is="totalReturn >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon"
            class="h-6 w-6"
            :class="totalReturn >= 0 ? 'text-brand-primary' : 'text-brand-danger'"
          />
        </div>
      </div>
    </div>

    <!-- Asset Allocation & Investments Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <!-- Left Column: Chart -->
      <div class="lg:col-span-1">
        <PortfolioPieChart
          v-if="investmentStore.investments.length > 0"
          :investments="investmentStore.investments"
          class="card"
        />
        <div
          v-else
          class="bg-brand-card p-6 rounded-lg shadow-lg flex items-center justify-center text-gray-500 h-full"
        >
          Chart will appear here.
        </div>
      </div>

      <!-- Right Column: Investments List -->
      <div class="lg:col-span-2">
        <h2 class="text-2xl font-bold text-white mb-4">Your Investments</h2>
        <div v-if="investmentStore.investments.length > 0">
          <TransitionGroup name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InvestmentCard
              v-for="investment in investmentStore.investments"
              :key="investment.id"
              :investment="investment"
              class="card"
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
