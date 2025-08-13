// api/search.js

export default async function handler(request, response) {
  const alphaVantageApiKey = process.env.VITE_ALPHA_VANTAGE_API_KEY
  // Get the search keyword from the query string, e.g., /api/search?keyword=BA
  const { keyword } = request.query

  if (!alphaVantageApiKey) {
    return response.status(500).json({ error: 'API key is missing.' })
  }
  if (!keyword) {
    return response.status(400).json({ error: 'Search keyword is required.' })
  }

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${alphaVantageApiKey}`

  try {
    const searchResponse = await fetch(url)
    if (!searchResponse.ok) {
      throw new Error('Failed to fetch search results from the source.')
    }
    const searchData = await searchResponse.json()

    // Send the successful response back to our front-end
    return response.status(200).json(searchData)
  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
}
