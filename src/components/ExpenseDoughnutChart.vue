// src/components/ExpenseDoughnutChart.vue
<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import type { Expense } from '@/types'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  expenses: Expense[]
}>()

const chartColors = ['#8B5CF6', '#F97316', '#3B82F6', '#EF4444', '#10B981', '#EAB308']

const chartData = computed(() => {
  // Group expenses by category and sum their amounts
  const categoryTotals = props.expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const labels = Object.keys(categoryTotals)
  const data = Object.values(categoryTotals)

  return {
    labels,
    datasets: [{ backgroundColor: chartColors, data, borderWidth: 0 }],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: '#94A3B8', padding: 20 },
    },
  },
  cutout: '60%',
}
</script>

<template>
  <div class="card">
    <h2 class="text-xl font-bold text-white mb-4">Spending by Category</h2>
    <div style="height: 300px">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
