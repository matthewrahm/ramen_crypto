const cache = new Map()
const TTL = 60 * 1000

export default async (req) => {
  const url = new URL(req.url)
  const endpoint = url.searchParams.get('endpoint')

  if (!endpoint) {
    return new Response(JSON.stringify({ error: 'Missing endpoint parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const params = new URLSearchParams(url.searchParams)
  params.delete('endpoint')

  const cacheKey = `${endpoint}?${params.toString()}`
  const now = Date.now()
  const cached = cache.get(cacheKey)

  if (cached && now - cached.timestamp < TTL) {
    return new Response(JSON.stringify(cached.data), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const apiUrl = `https://api.coingecko.com/api/v3/${endpoint}?${params.toString()}`
    const res = await fetch(apiUrl, {
      headers: { accept: 'application/json' },
    })

    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
    const data = await res.json()

    cache.set(cacheKey, { data, timestamp: now })

    // Limit cache size
    if (cache.size > 50) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0]
      cache.delete(oldest[0])
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
