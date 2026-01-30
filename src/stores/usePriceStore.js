import { create } from 'zustand'

const usePriceStore = create((set) => ({
  prices: {},
  stats: {},
  sparklines: {},
  setPriceData: (symbol, data) =>
    set((state) => ({
      prices: { ...state.prices, [symbol]: data.price },
      stats: {
        ...state.stats,
        [symbol]: {
          change: data.change,
          changePercent: data.changePercent,
          high: data.high,
          low: data.low,
          volume: data.volume,
          quoteVolume: data.quoteVolume,
        },
      },
    })),
  addSparklinePoint: (symbol, price) =>
    set((state) => {
      const existing = state.sparklines[symbol] || []
      const updated = [...existing, price].slice(-60)
      return { sparklines: { ...state.sparklines, [symbol]: updated } }
    }),
}))

export default usePriceStore
