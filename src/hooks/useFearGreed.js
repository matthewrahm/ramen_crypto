import { useEffect } from 'react'
import { fetchFearGreed } from '../services/fearGreedApi'
import useSentimentStore from '../stores/useSentimentStore'

export default function useFearGreed() {
  const setData = useSentimentStore((s) => s.setData)
  const setLoading = useSentimentStore((s) => s.setLoading)
  const setError = useSentimentStore((s) => s.setError)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchFearGreed(30)
        if (!cancelled && data?.data) {
          const current = data.data[0]
          const history = data.data.map((d) => ({
            value: parseInt(d.value),
            label: d.value_classification,
            timestamp: parseInt(d.timestamp) * 1000,
          })).reverse()
          setData(
            { value: parseInt(current.value), label: current.value_classification },
            history
          )
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    load()
    const interval = setInterval(load, 5 * 60 * 1000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [setData, setLoading, setError])
}
