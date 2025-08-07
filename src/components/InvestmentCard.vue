// src/components/InvestmentCard.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useInvestmentStore } from '../stores/InvestmentStore'
import type { Investment } from '@/types'

const props = defineProps<{
  investment: Investment
}>()

const investmentStore = useInvestmentStore()

// Local state for managing edit mode
const isEditing = ref(false)
// Local state to hold the form values while editing
const editedShares = ref(props.investment.shares)
const editedPurchasePrice = ref(props.investment.purchasePrice)

function startEditing() {
  // Copy current values into our edit refs
  editedShares.value = props.investment.shares
  editedPurchasePrice.value = props.investment.purchasePrice
  isEditing.value = true
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
    isEditing.value = false // Exit edit mode
  } else {
    alert('Shares and Purchase Price must be greater than zero.')
  }
}
</script>

<template>
  <!-- EDITING VIEW -->
  <div
    v-if="isEditing"
    class="bg-gray-600 p-4 rounded-lg shadow-md grid grid-cols-3 gap-4 items-center"
  >
    <!-- Column 1: Name (not editable) -->
    <div class="col-span-1">
      <h3 class="text-lg font-bold text-white">{{ investment.name }} ({{ investment.id }})</h3>
    </div>

    <!-- Column 2: Editable Inputs -->
    <div class="col-span-1 space-y-2">
      <div>
        <label class="block text-xs font-medium text-gray-300">Shares</label>
        <input
          v-model.number="editedShares"
          type="number"
          class="w-full bg-gray-700 border-gray-500 rounded-md text-white p-1"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-gray-300">Avg. Cost</label>
        <input
          v-model.number="editedPurchasePrice"
          type="number"
          class="w-full bg-gray-700 border-gray-500 rounded-md text-white p-1"
        />
      </div>
    </div>

    <!-- Column 3: Save/Cancel Buttons -->
    <div class="col-span-1 flex justify-end space-x-2">
      <button
        @click="saveChanges"
        class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </button>
      <button
        @click="cancelEditing"
        class="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- DISPLAY VIEW (Your original card code) -->
  <div v-else class="bg-gray-700 p-4 rounded-lg shadow-md grid grid-cols-3 gap-4 items-center">
    <!-- Column 1: Name and Shares -->
    <div class="col-span-1">
      <h3 class="text-lg font-bold text-white">{{ investment.name }} ({{ investment.id }})</h3>
      <p class="text-sm text-gray-300">Shares: {{ investment.shares }}</p>
      <p class="text-sm text-gray-300">Avg. Cost: ${{ investment.purchasePrice.toFixed(2) }}</p>
    </div>

    <!-- Column 2: Live Price and Gain/Loss -->
    <div class="col-span-1 text-center">
      <div v-if="investment.error" class="text-red-400 text-sm">
        <p class="font-bold">Error</p>
        <p>{{ investment.error }}</p>
      </div>
      <div v-else-if="investment.currentPrice" class="text-right">
        <p
          class="text-xl font-semibold"
          :class="
            investment.currentPrice >= investment.purchasePrice ? 'text-green-400' : 'text-red-400'
          "
        >
          ${{ investment.currentPrice.toFixed(2) }}
        </p>
        <p
          class="text-xs"
          :class="
            investment.currentPrice >= investment.purchasePrice ? 'text-green-500' : 'text-red-500'
          "
        >
          {{
            (
              ((investment.currentPrice - investment.purchasePrice) / investment.purchasePrice) *
              100
            ).toFixed(2)
          }}%
        </p>
      </div>
      <div v-else class="text-gray-500 text-sm animate-pulse">Loading...</div>
    </div>

    <!-- Column 3: Action Buttons (Now with Edit) -->
    <div class="col-span-1 flex justify-end space-x-2">
      <button
        @click="startEditing"
        class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full h-10 w-10 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"
          />
        </svg>
      </button>
      <button
        @click="investmentStore.deleteInvestment(investment.id)"
        class="bg-red-600 hover:bg-red-800 text-white font-bold p-2 rounded-full h-10 w-10 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
