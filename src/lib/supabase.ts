import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définis dans .env.local'
  )
}

/**
 * Client Supabase singleton pour le frontend.
 * Utiliser ce client partout (hooks, pages) pour éviter plusieurs instances.
 * RLS (Row Level Security) doit être configuré côté projet Supabase.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
