const BASE_URL = 'https://api.binance.com'

export async function fetchKlines(symbol, interval, limit = 500) {
  const url = `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Binance API error: ${res.status}`)
  return res.json()
}

export async function fetchKlinesRange(symbol, interval, startTime, endTime) {
  let url = `${BASE_URL}/api/v3/klines?symbol=${symbol}&interval=${interval}`
  if (startTime) url += `&startTime=${startTime}`
  if (endTime) url += `&endTime=${endTime}`
  url += `&limit=1000`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Binance API error: ${res.status}`)
  return res.json()
}

export async function fetchTickerPrice(symbol) {
  const url = `${BASE_URL}/api/v3/ticker/24hr?symbol=${symbol}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Binance API error: ${res.status}`)
  return res.json()
}
