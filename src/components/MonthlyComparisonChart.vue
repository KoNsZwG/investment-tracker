// src/components/MonthlyComparisonChart.vue
<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  incomeData: Record<string, number>
  expensesData: Record<string, number>
}>()

const chartData = computed(() => {
  const labels: string[] = []
  const incomeDataset: number[] = []
  const expensesDataset: number[] = []
  const today = new Date()

  // Generate data for the last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthKey = d.toISOString().slice(0, 7)
    const monthLabel = d.toLocaleString('default', { month: 'short', year: '2-digit' })

    labels.push(monthLabel)
    incomeDataset.push(props.incomeData[monthKey] || 0)
    expensesDataset.push(props.expensesData[monthKey] || 0)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Income',
        backgroundColor: '#10B981', // brand-primary
        data: incomeDataset,
      },
      {
        label: 'Expenses',
        backgroundColor: '#EF4444', // brand-danger
        data: expensesDataset,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#94A3B8' } } },
  scales: {
    y: { ticks: { color: '#94A3B8' } },
    x: { ticks: { color: '#94A3B8' } },
  },
}
</script>

<template>
  <div class="card">
    <h2 class="text-xl font-bold text-white mb-4">Monthly Income vs. Expenses</h2>
    <div style="height: 400px">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
