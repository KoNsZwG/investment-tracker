// api/news.js

export default async function handler(request, response) {
  const newsApiKey = process.env.VITE_NEWS_API_KEY

  if (!newsApiKey) {
    return response.status(500).json({ error: 'News API key is missing.' })
  }

  const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${newsApiKey}`

  try {
    const newsResponse = await fetch(url)
    if (!newsResponse.ok) {
      throw new Error('Failed to fetch news from the source.')
    }
    const newsData = await newsResponse.json()

    // Send the successful response back to our front-end
    return response.status(200).json(newsData)
  } catch (error) {
    return response.status(500).json({ error: error.message })
  }
}
