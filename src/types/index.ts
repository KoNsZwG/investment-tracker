// src/types/index.ts
export interface Investment {
  id: string // We'll use the ticker symbol as the ID
  name: string
  shares: number
  purchasePrice: number
  currentPrice?: number
  dateAdded: string
  dailyChange?: number
  dailyChangePercent?: number
  error?: string
  lastFetched?: number
}

export interface Expense {
  id: string // A unique ID for each expense
  title: string
  amount: number
  category: string
  date: string // We'll store the date as a string in 'YYYY-MM-DD' format
}

export interface ApiQuote {
  symbol: string
  price: number
  // You could add other properties like 'name', 'dayHigh' if you wanted to use them
}
