export async function fetchFearGreed(limit = 30) {
  const res = await fetch(`/api/fear-greed?limit=${limit}`)
  if (!res.ok) throw new Error(`Fear & Greed API error: ${res.status}`)
  return res.json()
}
