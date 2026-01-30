import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  isGuest: false,

  initialize: async () => {
    if (get().initialized) return
    if (!supabase) {
      set({ loading: false, initialized: true, isGuest: false })
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({
        session,
        user: session?.user ?? null,
        loading: false,
        initialized: true,
        isGuest: session ? false : get().isGuest,
      })
    } catch {
      set({ loading: false, initialized: true, isGuest: false })
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session,
        user: session?.user ?? null,
        isGuest: session ? false : get().isGuest,
      })
    })
  },

  signUp: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    set({ loading: true })
    const { data, error } = await supabase.auth.signUp({ email, password })
    set({ loading: false })
    return { data, error }
  },

  signIn: async (email, password) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    set({ loading: true })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    set({ loading: false })
    return { data, error }
  },

  signInWithOAuth: async (provider) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.auth.signInWithOAuth({ provider })
    return { data, error }
  },

  signOut: async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    set({ user: null, session: null, isGuest: false })
  },

  resetPassword: async (email) => {
    if (!supabase) return { error: { message: 'Supabase not configured' } }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  },

  continueAsGuest: () => {
    set({ isGuest: true, loading: false })
  },
}))

export default useAuthStore
