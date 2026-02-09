# 📦 **INSTRUCTIONS POUR INSÉRER LES DONNÉES EXEMPLES**

## 🎯 **Où Coller le Script**

### 1. **Accéder au Dashboard Supabase**
```
1. Allez sur https://dashboard.supabase.com
2. Connectez-vous avec votre compte
3. Sélectionnez votre projet ERP
```

### 2. **Ouvrir l'Éditeur SQL**
```
1. Dans le menu de gauche, cliquez sur "SQL Editor"
2. Cliquez sur "New query" pour créer une nouvelle requête
3. Copiez tout le contenu du fichier ERP_SEED_DATA.sql
4. Collez-le dans l'éditeur
5. Cliquez sur "Run" pour exécuter le script
```

---

## 📋 **Données Qui Seront Insérées**

### 🏷️ **3 Catégories**
- **Électronique** : MacBook Pro, iPhone 15 Pro, iPad Air, AirPods Pro
- **Mobilier** : Bureau réglable, Chaise ergonomique, Étagère modulaire
- **Services** : Abonnement ERP Pro, Formation ERP, Maintenance annuelle

### 📦 **10 Produits**
- **4 produits Électronique** (Apple)
- **3 produits Mobilier** (Ergonomie)
- **3 produits Services** (GTBP)

### 👥 **5 Clients**
- Société Informatique SA (Genève)
- Bureau Design Sàrl (Lausanne)
- Entreprise Construction AG (Zurich)
- Café Central (Berne)
- Librairie Moderne (Sion)

### 🧾 **7 Factures**
- Différents statuts : draft, sent, paid
- Clients variés
- Montants réalistes

---

## 🔧 **Vérification du Hook useProducts**

### ✅ **Configuration Actuelle**
```typescript
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    enabled: !!user && initialized, // ✅ Seulement si connecté
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnReconnect: true, // ✅ Rafraîchit à la reconnexion
    refetchInterval: false, // Pas de rafraîchissement auto
  })
}
```

### 🔄 **Rafraîchissement Automatique**
Le hook `useProducts` rafraîchira automatiquement l'affichage lorsque :

1. **Nouvelle connexion** : `refetchOnReconnect: true`
2. **Invalidation manuelle** : Via `queryClient.invalidateQueries()`
3. **Changement de filtres** : Nouveau `queryKey` avec filtres différents

### 📱 **Comment Forcer le Rafraîchissement**
```typescript
// Dans un composant
const queryClient = useQueryClient()

// Forcer le rafraîchissement des produits
const refreshProducts = () => {
  queryClient.invalidateQueries({ queryKey: ['products'] })
}
```

---

## 🎯 **Après Insertion des Données**

### 1. **Vérification dans l'Application**
- Allez sur votre ERP : `http://localhost:5173`
- Connectez-vous
- Allez dans l'onglet "Produits"
- Vous devriez voir les 10 produits apparaître

### 2. **Dashboard**
- Allez sur le Dashboard
- Les statistiques devraient s'afficher :
  - 10 produits
  - 5 clients
  - 7 factures

### 3. **Logs de Debug**
Ouvrez la console (F12) pour voir :
```
📦 PRODUCTS - Début récupération des produits
✅ PRODUCTS - Produits récupérés: 10
📊 DASHBOARD STATS - Début récupération des stats
✅ DASHBOARD STATS - Stats récupérées: {clientsCount: 5, invoicesThisMonth: 7, pendingRevenue: ...}
```

---

## 🚨 **Dépannage**

### Si les produits n'apparaissent pas :

1. **Vérifiez la console** pour les erreurs
2. **Allez sur `/auth-debug`** pour tester la connexion
3. **Vérifiez RLS** : Les politiques autorisent-elles la lecture ?
4. **Forcez le rafraîchissement** : Rechargez la page (F5)

### Si erreur SQL :
1. **Vérifiez le schéma** : Assurez-vous que les tables existent
2. **Exécutez d'abord** : `ERP_COMPLETE_DATABASE_SCHEMA.sql`
3. **Puis exécutez** : `ERP_SEED_DATA.sql`

---

## 🎉 **Résultat Attendu**

Après avoir exécuté le script seed :

- ✅ **10 produits** visibles dans l'onglet Produits
- ✅ **5 clients** dans l'onglet Clients  
- ✅ **7 factures** dans l'onglet Factures
- ✅ **Dashboard** avec statistiques complètes
- ✅ **Filtres** fonctionnels par catégorie
- ✅ **Recherche** fonctionnelle sur tous les produits

---

**Votre ERP sera maintenant peuplé avec des données réalistes pour tester toutes les fonctionnalités !** 📦✨
