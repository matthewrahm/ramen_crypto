import { useEffect } from 'react'
import { fetchMarketData } from '../services/coingeckoApi'
import useMarketStore from '../stores/useMarketStore'

export default function useMarketData() {
  const setCoins = useMarketStore((s) => s.setCoins)
  const setLoading = useMarketStore((s) => s.setLoading)
  const setError = useMarketStore((s) => s.setError)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchMarketData(1, 30)
        if (!cancelled) setCoins(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    load()
    const interval = setInterval(load, 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [setCoins, setLoading, setError])
}
