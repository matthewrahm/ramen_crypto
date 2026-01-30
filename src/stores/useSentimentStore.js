import { create } from 'zustand'

const useSentimentStore = create((set) => ({
  current: null,
  history: [],
  loading: false,
  error: null,
  setData: (current, history) => set({ current, history, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
}))

export default useSentimentStore
