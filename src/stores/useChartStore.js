import { create } from 'zustand'

const useChartStore = create((set) => ({
  candles: [],
  loading: false,
  error: null,
  setCandles: (candles) => set({ candles, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  appendCandle: (candle) =>
    set((state) => {
      const existing = [...state.candles]
      const lastIdx = existing.length - 1
      if (lastIdx >= 0 && existing[lastIdx].time === candle.time) {
        existing[lastIdx] = candle
      } else {
        existing.push(candle)
      }
      return { candles: existing }
    }),
}))

export default useChartStore
