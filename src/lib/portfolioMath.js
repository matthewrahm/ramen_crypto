export function calculatePnL(position, currentPrice) {
  const current = position.quantity * currentPrice
  const entry = position.total
  if (position.type === 'buy') {
    return {
      value: current,
      pnl: current - entry,
      pnlPercent: ((current - entry) / entry) * 100,
    }
  }
  return {
    value: entry,
    pnl: entry - current,
    pnlPercent: ((entry - current) / entry) * 100,
  }
}

export function calculatePortfolioSummary(positions, prices) {
  let totalValue = 0
  let totalInvested = 0

  positions.forEach((pos) => {
    const symbol = pos.asset
    const price = prices[symbol] || 0
    if (pos.type === 'buy') {
      totalValue += pos.quantity * price
      totalInvested += pos.total
    }
  })

  const totalPnL = totalValue - totalInvested
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  return { totalValue, totalInvested, totalPnL, totalPnLPercent }
}

export function simulateDCA(prices, amountPerPeriod) {
  let totalInvested = 0
  let totalUnits = 0
  const dataPoints = []

  prices.forEach((point, i) => {
    totalInvested += amountPerPeriod
    totalUnits += amountPerPeriod / point.price
    const currentValue = totalUnits * point.price

    dataPoints.push({
      time: point.time,
      invested: totalInvested,
      value: currentValue,
    })
  })

  const finalValue = totalUnits * prices[prices.length - 1].price
  const roi = totalInvested > 0 ? ((finalValue - totalInvested) / totalInvested) * 100 : 0

  return { dataPoints, totalInvested, finalValue, totalUnits, roi }
}

export function calculateWhatIf(amountUSD, priceAtDate, currentPrice) {
  const units = amountUSD / priceAtDate
  const currentValue = units * currentPrice
  const pnl = currentValue - amountUSD
  const pnlPercent = (pnl / amountUSD) * 100

  return { units, currentValue, pnl, pnlPercent }
}
