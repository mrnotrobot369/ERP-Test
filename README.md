# GTBP ERP

## 🎯 Description
ERP complet avec React + TypeScript + Supabase pour la gestion d'entreprise.

## ✨ Fonctionnalités
- 🔐 Authentification sécurisée
- 👥 Gestion des clients  
- 📄 Gestion des factures
- 📦 **Gestion des produits** (nouveau!)
- 📊 Dashboard analytique

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Compte Supabase

### Installation
```bash
git clone https://github.com/USERNAME/GTBP-ERP.git
cd GTBP-ERP
npm install
```

### Configuration
1. Copiez `.env.example` vers `.env.local`
2. Configurez vos clés Supabase:
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```
3. Appliquez les migrations SQL (voir `supabase/migrations/`)

### Lancement
```bash
npm run dev
```

## 📁 Structure
```
src/
├── components/     # Composants React
├── hooks/         # Hooks TanStack Query
├── lib/           # Utilitaires et Supabase
├── pages/         # Pages de l'application
├── types/         # Types TypeScript
└── stores/        # Stores Zustand
```

## 🛠️ Stack Technique
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod

## 📊 Statistiques
- **Modules**: 4/8 terminés (50%)
- **Fichiers**: 91+ composants
- **Lignes**: 18,300+ lignes
- **Tests**: En cours

## 🎯 Modules Actifs

### ✅ Module Authentification
- Login/Signup sécurisés
- Protected routes
- Session persistence

### ✅ Module Clients
- CRUD complet
- Recherche et filtres
- Interface responsive

### ✅ Module Factures
- Gestion des statuts
- Calculs automatiques
- Interface de création

### ✅ Module Produits
- Gestion complète des stocks
- Validation robuste
- Dashboard intégré
- Alertes de stock faible

## 🚀 Routes Disponibles
- `/` - Dashboard
- `/clients` - Gestion clients
- `/factures` - Gestion factures
- `/products` - Gestion produits
- `/products/new` - Nouveau produit
- `/products/:id/edit` - Modifier produit

## 🧪 Tests de Connexion

Pour tester votre connexion Supabase, ouvrez la console du navigateur et exécutez:

```javascript
// Test simple
import { supabase } from '@/lib/supabase'
const { data, error } = await supabase.from('products').select('count').single()
console.log(data, error)
```

## 📝 Documentation

- `PRODUCTS_MODULE_README.md` - Guide du module produits
- `SUPABASE_TROUBLESHOOTING.md` - Aide technique Supabase
- `GITHUB_PROJECT_PLAN.md` - Plan de développement
- `GITHUB_SETUP_GUIDE.md` - Guide GitHub

## 🤝 Contribuer
1. Fork le repository
2. Créez une branche `feature/nom-de-la-feature`
3. Commitez vos changements
4. Push vers la branche
5. Ouvrez une Pull Request

## 📄 Licence
MIT License

---

**Développé avec ❤️ pour GTBP ERP**
