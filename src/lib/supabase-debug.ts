import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Configuration avec logging détaillé
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

console.log('🔍 DEBUG SUPABASE - Configuration initiale:')
console.log('  URL:', supabaseUrl)
console.log('  ANON_KEY:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NON DÉFINIE')
console.log('  URL valide:', supabaseUrl.includes('supabase.co'))
console.log('  Clé valide:', supabaseAnonKey.startsWith('eyJ'))

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERREUR CRITIQUE: Variables Supabase manquantes')
  console.error('  Solution: Vérifiez votre fichier .env.local')
}

// Client avec logging détaillé
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'erp-gtbp-debug'
    }
  }
})

// Test de connexion simple
export const testSupabaseConnection = async () => {
  console.log('🧪 TEST SUPABASE - Début du test de connexion complet')
  
  try {
    // Test 1: Configuration
    console.log('✅ Test 1: Configuration')
    console.log('  URL:', supabaseUrl)
    console.log('  Clé:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NON DÉFINIE')
    
    // Test 2: Connexion simple
    console.log('✅ Test 2: Connexion simple')
    const { data, error } = await supabase.from('products').select('count').single()
    
    if (error) {
      console.error('❌ Erreur connexion:', error.message)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Connexion réussie:', data)
    
    // Test 3: Lecture de données
    console.log('✅ Test 3: Lecture de données')
    const { data: products, error: productsError } = await supabase.from('products').select('*').limit(5)
    
    if (productsError) {
      console.error('❌ Erreur lecture produits:', productsError.message)
      return { success: false, error: productsError.message }
    }
    
    console.log('✅ Produits trouvés:', products?.length, 'produits')
    
    return { 
      success: true, 
      data: { 
        config: { url: supabaseUrl, key: supabaseAnonKey },
        connection: { count: data?.count },
        products: products?.length || 0
      }
    }
  } catch (err: any) {
    console.error('❌ Erreur générale:', err.message)
    return { success: false, error: err.message }
  }
}
