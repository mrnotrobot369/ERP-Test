import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null

  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearError: () => void

  // Auto-sync with Supabase auth state
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, session: data.session, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Sign in failed',
        loading: false
      })
    }
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      set({ user: data.user, session: data.session, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Sign up failed',
        loading: false
      })
    }
  },

  signOut: async () => {
    set({ loading: true })
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      set({ user: null, session: null, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Sign out failed',
        loading: false
      })
    }
  },

  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, session, loading: false })

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_, session) => {
        set({ user: session?.user || null, session })
      })
    } catch (err) {
      set({ loading: false })
    }
  }
}))
