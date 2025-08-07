// src/components/AddExpenseForm.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useExpenseStore } from '@/stores/expenseStore'

const expenseStore = useExpenseStore()

const title = ref('')
const amount = ref<number | null>(null)
const category = ref('Other') // Default category
const date = ref(new Date().toISOString().slice(0, 10)) // Default to today's date

// A predefined list of categories for the dropdown
const categories = ['Groceries', 'Rent', 'Utilities', 'Entertainment', 'Transport', 'Other']

function handleSubmit() {
  if (!title.value || !amount.value || amount.value <= 0) {
    alert('Please provide a valid title and amount.')
    return
  }
  expenseStore.addExpense({
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
    <h2 class="text-2xl font-bold text-white mb-4">Add New Expense</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Title -->
      <div>
        <label for="expense-title" class="block text-sm font-medium text-brand-secondary"
          >Title</label
        >
        <input
          v-model="title"
          type="text"
          id="expense-title"
          placeholder="e.g., Coffee"
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        />
      </div>
      <!-- Amount -->
      <div>
        <label for="expense-amount" class="block text-sm font-medium text-brand-secondary"
          >Amount ($)</label
        >
        <input
          v-model.number="amount"
          type="number"
          step="0.01"
          id="expense-amount"
          placeholder="e.g., 4.50"
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        />
      </div>
      <!-- Category -->
      <div>
        <label for="expense-category" class="block text-sm font-medium text-brand-secondary"
          >Category</label
        >
        <select
          v-model="category"
          id="expense-category"
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        >
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      <!-- Date -->
      <div>
        <label for="expense-date" class="block text-sm font-medium text-brand-secondary"
          >Date</label
        >
        <input
          v-model="date"
          type="date"
          id="expense-date"
          class="mt-1 block w-full bg-brand-dark border-brand-border rounded-md shadow-sm text-white focus:ring-green-500 focus:border-green-500 px-3 py-2"
        />
      </div>
    </div>
    <div class="mt-6">
      <button
        type="submit"
        class="w-full bg-brand-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
      >
        Add Expense
      </button>
    </div>
  </form>
</template>
