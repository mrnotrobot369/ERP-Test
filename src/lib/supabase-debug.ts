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

// Client avec logging détaillé - ❌ SINGLETON PATTERN
let supabaseDebugInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseDebugClient = () => {
  if (!supabaseDebugInstance) {
    console.log('🔍 DEBUG SUPABASE - Création de l\'instance singleton')
    supabaseDebugInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
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
  } else {
    console.log('🔍 DEBUG SUPABASE - Réutilisation de l\'instance singleton')
  }
  return supabaseDebugInstance
}

export const supabase = getSupabaseDebugClient()

// Logging pour l'authentification - ❌ DÉPLACÉ APRÈS CRÉATION DU CLIENT
(() => {
  if (supabaseDebugInstance) {
    supabaseDebugInstance.auth.onAuthStateChange((event: any, session: any) => {
      console.log('🔍 DEBUG SUPABASE - Auth state change global:', {
        event,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
        timestamp: new Date().toISOString()
      })
    })
  }
})()

// Test de connexion simple
export const testSupabaseConnection = async () => {
  console.log('🧪 TEST SUPABASE - Début du test de connexion complet')
  
  try {
    // Test 1: Configuration
    console.log('✅ Test 1: Configuration')
    console.log('  URL:', supabaseUrl)
    console.log('  Clé:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NON DÉFINIE')
    
    // Test 2: Connexion simple - ❌ OPTIMISÉ POUR ÉVITER LES 503
    console.log('✅ Test 2: Connexion simple')
    try {
      // Utiliser une requête plus simple et robuste
      const { error } = await supabase
        .from('products')
        .select('id')
        .limit(1)
      
      if (error) {
        console.error('❌ Erreur connexion:', error.message)
        return { success: false, error: error.message }
      }
      
      console.log('✅ Connexion réussie - Test simple passé')
    } catch (err: any) {
      console.error('❌ Erreur inattendue connexion:', err.message)
      return { success: false, error: err.message }
    }
    
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
        connection: { status: 'connected' },
        products: products?.length || 0
      }
    }
  } catch (err: any) {
    console.error('❌ Erreur générale:', err.message)
    return { success: false, error: err.message }
  }
}

// Test d'authentification
export const testSupabaseAuth = async () => {
  console.log('🧪 TEST SUPABASE - Début du test d\'authentification')
  
  try {
    // Test 1: Vérifier la session actuelle
    console.log('✅ Test 1: Session actuelle')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ Erreur session:', sessionError.message)
      return { success: false, error: sessionError.message }
    }
    
    console.log('✅ Session vérifiée:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id
    })
    
    // Test 2: Test de l'écouteur d'état
    console.log('✅ Test 2: Listener d\'état auth')
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      console.log('🔍 Auth state change test:', { event, hasUser: !!session?.user })
    })
    
    setTimeout(() => subscription.unsubscribe(), 1000)
    
    return { 
      success: true, 
      data: { 
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id
      }
    }
  } catch (err: any) {
    console.error('❌ Erreur auth test:', err.message)
    return { success: false, error: err.message }
  }
}
