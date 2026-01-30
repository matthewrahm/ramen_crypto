import { useMemo } from 'react'
import { sma, ema, rsi, macd, bollingerBands } from '../lib/indicators'
import { candlesToCloses } from '../lib/chartHelpers'
import useChartStore from '../stores/useChartStore'
import useIndicatorStore from '../stores/useIndicatorStore'

export default function useIndicators() {
  const candles = useChartStore((s) => s.candles)
  const active = useIndicatorStore((s) => s.active)

  return useMemo(() => {
    if (!candles.length) return {}

    const closes = candlesToCloses(candles)
    const result = {}

    if (active.includes('sma50')) {
      const values = sma(closes, 50)
      result.sma50 = values.map((v, i) => ({
        time: candles[i + 49]?.time,
        value: v,
      })).filter((d) => d.time != null)
    }

    if (active.includes('sma200')) {
      const values = sma(closes, 200)
      result.sma200 = values.map((v, i) => ({
        time: candles[i + 199]?.time,
        value: v,
      })).filter((d) => d.time != null)
    }

    if (active.includes('ema50')) {
      const values = ema(closes, 50)
      result.ema50 = values.map((v, i) => ({
        time: candles[i + 49]?.time,
        value: v,
      })).filter((d) => d.time != null)
    }

    if (active.includes('ema200')) {
      const values = ema(closes, 200)
      result.ema200 = values.map((v, i) => ({
        time: candles[i + 199]?.time,
        value: v,
      })).filter((d) => d.time != null)
    }

    if (active.includes('bb')) {
      const bb = bollingerBands(closes, 20, 2)
      result.bbUpper = bb.upper.map((v, i) => ({
        time: candles[i + 19]?.time,
        value: v,
      })).filter((d) => d.time != null)
      result.bbMiddle = bb.middle.map((v, i) => ({
        time: candles[i + 19]?.time,
        value: v,
      })).filter((d) => d.time != null)
      result.bbLower = bb.lower.map((v, i) => ({
        time: candles[i + 19]?.time,
        value: v,
      })).filter((d) => d.time != null)
    }

    if (active.includes('rsi')) {
      const values = rsi(closes, 14)
      result.rsi = values.map((v, i) => ({
        time: candles[i + 14]?.time,
        value: v,
      })).filter((d) => d.time != null)
    }

    if (active.includes('macd')) {
      const m = macd(closes, 12, 26, 9)
      const offset = 25 + 8
      result.macdLine = m.macdLine.map((v, i) => ({
        time: candles[i + offset]?.time,
        value: v,
      })).filter((d) => d.time != null)
      result.macdSignal = m.signalLine.map((v, i) => ({
        time: candles[i + offset]?.time,
        value: v,
      })).filter((d) => d.time != null)
      result.macdHistogram = m.histogram.map((v, i) => ({
        time: candles[i + offset]?.time,
        value: v,
      })).filter((d) => d.time != null)
    }

    return result
  }, [candles, active])
}
