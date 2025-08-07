// src/types/index.ts
export interface Investment {
  id: string // We'll use the ticker symbol as the ID
  name: string
  shares: number
  purchasePrice: number
  currentPrice?: number
  dailyChange?: number
  dailyChangePercent?: number
  error?: string
}
export interface ApiQuote {
  symbol: string
  price: number
  // You could add other properties like 'name', 'dayHigh' if you wanted to use them
}
