let cache = { data: null, timestamp: 0 }
const TTL = 5 * 60 * 1000

export default async (req) => {
  const now = Date.now()
  if (cache.data && now - cache.timestamp < TTL) {
    return new Response(JSON.stringify(cache.data), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(req.url)
  const limit = url.searchParams.get('limit') || '30'

  try {
    const res = await fetch(`https://api.alternative.me/fng/?limit=${limit}`)
    if (!res.ok) throw new Error(`Upstream error: ${res.status}`)
    const data = await res.json()

    cache = { data, timestamp: now }

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
