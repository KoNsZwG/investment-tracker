// src/components/AddIncomeForm.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useIncomeStore } from '@/stores/incomeStore'

const incomeStore = useIncomeStore()

const title = ref('')
const amount = ref<number | null>(null)
const category = ref<'Salary' | 'Bonus' | 'Investment' | 'Other'>('Salary')
const date = ref(new Date().toISOString().slice(0, 10))

const categories = ['Salary', 'Bonus', 'Investment', 'Other']

function handleSubmit() {
  if (!title.value || !amount.value || amount.value <= 0) {
    alert('Please provide a valid title and amount.')
    return
  }
  incomeStore.addIncome({
    title: title.value,
    amount: amount.value,
    category: category.value,
    date: date.value,
  })
  // Reset form
  title.value = ''
  amount.value = null
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="card mb-8">
    <h2 class="text-2xl font-bold text-white mb-4">Add New Income</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Title -->
      <div>
        <label for="income-title" class="block text-sm font-medium text-brand-secondary"
          >Title</label
        >
        <input
          v-model="title"
          type="text"
          id="income-title"
          placeholder="e.g., Monthly Salary"
          class="input-field mt-1"
        />
      </div>
      <!-- Amount -->
      <div>
        <label for="income-amount" class="block text-sm font-medium text-brand-secondary"
          >Amount ($)</label
        >
        <input
          v-model.number="amount"
          type="number"
          step="0.01"
          id="income-amount"
          placeholder="e.g., 5000.00"
          class="input-field mt-1"
        />
      </div>
      <!-- Category -->
      <div>
        <label for="income-category" class="block text-sm font-medium text-brand-secondary"
          >Category</label
        >
        <select v-model="category" id="income-category" class="input-field mt-1">
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <!-- Date -->
      <div>
        <label for="income-date" class="block text-sm font-medium text-brand-secondary">Date</label>
        <input v-model="date" type="date" id="income-date" class="input-field mt-1" />
      </div>
    </div>
    <div class="mt-6">
      <button type="submit" class="btn-primary w-full">Add Income</button>
    </div>
  </form>
</template>

<style scoped>
.input-field {
  @apply block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2;
}
.btn-primary {
  @apply bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg;
}
</style>
