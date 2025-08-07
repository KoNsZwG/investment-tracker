// src/views/PortfolioView.vue
<script setup lang="ts">
import { useInvestmentStore } from '../stores/InvestmentStore'
import InvestmentCard from '@/components/InvestmentCard.vue'
import { onMounted } from 'vue'

const investmentStore = useInvestmentStore()

// We still want to fetch prices when this page is loaded
onMounted(() => {
  investmentStore.fetchAllLivePrices()
})
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white mb-4">Your Investments</h1>

    <div v-if="investmentStore.investments.length > 0">
      <TransitionGroup
        name="fade"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <InvestmentCard
          v-for="investment in investmentStore.investments"
          :key="investment.id"
          :investment="investment"
        />
      </TransitionGroup>
    </div>
    <div v-else class="text-center text-gray-500 bg-brand-card p-8 rounded-lg mt-8">
      Your portfolio is empty. Add an investment on the Dashboard to get started!
    </div>
  </main>
</template>

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
