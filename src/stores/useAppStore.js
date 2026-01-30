import { create } from 'zustand'
import { fetchPreferences, savePreferences } from '../services/supabaseSync'

const useAppStore = create((set, get) => ({
  selectedAsset: 'BTCUSDT',
  selectedRange: '1D',
  chartType: 'candlestick',
  _userId: null,

  setSelectedAsset: (asset) => set({ selectedAsset: asset }),

  setSelectedRange: (range) => {
    set({ selectedRange: range })
    const { _userId } = get()
    if (_userId) savePreferences(_userId, { default_range: range })
  },

  setChartType: (type) => {
    set({ chartType: type })
    const { _userId } = get()
    if (_userId) savePreferences(_userId, { chart_type: type })
  },

  loadPreferences: async (userId) => {
    set({ _userId: userId })
    const prefs = await fetchPreferences(userId)
    if (prefs) {
      set({
        selectedRange: prefs.default_range || '1D',
        chartType: prefs.chart_type || 'candlestick',
      })
    }
  },
}))

export default useAppStore
