export function klinesToCandles(klines) {
  return klines.map((k) => ({
    time: Math.floor(k[0] / 1000),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5]),
  }))
}

export function klinesToLineData(klines) {
  return klines.map((k) => ({
    time: Math.floor(k[0] / 1000),
    value: parseFloat(k[4]),
  }))
}

export function candlesToCloses(candles) {
  return candles.map((c) => c.close)
}

export function normalizeToPercent(data) {
  if (!data.length) return []
  const base = data[0].value
  if (base === 0) return data
  return data.map((d) => ({
    time: d.time,
    value: ((d.value - base) / base) * 100,
  }))
}

export function indicatorToLineData(values, candles, offset = 0) {
  return values.map((v, i) => ({
    time: candles[i + offset]?.time,
    value: v,
  })).filter((d) => d.time != null && !isNaN(d.value))
}
