// src/views/PortfolioView.vue
<script setup lang="ts">
import { useInvestmentStore } from '@/stores/investmentStore'
import InvestmentCard from '@/components/InvestmentCard.vue'
import AddInvestmentForm from '@/components/AddInvestmentForm.vue'
import { onMounted, ref } from 'vue'
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/solid'

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
      <div class="flex space-x-2 justify-end">
        <button
          @click="handleClearPortfolio"
          v-if="investmentStore.investments.length > 0"
          class="bg-brand-danger hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg flex items-center text-sm"
        >
          <TrashIcon class="h-5 w-5 md:mr-2" />
          <span class="hidden md:inline">Clear All</span>
          <!-- Hide text on mobile -->
        </button>
        <button
          @click="isAddFormVisible = !isAddFormVisible"
          class="bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg flex items-center text-sm"
        >
          <PlusIcon class="h-5 w-5 md:mr-2" />
          <span class="hidden md:inline">Add Investment</span>
          <!-- Hide text on mobile -->
        </button>
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
