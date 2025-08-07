// src/components/PortfolioPieChart.vue
<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import type { Investment } from '@/types'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps<{
  investments: Investment[]
}>()

// --- CHART DATA ---
const chartColors = ['#10B981', '#3B82F6', '#F97316', '#EF4444', '#8B5CF6']
const chartData = computed(() => {
  const labels = props.investments.map((inv) => inv.id)
  const data = props.investments.map((inv) => {
    const value = inv.currentPrice ? inv.shares * inv.currentPrice : inv.shares * inv.purchasePrice
    return value
  })
  return { labels, datasets: [{ backgroundColor: chartColors, data, borderWidth: 0 }] }
})

// --- CHART OPTIONS ---
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false, // <-- We disable the default legend
    },
  },
  cutout: '60%',
}

// --- NEW: COMPUTED PROPERTY FOR OUR CUSTOM LEGEND ---
const legendData = computed(() => {
  const totalValue = chartData.value.datasets[0].data.reduce((sum, value) => sum + value, 0)
  if (totalValue === 0) return []

  return chartData.value.labels.map((label, index) => ({
    label,
    color: chartColors[index % chartColors.length],
    percentage: ((chartData.value.datasets[0].data[index] / totalValue) * 100).toFixed(0),
  }))
})
</script>

<template>
  <div class="bg-brand-card p-6 rounded-lg shadow-lg">
    <h2 class="text-xl font-bold text-white mb-4">Asset Allocation</h2>
    <div style="height: 250px" class="mb-6">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <!-- NEW: Custom Legend -->
    <div class="space-y-2">
      <div
        v-for="item in legendData"
        :key="item.label"
        class="flex items-center justify-between text-sm"
      >
        <div class="flex items-center">
          <span class="h-3 w-3 rounded-full mr-2" :style="{ backgroundColor: item.color }"></span>
          <span class="text-brand-secondary">{{ item.label }}</span>
        </div>
        <span class="font-bold text-white">{{ item.percentage }}%</span>
      </div>
    </div>
  </div>
</template>
