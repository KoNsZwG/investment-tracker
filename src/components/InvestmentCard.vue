// src/components/InvestmentCard.vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInvestmentStore } from '../stores/InvestmentStore'
import type { Investment } from '@/types'
import { EllipsisVerticalIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  investment: Investment
}>()

const investmentStore = useInvestmentStore()

// --- STATE FOR EDITING AND DROPDOWN ---
const isMenuOpen = ref(false)
const isEditing = ref(false)
const editedShares = ref(props.investment.shares)
const editedPurchasePrice = ref(props.investment.purchasePrice)

// --- FUNCTIONS ---
function startEditing() {
  editedShares.value = props.investment.shares
  editedPurchasePrice.value = props.investment.purchasePrice
  isEditing.value = true
  isMenuOpen.value = false // Close the menu when editing starts
}

function cancelEditing() {
  isEditing.value = false
}

function saveChanges() {
  if (editedShares.value > 0 && editedPurchasePrice.value > 0) {
    investmentStore.updateInvestment(props.investment.id, {
      shares: editedShares.value,
      purchasePrice: editedPurchasePrice.value,
    })
    isEditing.value = false
  } else {
    alert('Shares and Purchase Price must be valid numbers greater than zero.')
  }
}

// --- COMPUTED PROPERTIES for display ---
const totalCost = computed(() => props.investment.shares * props.investment.purchasePrice)
const totalValue = computed(() => {
  if (props.investment.currentPrice) {
    return props.investment.shares * props.investment.currentPrice
  }
  return totalCost.value
})
const totalGainLoss = computed(() => totalValue.value - totalCost.value)
const totalGainLossPercent = computed(() => {
  if (totalCost.value === 0) return 0
  return (totalGainLoss.value / totalCost.value) * 100
})
</script>

<template>
  <div class="bg-brand-card p-4 rounded-lg shadow-md text-white">
    <!-- EDITING VIEW -->
    <div v-if="isEditing">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">{{ investment.id }}</h3>
        <div class="flex space-x-2">
          <button @click="saveChanges" title="Save" class="text-green-400 hover:text-white">
            <CheckIcon class="h-6 w-6" />
          </button>
          <button @click="cancelEditing" title="Cancel" class="text-red-400 hover:text-white">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
      <p class="text-sm text-brand-secondary mb-4">{{ investment.name }}</p>
      <div class="border-t border-gray-600 pt-4 grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-brand-secondary">Shares</label>
          <input
            v-model.number="editedShares"
            type="number"
            class="mt-1 w-full bg-gray-800 border-gray-600 rounded-md text-white p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-brand-secondary">Avg. Cost</label>
          <input
            v-model.number="editedPurchasePrice"
            type="number"
            step="any"
            class="mt-1 w-full bg-gray-800 border-gray-600 rounded-md text-white p-2"
          />
        </div>
      </div>
    </div>

    <!-- DISPLAY VIEW -->
    <div v-else>
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-xl font-bold">{{ investment.id }}</h3>
        <div class="relative">
          <button @click="isMenuOpen = !isMenuOpen" class="text-gray-400 hover:text-white">
            <EllipsisVerticalIcon class="h-6 w-6" />
          </button>
          <div
            v-if="isMenuOpen"
            @mouseleave="isMenuOpen = false"
            class="absolute right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10"
          >
            <a
              href="#"
              @click.prevent="startEditing"
              class="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
              >Edit</a
            >
            <a
              href="#"
              @click.prevent="investmentStore.deleteInvestment(investment.id)"
              class="block px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
              >Delete</a
            >
          </div>
        </div>
      </div>
      <p class="text-sm text-brand-secondary mb-4">{{ investment.name }}</p>

      <div class="flex justify-between items-baseline mb-4">
        <p v-if="investment.currentPrice" class="text-3xl font-bold">
          ${{ investment.currentPrice.toFixed(2) }}
        </p>
        <p v-else class="text-3xl font-bold text-brand-secondary animate-pulse">$--.--</p>
        <p class="text-sm text-brand-secondary">Daily change will go here</p>
      </div>

      <div class="border-t border-gray-600 pt-4">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-brand-secondary">Shares</span>
          <span>{{ investment.shares }}</span>
        </div>

        <div class="flex justify-between text-sm mb-2">
          <span class="text-brand-secondary">Total Value</span>
          <span>${{ totalValue.toFixed(2) }}</span>
        </div>

        <div class="border-t border-gray-600 pt-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-brand-secondary">Shares</span>
            <span>{{ investment.shares }}</span>
          </div>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-brand-secondary">Total Value</span>
            <span>${{ totalValue.toFixed(2) }}</span>
          </div>

          <!-- THIS IS THE FIX -->
          <!-- Only show Gain/Loss if we have a current price -->
          <div v-if="investment.currentPrice" class="flex justify-between text-sm font-bold">
            <span class="text-brand-secondary">Total Gain/Loss</span>
            <span :class="totalGainLoss >= 0 ? 'text-brand-primary' : 'text-brand-danger'">
              {{ totalGainLoss >= 0 ? '+' : '' }}${{ totalGainLoss.toFixed(2) }} ({{
                totalGainLossPercent.toFixed(2)
              }}%)
            </span>
          </div>
          <!-- Otherwise, show a loading placeholder -->
          <div v-else class="flex justify-between text-sm font-bold">
            <span class="text-brand-secondary">Total Gain/Loss</span>
            <span class="text-brand-secondary animate-pulse">Calculating...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
