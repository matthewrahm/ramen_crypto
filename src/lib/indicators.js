export function sma(data, period) {
  const result = []
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = i - period + 1; j <= i; j++) {
      sum += data[j]
    }
    result.push(sum / period)
  }
  return result
}

export function ema(data, period) {
  if (data.length < period) return []
  const multiplier = 2 / (period + 1)
  const result = []

  let seed = 0
  for (let i = 0; i < period; i++) {
    seed += data[i]
  }
  seed /= period
  result.push(seed)

  for (let i = period; i < data.length; i++) {
    const val = (data[i] - result[result.length - 1]) * multiplier + result[result.length - 1]
    result.push(val)
  }
  return result
}

export function rsi(data, period = 14) {
  if (data.length < period + 1) return []

  const gains = []
  const losses = []
  for (let i = 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1]
    gains.push(diff > 0 ? diff : 0)
    losses.push(diff < 0 ? Math.abs(diff) : 0)
  }

  let avgGain = 0
  let avgLoss = 0
  for (let i = 0; i < period; i++) {
    avgGain += gains[i]
    avgLoss += losses[i]
  }
  avgGain /= period
  avgLoss /= period

  const result = []
  if (avgLoss === 0) {
    result.push(100)
  } else {
    result.push(100 - 100 / (1 + avgGain / avgLoss))
  }

  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period
    if (avgLoss === 0) {
      result.push(100)
    } else {
      result.push(100 - 100 / (1 + avgGain / avgLoss))
    }
  }
  return result
}

export function macd(data, fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(data, fast)
  const emaSlow = ema(data, slow)

  const offset = slow - fast
  const macdLine = []
  for (let i = 0; i < emaSlow.length; i++) {
    macdLine.push(emaFast[i + offset] - emaSlow[i])
  }

  const signalLine = ema(macdLine, signal)
  const signalOffset = signal - 1
  const histogram = []
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + signalOffset] - signalLine[i])
  }

  return {
    macdLine: macdLine.slice(signalOffset),
    signalLine,
    histogram,
  }
}

export function bollingerBands(data, period = 20, stdDevMultiplier = 2) {
  const middle = sma(data, period)
  const upper = []
  const lower = []

  for (let i = period - 1; i < data.length; i++) {
    let sumSq = 0
    for (let j = i - period + 1; j <= i; j++) {
      const diff = data[j] - middle[i - period + 1]
      sumSq += diff * diff
    }
    const stdDev = Math.sqrt(sumSq / period)
    const idx = i - period + 1
    upper.push(middle[idx] + stdDevMultiplier * stdDev)
    lower.push(middle[idx] - stdDevMultiplier * stdDev)
  }

  return { upper, middle, lower }
}
