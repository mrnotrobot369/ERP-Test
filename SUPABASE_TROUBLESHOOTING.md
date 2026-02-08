# Guide de Dépannage Supabase

## 🚀 Étapes Initiales

### 1. Vérifier Variables d'Environnement

Ouvrez votre fichier `.env.local` et vérifiez :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-ici
```

**Comment trouver ces clés :**
1. Allez sur [supabase.com](https://supabase.com)
2. Sélectionnez votre projet
3. Settings > API
4. Copiez l'URL et la clé `anon`

### 2. Tester la Connexion

Créez un fichier de test :

```tsx
// src/test-supabase.ts
import { supabase } from '@/lib/supabase'

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
```

## 🗄️ Appliquer les Migrations

### Option A: Via CLI Supabase (Recommandé)

```bash
# Installer le CLI si pas déjà fait
npm install -g supabase

# Se connecter à votre projet
supabase login

# Lier le projet local
supabase link --project-ref votre-projet-id

# Appliquer les migrations
supabase db push
```

### Option B: Via Dashboard Supabase

1. Allez sur votre projet Supabase
2. Ouvrez `SQL Editor`
3. Copiez-collez le contenu de `001_create_products_table.sql`
4. Cliquez sur `Run`
5. Faites de même avec `002_seed_products.sql`

### Option C: Via Table Builder (Interface Graphique)

1. Dans Supabase Dashboard > Table Editor
2. Cliquez sur `Create a new table`
3. Nommez-la `products`
4. Ajoutez les colonnes manuellement (voir schéma ci-dessous)

## 📋 Schéma de la Table Products

| Nom | Type | Contraintes | Description |
|------|------|-------------|-------------|
| id | uuid | PRIMARY KEY | UUID généré |
| created_at | timestamptz | DEFAULT now() | Date de création |
| updated_at | timestamptz | DEFAULT now() | Date de mise à jour |
| name | text | NOT NULL | Nom du produit |
| description | text | NULLABLE | Description |
| reference | text | UNIQUE NULLABLE | Référence interne |
| sku | text | UNIQUE NULLABLE | SKU |
| cost_price | numeric(10,2) | NOT NULL DEFAULT 0 | Prix de coût |
| selling_price | numeric(10,2) | NOT NULL DEFAULT 0 | Prix de vente |
| stock_quantity | integer | NOT NULL DEFAULT 0 | Quantité en stock |
| min_stock_level | integer | NOT NULL DEFAULT 0 | Stock minimum |
| max_stock_level | integer | NOT NULL DEFAULT 1000 | Stock maximum |
| category | text | NULLABLE | Catégorie |
| brand | text | NULLABLE | Marque |
| weight | numeric(8,3) | NULLABLE | Poids en kg |
| dimensions | text | NULLABLE | Dimensions LxWxH |
| is_active | boolean | NOT NULL DEFAULT true | Statut actif |

## 🔐 Configurer RLS (Row Level Security)

Après création de la table, exécutez :

```sql
-- Activer RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Politiques de base
CREATE POLICY "Users can view active products" ON public.products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');
```

## 🐛 Problèmes Communs

### Erreur "relation does not exist"
**Cause**: La table n'existe pas
**Solution**: Appliquez la migration SQL

### Erreur "permission denied"
**Cause**: RLS non configuré
**Solution**: Configurez les politiques RLS

### Erreur "column does not exist"
**Cause**: Schéma incomplet
**Solution**: Vérifiez toutes les colonnes

### Erreur CORS
**Cause**: Origine non autorisée
**Solution**: Ajoutez `localhost:5173` dans les origines autorisées

## 🧪 Tests de Validation

Après configuration, testez avec :

```tsx
// Dans votre composant React
import { useProducts } from '@/hooks/use-products'

function TestComponent() {
  const { data: products, error } = useProducts()
  
  if (error) {
    return <div>Erreur: {error.message}</div>
  }
  
  return (
    <div>
      <h1>Produits trouvés: {products?.length || 0}</h1>
      {products?.map(p => (
        <div key={p.id}>
          {p.name} - {p.selling_price}€
        </div>
      ))}
    </div>
  )
}
```

## 📞 Support Supabase

- Documentation: [supabase.com/docs](https://supabase.com/docs)
- Status: [status.supabase.com](https://status.supabase.com)
- Support: [supabase.com/support](https://supabase.com/support)
