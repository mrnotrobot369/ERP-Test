/**
 * Fichier de test pour vérifier la connexion Supabase
 * À exécuter dans la console du navigateur ou comme composant React
 */

import { supabase } from '@/lib/supabase'

// Test de connexion simple
export async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase...')
  
  try {
    // Test simple de connexion
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .single()
    
    if (error) {
      console.error('❌ Erreur de connexion Supabase:', error)
      return {
        success: false,
        error: error.message,
        details: error
      }
    }
    
    console.log('✅ Connexion Supabase réussie!')
    console.log('📊 Données reçues:', data)
    
    return {
      success: true,
      data: data
    }
  } catch (err) {
    console.error('❌ Erreur critique:', err)
    return {
      success: false,
      error: 'Erreur inattendue',
      details: err
    }
  }
}

// Test complet avec produits
export async function testProductsData() {
  console.log('🔍 Test des données produits...')
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(5)
    
    if (error) {
      console.error('❌ Erreur récupération produits:', error)
      return {
        success: false,
        error: error.message
      }
    }
    
    console.log(`✅ ${data?.length || 0} produits trouvés`)
    data?.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.selling_price}€`)
    })
    
    return {
      success: true,
      count: data?.length || 0,
      products: data
    }
  } catch (err) {
    console.error('❌ Erreur critique produits:', err)
    return {
      success: false,
      error: 'Erreur inattendue'
    }
  }
}

// Test des catégories
export async function testCategories() {
  console.log('🔍 Test des catégories...')
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .not('category', 'is', null)
    
    if (error) {
      console.error('❌ Erreur catégories:', error)
      return {
        success: false,
        error: error.message
      }
    }
    
    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))]
    console.log('✅ Catégories trouvées:', categories)
    
    return {
      success: true,
      categories: categories
    }
  } catch (err) {
    console.error('❌ Erreur critique catégories:', err)
    return {
      success: false,
      error: 'Erreur inattendue'
    }
  }
}

// Fonction de test complète
export async function runAllTests() {
  console.log('🚀 Lancement des tests Supabase...')
  console.log('=' .repeat(50))
  
  const results = {
    connection: await testSupabaseConnection(),
    products: await testProductsData(),
    categories: await testCategories()
  }
  
  console.log('=' .repeat(50))
  console.log('📊 Résultats des tests:')
  
  Object.entries(results).forEach(([key, result]) => {
    const status = result.success ? '✅' : '❌'
    console.log(`${status} ${key}: ${result.success ? 'Succès' : result.error}`)
  })
  
  const allSuccess = Object.values(results).every(r => r.success)
  
  if (allSuccess) {
    console.log('\n🎉 Tous les tests réussis! Votre setup Supabase est fonctionnel.')
  } else {
    console.log('\n⚠️ Certains tests ont échoué. Vérifiez votre configuration.')
  }
  
  return results
}

// Pour utiliser dans la console du navigateur:
// Copiez-collez ce code dans la console puis exécutez:
// await runAllTests()
