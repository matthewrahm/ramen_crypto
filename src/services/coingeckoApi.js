export async function fetchMarketData(page = 1, perPage = 30) {
  const params = new URLSearchParams({
    endpoint: 'coins/markets',
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: String(perPage),
    page: String(page),
    sparkline: 'false',
    price_change_percentage: '24h',
  })
  const res = await fetch(`/api/coingecko-proxy?${params}`)
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`)
  return res.json()
}

export async function fetchCoinHistory(coinId, days = 30) {
  const params = new URLSearchParams({
    endpoint: `coins/${coinId}/market_chart`,
    vs_currency: 'usd',
    days: String(days),
  })
  const res = await fetch(`/api/coingecko-proxy?${params}`)
  if (!res.ok) throw new Error(`CoinGecko API error: ${res.status}`)
  return res.json()
}
