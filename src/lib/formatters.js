export function formatPrice(price, decimals) {
  if (price == null || isNaN(price)) return '--'
  const num = Number(price)
  const d = decimals ?? (num >= 1000 ? 2 : num >= 1 ? 2 : 4)
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  })
}

export function formatPercent(value) {
  if (value == null || isNaN(value)) return '--'
  const num = Number(value)
  const sign = num >= 0 ? '+' : ''
  return `${sign}${num.toFixed(2)}%`
}

export function formatCompact(value) {
  if (value == null || isNaN(value)) return '--'
  const num = Number(value)
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatUTCTime() {
  const now = new Date()
  return now.toUTCString().slice(17, 25) + ' UTC'
}

export function formatNumber(value, decimals = 2) {
  if (value == null || isNaN(value)) return '--'
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
