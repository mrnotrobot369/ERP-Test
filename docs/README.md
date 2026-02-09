# GTBP ERP - Documentation

## 📋 Vue d'Ensemble

ERP complet avec React + TypeScript + Supabase pour la gestion d'entreprise.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- Compte Supabase

### Installation
```bash
git clone https://github.com/mrnotrobot369/ERP-Test.git
cd ERP-Test
npm install
```

### Configuration
1. Copiez `.env.example` vers `.env.local`
2. Configurez vos clés Supabase
3. Appliquez les migrations SQL

### Lancement
```bash
npm run dev
```

## 📚 Documentation

- [**SETUP.md**](./SETUP.md) - Installation et configuration complète
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Structure technique et patterns
- [**API.md**](./API.md) - Référence des hooks, types et validations
- [**DEPLOY.md**](./DEPLOY.md) - Déploiement et CI/CD

## ✨ Modules Actifs

### ✅ Authentification
- Login/Signup sécurisés
- Protected routes
- Session persistence

### ✅ Clients
- CRUD complet
- Recherche et filtres
- Interface responsive

### ✅ Factures
- Gestion des statuts
- Calculs automatiques
- Interface de création

### ✅ Produits
- Gestion complète des stocks
- Validation robuste
- Dashboard intégré
- Alertes de stock faible

## 🛠️ Stack Technique

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: Zustand + TanStack Query
- **Forms**: React Hook Form + Zod

## 📊 Statistiques

- **Modules**: 4/8 terminés (50%)
- **Fichiers**: ~60 fichiers essentiels
- **Lignes**: 18,000+ lignes de code
- **Tests**: En cours

## 🎯 Routes Disponibles

- `/` - Dashboard
- `/clients` - Gestion clients
- `/factures` - Gestion factures
- `/products` - Gestion produits
- `/products/new` - Nouveau produit
- `/products/:id/edit` - Modifier produit

## 🤝 Contribuer

Voir [CONTRIBUTING.md](../CONTRIBUTING.md) pour les guidelines de contribution.

## 📄 Licence

MIT License - voir [LICENSE](../LICENSE)

---

**Développé avec ❤️ pour GTBP ERP**
