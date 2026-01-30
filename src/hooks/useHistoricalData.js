import { useEffect } from 'react'
import { fetchKlines } from '../services/binanceRest'
import { klinesToCandles } from '../lib/chartHelpers'
import { TIME_RANGES } from '../lib/constants'
import useChartStore from '../stores/useChartStore'
import useAppStore from '../stores/useAppStore'

export default function useHistoricalData() {
  const selectedAsset = useAppStore((s) => s.selectedAsset)
  const selectedRange = useAppStore((s) => s.selectedRange)
  const setCandles = useChartStore((s) => s.setCandles)
  const setLoading = useChartStore((s) => s.setLoading)
  const setError = useChartStore((s) => s.setError)

  useEffect(() => {
    let cancelled = false
    const range = TIME_RANGES.find((r) => r.value === selectedRange) || TIME_RANGES[0]

    async function load() {
      setLoading(true)
      try {
        const klines = await fetchKlines(selectedAsset, range.interval, range.limit)
        if (!cancelled) {
          setCandles(klinesToCandles(klines))
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    load()
    return () => { cancelled = true }
  }, [selectedAsset, selectedRange, setCandles, setLoading, setError])
}
