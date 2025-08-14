// src/views/AnalyticsView.vue
<script setup lang="ts">
import { useInvestmentStore } from '@/stores/investmentStore'
import { useExpenseStore } from '@/stores/expenseStore'
import { useIncomeStore } from '@/stores/incomeStore' // <-- 1. Import income store
import MonthlySavingsChart from '@/components/MonthlySavingsChart.vue'
import MonthlyComparisonChart from '@/components/MonthlyComparisonChart.vue' // <-- 2. Import new bar chart

const investmentStore = useInvestmentStore()
const expenseStore = useExpenseStore()
const incomeStore = useIncomeStore() // <-- 3. Initialize income store
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white">Analytics & Reports</h1>
    <p class="text-brand-secondary mt-2 mb-8">Analyze your financial trends over time.</p>

    <div class="grid grid-cols-1 gap-8">
      <!-- The new bar chart -->
      <MonthlyComparisonChart
        :income-data="incomeStore.incomeByMonth"
        :expenses-data="expenseStore.expensesByMonth"
      />

      <!-- The existing line chart -->
      <MonthlySavingsChart
        :investments-data="investmentStore.investmentsByMonth"
        :expenses-data="expenseStore.expensesByMonth"
      />
    </div>
  </main>
</template>
