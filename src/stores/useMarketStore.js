import { create } from 'zustand'

const useMarketStore = create((set) => ({
  coins: [],
  loading: false,
  error: null,
  setCoins: (coins) => set({ coins, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}))

export default useMarketStore
