// src/views/PortfolioView.vue
<script setup lang="ts">
import { useInvestmentStore } from '@/stores/investmentStore'
import InvestmentCard from '@/components/InvestmentCard.vue'
import AddInvestmentForm from '@/components/AddInvestmentForm.vue'
import { onMounted, ref } from 'vue'

const investmentStore = useInvestmentStore()
const isAddFormVisible = ref(false)

onMounted(() => {
  investmentStore.fetchAllLivePrices()
})

function handleClearPortfolio() {
  if (confirm('Are you sure you want to delete all investments? This action cannot be undone.')) {
    investmentStore.clearPortfolio()
  }
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div class="text-left">
        <h1 class="text-3xl font-bold text-white">My Investments</h1>
        <p class="text-brand-secondary mt-2">Manage your stock and ETF holdings.</p>
      </div>
      <div>
        <div class="flex space-x-2">
          <button
            @click="handleClearPortfolio"
            v-if="investmentStore.investments.length > 0"
            class="bg-brand-danger hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Clear All
          </button>
          <button
            @click="isAddFormVisible = !isAddFormVisible"
            class="bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            <span class="mr-2">+</span> Add Investment
          </button>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <AddInvestmentForm v-if="isAddFormVisible" class="mb-8" />
    </Transition>

    <div v-if="investmentStore.investments.length > 0">
      <TransitionGroup
        name="fade"
        tag="div"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <InvestmentCard
          v-for="investment in investmentStore.investments"
          :key="investment.id"
          :investment="investment"
        />
      </TransitionGroup>
    </div>
    <div v-else class="text-center text-gray-500 bg-brand-card p-8 rounded-lg mt-8">
      Your portfolio is empty. Click "Add Investment" to get started!
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
