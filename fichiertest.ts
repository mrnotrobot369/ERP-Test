import { supabase } from '@GTBP/supabase'

async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .single()
    
    if (error) {
      console.error('Erreur de connexion:', error)
      return false
    }
    
    console.log('✅ Connexion réussie:', data)
    return true
  } catch (err) {
    console.error('❌ Erreur critique:', err)
    return false
  }
}

testConnection()