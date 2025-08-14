// src/views/IncomeView.vue
<script setup lang="ts">
import { useIncomeStore } from '@/stores/incomeStore'
import AddIncomeForm from '@/components/AddIncomeForm.vue'

const incomeStore = useIncomeStore()
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white">Income</h1>
    <p class="text-brand-secondary mt-2 mb-8">Track and manage your income sources.</p>

    <AddIncomeForm />

    <div class="card">
      <h2 class="text-xl font-bold text-white mb-4">Recent Income</h2>
      <div v-if="incomeStore.incomeSources.length === 0" class="text-center text-gray-500 py-8">
        You have no income logged yet.
      </div>
      <ul v-else class="divide-y divide-brand-border">
        <li
          v-for="income in incomeStore.incomeSources"
          :key="income.id"
          class="py-4 flex justify-between items-center"
        >
          <div>
            <p class="font-bold text-white">{{ income.title }}</p>
            <p class="text-sm text-brand-secondary">{{ income.category }} on {{ income.date }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-lg text-brand-primary">+${{ income.amount.toFixed(2) }}</p>
            <button
              @click="incomeStore.deleteIncome(income.id)"
              class="text-xs text-gray-500 hover:text-white"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>
