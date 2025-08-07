// src/components/PortfolioPieChart.vue
<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs' // <-- Change import from Pie to Doughnut
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import type { Investment } from '@/types'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  investments: Investment[]
}>()

const chartData = computed(() => {
  const labels = props.investments.map((inv) => inv.id)
  const data = props.investments.map((inv) => {
    const value = inv.currentPrice ? inv.shares * inv.currentPrice : inv.shares * inv.purchasePrice
    return value
  })

  return {
    labels,
    datasets: [
      {
        backgroundColor: ['#10B981', '#3B82F6', '#F97316', '#EF4444', '#8B5CF6'], // Updated colors
        data,
        borderWidth: 0, // Remove the white border between segments
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const, // Move legend to the bottom
      labels: {
        color: '#94A3B8', // A light gray for the text
        padding: 20,
      },
    },
  },
  cutout: '60%', // <-- THIS IS WHAT MAKES IT A DOUGHNUT CHART!
}
</script>

<template>
  <div class="bg-brand-card p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold text-white mb-4">Asset Allocation</h2>
    <div style="height: 300px">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
