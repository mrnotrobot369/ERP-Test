import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

console.log('🔍 SUPABASE - Configuration initiale:')
console.log('  URL:', supabaseUrl)
console.log('  ANON_KEY:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NON DÉFINIE')

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définis dans .env.local'
  )
}

// ❌ SINGLETON PATTERN - Instance unique du client Supabase
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    console.log('🔍 SUPABASE - Création de l\'instance singleton')
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'erp-gtbp-main'
        }
      }
    })
  } else {
    console.log('🔍 SUPABASE - Réutilisation de l\'instance singleton')
  }
  
  return supabaseInstance
}

/**
 * Client Supabase singleton pour le frontend.
 * Utiliser ce client partout (hooks, pages) pour éviter plusieurs instances.
 * RLS (Row Level Security) doit être configuré côté projet Supabase.
 */
export const supabase = getSupabaseClient()

// Export par défaut pour compatibilité
export default supabase
