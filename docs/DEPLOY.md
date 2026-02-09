# 🚀 Guide de Déploiement - GTBP ERP

## 📋 Vue d'Ensemble

Guide complet pour déployer l'ERP GTBP en production avec CI/CD automatisé.

## 🎯 Options de Déploiement

### 1. **Vercel** (Recommandé)
- **Avantages**: Intégration Git, CDN global, SSL automatique
- **Coût**: Gratuit pour projets personnels
- **Configuration**: Minimal

### 2. **Netlify**
- **Avantages**: Build automatisé, forms, functions
- **Coût**: Gratuit pour projets personnels
- **Configuration**: Simple

### 3. **AWS Amplify**
- **Avantages**: Scalabilité, services AWS
- **Coût**: Niveau gratuit disponible
- **Configuration**: Moderée

### 4. **Docker + VPS**
- **Avantages**: Contrôle total, personnalisable
- **Coût**: Variable (VPS ~$5-20/mois)
- **Configuration**: Avancée

## 🌐 Déploiement sur Vercel

### Prérequis
- Compte Vercel
- Repository GitHub connecté
- Variables d'environnement Supabase

### Étapes

#### 1. Importer le Projet
```bash
# Via Vercel CLI
npm i -g vercel
vercel login
vercel link
```

Ou via l'interface Vercel:
1. Allez sur [vercel.com](https://vercel.com)
2. "New Project"
3. Importez depuis GitHub
4. Sélectionnez `mrnotrobot369/ERP-Test`

#### 2. Configuration Build
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

#### 3. Variables d'Environnement
Dans Vercel Dashboard > Settings > Environment Variables:

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

#### 4. Déploiement Automatique
```bash
# Push vers main déclenche le déploiement
git push origin main
```

### Vercel CLI Commands
```bash
# Déployer manuellement
vercel --prod

# Vérifier la configuration
vercel inspect

# Logs du déploiement
vercel logs
```

## 🔧 Configuration CI/CD

### GitHub Actions

#### `.github/workflows/deploy.yml`
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test --if-present
    
    - name: Type check
      run: npm run typecheck
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

#### Secrets GitHub
Dans GitHub Repository > Settings > Secrets:

```bash
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

### Vercel Webhook
Pour déclencher les déploiements automatiquement:

1. Vercel Dashboard > Settings > Git
2. Configurez le webhook GitHub
3. Activez "Deploy on push"

## 🗄️ Configuration Supabase Production

### 1. Backup des Données
```sql
-- Exporter les données
pg_dump -h hostname -U username -d database > backup.sql
```

### 2. Migration vers Production
```bash
# Via Supabase CLI
supabase db push --db-url postgresql://user:pass@host:port/db

# Ou via Dashboard
# Copiez-collez les migrations SQL
```

### 3. Configuration RLS Production
```sql
-- Politiques de sécurité pour production
CREATE POLICY "Users can manage their data" 
ON public.products 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
```

### 4. Monitoring Supabase
- Dashboard > Logs
- Dashboard > Database > Usage
- Alerts pour les métriques critiques

## 📊 Monitoring et Logging

### Application Monitoring

#### 1. **Vercel Analytics**
```typescript
// Analytics automatique avec Vercel
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      <Analytics />
      {/* Votre app */}
    </>
  )
}
```

#### 2. **Error Tracking**
```typescript
// Error boundaries
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Envoyer à un service de monitoring
  }
}
```

#### 3. **Performance Monitoring**
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Envoyer les métriques à Vercel Analytics
  console.log(metric)
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

### Logs Structurés
```typescript
// Logging structuré
const logger = {
  info: (message, data) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString()
    }))
  },
  error: (message, error) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }))
  }
}
```

## 🔒 Sécurité Production

### 1. **Variables d'Environnement**
```env
# Production uniquement
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=prod_anon_key

# Jamais exposer les clés secrètes
# SUPABASE_SERVICE_ROLE_KEY=jamais_dans_le_client
```

### 2. **HTTPS et Headers**
```typescript
// vite.config.ts - Headers de sécurité
export default defineConfig({
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    }
  }
})
```

### 3. **Content Security Policy**
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

## 🚀 Optimisation Performance

### 1. **Bundle Optimization**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          supabase: ['@supabase/supabase-js'],
          query: ['@tanstack/react-query']
        }
      }
    },
    minify: 'terser',
    sourcemap: false
  }
})
```

### 2. **Lazy Loading**
```typescript
// Lazy loading des routes
const Products = lazy(() => import('./pages/Products'))
const Invoices = lazy(() => import('./pages/Invoices'))

// Lazy loading des composants
const ProductForm = lazy(() => import('./components/ProductForm'))
```

### 3. **Cache Strategy**
```typescript
// TanStack Query cache optimisé
useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000,  // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: true
})
```

## 🔄 Workflow de Déploiement

### Branch Strategy
```
main (production)
└── develop (staging)
    └── feature/* (développement)
```

### Processus
1. **Développement** sur `feature/*`
2. **Merge** vers `develop` (staging)
3. **Tests** automatiques sur `develop`
4. **Merge** vers `main` (production)
5. **Déploiement** automatique

### Commands Utiles
```bash
# Déployer en staging
git push origin develop

# Déployer en production
git push origin main

# Déploiement manuel
vercel --prod

# Rollback
vercel rollback [deployment-url]
```

## 📱 Environnement Multi-Stage

### Configuration
```typescript
// src/config/env.ts
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY
  },
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}
```

### Variables par Environnement
```bash
# .env.development
VITE_SUPABASE_URL=https://dev.supabase.co
VITE_SUPABASE_ANON_KEY=dev_key

# .env.production
VITE_SUPABASE_URL=https://prod.supabase.co
VITE_SUPABASE_ANON_KEY=prod_key
```

## 🔍 Tests de Déploiement

### Checklist Pre-Déploiement
- [ ] Build local réussi
- [ ] Tests passent
- [ ] Variables d'environnement configurées
- [ ] Supabase production prêt
- [ ] Backup des données existantes
- [ ] Monitoring configuré

### Tests Post-Déploiement
- [ ] Application accessible
- [ ] Login fonctionne
- [ ] CRUD fonctionne
- [ ] Performance acceptable
- [ ] Pas d'erreurs console
- [ ] Mobile responsive

## 📞 Support et Maintenance

### Monitoring Continu
- Vercel Analytics
- Supabase Logs
- Performance metrics
- Error tracking

### Mises à Jour
```bash
# Mise à jour dépendances
npm update

# Re-déploiement
git push origin main
```

### Backup Strategy
- Supabase: Automatique quotidien
- Code: Versionné sur GitHub
- Configuration: Documentation complète

---

**Déploiement production prêt pour GTBP ERP ! 🚀**
