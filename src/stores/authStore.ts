import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase-debug'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (loading: boolean) => void
  /** Initialise l'écoute du state auth Supabase (à appeler au mount de l'app). */
  init: () => void
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),

  init: () => {
    console.log('🔐 AUTH STORE - Initialisation du listener d\'authentification')
    if (get().initialized) {
      console.log('🔐 AUTH STORE - Déjà initialisé, skip')
      return
    }
    set({ initialized: true })

    console.log('🔐 AUTH STORE - Récupération de la session existante...')
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ AUTH STORE - Erreur getSession:', error)
      } else {
        console.log('✅ AUTH STORE - Session récupérée:', {
          hasUser: !!session?.user,
          userId: session?.user?.id,
          email: session?.user?.email
        })
      }
      set({ user: session?.user ?? null, session, loading: false })
    })

    console.log('🔐 AUTH STORE - Configuration du listener onAuthStateChange...')
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 AUTH STORE - Auth state change:', {
        event,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
        timestamp: new Date().toISOString()
      })
      set({ user: session?.user ?? null, session })
    })

    return () => {
      console.log('🔐 AUTH STORE - Unsubscribe du listener')
      subscription.unsubscribe()
    }
  },

  signIn: async (email, password) => {
    console.log('🔐 AUTH STORE - Début signIn:', {
      email,
      hasPassword: !!password,
      passwordLength: password.length
    })
    
    set({ loading: true })
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      
      if (error) {
        console.error('❌ AUTH STORE - Erreur signIn:', {
          message: error.message,
          status: error.status,
          code: (error as any).code,
          details: (error as any).details
        })
        set({ loading: false })
        return { error }
      }
      
      console.log('✅ AUTH STORE - SignIn réussi:', {
        hasUser: !!data.user,
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session,
        timestamp: new Date().toISOString()
      })
      
      set({ loading: false })
      return { error: null }
    } catch (err: any) {
      console.error('❌ AUTH STORE - Erreur inattendue signIn:', err)
      set({ loading: false })
      return { error: err }
    }
  },

  signUp: async (email, password) => {
    console.log('🔐 AUTH STORE - Début signUp:', {
      email,
      hasPassword: !!password,
      passwordLength: password.length
    })
    
    set({ loading: true })
    
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      
      if (error) {
        console.error('❌ AUTH STORE - Erreur signUp:', {
          message: error.message,
          status: error.status,
          code: (error as any).code,
          details: (error as any).details
        })
        set({ loading: false })
        return { error }
      }
      
      console.log('✅ AUTH STORE - SignUp réussi:', {
        hasUser: !!data.user,
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session,
        needsEmailConfirmation: !data.session,
        timestamp: new Date().toISOString()
      })
      
      set({ loading: false })
      return { error: null }
    } catch (err: any) {
      console.error('❌ AUTH STORE - Erreur inattendue signUp:', err)
      set({ loading: false })
      return { error: err }
    }
  },

  signOut: async () => {
    console.log('🔐 AUTH STORE - Début signOut')
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ AUTH STORE - Erreur signOut:', error)
      } else {
        console.log('✅ AUTH STORE - SignOut réussi')
      }
      
      set({ user: null, session: null })
    } catch (err: any) {
      console.error('❌ AUTH STORE - Erreur inattendue signOut:', err)
      set({ user: null, session: null })
    }
  },
}))
