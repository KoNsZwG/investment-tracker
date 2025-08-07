// src/views/AnalyticsView.vue
<script setup lang="ts">
import { useInvestmentStore } from '@/stores/investmentStore'
import { useExpenseStore } from '@/stores/expenseStore'
import MonthlySavingsChart from '@/components/MonthlySavingsChart.vue'

const investmentStore = useInvestmentStore()
const expenseStore = useExpenseStore()
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white">Analytics & Reports</h1>
    <p class="text-brand-secondary mt-2 mb-8">Analyze your financial trends over time.</p>

    <MonthlySavingsChart
      :investments-data="investmentStore.investmentsByMonth"
      :expenses-data="expenseStore.expensesByMonth"
    />
  </main>
</template>
