# 🚀 Guide d'Installation et Configuration

## 📋 Prérequis

### Système
- **OS**: Windows 10+, macOS 10.15+, Linux
- **Node.js**: 18.0+ (recommandé 20.x)
- **Mémoire**: 4GB RAM minimum
- **Stockage**: 2GB d'espace libre

### Outils
- **IDE**: VS Code (recommandé)
- **Terminal**: PowerShell, Terminal, ou Git Bash
- **Navigateur**: Chrome/Firefox récent

## 🛠️ Installation

### 1. Cloner le Repository

```bash
git clone https://github.com/mrnotrobot369/ERP-Test.git
cd ERP-Test
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configuration Supabase

#### Créer un Projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL et la clé anon

#### Configurer les Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.local
```

Éditez `.env.local` avec vos clés :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-ici
```

### 4. Appliquer les Migrations

#### Option A: Via Supabase Dashboard (Recommandé)
1. Allez sur votre projet Supabase
2. Ouvrez `SQL Editor`
3. Créez une nouvelle requête
4. Copiez-collez le contenu de `supabase/migrations/001_create_products_table.sql`
5. Cliquez sur `Run`
6. Répétez avec `002_seed_products.sql`

#### Option B: Via CLI (si installé)
```bash
supabase db push
```

## 🧪 Vérification de l'Installation

### 1. Démarrer l'Application

```bash
npm run dev
```

L'application devrait démarrer sur `http://localhost:5173`

### 2. Test de Connexion

Ouvrez la console du navigateur (F12) et exécutez :

```javascript
// Test connexion Supabase
import { supabase } from '/src/lib/supabase.js'
const { data, error } = await supabase.from('products').select('count').single()
console.log('Connexion:', error ? '❌' : '✅', data || error)
```

### 3. Vérifier les Modules

- ✅ Page de login accessible
- ✅ Dashboard affiche les statistiques
- ✅ Module produits fonctionne avec les données exemples
- ✅ Navigation responsive

## 🔧 Configuration Avancée

### TypeScript

Le projet utilise TypeScript en mode strict. Pour vérifier :

```bash
npm run typecheck
```

### ESLint

Pour vérifier la qualité du code :

```bash
npm run lint
```

### Build de Production

Pour créer une version optimisée :

```bash
npm run build
```

## 🐛 Dépannage

### Problèmes Communs

#### "relation does not exist"
**Cause**: Les migrations SQL n'ont pas été appliquées  
**Solution**: Appliquez les migrations via Supabase Dashboard

#### "permission denied"
**Cause**: RLS (Row Level Security) non configuré  
**Solution**: Configurez les politiques RLS dans Supabase

#### "supabase not found"
**Cause**: Variables d'environnement incorrectes  
**Solution**: Vérifiez `.env.local` et redémarrez le serveur

#### Build échoue
**Cause**: Dépendances manquantes ou erreurs TypeScript  
**Solution**: 
```bash
npm run clean:install
npm run typecheck
```

### Logs Utiles

Pour activer les logs de développement :

```typescript
// Dans un composant
console.log('Produits:', products)
console.log('Erreur:', error)
```

### Performance

Si l'application est lente :
- Vérifiez la connexion internet
- Désactivez les extensions de navigateur
- Videz le cache du navigateur

## 📱 Développement

### Scripts Disponibles

```json
{
  "dev": "vite",                    // Serveur de développement
  "build": "tsc -b && vite build",  // Build production
  "preview": "vite preview",        // Aperçu du build
  "typecheck": "tsc --noEmit",      // Vérification TypeScript
  "lint": "eslint . --ext ts,tsx",  // Vérification code
  "lint:fix": "eslint . --fix"      // Correction automatique
}
```

### Structure des Fichiers

```
src/
├── components/     # Composants React
├── hooks/         # Hooks TanStack Query
├── lib/           # Utilitaires et Supabase
├── pages/         # Pages de l'application
├── stores/        # Stores Zustand
└── types/         # Types TypeScript
```

### Bonnes Pratiques

- Utilisez TypeScript strict
- Suivez les conventions de nommage
- Ajoutez des JSDoc pour les fonctions complexes
- Testez avant de committer

## 🚀 Déploiement

Pour le déploiement, voir [DEPLOY.md](./DEPLOY.md).

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez ce guide
2. Vérifiez les logs du navigateur
3. Testez avec les données exemples
4. Créez une issue sur GitHub

---

**Installation terminée ! Votre ERP GTBP est prêt. 🎉**
