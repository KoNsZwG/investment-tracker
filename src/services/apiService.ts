import type { NewsArticle, ApiQuote, SearchResult } from '@/types'
import { SEED_STOCKS } from '@/data/seedStocks'
import { SEED_NEWS } from '@/data/seedNews'
import { SEED_SEARCH } from '@/data/seedSearch'

export async function fetchNewsHeadlines(): Promise<NewsArticle[]> {
  return SEED_NEWS
}

export async function fetchQuote(ticker: string): Promise<ApiQuote> {
  const upper = ticker.toUpperCase()
  const quote = SEED_STOCKS.find((s) => s.symbol === upper)
  if (!quote) throw new Error(`No seed data for ticker: ${upper}`)
  return quote
}

export async function searchSymbols(keyword: string): Promise<SearchResult[]> {
  const lower = keyword.toLowerCase()
  return SEED_SEARCH.filter(
    (s) => s.symbol.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower),
  ).slice(0, 8)
}
