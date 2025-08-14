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
  change?: number
  changesPercentage?: number
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage: string | null
  source: {
    name: string
  }
}

export interface Income {
  id: string
  title: string
  amount: number
  category: 'Salary' | 'Bonus' | 'Investment' | 'Other' // A more defined category set
  date: string // 'YYYY-MM-DD'
}

export interface SearchResult {
  '1. symbol': string
  '2. name': string
}
