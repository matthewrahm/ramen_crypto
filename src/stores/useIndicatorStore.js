import { create } from 'zustand'

const useIndicatorStore = create((set) => ({
  active: [],
  toggle: (id) =>
    set((state) => ({
      active: state.active.includes(id)
        ? state.active.filter((i) => i !== id)
        : [...state.active, id],
    })),
  clear: () => set({ active: [] }),
}))

export default useIndicatorStore
