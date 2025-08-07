// src/components/PortfolioPieChart.vue
<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js'
import type { Investment } from '@/types'

// This is a required step to register the components Chart.js needs
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale)

// Define the props that this component will accept from its parent (HomeView)
const props = defineProps<{
  investments: Investment[]
}>()

// A computed property that transforms our investment data into the format Chart.js needs
const chartData = computed(() => {
  const labels = props.investments.map((inv) => inv.id) // e.g., ['AAPL', 'GOOGL']
  const data = props.investments.map((inv) => {
    // Use the current value if available, otherwise use the initial cost
    const value = inv.currentPrice ? inv.shares * inv.currentPrice : inv.shares * inv.purchasePrice
    return value
  })

  return {
    labels,
    datasets: [
      {
        backgroundColor: [
          // Some nice default colors
          '#41B883',
          '#E46651',
          '#00D8FF',
          '#DD1B16',
          '#34495E',
          '#F39C12',
          '#8E44AD',
          '#2ECC71',
        ],
        data,
      },
    ],
  }
})

// Configuration options for our chart
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold text-white mb-4">Portfolio Allocation</h2>
    <div style="height: 300px">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
