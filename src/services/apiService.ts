// src/services/apiService.ts
import type { NewsArticle, ApiQuote } from '@/types'

const fmpApiKey = import.meta.env.VITE_FMP_API_KEY
const alphaVantageApiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY

// --- News Service ---
export async function fetchNewsHeadlines(): Promise<NewsArticle[]> {
  const response = await fetch('/api/news')
  if (!response.ok) {
    throw new Error('Failed to fetch news headlines from our server.')
  }
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data.articles
}

// --- Search Service ---
export interface SearchResult {
  '1. symbol': string
  '2. name': string
}

// --- Investment Quote Service ---
export async function fetchQuote(ticker: string): Promise<ApiQuote> {
  if (ticker.includes('.')) {
    // Alpha Vantage Logic
    if (!alphaVantageApiKey) throw new Error('Alpha Vantage API key is missing.')
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphaVantageApiKey}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('Alpha Vantage API request failed')
    const data = await response.json()
    if (data.Note) throw new Error('Alpha Vantage API limit reached.')
    const avQuote = data['Global Quote']
    if (avQuote && avQuote['05. price'] && Object.keys(avQuote).length > 0) {
      return {
        symbol: avQuote['01. symbol'],
        price: parseFloat(avQuote['05. price']),
        change: parseFloat(avQuote['09. change']),
        changesPercentage: parseFloat(avQuote['10. change percent'].replace('%', '')),
      }
    } else {
      throw new Error('Invalid ticker or no data available from Alpha Vantage.')
    }
  } else {
    // FMP Logic
    if (!fmpApiKey) throw new Error('FMP API key is missing.')
    const url = `https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${fmpApiKey}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('FMP API request failed')
    const data = await response.json()
    const fmpQuote = data[0]
    if (fmpQuote && fmpQuote.price) {
      return {
        symbol: fmpQuote.symbol,
        price: fmpQuote.price,
        change: fmpQuote.change,
        changesPercentage: fmpQuote.changesPercentage,
      }
    } else {
      throw new Error('Invalid ticker or no data available from FMP.')
    }
  }
}

export async function searchSymbols(keyword: string): Promise<SearchResult[]> {
  const response = await fetch(`/api/search?keyword=${keyword}`)
  const data = await response.json()
  if (data.bestMatches) {
    return data.bestMatches
  }
  return []
}
