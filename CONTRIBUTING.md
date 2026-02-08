# 🤝 Guide de Contribution - GTBP ERP

Merci de votre intérêt pour contribuer au projet GTBP ERP ! 🎉

## 📋 Table des Matières
- [Processus de Développement](#processus-de-développement)
- [Guidelines de Code](#guidelines-de-code)
- [Processus de Pull Request](#processus-de-pull-request)
- [Style Guide](#style-guide)

## 🔄 Processus de Développement

### 1. Fork le Repository
```bash
# Fork le projet sur GitHub
# Clonez votre fork localement
git clone https://github.com/VOTRE_USERNAME/GTBP-ERP.git
cd GTBP-ERP
```

### 2. Créez une Branche
```bash
# Créez une branche pour votre feature
git checkout -b feature/nom-de-la-feature

# Ou pour un bugfix
git checkout -b fix/nom-du-bugfix
```

### 3. Installez les Dépendances
```bash
npm install
```

### 4. Développez
- Suivez les guidelines de code ci-dessous
- Testez vos changements
- Documentez si nécessaire

## 📝 Guidelines de Code

### TypeScript
- Utilisez des types stricts
- Préférez les interfaces aux types
- Ajoutez JSDoc pour les fonctions complexes

```tsx
// ✅ Bon
interface Product {
  id: string
  name: string
  price: number
}

/**
 * Calcule la marge bénéficiaire
 * @param costPrice - Prix de coût
 * @param sellingPrice - Prix de vente
 * @returns Pourcentage de marge
 */
export function calculateMargin(costPrice: number, sellingPrice: number): number {
  return ((sellingPrice - costPrice) / costPrice) * 100
}

// ❌ Éviter
function calculateMargin(a: any, b: any): any {
  return ((b - a) / a) * 100
}
```

### React
- Utilisez des composants fonctionnels
- Préférez les hooks aux classes
- Utilisez TypeScript strict

```tsx
// ✅ Bon
export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  return (
    <Card>
      <CardContent>
        <h3>{product.name}</h3>
      </CardContent>
    </Card>
  )
}

// ❌ Éviter
class ProductCard extends React.Component {
  render() {
    return <div>{this.props.product.name}</div>
  }
}
```

### Nommage
- **Composants**: PascalCase (`ProductCard`)
- **Fichiers**: kebab-case (`product-card.tsx`)
- **Variables**: camelCase (`productName`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Imports
- Groupés par type
- Imports relatifs avec `@/`
- Pas d'imports inutilisés

```tsx
// ✅ Bon
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types/product'

// ❌ Éviter
import React from 'react'
import Button from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types/product'
```

## 🔄 Processus de Pull Request

### 1. Testez Vos Changements
```bash
# Lancement en développement
npm run dev

# Tests (quand disponibles)
npm test

# Build de production
npm run build
```

### 2. Commitez Vos Changements
```bash
# Ajoutez les fichiers modifiés
git add .

# Commitez avec un message clair
git commit -m "feat: add product search functionality"

# Push vers votre fork
git push origin feature/nom-de-la-feature
```

### 3. Créez la Pull Request
- Utilisez le template de PR
- Remplissez toutes les sections
- Ajoutez des captures d'écran si applicable
- Liez les issues connexes

### 4. Relecture
- Soyez patient pour la relecture
- Répondez aux commentaires rapidement
- Faites les changements demandés

## 🎨 Style Guide

### CSS/Tailwind
- Utilisez les classes utilitaires Tailwind
- Évitez le CSS inline
- Préférez les composants shadcn/ui

```tsx
// ✅ Bon
<div className="flex items-center justify-between p-4 border rounded-lg">
  <h2 className="text-lg font-semibold">{title}</h2>
  <Button variant="outline">Action</Button>
</div>

// ❌ Éviter
<div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px' }}>
  <h2 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h2>
</div>
```

### Messages de Commit
Utilisez [Conventional Commits](https://conventionalcommits.org/):

```
feat: add product search functionality
fix: resolve validation error in product form
docs: update README with installation guide
refactor: optimize product list rendering
test: add unit tests for product service
```

## 🧪 Tests

### Tests Unitaires
- Testez les fonctions pures
- Mockez les dépendances externes
- Couvrez les cas d'erreur

```tsx
// ✅ Bon exemple
describe('calculateMargin', () => {
  it('should return correct margin for valid inputs', () => {
    expect(calculateMargin(100, 150)).toBe(50)
  })
  
  it('should handle zero cost price', () => {
    expect(calculateMargin(0, 100)).toBe(0)
  })
})
```

### Tests d'Intégration
- Testez les workflows utilisateur
- Utilisez Testing Library
- Mockez Supabase pour les tests

## 📚 Documentation

- Mettez à jour le README pour les nouvelles fonctionnalités
- Ajoutez des JSDoc pour les fonctions complexes
- Documentez les changements cassants

## 🚀 Déploiement

Le projet est automatiquement déployé via GitHub Actions lors du merge sur `main`.

## 🤝 Besoin d'Aide?

- Créez une issue pour les questions
- Rejoignez les discussions GitHub
- Consultez la documentation existante

---

**Merci de votre contribution ! 🎉**
