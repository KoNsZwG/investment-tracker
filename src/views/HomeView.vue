// src/views/HomeView.vue
<script setup lang="ts">
import { useInvestmentStore } from '@/stores/investmentStore'
import { useExpenseStore } from '@/stores/expenseStore'
import PortfolioPieChart from '@/components/PortfolioPieChart.vue'
import ExpenseDoughnutChart from '@/components/ExpenseDoughnutChart.vue'
import { onMounted, computed } from 'vue'
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/vue/24/outline'
import { formatCurrency } from '@/utils/formatters'

const investmentStore = useInvestmentStore()
const expenseStore = useExpenseStore()

const totalReturn = computed(
  () => investmentStore.portfolioCurrentValue - investmentStore.portfolioTotalCost,
)

onMounted(() => {
  investmentStore.fetchAllLivePrices()
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="text-left mb-8">
      <h1 class="text-3xl font-bold text-white">Dashboard Overview</h1>
      <p class="text-brand-secondary mt-2">A high-level overview of your financial status.</p>
    </div>

    <!-- Portfolio Summary Grid -->
    <h2 class="text-2xl font-bold text-white mb-4 mt-8">Financial Summary</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Card 1: Total Value -->
      <div class="card">
        <p class="text-sm text-brand-secondary mb-1">Total Value</p>
        <p class="text-3xl font-bold text-white">
          {{ formatCurrency(investmentStore.portfolioCurrentValue) }}
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
              {{ investmentStore.portfolioTodayGainLoss >= 0 ? '+' : ''
              }}{{ formatCurrency(investmentStore.portfolioTodayGainLoss) }}
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
      <!-- Card 3: Monthly Spending -->
      <div class="card">
        <p class="text-sm text-brand-secondary mb-1">Monthly Spending</p>
        <p class="text-3xl font-bold text-white">
          {{ formatCurrency(expenseStore.totalExpensesThisMonth) }}
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
              {{ totalReturn >= 0 ? '+' : '' }}{{ formatCurrency(totalReturn) }}
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

    <!-- Overview Section with both charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <!-- Left Column: Investment Chart -->
      <div class="lg:col-span-1">
        <PortfolioPieChart
          v-if="investmentStore.investments.length > 0"
          :investments="investmentStore.investments"
        />
        <div v-else class="card flex items-center justify-center text-gray-500 h-full">
          Investment chart will appear here.
        </div>
      </div>
      <!-- Right Column: Expense Chart -->
      <div class="lg:col-span-1">
        <ExpenseDoughnutChart
          v-if="expenseStore.expenses.length > 0"
          :expenses="expenseStore.expenses"
        />
        <div v-else class="card flex items-center justify-center text-gray-500 h-full">
          Expense chart will appear here.
        </div>
      </div>
    </div>
  </main>
</template>

<!-- ADD THIS STYLE BLOCK AT THE VERY END OF THE FILE -->
<!-- <style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> -->
