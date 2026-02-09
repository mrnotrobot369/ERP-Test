import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Configuration avec logging détaillé
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

console.log('🔍 SUPABASE CLIENT - Configuration initiale:')
console.log('  URL:', supabaseUrl)
console.log('  ANON_KEY:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NON DÉFINIE')
console.log('  URL valide:', supabaseUrl.includes('supabase.co'))
console.log('  Clé valide:', supabaseAnonKey.startsWith('eyJ'))

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERREUR CRITIQUE: Variables Supabase manquantes')
  console.error('  Solution: Vérifiez votre fichier .env.local')
}

// ❌ SINGLETON PATTERN - Instance unique du client Supabase
let supabaseClientInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!supabaseClientInstance) {
    console.log('🔍 SUPABASE CLIENT - Création de l\'instance singleton')
    supabaseClientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'X-Client-Info': 'erp-gtbp-singleton'
        }
      }
    })
  } else {
    console.log('🔍 SUPABASE CLIENT - Réutilisation de l\'instance singleton')
  }
  
  return supabaseClientInstance
}

// Export de l'instance unique pour compatibilité
export const supabaseClient = getSupabaseClient()

// Export par défaut pour compatibilité existante
export default supabaseClient
