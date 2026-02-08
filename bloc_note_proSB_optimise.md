# 📘 Bloc-Notes ProSB - Next.js 15 + Supabase ERP
## Guide Complet & Roadmap SMART 2026

---

## 🎯 OBJECTIFS SMART DU PROJET

### Phase 1 : Fondations (Semaines 1-4)
**Objectif** : Mettre en place l'infrastructure de base fonctionnelle

- ✅ **Spécifique** : Déployer Next.js 15 + Supabase avec authentification RLS
- ✅ **Mesurable** : 
  - 3 tables PostgreSQL créées (users, companies, invoices)
  - 5 policies RLS implémentées et testées
  - TTFB < 200ms sur Vercel Edge
- ✅ **Atteignable** : Stack documentée, tutoriels disponibles
- ✅ **Réaliste** : ~15h de développement (3-4h/jour)
- ✅ **Temporel** : Deadline : Fin Semaine 4 (8 Mars 2026)

**Livrables** :
- [ ] Authentification Supabase fonctionnelle (Google + Email)
- [ ] Schéma DB avec RLS multi-tenant
- [ ] Layout principal avec navigation
- [ ] CI/CD pipeline (GitHub Actions → Vercel)

---

### Phase 2 : Module Facturation (Semaines 5-8)
**Objectif** : Créer le CRUD complet pour les factures

- ✅ **Spécifique** : Implémenter création/lecture/modification/suppression factures
- ✅ **Mesurable** :
  - 4 Server Actions (create, update, delete, duplicate)
  - 2 pages RSC (liste + détail)
  - 100% type-safe (Zod + TypeScript strict)
  - Tests E2E Playwright (>80% coverage)
- ✅ **Atteignable** : Utilisation shadcn/ui pour accélérer le UI
- ✅ **Réaliste** : ~20h de développement
- ✅ **Temporel** : Deadline : 5 Avril 2026

**Livrables** :
- [ ] Formulaire facture avec validation Zod
- [ ] Export PDF (react-pdf ou jsPDF)
- [ ] Recherche + filtres (statut, client, date)
- [ ] Pagination server-side (10 items/page)

---

### Phase 3 : Temps Réel & UX (Semaines 9-10)
**Objectif** : Améliorer l'expérience utilisateur avec le temps réel

- ✅ **Spécifique** : Implémenter Realtime + Optimistic UI
- ✅ **Mesurable** :
  - Latence <50ms pour optimistic updates
  - 3 features realtime (notifications, statuts, totaux)
  - Lighthouse Performance Score >90
- ✅ **Atteignable** : Supabase Realtime natif
- ✅ **Réaliste** : ~12h de développement
- ✅ **Temporel** : Deadline : 19 Avril 2026

**Livrables** :
- [ ] Notifications toast temps réel
- [ ] Dashboard avec totaux live
- [ ] Optimistic UI sur formulaires

---

### Phase 4 : Production & Monitoring (Semaines 11-12)
**Objectif** : Préparer le lancement en production

- ✅ **Spécifique** : Sécuriser, monitorer et documenter
- ✅ **Mesurable** :
  - 0 vulnérabilité critique (npm audit)
  - Error rate <1% (Sentry)
  - Documentation API complète
  - Uptime >99.5% (Vercel Analytics)
- ✅ **Atteignable** : Outils existants (Sentry, Vercel)
- ✅ **Réaliste** : ~10h configuration + monitoring
- ✅ **Temporel** : Deadline : 3 Mai 2026

**Livrables** :
- [ ] Sentry configuré (error tracking)
- [ ] Rate limiting (Upstash Redis)
- [ ] Backup automatique DB (Supabase)
- [ ] Guide d'onboarding utilisateur

---

## 🧩 CONCEPTS CLÉS & ARCHITECTURE

### React Server Components (RSC)
**Quoi** : Composants qui s'exécutent **uniquement** côté serveur  
**Pourquoi** : 
- 0 JavaScript envoyé au client
- Accès direct à la DB sans API layer
- Meilleure performance SEO

**Quand utiliser** :
- ✅ Affichage de listes (factures, clients)
- ✅ Pages statiques (dashboard, rapports)
- ❌ Interactions utilisateur (formulaires avec état local)

```typescript
// ✅ BON : RSC pour lecture de données
// app/invoices/page.tsx
async function InvoicesPage() {
  const supabase = createServerClient() // Cookie-based auth SSR
  
  // Requête exécutée côté serveur, RLS appliqué automatiquement
  const { data: invoices } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(name, email),
      items:invoice_items(*)
    `)
    .order('created_at', { ascending: false })
  
  // Pas de loading state, pas de useEffect, juste du HTML
  return <InvoiceList invoices={invoices} />
}
```

**💡 Astuce Ninja** : Utilisez `Suspense` pour streamer les composants lents
```typescript
<Suspense fallback={<InvoiceSkeleton />}>
  <InvoiceList /> {/* Stream dès que les données arrivent */}
</Suspense>
```

---

### Server Actions
**Quoi** : Fonctions TypeScript qui s'exécutent côté serveur en réponse à des actions utilisateur  
**Pourquoi** :
- Pas de route API à créer manuellement
- Type-safety de bout en bout
- Revalidation automatique du cache Next.js

**Quand utiliser** :
- ✅ Formulaires (POST, PUT, DELETE)
- ✅ Mutations avec validation Zod
- ❌ Webhooks externes (utiliser Route Handlers)

```typescript
// ✅ BON : Server Action pour écriture
// app/actions/invoice.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'

// Schema de validation (réutilisable côté client pour UX)
const invoiceSchema = z.object({
  client_id: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(['draft', 'sent', 'paid']),
  due_date: z.string().datetime(),
})

export async function createInvoice(formData: FormData) {
  const supabase = createServerClient()
  
  // 1. Validation des données (sécurité serveur)
  const rawData = Object.fromEntries(formData)
  const validated = invoiceSchema.parse({
    ...rawData,
    amount: parseFloat(rawData.amount as string),
  })
  
  // 2. Insertion en DB (RLS vérifie company_id automatiquement)
  const { data, error } = await supabase
    .from('invoices')
    .insert(validated)
    .select()
    .single()
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  // 3. Revalidation du cache Next.js pour afficher la nouvelle facture
  revalidatePath('/invoices')
  
  return { success: true, invoice: data }
}
```

**💡 Astuce Ninja** : Utilisez `useFormStatus` pour le loading state
```typescript
'use client'
import { useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending}>
      {pending ? 'Création...' : 'Créer la facture'}
    </button>
  )
}
```

---

### Supabase RLS (Row-Level Security)
**Quoi** : Firewall au niveau de la base de données PostgreSQL  
**Pourquoi** :
- Sécurité defense-in-depth (même si le code a un bug)
- Isolation multi-tenant automatique
- Audit trail natif

**Quand configurer** :
- ✅ Toujours, dès la création d'une table
- ✅ Pour chaque opération (SELECT, INSERT, UPDATE, DELETE)

```sql
-- ✅ ESSENTIEL : Policy d'isolation multi-tenant
-- Les utilisateurs ne voient QUE les données de leur entreprise

-- 1. Activer RLS sur la table
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- 2. Policy pour la lecture (SELECT)
CREATE POLICY "users_see_own_company_invoices"
ON invoices
FOR SELECT
USING (
  company_id = (
    SELECT company_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);

-- 3. Policy pour la création (INSERT)
CREATE POLICY "users_create_own_company_invoices"
ON invoices
FOR INSERT
WITH CHECK (
  company_id = (
    SELECT company_id 
    FROM profiles 
    WHERE id = auth.uid()
  )
);

-- 4. Policy pour la modification (UPDATE)
-- Seuls les admins peuvent modifier le statut 'paid'
CREATE POLICY "admins_can_mark_as_paid"
ON invoices
FOR UPDATE
USING (
  company_id = (SELECT company_id FROM profiles WHERE id = auth.uid())
  AND (
    status != 'paid' 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
);
```

**💡 Astuce Ninja** : Testez les policies avec `set_config`
```sql
-- Simuler un utilisateur spécifique
SELECT set_config('request.jwt.claims', '{"sub":"user-uuid"}', true);
SELECT * FROM invoices; -- Voit uniquement ses factures
```

---

## 🏗️ ARCHITECTURE PROJET (Structure Optimale)

```
my-erp/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 🔒 Route group protégé (avec middleware)
│   │   ├── layout.tsx            # Layout avec sidebar + auth check
│   │   ├── dashboard/
│   │   │   └── page.tsx          # 📊 RSC : Dashboard avec totaux
│   │   ├── invoices/
│   │   │   ├── page.tsx          # 📄 RSC : Liste des factures
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx      # 👁️ RSC : Détail facture
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx  # ✏️ Client : Formulaire édition
│   │   │   ├── new/
│   │   │   │   └── page.tsx      # ➕ Client : Formulaire création
│   │   │   └── actions.ts        # ⚡ Server Actions (create, update, delete)
│   │   ├── clients/...           # 👥 Même structure pour clients
│   │   └── settings/...          # ⚙️ Paramètres utilisateur
│   ├── (public)/                 # Route group public (sans auth)
│   │   ├── login/
│   │   │   └── page.tsx          # 🔑 Page de connexion
│   │   └── signup/
│   │       └── page.tsx          # 📝 Inscription
│   ├── api/                      # Route Handlers (webhooks uniquement)
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts      # 💳 Webhook Stripe
│   │   └── cron/
│   │       └── send-reminders/
│   │           └── route.ts      # ⏰ Job CRON (factures dues)
│   ├── layout.tsx                # Root layout (metadata, fonts)
│   └── globals.css               # Tailwind imports
│
├── components/                   # Composants réutilisables
│   ├── ui/                       # 🎨 shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── forms/
│   │   ├── invoice-form.tsx      # 📝 Formulaire facture
│   │   └── client-form.tsx
│   ├── layout/
│   │   ├── sidebar.tsx           # 📐 Navigation latérale
│   │   └── header.tsx
│   └── shared/
│       ├── data-table.tsx        # 📊 Table réutilisable
│       └── search-filter.tsx
│
├── lib/                          # Utilitaires & configs
│   ├── supabase/
│   │   ├── server.ts             # 🔧 Client Supabase SSR (cookies)
│   │   ├── client.ts             # 🔧 Client Supabase CSR (navigation)
│   │   └── middleware.ts         # 🛡️ Middleware auth
│   ├── db/
│   │   ├── schema.ts             # 📐 Types générés (supabase gen types)
│   │   └── migrations/           # 📝 Migrations SQL
│   ├── validations/
│   │   ├── invoice.ts            # ✅ Schemas Zod
│   │   └── client.ts
│   └── utils/
│       ├── format.ts             # 💰 Formatage (monnaie, dates)
│       └── pdf.ts                # 📄 Génération PDF
│
├── middleware.ts                 # 🛡️ Middleware global (auth redirect)
├── supabase/
│   ├── config.toml               # ⚙️ Config Supabase CLI
│   └── migrations/
│       ├── 20260101_initial_schema.sql
│       └── 20260115_add_rls_policies.sql
│
├── tests/
│   ├── e2e/                      # 🧪 Tests Playwright
│   │   ├── invoices.spec.ts
│   │   └── auth.spec.ts
│   └── unit/                     # 🧪 Tests unitaires (Vitest)
│       └── validations.test.ts
│
├── .env.local                    # 🔐 Variables d'environnement
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 💻 EXEMPLES DE CODE COMPLETS

### 1. Page Liste Factures (RSC)
```typescript
// app/(auth)/invoices/page.tsx
import { Suspense } from 'react'
import { createServerClient } from '@/lib/supabase/server'
import { InvoiceTable } from '@/components/invoices/invoice-table'
import { InvoiceTableSkeleton } from '@/components/invoices/invoice-table-skeleton'
import { SearchParams } from '@/types'

// ✅ IMPORTANT : Next.js 15 passe searchParams en Promise
type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function InvoicesPage({ searchParams }: PageProps) {
  // Await searchParams (Next.js 15 requirement)
  const params = await searchParams
  const page = Number(params?.page) || 1
  const search = params?.search || ''
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Factures</h1>
        <Link href="/invoices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </Link>
      </div>
      
      {/* Suspense permet de streamer le contenu */}
      <Suspense fallback={<InvoiceTableSkeleton />}>
        <InvoiceTableData page={page} search={search} />
      </Suspense>
    </div>
  )
}

// Composant séparé pour isoler le fetching
async function InvoiceTableData({ page, search }: { page: number; search: string }) {
  const supabase = createServerClient()
  const ITEMS_PER_PAGE = 10
  const offset = (page - 1) * ITEMS_PER_PAGE
  
  // Query avec pagination côté serveur
  const { data: invoices, count } = await supabase
    .from('invoices')
    .select(`
      *,
      client:clients(name, email)
    `, { count: 'exact' })
    .ilike('invoice_number', `%${search}%`) // Recherche case-insensitive
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)
  
  return (
    <InvoiceTable 
      invoices={invoices || []} 
      totalCount={count || 0}
      currentPage={page}
    />
  )
}
```

---

### 2. Formulaire avec Server Action
```typescript
// app/(auth)/invoices/new/page.tsx
'use client'

import { useFormState } from 'react-dom'
import { createInvoice } from '../actions'
import { InvoiceFormFields } from '@/components/invoices/invoice-form-fields'

// État initial du formulaire
const initialState = {
  success: false,
  error: null,
  invoice: null,
}

export default function NewInvoicePage() {
  // useFormState gère l'état de la Server Action
  const [state, formAction] = useFormState(createInvoice, initialState)
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Nouvelle facture</h1>
      
      <form action={formAction} className="space-y-6">
        <InvoiceFormFields />
        
        {state.error && (
          <div className="bg-red-50 text-red-600 p-4 rounded">
            {state.error}
          </div>
        )}
        
        <SubmitButton />
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Création en cours...
        </>
      ) : (
        'Créer la facture'
      )}
    </Button>
  )
}
```

---

### 3. Optimistic UI (Mise à jour instantanée)
```typescript
// components/invoices/invoice-status-toggle.tsx
'use client'

import { useOptimistic } from 'react'
import { updateInvoiceStatus } from '@/app/(auth)/invoices/actions'
import { Badge } from '@/components/ui/badge'

type Invoice = {
  id: string
  status: 'draft' | 'sent' | 'paid'
  invoice_number: string
}

export function InvoiceStatusToggle({ invoice }: { invoice: Invoice }) {
  // Optimistic state : UI réactive avant la confirmation serveur
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    invoice.status,
    (_, newStatus: Invoice['status']) => newStatus
  )
  
  const handleStatusChange = async (newStatus: Invoice['status']) => {
    // 1. Mise à jour optimistic (UI instantanée)
    setOptimisticStatus(newStatus)
    
    // 2. Appel serveur en arrière-plan
    await updateInvoiceStatus(invoice.id, newStatus)
  }
  
  return (
    <div className="flex gap-2">
      {(['draft', 'sent', 'paid'] as const).map((status) => (
        <button
          key={status}
          onClick={() => handleStatusChange(status)}
          disabled={optimisticStatus === status}
        >
          <Badge variant={optimisticStatus === status ? 'default' : 'outline'}>
            {status}
          </Badge>
        </button>
      ))}
    </div>
  )
}
```

---

### 4. Realtime Supabase (Notifications live)
```typescript
// app/(auth)/layout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createBrowserClient()
  
  useEffect(() => {
    // Écoute des nouvelles factures en temps réel
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'invoices',
        },
        (payload) => {
          console.log('Nouvelle facture créée :', payload.new)
          
          // Notification toast
          toast.success('Nouvelle facture créée !', {
            description: `N° ${payload.new.invoice_number}`,
          })
          
          // Rafraîchir la page pour afficher la nouvelle donnée
          router.refresh()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'invoices',
          filter: 'status=eq.paid', // Uniquement quand statut = "paid"
        },
        (payload) => {
          toast.success('💰 Facture payée !', {
            description: `N° ${payload.new.invoice_number}`,
          })
          router.refresh()
        }
      )
      .subscribe()
    
    // Cleanup à la destruction du composant
    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])
  
  return <>{children}</>
}
```

---

## ⚡ PATTERNS AVANCÉS

### Edge Runtime (Performance Globale)
```typescript
// app/(auth)/invoices/page.tsx
export const runtime = 'edge' // Déploiement sur Vercel Edge Network

// ✅ Avantages :
// - Latence <50ms partout dans le monde
// - Cold start <10ms vs ~500ms pour Node.js
// - Auto-scaling instantané

// ⚠️ Limitations :
// - Pas d'accès au filesystem
// - Pas de modules Node.js natifs (fs, crypto)
// - Taille limitée à 1MB
```

---

### Revalidation Intelligente
```typescript
// app/actions/invoice.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function createInvoice(formData: FormData) {
  // ... insertion DB
  
  // Option 1 : Revalider un chemin spécifique
  revalidatePath('/invoices') // Invalide uniquement /invoices
  
  // Option 2 : Revalider une tag (plus granulaire)
  revalidateTag('invoices-list') // Invalide tous les composants tagués
  
  // Option 3 : Revalidation dynamique
  revalidatePath(`/invoices/${newInvoice.id}`) // Page détail
}

// Utilisation des tags dans un fetch
async function getInvoices() {
  const res = await fetch('/api/invoices', {
    next: { 
      tags: ['invoices-list'],
      revalidate: 60, // Cache 60 secondes
    }
  })
  return res.json()
}
```

---

### Gestion d'Erreurs Robuste
```typescript
// app/actions/invoice.ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'

export async function createInvoice(prevState: any, formData: FormData) {
  try {
    // 1. Validation
    const validated = invoiceSchema.parse(Object.fromEntries(formData))
    
    // 2. Insertion DB
    const { data, error } = await supabase
      .from('invoices')
      .insert(validated)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    
    // 3. Revalidation
    revalidatePath('/invoices')
    
    // 4. Redirection
    redirect(`/invoices/${data.id}`)
    
  } catch (error) {
    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.flatten().fieldErrors,
      }
    }
    
    // Erreur générique
    return {
      success: false,
      error: 'Une erreur est survenue. Veuillez réessayer.',
    }
  }
}
```

---

## 🔐 SÉCURITÉ - CHECKLIST COMPLÈTE

### 1. Authentification
- [ ] Supabase Auth configuré (Email + OAuth)
- [ ] Session cookies avec `httpOnly` flag
- [ ] Refresh token rotation activé
- [ ] MFA (Multi-Factor Auth) pour admins

### 2. Autorisation (RLS)
- [ ] RLS activé sur toutes les tables
- [ ] Policies testées avec différents rôles
- [ ] Audit trail (created_by, updated_by)
- [ ] Soft delete (deleted_at) au lieu de DELETE

### 3. Validation
- [ ] Zod schemas côté serveur (obligatoire)
- [ ] Sanitization des inputs (xss)
- [ ] Rate limiting API (Upstash Redis)
- [ ] CSRF protection (Next.js natif)

### 4. Données Sensibles
- [ ] Variables d'environnement chiffrées
- [ ] Pas de secrets dans le code
- [ ] Chiffrement données sensibles (PII)
- [ ] Backup chiffré (Supabase)

---

## 📊 MONITORING & OBSERVABILITÉ

### Stack Recommandée
```typescript
// Sentry (Error Tracking)
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% des requêtes
  environment: process.env.NODE_ENV,
})

// Vercel Analytics (Performance)
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

// Upstash Redis (Rate Limiting)
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 req/10sec
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new Response('Rate limit exceeded', { status: 429 })
  }
  
  // ... suite du code
}
```

---

## 🎓 RESSOURCES & LEARNING PATH

### Documentation Officielle
1. [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
2. [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
3. [React Server Components](https://react.dev/reference/rsc/server-components)

### Tutoriels Pratiques
- [ ] [Supabase + Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [ ] [shadcn/ui Installation](https://ui.shadcn.com/docs/installation/next)
- [ ] [Playwright E2E Testing](https://playwright.dev/docs/intro)

### Exemples Open-Source
- [Taxonomy](https://github.com/shadcn-ui/taxonomy) - SaaS template
- [Next.js Commerce](https://github.com/vercel/commerce) - E-commerce
- [Cal.com](https://github.com/calcom/cal.com) - Scheduling

---

## 🚀 DÉMARRAGE RAPIDE (Quick Start)

```bash
# 1. Créer le projet Next.js
npx create-next-app@latest my-erp --typescript --tailwind --app

# 2. Installer les dépendances
cd my-erp
npm install @supabase/ssr @supabase/supabase-js zod react-hook-form

# 3. Initialiser Supabase
npx supabase init
npx supabase start

# 4. Générer les types TypeScript
npx supabase gen types typescript --local > lib/db/schema.ts

# 5. Installer shadcn/ui
npx shadcn@latest init

# 6. Lancer le dev server
npm run dev
```

---

## 📈 KPIs À SUIVRE

### Performance
- TTFB (Time To First Byte) : < 200ms
- FCP (First Contentful Paint) : < 1.8s
- LCP (Largest Contentful Paint) : < 2.5s
- CLS (Cumulative Layout Shift) : < 0.1

### Qualité Code
- Test coverage : > 80%
- TypeScript strict mode : 100%
- ESLint errors : 0
- Bundle size : < 500KB

### Business
- Taux de conversion signup : > 10%
- Temps moyen création facture : < 2min
- Uptime : > 99.5%
- Support tickets/semaine : < 5

---

## 🎯 PROCHAINES ÉTAPES

### Maintenant (Semaine actuelle)
1. ✅ Lire ce guide en entier
2. ✅ Setup Next.js + Supabase local
3. ✅ Créer première table avec RLS
4. ✅ Tester Server Action basique

### Cette semaine
1. [ ] Implémenter auth complète
2. [ ] Créer schéma DB complet
3. [ ] Setup CI/CD GitHub → Vercel
4. [ ] Créer composants UI de base

### Ce mois
1. [ ] Module factures complet
2. [ ] Tests E2E Playwright
3. [ ] Export PDF fonctionnel
4. [ ] Dashboard temps réel

---

## 💡 TIPS DE PRO

### Performance
> "Utilisez `loading.tsx` dans chaque route pour éviter les layouts blancs"

### Sécurité
> "Toujours valider côté serveur, même si validation côté client"

### DX (Developer Experience)
> "Configurez VSCode avec Prettier + ESLint + Tailwind IntelliSense"

### Débogage
> "Utilisez `console.log` dans les Server Actions (s'affiche dans le terminal)"

---

## 🏁 CONCLUSION

Cette stack Next.js 15 + Supabase est **battle-tested** pour construire un ERP moderne :

✅ **Simple** : Moins de code, plus de fonctionnalités  
✅ **Performant** : Edge Runtime + RSC = <100ms TTFB  
✅ **Sécurisé** : RLS + Server Actions = defense-in-depth  
✅ **Scalable** : De 10 à 100k utilisateurs sans refactoring  

**Prochaine action** : Commence par la Phase 1 (Fondations) et shippe ton premier prototype en 4 semaines ! 🚀

---

*Dernière mise à jour : 8 Février 2026*  
*Version : 2.0 - Next.js 15 Edition*
