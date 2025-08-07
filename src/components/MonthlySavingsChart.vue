// src/components/MonthlySavingsChart.vue
<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const props = defineProps<{
  investmentsData: Record<string, number>
  expensesData: Record<string, number>
}>()

const chartData = computed(() => {
  const labels = []
  const savingsData = []
  const today = new Date()

  // Generate labels for the last 12 months
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    const monthKey = d.toISOString().slice(0, 7) // 'YYYY-MM'
    const monthLabel = d.toLocaleString('default', { month: 'short', year: '2-digit' })

    labels.push(monthLabel)

    const invested = props.investmentsData[monthKey] || 0
    const spent = props.expensesData[monthKey] || 0
    savingsData.push(invested - spent)
  }

  return {
    labels,
    datasets: [
      {
        label: 'Monthly Savings (Invested - Spent)',
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        data: savingsData,
        tension: 0.3,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { ticks: { color: '#94A3B8' } },
    x: { ticks: { color: '#94A3B8' } },
  },
}
</script>

<template>
  <div class="card">
    <h2 class="text-xl font-bold text-white mb-4">Monthly Savings Trend</h2>
    <div style="height: 400px">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
