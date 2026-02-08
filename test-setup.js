#!/usr/bin/env node

/**
 * Script de vérification du setup GTBP ERP
 * Vérifie que tous les composants et fichiers sont en place
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Vérification du projet GTBP ERP...\n')

// Fichiers critiques à vérifier
const criticalFiles = [
  'src/types/database.ts',
  'src/types/product.ts',
  'src/lib/validations/product.ts',
  'src/hooks/use-products.ts',
  'src/components/products/ProductForm.tsx',
  'src/components/products/ProductCard.tsx',
  'src/components/products/ProductActions.tsx',
  'src/pages/Products.tsx',
  'src/pages/ProductNew.tsx',
  'src/pages/ProductEdit.tsx',
  'src/routes.tsx',
  'supabase/migrations/001_create_products_table.sql',
  'supabase/migrations/002_seed_products.sql'
]

// Vérifier l'existence des fichiers
let allFilesExist = true
const missingFiles = []

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, file)
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MANQUANT`)
    missingFiles.push(file)
    allFilesExist = false
  }
})

// Vérifier le contenu des routes
try {
  const routesContent = fs.readFileSync('src/routes.tsx', 'utf8')
  const hasProductsRoutes = routesContent.includes('/products') && 
                        routesContent.includes('ProductNew') && 
                        routesContent.includes('ProductEdit')
  
  if (hasProductsRoutes) {
    console.log('✅ Routes produits configurées')
  } else {
    console.log('❌ Routes produits manquantes')
    allFilesExist = false
  }
} catch (error) {
  console.log('❌ Erreur lecture routes.tsx')
  allFilesExist = false
}

// Vérifier les imports dans Layout
try {
  const layoutContent = fs.readFileSync('src/components/Layout.tsx', 'utf8')
  const hasProductsNav = layoutContent.includes('Produits') && 
                       layoutContent.includes('Package')
  
  if (hasProductsNav) {
    console.log('✅ Navigation produits ajoutée')
  } else {
    console.log('❌ Navigation produits manquante')
    allFilesExist = false
  }
} catch (error) {
  console.log('❌ Erreur lecture Layout.tsx')
  allFilesExist = false
}

// Vérifier package.json pour les dépendances
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    '@tanstack/react-query',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    'lucide-react',
    '@supabase/supabase-js'
  ]
  
  let allDepsPresent = true
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ Dépendance ${dep}`)
    } else {
      console.log(`❌ Dépendance manquante: ${dep}`)
      allDepsPresent = false
    }
  })
  
  if (!allDepsPresent) allFilesExist = false
} catch (error) {
  console.log('❌ Erreur lecture package.json')
  allFilesExist = false
}

// Résultat final
console.log('\n' + '='.repeat(50))
if (allFilesExist) {
  console.log('🎉 SUCCÈS: Module produits complètement installé!')
  console.log('\n📋 Prochaines étapes:')
  console.log('1. Appliquer les migrations SQL dans Supabase')
  console.log('2. Installer @radix-ui/react-dropdown-menu')
  console.log('3. Démarrer le serveur: npm run dev')
  console.log('4. Tester: http://localhost:5173/products')
} else {
  console.log('❌ ERREUR: Certains éléments sont manquants')
  console.log('\n🔧 Actions requises:')
  
  if (missingFiles.length > 0) {
    console.log('\n📁 Fichiers manquants:')
    missingFiles.forEach(file => console.log(`   - ${file}`))
  }
  
  console.log('\n📦 Vérifiez que toutes les dépendances sont installées:')
  console.log('   npm install')
  
  console.log('\n🗄️ Appliquez les migrations SQL:')
  console.log('   Via Supabase Dashboard > SQL Editor')
  console.log('   Ou avec: supabase db push')
}

console.log('\n📚 Documentation disponible:')
console.log('- PRODUCTS_MODULE_README.md')
console.log('- SUPABASE_TROUBLESHOOTING.md') 
console.log('- GITHUB_PROJECT_PLAN.md')

console.log('\n🚀 Bon développement!')
