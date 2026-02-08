# 🎯 Guide Ultime Cursor pour Projet ERP Pro

## 📚 TABLE DES MATIÈRES

1. [Setup Initial Cursor](#setup-initial)
2. [Prompt de Démarrage Projet](#prompt-démarrage)
3. [Configuration .cursorrules](#cursorrules)
4. [Règles de Composition](#règles-composition)
5. [Workflow Optimal](#workflow-optimal)
6. [Prompts Avancés par Phase](#prompts-avancés)
7. [Commandes Composer](#commandes-composer)
8. [Raccourcis Clavier](#raccourcis)
9. [Tips & Tricks Pro](#tips-tricks)

---

## 🚀 SETUP INITIAL CURSOR

### Étape 1 : Installation et Configuration de Base

#### Télécharger Cursor
```bash
# 1. Télécharger depuis cursor.sh
# 2. Installer l'application
# 3. Ouvrir Cursor

# 4. Si vous avez déjà VS Code, importer vos settings
# Cursor > Settings > Import from VS Code
```

#### Extensions Essentielles à Installer

**Via Cursor Extensions (Cmd/Ctrl + Shift + X)** :

```
Extensions OBLIGATOIRES :
✅ ESLint
✅ Prettier - Code formatter
✅ Tailwind CSS IntelliSense
✅ TypeScript Vue Plugin (Volar)
✅ Error Lens (affiche erreurs inline)
✅ Pretty TypeScript Errors
✅ Auto Rename Tag
✅ Path Intellisense

Extensions RECOMMANDÉES :
✅ GitLens
✅ Thunder Client (tester API)
✅ Database Client (visualiser Supabase)
✅ Todo Tree
✅ Better Comments
✅ Import Cost
```

#### Configuration Cursor Settings (settings.json)

```json
{
  // ============================================
  // CURSOR AI CONFIGURATION
  // ============================================
  "cursor.ai.useComposer": true,
  "cursor.ai.enableCodeActions": true,
  "cursor.ai.enableAutoCompletions": true,
  "cursor.chat.showSuggestedFiles": true,
  "cursor.chat.alwaysSearchWeb": false,
  
  // ============================================
  // EDITOR CONFIGURATION
  // ============================================
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono, Fira Code, Consolas, monospace",
  "editor.fontLigatures": true,
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.detectIndentation": false,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": true,
  "editor.linkedEditing": true,
  "editor.minimap.enabled": true,
  "editor.rulers": [80, 120],
  "editor.wordWrap": "on",
  "editor.suggest.preview": true,
  "editor.inlineSuggest.enabled": true,
  
  // ============================================
  // TYPESCRIPT / JAVASCRIPT
  // ============================================
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  
  // ============================================
  // PRETTIER CONFIGURATION
  // ============================================
  "prettier.semi": false,
  "prettier.singleQuote": true,
  "prettier.trailingComma": "es5",
  "prettier.arrowParens": "avoid",
  "prettier.printWidth": 100,
  
  // ============================================
  // TAILWIND CSS
  // ============================================
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  
  // ============================================
  // FILES CONFIGURATION
  // ============================================
  "files.autoSave": "onFocusChange",
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true,
    "**/.turbo": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  
  // ============================================
  // GIT CONFIGURATION
  // ============================================
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  
  // ============================================
  // TERMINAL CONFIGURATION
  // ============================================
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "JetBrains Mono",
  
  // ============================================
  // WORKBENCH
  // ============================================
  "workbench.colorTheme": "GitHub Dark Default",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.startupEditor": "none",
  "workbench.editor.enablePreview": false,
  
  // ============================================
  // ERROR LENS (inline errors)
  // ============================================
  "errorLens.enabled": true,
  "errorLens.enabledDiagnosticLevels": ["error", "warning"],
  
  // ============================================
  // EMMET
  // ============================================
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  },
  "emmet.triggerExpansionOnTab": true
}
```

---

## 🎯 PROMPT DE DÉMARRAGE PROJET (Le Plus Important !)

### 📋 Prompt Master pour Cursor Composer

**Copier-coller ce prompt dans Cursor Composer (Cmd+I) :**

```markdown
# Context: Je veux créer un ERP moderne pour PME avec la stack suivante

## Stack Technique
- Frontend: React 19 + TypeScript + Vite
- State: TanStack Query + Zustand
- UI: shadcn/ui + Tailwind CSS (avec charts)
- Backend: Supabase (PostgreSQL + Auth + Storage + Edge Functions + Realtime)
- IA: SDK Anthropic Claude + pgvector
- Tools: Zod, React Hook Form, @react-pdf/renderer, i18next, Resend
- Hosting: Cloudflare Pages

## Architecture & Best Practices à Respecter

### Structure du Projet
```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── forms/           # Formulaires réutilisables
│   ├── layout/          # Layout components (Sidebar, Header)
│   └── features/        # Feature-specific components
├── hooks/               # Custom React hooks
├── lib/
│   ├── supabase.ts      # Supabase client config
│   ├── utils.ts         # Utility functions
│   └── validations/     # Zod schemas
├── pages/               # Page components (routes)
├── stores/              # Zustand stores
├── types/               # TypeScript types & interfaces
└── styles/              # Global styles
```

### Règles de Code à Appliquer

**TypeScript**
- Mode strict activé
- Pas de `any`, utiliser `unknown` si nécessaire
- Typer toutes les props avec interfaces
- Utiliser les types générés depuis Supabase

**React**
- Composants fonctionnels uniquement
- Hooks personnalisés pour logique réutilisable
- Props destructurées dans la signature
- Éviter les inline functions dans JSX (performance)

**Naming Conventions**
- Composants: PascalCase (ex: InvoiceCard)
- Fichiers composants: kebab-case (ex: invoice-card.tsx)
- Hooks: camelCase avec "use" (ex: useInvoices)
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase avec suffixe (ex: InvoiceProps, UserData)

**Imports**
- Utiliser path aliases (@/ pour src/)
- Grouper les imports (React, libraries, local)
- Tri alphabétique dans chaque groupe

**Styling**
- Tailwind CSS uniquement (pas de CSS modules)
- shadcn/ui pour composants réutilisables
- Responsive mobile-first (sm:, md:, lg:)
- Dark mode supporté (class strategy)

**State Management**
- TanStack Query pour server state (API calls)
- Zustand pour client state (UI, filters, preferences)
- Pas de props drilling, utiliser les stores

**Validation & Forms**
- Zod pour tous les schemas
- React Hook Form pour formulaires
- Validation côté client ET serveur

**Supabase**
- RLS (Row Level Security) sur toutes les tables
- Types générés automatiquement
- Policies testées avant déploiement

**Error Handling**
- try/catch sur toutes les async operations
- Toast notifications pour erreurs user-facing
- Console.error pour erreurs techniques
- Sentry en production

**Performance**
- Lazy loading pour routes (React.lazy)
- Memoization avec useMemo/useCallback si nécessaire
- Pagination côté serveur (pas de .fetchAll())
- Images optimisées (WebP, lazy loading)

**Accessibility**
- Labels sur tous les inputs
- ARIA attributes quand nécessaire
- Navigation clavier fonctionnelle
- Contraste WCAG AA minimum

**Git Commits**
- Convention Conventional Commits
- feat:, fix:, docs:, refactor:, test:
- Messages clairs et concis

## Tâche Initiale

Aide-moi à configurer ce projet de zéro avec cette stack. 

Étapes attendues:
1. Créer la structure de dossiers optimale
2. Configurer package.json avec toutes les dépendances
3. Setup Vite avec TypeScript
4. Configurer Tailwind CSS + shadcn/ui
5. Setup Supabase client
6. Créer les fichiers de config (tsconfig, eslint, prettier)
7. Initialiser Git avec .gitignore approprié

Utilise les meilleures pratiques 2026 et génère un code production-ready.
```

---

## ⚙️ CONFIGURATION .cursorrules

### Créer le fichier .cursorrules à la racine du projet

**Ce fichier guide Cursor dans TOUS vos prompts**

```markdown
# .cursorrules - Configuration Cursor pour ERP Project

## Project Context
This is a modern ERP application built with:
- React 19 + TypeScript + Vite
- TanStack Query + Zustand
- shadcn/ui + Tailwind CSS
- Supabase (PostgreSQL + Auth + Realtime)
- Anthropic Claude AI

## Code Style & Standards

### TypeScript
- Always use strict mode
- Never use `any`, prefer `unknown` or proper types
- Explicit return types for functions
- Interface for props, type for unions/intersections
- Generate types from Supabase schema

Example:
```typescript
// ✅ GOOD
interface InvoiceCardProps {
  invoice: Database['public']['Tables']['invoices']['Row']
  onUpdate: (id: string) => Promise<void>
}

export function InvoiceCard({ invoice, onUpdate }: InvoiceCardProps): JSX.Element {
  // ...
}

// ❌ BAD
export function InvoiceCard(props: any) {
  // ...
}
```

### React Best Practices
- Functional components only
- Custom hooks for reusable logic
- Destructure props in function signature
- Use `React.FC` sparingly (only when needed)
- Memoize expensive computations with useMemo

Example:
```typescript
// ✅ GOOD
export function InvoiceList({ invoices }: InvoiceListProps) {
  const total = useMemo(
    () => invoices.reduce((sum, inv) => sum + inv.amount, 0),
    [invoices]
  )
  
  return <div>{total}</div>
}

// ❌ BAD
export const InvoiceList: React.FC<InvoiceListProps> = (props) => {
  const total = props.invoices.reduce((sum, inv) => sum + inv.amount, 0) // Recalculated on every render!
  return <div>{total}</div>
}
```

### Naming Conventions
- Components: PascalCase (InvoiceCard.tsx)
- Files: kebab-case (invoice-card.tsx)
- Hooks: camelCase with "use" prefix (useInvoices)
- Constants: UPPER_SNAKE_CASE (API_BASE_URL)
- Types: PascalCase with suffix (InvoiceProps, UserData)

### Import Order
```typescript
// 1. React
import { useState, useEffect } from 'react'

// 2. External libraries
import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

// 3. Internal modules
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { useInvoicesStore } from '@/stores/invoices'

// 4. Types
import type { Invoice } from '@/types/invoice'

// 5. Styles (if any)
import './styles.css'
```

### State Management Rules
- **TanStack Query**: Server state (API calls, DB queries)
- **Zustand**: Client state (UI, filters, user preferences)
- **useState**: Component-local state only

Example:
```typescript
// ✅ GOOD: TanStack Query for server data
const { data: invoices } = useQuery({
  queryKey: ['invoices'],
  queryFn: () => supabase.from('invoices').select('*')
})

// ✅ GOOD: Zustand for global UI state
const { status, setStatus } = useFiltersStore()

// ✅ GOOD: useState for local component state
const [isOpen, setIsOpen] = useState(false)

// ❌ BAD: useState for server data
const [invoices, setInvoices] = useState([])
useEffect(() => {
  fetchInvoices().then(setInvoices) // Use TanStack Query instead!
}, [])
```

### Styling with Tailwind
- Mobile-first approach (default styles for mobile, md: for desktop)
- Use cn() utility for conditional classes
- Dark mode with class strategy
- Semantic color names (primary, destructive, muted)

Example:
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "p-4 rounded-lg", // Base styles
  "bg-white dark:bg-gray-900", // Dark mode
  "md:p-6 lg:p-8", // Responsive
  isActive && "border-2 border-blue-500", // Conditional
  className // Allow override
)}>
```

### Forms & Validation
- React Hook Form for all forms
- Zod for validation schemas
- Validate on both client AND server

Example:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const invoiceSchema = z.object({
  number: z.string().min(1, 'Required'),
  amount: z.number().positive('Must be positive'),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

export function InvoiceForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema)
  })
  
  const onSubmit = async (data: InvoiceFormData) => {
    // Server-side validation happens in Supabase Edge Function or RLS
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('number')} />
      {errors.number && <span>{errors.number.message}</span>}
    </form>
  )
}
```

### Error Handling
- Always wrap async operations in try/catch
- User-facing errors: Toast notifications
- Technical errors: console.error + Sentry

Example:
```typescript
import { toast } from 'sonner'

try {
  const { data, error } = await supabase.from('invoices').insert(invoice)
  if (error) throw error
  
  toast.success('Invoice created!')
  return data
} catch (error) {
  console.error('Failed to create invoice:', error)
  toast.error('Failed to create invoice. Please try again.')
  throw error
}
```

### Supabase Best Practices
- Enable RLS on all tables
- Use generated types from Supabase
- Never expose service_role key in frontend
- Use Edge Functions for sensitive operations

Example:
```typescript
// ✅ GOOD: Using anon key + RLS
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// RLS policy ensures user can only access their data
const { data } = await supabase.from('invoices').select('*') // ✅ Safe
```

### Performance Guidelines
- Lazy load routes with React.lazy
- Server-side pagination (limit + offset)
- Optimize images (WebP, lazy loading)
- Debounce search inputs
- Use React.memo sparingly (measure first!)

Example:
```typescript
// Lazy loading
const InvoiceDetail = lazy(() => import('@/pages/invoice-detail'))

// Pagination
const ITEMS_PER_PAGE = 10
const { data } = await supabase
  .from('invoices')
  .select('*', { count: 'exact' })
  .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
```

### Testing Requirements
- Unit tests for utils/hooks (Vitest)
- E2E tests for critical flows (Playwright)
- Test RLS policies in Supabase

### Accessibility
- All inputs have labels
- Proper ARIA attributes
- Keyboard navigation works
- Color contrast WCAG AA

### Comments
- Use JSDoc for exported functions
- Explain WHY, not WHAT
- No commented-out code (use Git)

Example:
```typescript
/**
 * Calculates the total amount of invoices including tax.
 * Uses the Swiss VAT rate of 7.7% by default.
 * 
 * @param invoices - Array of invoices to sum
 * @param taxRate - Optional tax rate (default: 0.077)
 * @returns Total amount with tax
 */
export function calculateTotalWithTax(
  invoices: Invoice[],
  taxRate = 0.077
): number {
  const subtotal = invoices.reduce((sum, inv) => sum + inv.amount, 0)
  return subtotal * (1 + taxRate)
}
```

## File Generation Rules

### When creating new files:
1. Always include proper imports
2. Add TypeScript types
3. Include error handling
4. Follow naming conventions
5. Add JSDoc comments for exported functions

### Component Template:
```typescript
import { ComponentProps } from '@/types/component'

interface ComponentNameProps {
  // Props definition
}

/**
 * Brief description of what this component does
 */
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Component logic
  
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Hook Template:
```typescript
import { useState, useEffect } from 'react'

interface UseHookNameOptions {
  // Options
}

/**
 * Brief description of what this hook does
 */
export function useHookName(options: UseHookNameOptions) {
  // Hook logic
  
  return {
    // Returned values
  }
}
```

## Git Commit Messages
Use Conventional Commits format:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

Example: `feat: add invoice PDF export with company logo`

## When Asked to Generate Code
1. Ask clarifying questions if requirements are unclear
2. Consider edge cases
3. Add proper error handling
4. Include TypeScript types
5. Follow all conventions above
6. Add comments for complex logic
7. Suggest improvements if you see issues

## Preferred Libraries & Patterns
- Prefer `fetch` over axios (native, smaller bundle)
- Use `zod` for validation (type-safe)
- Use `date-fns` for dates (tree-shakable)
- Prefer composition over inheritance
- Keep components small (<200 lines)
- Extract complex logic to custom hooks

Remember: Production-ready code is better than quick code. Take time to do it right.
```

---

## 🎨 RÈGLES DE COMPOSITION (Composer Mode)

### Quand utiliser Cursor Composer (Cmd+I)

**✅ Utiliser Composer pour :**
- Créer des features complètes (nouveau module)
- Refactoring multi-fichiers
- Setup initial du projet
- Architecture decisions
- Générer plusieurs composants liés

**❌ NE PAS utiliser Composer pour :**
- Petites modifications (1-2 lignes)
- Debugging simple
- Questions théoriques
- Auto-complétion (utiliser Tab)

### Structure de Prompt Optimal pour Composer

```markdown
# [Titre clair de la tâche]

## Context
[Expliquer le problème ou besoin]

## Objectif
[Ce que vous voulez accomplir]

## Contraintes
- [Contrainte technique 1]
- [Contrainte métier 2]
- [Performance requirements]

## Fichiers concernés
- [Liste des fichiers à créer/modifier]

## Critères d'acceptation
- [ ] [Critère 1]
- [ ] [Critère 2]
- [ ] Tests passent

## Exemple (si applicable)
```code
// Exemple de ce que vous voulez
```

## Questions
[Questions précises pour Cursor]
```

### Exemple Concret : Créer le Module Factures

```markdown
# Créer le module complet de gestion des factures

## Context
Je construis un ERP pour PME. J'ai besoin d'un module pour créer, lister, éditer et supprimer des factures.

## Objectif
Implémenter le CRUD complet des factures avec:
- Liste paginée (10/page)
- Formulaire création/édition avec validation
- Export PDF
- Recherche par numéro/client

## Contraintes
- TypeScript strict mode
- Validation Zod côté client ET serveur
- TanStack Query pour data fetching
- shadcn/ui pour UI components
- Supabase RLS activé
- Responsive mobile-first

## Fichiers à créer
```
src/
├── pages/
│   ├── invoices.tsx           # Liste
│   └── invoice-detail.tsx     # Détail/Édition
├── components/
│   └── invoices/
│       ├── invoice-form.tsx   # Formulaire
│       ├── invoice-card.tsx   # Card liste
│       └── invoice-pdf.tsx    # Template PDF
├── lib/
│   └── validations/
│       └── invoice.ts         # Schema Zod
├── hooks/
│   └── use-invoices.ts        # TanStack Query hooks
└── types/
    └── invoice.ts             # Types TypeScript
```

## Critères d'acceptation
- [ ] Liste affiche les factures avec pagination
- [ ] Formulaire valide avec Zod (messages d'erreur clairs)
- [ ] CRUD complet fonctionne (Create, Read, Update, Delete)
- [ ] Export PDF génère un fichier professionnel
- [ ] Recherche filtre instantanément
- [ ] Responsive sur mobile
- [ ] RLS Supabase empêche accès cross-company
- [ ] 0 erreur TypeScript
- [ ] Loading states pendant les requêtes

## Schema Supabase attendu
```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id),
  number VARCHAR(50) NOT NULL UNIQUE,
  client_id UUID NOT NULL REFERENCES clients(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'sent', 'paid')),
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policy
CREATE POLICY "Users see own company invoices"
ON invoices FOR SELECT
USING (company_id IN (
  SELECT company_id FROM user_companies WHERE user_id = auth.uid()
));
```

## Questions pour Cursor
1. Génère tous les fichiers listés ci-dessus
2. Utilise les best practices de la stack (voir .cursorrules)
3. Ajoute des commentaires JSDoc sur les fonctions exportées
4. Inclus la gestion d'erreurs complète
```

---

## 🔄 WORKFLOW OPTIMAL AVEC CURSOR

### Workflow Recommandé pour Développer une Feature

```
1. PLANIFICATION (Cmd+L - Chat)
   ├─ "Explique-moi comment architecturer le module [X]"
   ├─ Discuter des options
   └─ Valider l'approche

2. GÉNÉRATION (Cmd+I - Composer)
   ├─ Utiliser le prompt structuré (voir section précédente)
   ├─ Générer tous les fichiers
   └─ Review du code généré

3. ITÉRATION (Cmd+K - Inline Edit)
   ├─ Ajuster les détails
   ├─ Fix les erreurs TypeScript
   └─ Améliorer le styling

4. TESTING (Manuel + Cursor Chat)
   ├─ Tester l'UI manuellement
   ├─ "Génère les tests Vitest pour [component]"
   └─ Vérifier les edge cases

5. DOCUMENTATION (Cmd+L - Chat)
   ├─ "Génère la doc JSDoc pour [file]"
   └─ Update README si nécessaire

6. COMMIT (Terminal)
   ├─ git add .
   ├─ git commit -m "feat: add invoice module"
   └─ git push
```

---

## 🎯 PROMPTS AVANCÉS PAR PHASE DU PROJET

### Phase 1 : Setup Projet (Semaine 1)

#### Prompt 1.1 : Configuration Complète du Projet

```markdown
# Setup complet du projet ERP avec Vite + React + TypeScript

Crée la structure complète du projet avec:

1. **package.json** avec toutes les dépendances:
   - React 19 + React DOM
   - TypeScript + types
   - Vite + plugins
   - TanStack Query
   - Zustand
   - Zod
   - React Hook Form + resolver
   - Supabase JS
   - shadcn/ui dependencies (radix-ui, class-variance-authority, clsx, tailwind-merge)
   - Tailwind CSS + PostCSS + Autoprefixer
   - ESLint + Prettier
   - Vitest (testing)

2. **Configuration files**:
   - vite.config.ts (avec path alias @/)
   - tsconfig.json (strict mode, path mapping)
   - tailwind.config.js (shadcn/ui preset)
   - postcss.config.js
   - .eslintrc.cjs
   - .prettierrc
   - .gitignore (node_modules, dist, .env.local)

3. **Structure de dossiers**:
```
src/
├── components/
│   ├── ui/          # shadcn components (vide pour l'instant)
│   ├── forms/
│   ├── layout/
│   └── features/
├── hooks/
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── validations/
├── pages/
├── stores/
├── types/
└── styles/
    └── globals.css  # Tailwind imports
```

4. **Fichiers de base**:
   - src/main.tsx (avec QueryClientProvider)
   - src/App.tsx (routes de base)
   - src/lib/supabase.ts (Supabase client config)
   - src/lib/utils.ts (cn function pour tailwind)
   - src/styles/globals.css (Tailwind + CSS variables shadcn)

Génère des fichiers production-ready avec:
- Commentaires explicatifs
- Types TypeScript stricts
- Configuration optimale pour performance
- Support dark mode dans Tailwind
```

#### Prompt 1.2 : Setup shadcn/ui

```markdown
# Configure shadcn/ui dans le projet

1. Crée components.json avec la configuration:
   - Style: default
   - Base color: slate
   - CSS variables: true
   - Tailwind prefix: "" (pas de prefix)
   - TypeScript: true
   - Path aliases: @/components, @/lib/utils

2. Génère les fichiers de base shadcn:
   - components/ui/button.tsx
   - components/ui/card.tsx
   - components/ui/input.tsx
   - components/ui/label.tsx
   - components/ui/dialog.tsx
   - components/ui/select.tsx
   - components/ui/toast.tsx + toaster.tsx

3. Update globals.css avec les CSS variables de shadcn pour:
   - Light mode colors
   - Dark mode colors
   - Border radius variables

4. Crée un exemple de page utilisant les composants pour tester.
```

---

### Phase 2 : Authentification (Semaine 2-3)

#### Prompt 2.1 : Setup Supabase Auth

```markdown
# Implémenter l'authentification complète avec Supabase

## Context
J'ai un projet Supabase configuré avec ces credentials:
- URL: [TON_URL]
- Anon Key: [TON_KEY]

## Objectif
Créer un système d'authentification complet avec:
- Login email/password
- Login Google OAuth
- Signup
- Logout
- Forgot password
- Session persistence
- Auth state management

## Fichiers à créer/modifier

1. **lib/supabase.ts** - Client Supabase
```typescript
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

2. **stores/auth.ts** - Zustand store pour auth state
   - user: User | null
   - session: Session | null
   - loading: boolean
   - signIn(), signUp(), signOut(), resetPassword()

3. **hooks/use-auth.ts** - Hook pour accéder au store auth

4. **pages/login.tsx** - Page de connexion
   - Formulaire email/password avec React Hook Form + Zod
   - Bouton Google OAuth
   - Link vers signup et forgot password
   - Redirect vers /dashboard après login

5. **pages/signup.tsx** - Page d'inscription

6. **components/layout/auth-guard.tsx** - HOC pour protéger les routes
   - Vérifie si user est connecté
   - Redirect vers /login si non-auth

7. **.env.local.example** - Template des variables d'environnement

## Critères d'acceptation
- [ ] Login email/password fonctionne
- [ ] Google OAuth fonctionne (popup)
- [ ] Session persiste après refresh
- [ ] Logout clear la session
- [ ] Routes protégées redirigent vers /login
- [ ] Forgot password envoie un email
- [ ] UI responsive avec shadcn/ui
- [ ] Loading states pendant les requêtes
- [ ] Error handling avec toast notifications
- [ ] TypeScript 100% typé

Génère tous ces fichiers en respectant les best practices du .cursorrules
```

---

### Phase 3 : Module Factures (Semaine 4-6)

#### Prompt 3.1 : Schema Supabase + Types

```markdown
# Génère le schema Supabase pour le module factures

Crée un fichier SQL complet pour:

1. **Tables**:
   - companies (id, name, logo_url, created_at)
   - clients (id, company_id, name, email, address, created_at)
   - invoices (id, company_id, client_id, number, amount, status, due_date, created_at, updated_at)
   - invoice_items (id, invoice_id, description, quantity, unit_price)

2. **RLS Policies** pour chaque table:
   - SELECT: Users see only their company data
   - INSERT: Users can insert for their company
   - UPDATE: Users can update their company data
   - DELETE: Soft delete (add deleted_at column)

3. **Fonctions SQL**:
   - auth.user_company_id() pour récupérer le company_id du user
   - Trigger pour auto-update updated_at

4. **Indexes** pour performance:
   - Sur company_id
   - Sur client_id
   - Sur invoice number (unique)

5. **Types TypeScript générés**:
Crée types/supabase.ts avec les types générés depuis ce schema.

Utilise les best practices PostgreSQL et Supabase.
```

#### Prompt 3.2 : CRUD Complet Factures

```markdown
# Implémenter le CRUD complet pour les factures

## Objectif
Créer un module factures complet avec liste, création, édition, suppression.

## Spécifications Détaillées

### 1. Liste des Factures (pages/invoices.tsx)

**Features**:
- Tableau avec colonnes: Numéro, Client, Montant, Statut, Date échéance, Actions
- Pagination (10 items/page)
- Recherche par numéro ou nom client (debounced 300ms)
- Filtres: Statut (draft/sent/paid), Date range
- Bouton "Nouvelle facture"
- Loading skeleton pendant chargement
- Empty state si aucune facture

**Components à créer**:
- components/invoices/invoice-table.tsx (tableau)
- components/invoices/invoice-filters.tsx (filtres)
- components/invoices/invoice-search.tsx (recherche)

**Stores**:
- stores/invoice-filters.ts (Zustand pour filtres)

### 2. Formulaire Facture (pages/invoice-form.tsx)

**Fields**:
- Client (Select avec recherche)
- Numéro de facture (auto-généré ou manuel)
- Date d'émission
- Date d'échéance
- Items (array dynamique):
  - Description (textarea)
  - Quantité (number)
  - Prix unitaire (number)
  - Total (calculated)
- Notes (textarea optionnel)
- Statut (draft/sent/paid)

**Validation Zod** (lib/validations/invoice.ts):
```typescript
const invoiceSchema = z.object({
  client_id: z.string().uuid('Client requis'),
  number: z.string().min(1, 'Numéro requis'),
  issue_date: z.date(),
  due_date: z.date().min(new Date(), 'Date doit être future'),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
  })).min(1, 'Au moins 1 ligne requise'),
  status: z.enum(['draft', 'sent', 'paid']),
})
```

**Features**:
- Calcul automatique des totaux
- Ajout/suppression de lignes d'items
- Auto-save en draft (debounced 2s)
- Validation temps réel
- Loading state sur submit

### 3. Hooks TanStack Query (hooks/use-invoices.ts)

```typescript
// Queries
- useInvoices(filters) // Liste paginée
- useInvoice(id) // Détail
- useClients() // Pour le select

// Mutations
- useCreateInvoice()
- useUpdateInvoice()
- useDeleteInvoice()
```

Avec:
- Optimistic updates
- Cache invalidation appropriée
- Error handling
- Success toasts

### 4. Actions

**Components**:
- components/invoices/invoice-actions.tsx (dropdown menu)
  - Éditer
  - Dupliquer
  - Télécharger PDF
  - Envoyer par email
  - Supprimer (avec confirmation dialog)

## Critères d'acceptation
- [ ] Liste affiche toutes les factures de l'entreprise
- [ ] Pagination fonctionne
- [ ] Recherche filtre instantanément
- [ ] Filtres persistent dans URL (?status=paid)
- [ ] Formulaire valide correctement
- [ ] Création/édition fonctionnent
- [ ] Suppression avec confirmation
- [ ] Loading states partout
- [ ] 0 erreur TypeScript
- [ ] RLS empêche accès cross-company
- [ ] Responsive mobile
- [ ] Dark mode supporté

Génère tous les fichiers en respectant la structure et les best practices.
```

---

### Phase 4 : PDF Export (Semaine 7)

#### Prompt 4.1 : Génération PDF

```markdown
# Implémenter l'export PDF des factures

Crée un système complet pour générer et télécharger des factures en PDF.

## Fichiers à créer

1. **components/invoices/invoice-pdf.tsx**
   - Utilise @react-pdf/renderer
   - Template professionnel avec:
     - Header (logo entreprise, nom, adresse)
     - Infos facture (numéro, dates)
     - Infos client
     - Tableau des items (description, qté, prix, total)
     - Sous-total, TVA (7.7%), Total
     - Footer (conditions de paiement, IBAN)
   - Support multi-pages si >10 items

2. **lib/pdf-generator.ts**
   - Fonction generateInvoicePDF(invoice)
   - Fonction downloadPDF(invoice)
   - Gestion des erreurs

3. **hooks/use-generate-pdf.ts**
   - Hook qui wrap la génération
   - Loading state
   - Error handling

## Styling PDF
- Police: Helvetica
- Couleurs: Utiliser les couleurs de la marque
- Layout professionnel et aéré
- Logo de l'entreprise depuis Supabase Storage

## Features
- Bouton "Télécharger PDF" dans invoice actions
- Preview PDF avant téléchargement (optionnel)
- Nom du fichier: facture-[number].pdf

Génère du code production-ready avec gestion d'erreurs complète.
```

---

### Phase 5 : Realtime & Optimistic UI (Semaine 8-9)

#### Prompt 5.1 : Supabase Realtime

```markdown
# Implémenter Supabase Realtime pour notifications live

## Objectif
Ajouter des notifications en temps réel quand une facture est créée/modifiée/payée.

## Fichiers à créer/modifier

1. **hooks/use-realtime-invoices.ts**
   - Subscribe aux changements sur table invoices
   - Écouter INSERT, UPDATE, DELETE
   - Invalider le cache TanStack Query
   - Afficher toast notifications

2. **components/layout/realtime-provider.tsx**
   - Wrapper qui setup les channels Realtime
   - Cleanup au unmount

3. **App.tsx**
   - Wrap l'app avec RealtimeProvider

## Notifications à afficher
- INSERT: "Nouvelle facture créée: [number]"
- UPDATE status=paid: "💰 Facture payée: [number]"
- DELETE: "Facture supprimée"

## Critères
- [ ] Notifications apparaissent en temps réel
- [ ] Liste se met à jour automatiquement
- [ ] Fonctionne avec plusieurs onglets ouverts
- [ ] Pas de memory leak (cleanup correct)
- [ ] Toast avec sonner library

Utilise les best practices Supabase Realtime.
```

#### Prompt 5.2 : Optimistic UI

```markdown
# Ajouter Optimistic Updates avec TanStack Query

Implémente des optimistic updates pour:
1. Création de facture (apparaît instantanément dans la liste)
2. Changement de statut (toggle draft/sent/paid)
3. Suppression (disparaît instantanément)

Pour chaque mutation, configure:
- onMutate: Update cache optimistically
- onError: Rollback + toast error
- onSettled: Refetch pour sync

Exemple pour toggle status:
```typescript
const { mutate: toggleStatus } = useMutation({
  mutationFn: (id: string, status: InvoiceStatus) => 
    supabase.from('invoices').update({ status }).eq('id', id),
  onMutate: async ({ id, status }) => {
    await queryClient.cancelQueries(['invoices'])
    const previous = queryClient.getQueryData(['invoices'])
    
    queryClient.setQueryData(['invoices'], (old) =>
      old.map(inv => inv.id === id ? { ...inv, status } : inv)
    )
    
    return { previous }
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['invoices'], context.previous)
    toast.error('Échec de la mise à jour')
  },
  onSettled: () => {
    queryClient.invalidateQueries(['invoices'])
  }
})
```

Implémente ce pattern pour toutes les mutations importantes.
```

---

## ⌨️ RACCOURCIS CLAVIER CURSOR ESSENTIELS

```
╔════════════════════════════════════════════════════════════╗
║                  RACCOURCIS ESSENTIELS                     ║
╠════════════════════════════════════════════════════════════╣
║ Cmd/Ctrl + K        │ Inline Edit (modifier sélection)    ║
║ Cmd/Ctrl + I        │ Composer (générer multi-fichiers)   ║
║ Cmd/Ctrl + L        │ Chat (conversation)                 ║
║ Cmd/Ctrl + Shift + L│ Nouveau Chat                        ║
║ Tab                 │ Accepter suggestion AI              ║
║ Cmd/Ctrl + →        │ Accepter mot par mot                ║
║ Esc                 │ Rejeter suggestion                  ║
╠════════════════════════════════════════════════════════════╣
║                    NAVIGATION                              ║
╠════════════════════════════════════════════════════════════╣
║ Cmd/Ctrl + P        │ Quick Open (fichiers)               ║
║ Cmd/Ctrl + Shift + P│ Command Palette                     ║
║ Cmd/Ctrl + B        │ Toggle Sidebar                      ║
║ Cmd/Ctrl + J        │ Toggle Terminal                     ║
║ Cmd/Ctrl + `        │ Toggle Terminal                     ║
╠════════════════════════════════════════════════════════════╣
║                     ÉDITION                                ║
╠════════════════════════════════════════════════════════════╣
║ Cmd/Ctrl + D        │ Sélectionner occurrence suivante    ║
║ Cmd/Ctrl + Shift + L│ Sélectionner toutes occurrences     ║
║ Alt + ↑/↓           │ Déplacer ligne                      ║
║ Alt + Shift + ↑/↓   │ Dupliquer ligne                     ║
║ Cmd/Ctrl + /        │ Toggle commentaire                  ║
║ Cmd/Ctrl + Shift + K│ Supprimer ligne                     ║
╠════════════════════════════════════════════════════════════╣
║                      CURSOR AI                             ║
╠════════════════════════════════════════════════════════════╣
║ Cmd/Ctrl + K → "fix"│ Fix erreurs automatiquement         ║
║ Cmd/Ctrl + K → "doc"│ Générer JSDoc                       ║
║ Cmd/Ctrl + K → "test"│ Générer tests                      ║
║ Cmd/Ctrl + L → "@"  │ Référencer fichier dans chat        ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🎯 TIPS & TRICKS PRO

### Tip #1 : Utiliser @ pour le Contexte

Dans Cursor Chat (Cmd+L), utilisez `@` pour donner du contexte :

```
@filename.tsx - Référencer un fichier spécifique
@folder/ - Référencer un dossier entier
@git - Référencer les changements Git récents
@web - Chercher sur le web (requiert internet)
@docs - Chercher dans la documentation
@codebase - Chercher dans tout le codebase
```

**Exemple** :
```
@components/invoices/invoice-form.tsx 
Ajoute un champ "notes" optionnel à ce formulaire avec validation Zod
```

---

### Tip #2 : Composer avec Plusieurs Fichiers

Sélectionnez plusieurs fichiers dans l'explorateur (Cmd+Click), puis ouvrez Composer (Cmd+I).
Cursor verra tous ces fichiers comme contexte.

**Exemple** :
```
Sélectionner:
- invoice-form.tsx
- invoice.ts (validations)
- use-invoices.ts (hooks)

Prompt Composer:
"Ajoute un nouveau champ 'discount_percentage' (0-100) 
à ces fichiers en gardant la cohérence"
```

---

### Tip #3 : Prompts Incrémentaux

Ne demandez pas tout d'un coup. Procédez par étapes :

```
❌ MAUVAIS:
"Crée un module complet de gestion des factures avec CRUD, 
PDF, emails, stats, graphiques"

✅ BON:
Étape 1: "Crée la structure de base et le formulaire"
Étape 2: "Ajoute la liste avec pagination"
Étape 3: "Ajoute l'export PDF"
Étape 4: "Ajoute les statistiques"
```

---

### Tip #4 : Utiliser les Instructions de Ligne

Ajoutez des commentaires pour guider Cursor :

```typescript
// TODO: Add email validation here
const email = formData.get('email')

// FIXME: This should use debounce
const handleSearch = (query: string) => {
  search(query)
}

// NOTE: This needs to be refactored to use TanStack Query
useEffect(() => {
  fetchInvoices()
}, [])
```

Puis utilisez Cmd+K sur la ligne et tapez "fix" ou "refactor".

---

### Tip #5 : Générer des Tests Automatiquement

Sélectionnez une fonction/composant, puis Cmd+L :

```
Génère les tests Vitest pour cette fonction avec:
- Happy path
- Edge cases
- Error cases

Utilise describe/it/expect et mock Supabase si nécessaire.
```

---

### Tip #6 : Refactoring Intelligent

```
# Sélectionner un gros composant (>200 lignes)
# Cmd+K puis taper:

"Split this component into smaller components following 
Single Responsibility Principle. Extract:
- Form logic into useInvoiceForm hook
- Validation logic into separate file
- UI components into smaller pieces"
```

---

### Tip #7 : Debugging avec Cursor

```
# Quand vous avez une erreur runtime:

Cmd+L puis:
"J'ai cette erreur: [COLLER L'ERREUR]

Le code concerné est:
[COLLER LE CODE]

Explique-moi pourquoi ça plante et comment fix."
```

---

### Tip #8 : Optimisation de Performance

```
# Sélectionner un composant qui re-render trop

Cmd+L puis:
"@filename.tsx Analyse ce composant et suggère des optimisations:
- useMemo/useCallback si nécessaire
- React.memo si pertinent
- Éviter les inline functions
- Déplacer const hors du composant

Explique chaque suggestion."
```

---

### Tip #9 : Générer des Types depuis Schema

```
# Si vous avez un schema Zod
Cmd+L puis:

"@lib/validations/invoice.ts 
Génère les types TypeScript depuis ce schema Zod avec:
- Type pour le formulaire (InvoiceFormData)
- Type pour la DB (InvoiceDB)
- Type pour l'API response (InvoiceResponse)
```

---

### Tip #10 : Documentation Automatique

```
# Sélectionner plusieurs fonctions
Cmd+L puis:

"Génère la documentation JSDoc pour toutes ces fonctions 
exported avec:
- Description claire
- @param avec types
- @returns avec type
- @example avec cas d'usage
```

---

## 🚨 ERREURS COURANTES À ÉVITER

### ❌ Erreur #1 : Prompt Trop Vague

```
❌ MAUVAIS:
"Crée un formulaire pour les factures"

✅ BON:
"Crée un formulaire de facture avec React Hook Form + Zod qui:
- Valide le numéro de facture (format: INV-YYYY-XXXX)
- Calcule automatiquement les totaux
- Permet d'ajouter/supprimer des lignes d'items
- Affiche les erreurs de validation en temps réel
- Style avec shadcn/ui
- Type avec TypeScript strict"
```

---

### ❌ Erreur #2 : Ne Pas Donner de Contexte

```
❌ MAUVAIS:
"Fix ce bug"

✅ BON:
"@components/invoice-form.tsx
Le formulaire ne valide pas correctement quand je soumets.
Erreur console: [COLLER ERREUR]
Schema Zod: [COLLER SCHEMA]

Fix la validation et ajoute des console.log pour debug."
```

---

### ❌ Erreur #3 : Accepter le Premier Code Sans Review

**Toujours** :
1. Lire le code généré
2. Vérifier les types TypeScript
3. Tester manuellement
4. Demander des améliorations si besoin

```
Cmd+L:
"Le code que tu as généré fonctionne mais je vois des problèmes:
1. Pas de error handling
2. Pas de loading state
3. Types any utilisés

Peux-tu améliorer avec ces best practices?"
```

---

### ❌ Erreur #4 : Ne Pas Utiliser .cursorrules

Si Cursor génère du code qui ne suit pas vos conventions :

```
"@.cursorrules 
Pourquoi le code généré n'utilise pas les conventions du projet?
Régénère en respectant TOUTES les règles du .cursorrules"
```

---

## 🎓 EXEMPLES DE PROMPTS AVANCÉS

### Exemple 1 : Architecture Decision

```markdown
# Besoin d'aide pour choisir entre deux approches

## Context
Je construis le module de reporting pour l'ERP.

## Options

### Option A: Générer les rapports côté client
- Pros: Pas besoin d'Edge Function
- Cons: Performance si beaucoup de données

### Option B: Générer les rapports côté serveur (Edge Function)
- Pros: Performance, peut cacher le résultat
- Cons: Plus complexe à setup

## Ma Stack
- Supabase (PostgreSQL + Edge Functions)
- React (frontend)
- Cloudflare Pages (hosting)

## Questions
1. Quelle option recommandes-tu pour des rapports avec ~1000 factures?
2. Comment implémenter l'option choisie?
3. Quels sont les trade-offs de performance?
4. Exemple de code pour l'approche recommandée
```

---

### Exemple 2 : Migration de Code

```markdown
# Migrer de useState vers Zustand pour les filtres

## Code Actuel
@pages/invoices.tsx contient:
```typescript
const [status, setStatus] = useState('all')
const [dateRange, setDateRange] = useState({ from: null, to: null })
const [search, setSearch] = useState('')
```

Ces states sont passés en props à 5 composants enfants (props drilling).

## Objectif
Migrer vers Zustand pour:
- Éliminer props drilling
- Persister dans localStorage
- Synchroniser avec URL params

## Tâches
1. Crée stores/invoice-filters.ts avec Zustand
2. Migre les states
3. Update tous les composants qui utilisent ces states
4. Ajoute persist middleware
5. Ajoute sync avec URL params (useSearchParams)

Maintiens la logique existante, améliore juste l'architecture.
```

---

### Exemple 3 : Performance Optimization

```markdown
# Optimiser le composant InvoiceList qui re-render trop

## Problème
@components/invoices/invoice-list.tsx re-render à chaque frappe 
dans la barre de recherche, même si les résultats ne changent pas.

## Métriques Actuelles
- Renders: 50+ en 1 seconde de typing
- Time to Interactive: 2s
- Nombre d'invoices: 100

## Objectifs
- Réduire renders à <10
- TTI < 500ms

## Analyse Demandée
1. Identifie pourquoi il re-render autant
2. Suggère des optimisations (useMemo, useCallback, React.memo)
3. Implémente les optimisations
4. Ajoute des console.log pour mesurer l'impact

Ne sur-optimise pas. Mesure d'abord, optimise ensuite.
```

---

## 📊 CHECKLIST FINALE AVANT DE CODER

Avant de lancer un prompt Composer, vérifiez :

```
Configuration:
✅ .cursorrules existe et est à jour
✅ Extensions VS Code installées
✅ Settings.json configuré
✅ .env.local avec les bonnes variables

Planification:
✅ Objectif clair de la feature
✅ Fichiers concernés listés
✅ Critères d'acceptation définis
✅ Exemples de code si complexe

Prompt:
✅ Contexte donné (stack, contraintes)
✅ Résultat attendu précis
✅ Best practices mentionnées
✅ Edge cases considérés

Après Génération:
✅ Code review manuel
✅ TypeScript errors = 0
✅ Tests manuels
✅ Commit avec message clair
```

---

## 🚀 CONCLUSION & NEXT STEPS

### Workflow Optimal Résumé

```
1. SETUP INITIAL (1x)
   ├─ Installer Cursor + Extensions
   ├─ Configurer settings.json
   └─ Créer .cursorrules

2. DÉMARRER PROJET (1x)
   ├─ Utiliser Prompt Master (Composer)
   ├─ Générer structure + config
   └─ Installer dépendances

3. DÉVELOPPER FEATURES (itératif)
   ├─ Planifier avec Chat (Cmd+L)
   ├─ Générer avec Composer (Cmd+I)
   ├─ Itérer avec Inline Edit (Cmd+K)
   └─ Tester & Commit

4. REFACTORING (régulier)
   ├─ Analyser avec Cursor
   ├─ Optimiser performance
   └─ Améliorer types TypeScript

5. DOCUMENTATION (fin de feature)
   ├─ Générer JSDoc
   ├─ Update README
   └─ Créer examples
```

### Prochaine Action

**AUJOURD'HUI** :
1. Copier-coller le settings.json dans Cursor
2. Créer le .cursorrules à la racine
3. Lancer le Prompt Master pour setup initial
4. Faire le premier commit

**CETTE SEMAINE** :
1. Générer la structure complète du projet
2. Setup Supabase + Auth
3. Créer les premiers composants UI
4. Deploy preview sur Cloudflare Pages

**CE MOIS** :
1. Module factures complet
2. Tests E2E avec Playwright
3. Documentation complète
4. Premier utilisateur beta

---

## 🎁 BONUS : Templates de Prompts Réutilisables

### Template : Créer un CRUD Complet

```markdown
# Créer module CRUD pour [ENTITÉ]

## Entité: [NOM] (ex: clients, produits, etc.)

## Schema DB
```sql
[COLLER LE SCHEMA]
```

## Features Requises
- [ ] Liste paginée (10/page)
- [ ] Recherche
- [ ] Filtres: [LISTE]
- [ ] Formulaire création
- [ ] Formulaire édition
- [ ] Suppression avec confirmation
- [ ] Export CSV/PDF (optionnel)

## Validation Zod
```typescript
[DÉFINIR LES RÈGLES]
```

## Fichiers à Générer
- pages/[entité]s.tsx
- pages/[entité]-form.tsx
- components/[entité]/[entité]-table.tsx
- components/[entité]/[entité]-filters.tsx
- hooks/use-[entité]s.ts
- lib/validations/[entité].ts

Respecte les best practices du .cursorrules
```

---

### Template : Fix Bug

```markdown
# Fix bug dans [COMPONENT/FONCTION]

## Description du Bug
[DÉCRIRE LE COMPORTEMENT ACTUEL]

## Comportement Attendu
[DÉCRIRE CE QUI DEVRAIT SE PASSER]

## Erreur Console (si applicable)
```
[COLLER L'ERREUR]
```

## Code Concerné
@[FICHIER]
[LIGNE X à Y]

## Étapes de Reproduction
1. [ÉTAPE 1]
2. [ÉTAPE 2]
3. [ÉTAPE 3]

## Fix Attendu
- [ ] Corriger le bug
- [ ] Ajouter error handling
- [ ] Ajouter test pour éviter régression
- [ ] Commenter le fix
```

---

### Template : Optimisation Performance

```markdown
# Optimiser performance de [COMPONENT]

## Métriques Actuelles
- Renders: [NOMBRE] par seconde
- Bundle size: [TAILLE]
- Time to Interactive: [TEMPS]

## Objectifs
- Renders: < [NOMBRE]
- Bundle size: < [TAILLE]
- TTI: < [TEMPS]

## Analyse Demandée
1. Profile le composant
2. Identifie les bottlenecks
3. Suggère optimisations
4. Implémente les fixes
5. Mesure l'impact

## Contraintes
- Garder la même API (props)
- Pas de breaking changes
- Améliorer, pas sur-optimiser
```

---

**Prêt à devenir un ninja Cursor ? Let's code! 🥷**

---

*Dernière mise à jour : 8 Février 2026*  
*Version : 1.0 - Guide Cursor Pro*
