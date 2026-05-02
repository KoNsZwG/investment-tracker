export interface Investment {
  id: string
  userId: string
  symbol: string
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
  id: string
  userId: string
  title: string
  amount: number
  category: string
  date: string
}

export interface Income {
  id: string
  userId: string
  title: string
  amount: number
  category: 'Salary' | 'Bonus' | 'Investment' | 'Other'
  date: string
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

export interface SearchResult {
  symbol: string
  name: string
}
