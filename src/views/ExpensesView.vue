// src/views/ExpensesView.vue
<script setup lang="ts">
import { useExpenseStore } from '@/stores/expenseStore'
import AddExpenseForm from '@/components/AddExpenseForm.vue'

const expenseStore = useExpenseStore()
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-white">Expenses</h1>
    <p class="text-brand-secondary mt-2 mb-8">Track and manage your spending.</p>

    <AddExpenseForm />

    <div class="card">
      <h2 class="text-xl font-bold text-white mb-4">Recent Expenses</h2>
      <div v-if="expenseStore.expenses.length === 0" class="text-center text-gray-500 py-8">
        You have no expenses logged yet.
      </div>
      <ul v-else class="divide-y divide-brand-border">
        <li
          v-for="expense in expenseStore.expenses"
          :key="expense.id"
          class="py-4 flex justify-between items-center"
        >
          <div>
            <p class="font-bold text-white">{{ expense.title }}</p>
            <p class="text-sm text-brand-secondary">{{ expense.category }} on {{ expense.date }}</p>
          </div>
          <div class="text-right">
            <p class="font-bold text-lg text-brand-danger">-${{ expense.amount.toFixed(2) }}</p>
            <button
              @click="expenseStore.deleteExpense(expense.id)"
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
