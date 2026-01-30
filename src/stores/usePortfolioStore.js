import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { INITIAL_BALANCE } from '../lib/constants'
import * as sync from '../services/supabaseSync'

const usePortfolioStore = create(
  persist(
    (set, get) => ({
      balance: INITIAL_BALANCE,
      positions: [],
      portfolioId: null,
      synced: false,

      addPosition: (position) => {
        const newPosition = { ...position, id: Date.now(), date: new Date().toISOString() }
        set((state) => ({
          positions: [...state.positions, newPosition],
          balance: position.type === 'buy'
            ? state.balance - position.total
            : state.balance + position.total,
        }))

        // Sync to Supabase if authenticated
        const { _syncToSupabase } = get()
        if (_syncToSupabase) _syncToSupabase(newPosition)
      },

      removePosition: (id) => {
        const state = get()
        const pos = state.positions.find((p) => p.id === id)
        if (!pos) return

        set({
          positions: state.positions.filter((p) => p.id !== id),
          balance: pos.type === 'buy'
            ? state.balance + pos.total
            : state.balance - pos.total,
        })

        // Remove from Supabase if it has a supabase ID
        if (pos.supabaseId) {
          sync.removePosition(pos.supabaseId)
        }
      },

      resetPortfolio: () =>
        set({ balance: INITIAL_BALANCE, positions: [] }),

      // Called once after signup to load data from Supabase
      loadFromSupabase: async (userId) => {
        const portfolios = await sync.fetchPortfolios(userId)
        let portfolio = portfolios[0]

        if (!portfolio) {
          portfolio = await sync.createPortfolio(userId)
        }

        if (!portfolio) return

        const positions = await sync.fetchPositions(userId)

        if (positions.length > 0) {
          set({
            portfolioId: portfolio.id,
            balance: portfolio.balance,
            positions: positions.map((p) => ({
              id: p.id,
              supabaseId: p.id,
              asset: p.asset,
              symbol: p.symbol,
              type: p.type,
              quantity: Number(p.quantity),
              entry_price: Number(p.entry_price),
              total: Number(p.total),
              notes: p.notes,
              date: p.created_at,
            })),
            synced: true,
          })
        } else {
          // No remote data — import local data to Supabase
          const localPositions = get().positions
          for (const pos of localPositions) {
            await sync.savePosition(userId, portfolio.id, {
              asset: pos.asset,
              symbol: pos.symbol,
              type: pos.type,
              quantity: pos.quantity,
              entry_price: pos.entry_price,
              total: pos.total,
              notes: pos.notes,
            })
          }
          await sync.updatePortfolioBalance(portfolio.id, get().balance)
          set({ portfolioId: portfolio.id, synced: true })
        }
      },

      // Internal: sync a new position to Supabase
      _syncToSupabase: null,
      setSyncFn: (userId, portfolioId) => {
        set({
          _syncToSupabase: async (position) => {
            const saved = await sync.savePosition(userId, portfolioId, {
              asset: position.asset,
              symbol: position.symbol,
              type: position.type,
              quantity: position.quantity,
              entry_price: position.entry_price,
              total: position.total,
              notes: position.notes,
            })
            if (saved) {
              // Update the position with its supabase ID
              set((state) => ({
                positions: state.positions.map((p) =>
                  p.id === position.id ? { ...p, supabaseId: saved.id } : p
                ),
              }))
            }
            await sync.updatePortfolioBalance(portfolioId, get().balance)
          },
        })
      },
    }),
    {
      name: 'crypto-portfolio',
      partialize: (state) => ({
        balance: state.balance,
        positions: state.positions,
      }),
    }
  )
)

export default usePortfolioStore
