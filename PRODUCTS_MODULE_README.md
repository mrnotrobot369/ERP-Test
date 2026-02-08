# Module Produits - GTBP ERP

## 📋 Vue d'ensemble

Module complet de gestion des produits pour l'ERP GTBP avec React + TypeScript + Supabase.

## 🚀 Installation

### 1. Migration SQL

```bash
# Appliquer la migration de création de table
supabase db push

# Ou appliquer manuellement via Supabase Dashboard > SQL Editor
# Fichier: supabase/migrations/001_create_products_table.sql

# Appliquer les données de test
supabase db push
# Fichier: supabase/migrations/002_seed_products.sql
```

### 2. Dépendances

```bash
npm install @radix-ui/react-dropdown-menu
```

## 🏗️ Structure du Module

```
src/
├── types/
│   └── product.ts              # Types TypeScript
├── lib/
│   └── validations/
│       └── product.ts          # Validation Zod
├── hooks/
│   └── use-products.ts         # Hooks TanStack Query
├── components/
│   └── products/
│       ├── ProductForm.tsx     # Formulaire CRUD
│       ├── ProductCard.tsx     # Carte d'affichage
│       └── ProductActions.tsx  # Actions dropdown
├── pages/
│   ├── Products.tsx            # Liste avec recherche
│   ├── ProductNew.tsx          # Création
│   └── ProductEdit.tsx         # Modification
└── routes.tsx                  # Routes configurées
```

## 🎯 Fonctionnalités

### ✅ Fonctionnalités Implémentées

- **Gestion CRUD** complète des produits
- **Recherche plein texte** (nom, description, référence, SKU)
- **Filtres avancés** (catégorie, marque, statut, stock)
- **Validation robuste** avec Zod
- **Gestion intelligente des stocks** avec alertes
- **Calcul automatique** des marges bénéficiaires
- **Interface responsive** avec shadcn/ui
- **Mode grille/liste** pour l'affichage
- **Statistiques en temps réel**
- **Actions rapides** (éditer, supprimer, activer/désactiver)

### 📊 Statistiques et Alertes

- **Dashboard intégré**: Nombre total de produits et stock faible
- **Alertes de stock**: Produits en stock faible et rupture
- **Marge bénéficiaire**: Calcul automatique avec indicateurs visuels
- **Statuts visuels**: Badges pour actif/inactif, stock, marge

## 🛠️ Routes Disponibles

| Route | Description | Action |
|-------|-------------|--------|
| `/products` | Liste des produits | Recherche, filtres, statistiques |
| `/products/new` | Nouveau produit | Formulaire de création |
| `/products/:id/edit` | Modifier produit | Formulaire de modification |

## 📝 Exemples d'Utilisation

### Créer un produit

```tsx
// Navigation automatique via le bouton "Nouveau produit"
navigate('/products/new')
```

### Rechercher des produits

```tsx
const { data: products } = useProducts({
  search: 'laptop',
  category: 'Électronique',
  is_active: true
})
```

### Gérer le stock

```tsx
const updateStock = useUpdateProductStock()

// Ajouter du stock
await updateStock.mutateAsync({
  id: 'product-uuid',
  quantity: 10,
  operation: 'add'
})

// Définir le stock
await updateStock.mutateAsync({
  id: 'product-uuid', 
  quantity: 50,
  operation: 'set'
})
```

## 🧪 Données de Test

Le module inclut **15 produits exemples** couvrant :

- **Catégories variées**: Électronique, Bureautique, Accessoires, Audio, Stockage
- **Marques différentes**: TechBrand, GameGear, PowerTech, etc.
- **Scénarios de stock**: Normal, faible, rupture
- **Produits actifs/inactifs**: Pour tester les filtres
- **Prix et marges**: Différents niveaux de rentabilité

## 🎨 Interface Utilisateur

### Page Liste (`/products`)
- **Recherche** en temps réel
- **Filtres** dépliants (catégorie, marque, statut, stock)
- **Vue grille/liste** basculable
- **Statistiques** en cartes
- **Actions rapides** sur chaque produit

### Formulaire (`/products/new` et `/products/:id/edit`)
- **Validation en temps réel** avec messages d'erreur
- **Calcul automatique** de la marge bénéficiaire
- **Alertes de stock** pendant la saisie
- **Sélecteurs** pour catégories et marques
- **Mode édition** avec données pré-remplies

### Carte Produit
- **Affichage complet** ou compact
- **Badges de statut** (stock, marge, actif)
- **Actions intégrées** (modifier, supprimer, activer)
- **Informations clés** visibles d'un coup d'œil

## 🔧 Configuration

### Variables d'Environnement

Assurez-vous d'avoir les variables Supabase configurées :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

### Permissions RLS

Les politiques RLS sont configurées pour :
- ✅ **Lecture**: Utilisateurs authentifiés peuvent voir tous les produits
- ✅ **Création**: Utilisateurs authentifiés peuvent créer des produits
- ✅ **Modification**: Utilisateurs authentifiés peuvent modifier des produits
- ✅ **Suppression**: Utilisateurs authentifiés peuvent supprimer des produits

## 🚀 Prochaines Évolutions Possibles

- **Import/Export** CSV des produits
- **Gestion des images** de produits
- **Historique des mouvements** de stock
- **Alertes automatiques** par email
- **Gestion des variants** (tailles, couleurs)
- **Intégration** avec les factures
- **Barcodes** et codes QR

## 🐛 Dépannage

### Problèmes Communs

1. **Erreur de connexion Supabase**
   - Vérifiez vos variables d'environnement
   - Assurez-vous que RLS est activé

2. **Produits ne s'affichent pas**
   - Vérifiez que la migration a été appliquée
   - Appliquez les données de test avec la migration 002

3. **Validation ne fonctionne pas**
   - Vérifiez que react-hook-form et zod sont installés
   - Assurez-vous que le resolver est correctement configuré

### Logs Utiles

```tsx
// Activer les logs de développement
console.log('Produits chargés:', products)
console.log('Erreur:', error)
```

## 📞 Support

Pour toute question sur le module produits :
- Vérifiez la documentation Supabase
- Consultez les logs de développement
- Testez avec les données exemples fournies

---

**Module développé avec ❤️ pour GTBP ERP**
