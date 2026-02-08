# 🚀 Stack ERP Finale 2026 - Guide Complet pour Informaticiens de Gestion

## 📚 TABLE DES MATIÈRES

1. [Stack Technique Détaillée](#stack-technique)
2. [Architecture & Flux de Données](#architecture)
3. [Défis Hebdomadaires (12 semaines)](#défis-hebdomadaires)
4. [Astuces Ninja par Technologie](#astuces-ninja)
5. [Ressources d'Apprentissage](#ressources)
6. [FAQ & Troubleshooting](#faq)

---

## 🎯 STACK TECHNIQUE DÉTAILLÉE

### 🎨 FRONTEND (Interface Utilisateur)

#### **React 19 + TypeScript + Vite**
**Pourquoi ?**
- ✅ React = Bibliothèque la plus populaire (facile de trouver de l'aide)
- ✅ TypeScript = Sécurité des types (moins de bugs)
- ✅ Vite = Build ultra-rapide (<1s vs 10s avec Webpack)

**Quand l'utiliser ?**
- Pages dynamiques (dashboard, formulaires)
- Composants réutilisables (boutons, modals)

```typescript
// ✅ BON EXEMPLE : Composant TypeScript avec props typées
interface InvoiceCardProps {
  invoice: {
    id: string
    number: string
    amount: number
    status: 'draft' | 'sent' | 'paid'
  }
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  return (
    <div className="p-4 border rounded">
      <h3>{invoice.number}</h3>
      <p>{invoice.amount}€</p>
      <span className={`badge ${invoice.status}`}>{invoice.status}</span>
    </div>
  )
}
```

**Niveau requis** : 🟢 Débutant  
**Temps d'apprentissage** : 2-3 semaines

---

#### **TanStack Query (React Query)**
**Pourquoi ?**
- ✅ Gère automatiquement le cache des données
- ✅ Rafraîchit les données en arrière-plan
- ✅ Gère loading/error states sans code boilerplate

**Quand l'utiliser ?**
- Récupération de données API (GET)
- Synchronisation automatique entre composants
- Cache intelligent (évite requêtes inutiles)

```typescript
// ✅ BON EXEMPLE : Charger des factures avec cache automatique
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

function InvoiceList() {
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ['invoices'], // Clé unique pour le cache
    queryFn: async () => {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
      return data
    },
    staleTime: 5 * 60 * 1000, // Cache 5 minutes
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {invoices.map(invoice => (
        <InvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  )
}
```

**Niveau requis** : 🟡 Intermédiaire  
**Temps d'apprentissage** : 1 semaine

---

#### **Zustand (Gestion d'État Global)**
**Pourquoi ?**
- ✅ Plus simple que Redux (5x moins de code)
- ✅ Pas de Provider à wrapper
- ✅ TypeScript natif

**Quand l'utiliser ?**
- État partagé entre composants (user, theme, filters)
- Préférences utilisateur (langue, devise)
- État UI global (sidebar ouverte/fermée)

```typescript
// ✅ BON EXEMPLE : Store Zustand pour les filtres
import { create } from 'zustand'

interface FiltersStore {
  status: 'all' | 'draft' | 'sent' | 'paid'
  dateRange: { from: Date; to: Date }
  setStatus: (status: FiltersStore['status']) => void
  setDateRange: (range: FiltersStore['dateRange']) => void
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  status: 'all',
  dateRange: { from: new Date(), to: new Date() },
  setStatus: (status) => set({ status }),
  setDateRange: (dateRange) => set({ dateRange }),
}))

// Utilisation dans un composant
function FilterBar() {
  const { status, setStatus } = useFiltersStore()
  
  return (
    <select value={status} onChange={(e) => setStatus(e.target.value)}>
      <option value="all">Toutes</option>
      <option value="draft">Brouillons</option>
      <option value="sent">Envoyées</option>
      <option value="paid">Payées</option>
    </select>
  )
}
```

**Niveau requis** : 🟢 Débutant  
**Temps d'apprentissage** : 2-3 jours

---

#### **shadcn/ui + Tailwind CSS**
**Pourquoi ?**
- ✅ Composants professionnels pré-faits (gain de temps)
- ✅ Personnalisables à 100%
- ✅ Accessibilité (WCAG) intégrée
- ✅ Charts inclus (pour graphiques dashboard)

**Quand l'utiliser ?**
- Boutons, formulaires, modals, tables
- Graphiques (revenus, statistiques)
- Thème dark/light mode

```typescript
// ✅ BON EXEMPLE : Utiliser shadcn/ui
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { BarChart, Bar, XAxis, YAxis } from 'recharts'

function Dashboard() {
  const data = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Fév', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
  ]

  return (
    <div className="space-y-6">
      {/* Graphique avec shadcn/ui charts */}
      <BarChart width={600} height={300} data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Bar dataKey="revenue" fill="#8884d8" />
      </BarChart>

      {/* Bouton shadcn */}
      <Button variant="default" size="lg">
        Créer une facture
      </Button>
    </div>
  )
}
```

**Niveau requis** : 🟢 Débutant  
**Temps d'apprentissage** : 3-4 jours

---

### 🗄️ BACKEND (Base de Données & API)

#### **Supabase (Backend tout-en-un)**
**Pourquoi ?**
- ✅ PostgreSQL (base de données robuste)
- ✅ Authentification intégrée (email, Google, GitHub)
- ✅ Storage (upload fichiers)
- ✅ Realtime (changements en temps réel)
- ✅ Edge Functions (API serverless)

**Composants Supabase** :

##### **1. PostgreSQL + RLS (Row Level Security)**
Sécurité au niveau de la base de données.

```sql
-- ✅ ESSENTIEL : Politique RLS multi-tenant
-- Chaque utilisateur voit uniquement SES factures

-- Activer RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Politique de lecture
CREATE POLICY "Users see own company invoices"
ON invoices FOR SELECT
USING (
  company_id IN (
    SELECT company_id 
    FROM user_companies 
    WHERE user_id = auth.uid()
  )
);

-- Politique d'insertion
CREATE POLICY "Users create own company invoices"
ON invoices FOR INSERT
WITH CHECK (
  company_id IN (
    SELECT company_id 
    FROM user_companies 
    WHERE user_id = auth.uid()
  )
);
```

##### **2. Authentication (Auth)**
Gestion des utilisateurs sans coder le backend.

```typescript
// ✅ BON EXEMPLE : Login avec Supabase Auth
import { supabase } from '@/lib/supabase'

async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data.user
}

// Login avec Google OAuth
async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://mon-erp.com/dashboard',
    },
  })
}
```

##### **3. Storage (Upload Fichiers)**
Stockage sécurisé de fichiers (logos, PDF factures).

```typescript
// ✅ BON EXEMPLE : Upload logo entreprise
async function uploadCompanyLogo(file: File, companyId: string) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${companyId}/logo.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from('company-logos')
    .upload(filePath, file, {
      upsert: true, // Remplace si existe déjà
    })
  
  if (error) throw error
  
  // Obtenir l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('company-logos')
    .getPublicUrl(filePath)
  
  return publicUrl
}
```

##### **4. Edge Functions (API Serverless)**
Code backend qui s'exécute à la demande.

```typescript
// ✅ BON EXEMPLE : Edge Function pour envoyer facture par email
// supabase/functions/send-invoice/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { invoiceId } = await req.json()
  
  // Récupérer la facture
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, client:clients(*)')
    .eq('id', invoiceId)
    .single()
  
  // Envoyer l'email (avec Resend)
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'factures@mon-erp.com',
      to: invoice.client.email,
      subject: `Facture ${invoice.number}`,
      html: `<p>Bonjour, voici votre facture...</p>`,
    }),
  })
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

##### **5. Realtime (Temps Réel)**
Écoute les changements en base de données.

```typescript
// ✅ BON EXEMPLE : Notifications temps réel
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

function useRealtimeInvoices() {
  useEffect(() => {
    const channel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'invoices',
        },
        (payload) => {
          toast.success('Nouvelle facture créée !', {
            description: `N° ${payload.new.number}`,
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'invoices',
          filter: 'status=eq.paid',
        },
        (payload) => {
          toast.success('💰 Facture payée !', {
            description: `${payload.new.amount}€`,
          })
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])
}
```

**Niveau requis** : 🟡 Intermédiaire  
**Temps d'apprentissage** : 2-3 semaines

---

### 🤖 IA (Intelligence Artificielle)

#### **SDK Anthropic Claude + pgvector**
**Pourquoi ?**
- ✅ Génération automatique de descriptions produits
- ✅ Chatbot assistant comptable
- ✅ Analyse de documents (OCR factures)
- ✅ Recherche sémantique dans la base de données

**Cas d'usage ERP** :

##### **1. Assistant Comptable avec Claude**
```typescript
// ✅ BON EXEMPLE : Chatbot qui répond aux questions comptables
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
})

async function askAccountingQuestion(question: string) {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Tu es un expert-comptable. Réponds à cette question :
      
${question}

Contexte : ERP pour PME en Suisse.`,
    }],
  })
  
  return message.content[0].text
}

// Utilisation
const answer = await askAccountingQuestion(
  'Quelle est la différence entre TVA 7.7% et 2.5% ?'
)
```

##### **2. Recherche Sémantique avec pgvector**
Trouve des factures similaires par description.

```sql
-- Installation pgvector dans Supabase
CREATE EXTENSION IF NOT EXISTS vector;

-- Ajouter colonne embeddings
ALTER TABLE invoices 
ADD COLUMN description_embedding vector(1536);

-- Index pour recherche rapide
CREATE INDEX ON invoices 
USING ivfflat (description_embedding vector_cosine_ops);
```

```typescript
// ✅ BON EXEMPLE : Recherche sémantique de factures
async function searchSimilarInvoices(query: string) {
  // 1. Générer embedding de la requête avec Claude
  const embedding = await generateEmbedding(query)
  
  // 2. Rechercher dans PostgreSQL
  const { data } = await supabase.rpc('match_invoices', {
    query_embedding: embedding,
    match_threshold: 0.8,
    match_count: 10,
  })
  
  return data
}

// Exemple : "factures de consulting janvier 2026"
// → Trouve toutes les factures similaires même si mots différents
```

**Niveau requis** : 🔴 Avancé  
**Temps d'apprentissage** : 3-4 semaines

---

### 🛠️ OUTILS ESSENTIELS

#### **Zod (Validation de Données)**
**Pourquoi ?**
- ✅ Valide les données utilisateur (évite injections SQL)
- ✅ Génère types TypeScript automatiquement
- ✅ Messages d'erreur personnalisés

```typescript
// ✅ BON EXEMPLE : Schema Zod pour facture
import { z } from 'zod'

export const invoiceSchema = z.object({
  number: z.string().min(1, 'Numéro requis').regex(/^INV-\d{4}$/),
  client_id: z.string().uuid('ID client invalide'),
  amount: z.number().positive('Montant doit être positif'),
  due_date: z.date().min(new Date(), 'Date doit être future'),
  status: z.enum(['draft', 'sent', 'paid']),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().int().positive(),
    unit_price: z.number().positive(),
  })).min(1, 'Au moins 1 ligne requise'),
})

// Type TypeScript généré automatiquement
export type Invoice = z.infer<typeof invoiceSchema>

// Validation
try {
  const validatedData = invoiceSchema.parse(formData)
  // ✅ Données valides, insérer en DB
} catch (error) {
  if (error instanceof z.ZodError) {
    console.log(error.flatten()) // Erreurs par champ
  }
}
```

**Niveau requis** : 🟢 Débutant  
**Temps d'apprentissage** : 2-3 jours

---

#### **React Hook Form (Formulaires)**
**Pourquoi ?**
- ✅ Performance (pas de re-render à chaque touche)
- ✅ Intégration Zod native
- ✅ Gestion erreurs automatique

```typescript
// ✅ BON EXEMPLE : Formulaire facture avec validation
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { invoiceSchema } from '@/schemas/invoice'

function InvoiceForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(invoiceSchema),
  })
  
  const onSubmit = async (data: Invoice) => {
    await supabase.from('invoices').insert(data)
    toast.success('Facture créée !')
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('number')} 
        placeholder="INV-0001"
      />
      {errors.number && <span>{errors.number.message}</span>}
      
      <input 
        {...register('amount', { valueAsNumber: true })} 
        type="number"
      />
      {errors.amount && <span>{errors.amount.message}</span>}
      
      <button type="submit">Créer</button>
    </form>
  )
}
```

**Niveau requis** : 🟡 Intermédiaire  
**Temps d'apprentissage** : 1 semaine

---

#### **@react-pdf/renderer (Génération PDF)**
**Pourquoi ?**
- ✅ Génère PDF côté client (pas besoin de serveur)
- ✅ Composants React = facile à styliser
- ✅ Multi-pages automatique

```typescript
// ✅ BON EXEMPLE : Template PDF facture
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 24, marginBottom: 20 },
  table: { display: 'table', width: '100%', marginTop: 10 },
  tableRow: { flexDirection: 'row' },
  tableCell: { border: '1px solid #000', padding: 5 },
})

function InvoicePDF({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <Text style={styles.header}>Facture {invoice.number}</Text>
        
        {/* Info client */}
        <View>
          <Text>Client : {invoice.client.name}</Text>
          <Text>Date : {invoice.date}</Text>
        </View>
        
        {/* Tableau des articles */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Description</Text>
            <Text style={styles.tableCell}>Qté</Text>
            <Text style={styles.tableCell}>Prix</Text>
          </View>
          {invoice.items.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{item.unit_price}€</Text>
            </View>
          ))}
        </View>
        
        {/* Total */}
        <Text>Total : {invoice.amount}€</Text>
      </Page>
    </Document>
  )
}

// Télécharger le PDF
import { PDFDownloadLink } from '@react-pdf/renderer'

<PDFDownloadLink document={<InvoicePDF invoice={invoice} />} fileName="facture.pdf">
  {({ loading }) => (loading ? 'Chargement...' : 'Télécharger PDF')}
</PDFDownloadLink>
```

**Niveau requis** : 🟡 Intermédiaire  
**Temps d'apprentissage** : 3-4 jours

---

#### **i18next (Internationalisation)**
**Pourquoi ?**
- ✅ Support multi-langues (FR, EN, DE)
- ✅ Traduction dynamique des devises
- ✅ Formats dates localisés

```typescript
// ✅ BON EXEMPLE : Config i18next
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    fr: {
      translation: {
        'invoice.title': 'Facture',
        'invoice.amount': 'Montant',
        'invoice.create': 'Créer une facture',
      }
    },
    en: {
      translation: {
        'invoice.title': 'Invoice',
        'invoice.amount': 'Amount',
        'invoice.create': 'Create invoice',
      }
    }
  },
  lng: 'fr',
  fallbackLng: 'en',
})

// Utilisation dans composant
import { useTranslation } from 'react-i18next'

function InvoiceHeader() {
  const { t, i18n } = useTranslation()
  
  return (
    <div>
      <h1>{t('invoice.title')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  )
}
```

**Niveau requis** : 🟢 Débutant  
**Temps d'apprentissage** : 2-3 jours

---

#### **Resend (Envoi d'Emails)**
**Pourquoi ?**
- ✅ API simple (3 lignes de code)
- ✅ Templates React (comme les PDF)
- ✅ Analytics (taux d'ouverture)

```typescript
// ✅ BON EXEMPLE : Envoyer facture par email
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

async function sendInvoiceEmail(invoice: Invoice) {
  const { data, error } = await resend.emails.send({
    from: 'Factures <factures@mon-erp.com>',
    to: invoice.client.email,
    subject: `Facture ${invoice.number} - ${invoice.amount}€`,
    react: InvoiceEmailTemplate({ invoice }), // Composant React
  })
  
  if (error) throw error
  return data
}

// Template email (React component)
function InvoiceEmailTemplate({ invoice }: { invoice: Invoice }) {
  return (
    <div>
      <h1>Bonjour {invoice.client.name},</h1>
      <p>Voici votre facture :</p>
      <ul>
        <li>Numéro : {invoice.number}</li>
        <li>Montant : {invoice.amount}€</li>
        <li>Échéance : {invoice.due_date}</li>
      </ul>
      <a href={`https://mon-erp.com/invoices/${invoice.id}/pdf`}>
        Télécharger le PDF
      </a>
    </div>
  )
}
```

**Niveau requis** : 🟢 Débutant  
**Temps d'apprentissage** : 1 jour

---

### 🌐 HOSTING (Hébergement)

#### **Cloudflare Pages (Frontend Statique)**
**Pourquoi ?**
- ✅ CDN mondial (latence <50ms partout)
- ✅ Illimité & gratuit jusqu'à 500 req/sec
- ✅ HTTPS automatique
- ✅ Déploiement Git (push → live en 30s)

```bash
# Déploiement automatique
# 1. Connecter le repo GitHub
# 2. Cloudflare détecte Vite automatiquement
# 3. Build command : npm run build
# 4. Output directory : dist

# Variables d'environnement
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_ANTHROPIC_API_KEY=sk-ant-xxx
```

**Niveau requis** : 🟢 Débutant  
**Temps d'apprentissage** : 1 heure

---

## 🏗️ ARCHITECTURE & FLUX DE DONNÉES

### Schéma d'Architecture Complète

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR (Navigateur)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              CLOUDFLARE PAGES (Frontend)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + Vite + TypeScript                           │  │
│  │  ├─ TanStack Query (cache données)                   │  │
│  │  ├─ Zustand (état global)                            │  │
│  │  ├─ shadcn/ui (composants)                           │  │
│  │  └─ React Hook Form + Zod (formulaires)             │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL + RLS                                    │  │
│  │  ├─ Tables : invoices, clients, products            │  │
│  │  ├─ Policies : isolation multi-tenant               │  │
│  │  └─ pgvector : recherche sémantique IA              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Auth (Authentification)                             │  │
│  │  ├─ Email + Password                                 │  │
│  │  ├─ Google OAuth                                     │  │
│  │  └─ JWT tokens (httpOnly cookies)                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Storage (Fichiers)                                  │  │
│  │  ├─ company-logos/                                   │  │
│  │  ├─ invoice-pdfs/                                    │  │
│  │  └─ attachments/                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Edge Functions (API Serverless)                     │  │
│  │  ├─ send-invoice : envoyer email                    │  │
│  │  ├─ generate-report : créer rapports                │  │
│  │  └─ process-payment : webhook Stripe                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Realtime (WebSockets)                               │  │
│  │  └─ Notifications live des changements DB           │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  SERVICES EXTERNES                           │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Anthropic Claude │  │     Resend       │               │
│  │  (Chatbot IA)    │  │  (Emails)        │               │
│  └──────────────────┘  └──────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Flux de Données : Créer une Facture

```
1. USER clique "Créer facture"
   ↓
2. REACT affiche formulaire (React Hook Form)
   ↓
3. USER remplit champs + clique "Enregistrer"
   ↓
4. ZOD valide les données (invoiceSchema.parse)
   ✅ Valide → continue
   ❌ Invalide → affiche erreurs
   ↓
5. TANSTACK QUERY envoie mutation à Supabase
   ↓
6. SUPABASE vérifie RLS policy
   ✅ User autorisé → insert en DB
   ❌ Non autorisé → erreur 403
   ↓
7. POSTGRES insère la facture
   ↓
8. REALTIME broadcast le changement
   ↓
9. TANSTACK QUERY invalide le cache
   ↓
10. REACT re-render avec nouvelle facture
    ↓
11. (Optionnel) EDGE FUNCTION envoie email via Resend
    ↓
12. USER reçoit notification "Facture créée !"
```

---

## 🎯 DÉFIS HEBDOMADAIRES (12 Semaines)

### 🏆 FORMAT DES DÉFIS
Chaque défi suit ce format :
- **Objectif** : Compétence à acquérir
- **Tâche pratique** : Projet concret
- **Critères de validation** : Comment savoir si c'est réussi
- **Ressources** : Tutoriels/vidéos pour apprendre
- **Temps estimé** : Heures de travail

---

### 📅 SEMAINE 1 : Setup Projet + Git Basics

**🎯 Objectif** : Créer un projet Vite + comprendre Git

**📝 Tâche** :
1. Installer Node.js (v20+) + VS Code
2. Créer projet Vite avec TypeScript
3. Initialiser Git + faire 5 commits
4. Déployer sur GitHub

**✅ Validation** :
- [ ] `npm run dev` fonctionne
- [ ] Repo GitHub créé avec 5 commits
- [ ] README.md présent

**📚 Ressources** :
- 📺 [Vite en 100 secondes](https://www.youtube.com/watch?v=KCrXgy8qtjM) (Fireship)
- 📺 [Git & GitHub pour débutants](https://www.youtube.com/watch?v=RGOj5yH7evk) (freeCodeCamp - 1h)
- 📖 [Documentation Vite](https://vitejs.dev/guide/)

**⏱️ Temps** : 3-4 heures

---

### 📅 SEMAINE 2 : React + TypeScript Fondamentaux

**🎯 Objectif** : Maîtriser composants, props, state

**📝 Tâche** :
Créer 3 composants :
1. `<InvoiceCard />` : affiche une facture
2. `<InvoiceList />` : liste de factures
3. `<SearchBar />` : filtre les factures

**✅ Validation** :
- [ ] Composants typés avec TypeScript
- [ ] Props bien définies avec interfaces
- [ ] État local avec `useState`
- [ ] Pas d'erreur TypeScript

**📚 Ressources** :
- 📺 [React TypeScript Tutorial](https://www.youtube.com/watch?v=TPACABQTHvM) (Jack Herrington - 26min)
- 📺 [useState Hook Explained](https://www.youtube.com/watch?v=O6P86uwfdR0) (Web Dev Simplified - 13min)
- 📖 [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

**⏱️ Temps** : 5-6 heures

---

### 📅 SEMAINE 3 : Tailwind CSS + shadcn/ui

**🎯 Objectif** : Styliser l'application professionnellement

**📝 Tâche** :
1. Installer Tailwind CSS
2. Installer shadcn/ui (Button, Card, Input)
3. Recréer les 3 composants avec shadcn/ui
4. Implémenter dark mode

**✅ Validation** :
- [ ] Design cohérent et professionnel
- [ ] Dark mode fonctionne (toggle)
- [ ] Responsive (mobile + desktop)

**📚 Ressources** :
- 📺 [Tailwind CSS Crash Course](https://www.youtube.com/watch?v=UBOj6rqRUME) (Traversy Media - 1h30)
- 📺 [shadcn/ui Setup](https://www.youtube.com/watch?v=xMqekNYPVo8) (CodeWithAntonio - 15min)
- 🌐 [shadcn/ui Documentation](https://ui.shadcn.com/)

**⏱️ Temps** : 4-5 heures

---

### 📅 SEMAINE 4 : Supabase Setup + Auth

**🎯 Objectif** : Configurer base de données + login

**📝 Tâche** :
1. Créer projet Supabase
2. Créer table `invoices` avec RLS
3. Implémenter login/signup
4. Protéger les routes (redirect si non-auth)

**✅ Validation** :
- [ ] Login avec email fonctionne
- [ ] Utilisateur non-connecté → redirigé vers /login
- [ ] RLS empêche accès cross-user

**📚 Ressources** :
- 📺 [Supabase Crash Course](https://www.youtube.com/watch?v=7uKQBl9uZ00) (Traversy Media - 1h)
- 📺 [Row Level Security Explained](https://www.youtube.com/watch?v=Ow_Uzedfohk) (Supabase - 10min)
- 📖 [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

**⏱️ Temps** : 6-8 heures

---

### 📅 SEMAINE 5 : TanStack Query (React Query)

**🎯 Objectif** : Gérer le fetching de données avec cache

**📝 Tâche** :
1. Installer TanStack Query
2. Créer hook `useInvoices()` pour charger factures
3. Implémenter pagination (10/page)
4. Afficher loading skeleton

**✅ Validation** :
- [ ] Factures chargées depuis Supabase
- [ ] Cache actif (pas de re-fetch inutile)
- [ ] Skeleton pendant chargement
- [ ] Pagination fonctionne

**📚 Ressources** :
- 📺 [TanStack Query Tutorial](https://www.youtube.com/watch?v=8K1N3fE-cDs) (Cosden Solutions - 30min)
- 📺 [Pagination with React Query](https://www.youtube.com/watch?v=WKfVjQUa6nE) (Coding in Public - 18min)
- 📖 [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)

**⏱️ Temps** : 5-6 heures

---

### 📅 SEMAINE 6 : Formulaires avec React Hook Form + Zod

**🎯 Objectif** : Créer formulaires avec validation robuste

**📝 Tâche** :
1. Créer schema Zod pour facture
2. Formulaire création facture avec React Hook Form
3. Afficher erreurs de validation
4. Soumettre à Supabase avec TanStack Query mutation

**✅ Validation** :
- [ ] Validation Zod bloque données invalides
- [ ] Messages d'erreur clairs
- [ ] Formulaire s'efface après soumission
- [ ] Liste de factures se met à jour

**📚 Ressources** :
- 📺 [React Hook Form + Zod](https://www.youtube.com/watch?v=u6PQ5xZAv7Q) (Cosden Solutions - 22min)
- 📺 [Form Validation Tutorial](https://www.youtube.com/watch?v=MxqHHsLJ8d8) (ByteGrad - 35min)
- 📖 [Zod Documentation](https://zod.dev/)

**⏱️ Temps** : 6-7 heures

---

### 📅 SEMAINE 7 : Zustand (État Global)

**🎯 Objectif** : Gérer l'état global (user, filters, preferences)

**📝 Tâche** :
1. Créer store Zustand pour filtres
2. Implémenter filtres (statut, date range)
3. Persister les filtres dans localStorage
4. Synchroniser avec URL (query params)

**✅ Validation** :
- [ ] Filtres fonctionnent sur la liste
- [ ] Filtres persistent après refresh
- [ ] URL reflète les filtres (`?status=paid`)

**📚 Ressources** :
- 📺 [Zustand Tutorial](https://www.youtube.com/watch?v=AYO4qHAnLQI) (Cosden Solutions - 20min)
- 📺 [Persist State with Zustand](https://www.youtube.com/watch?v=KCr-0RO7Eb8) (Jack Herrington - 12min)
- 📖 [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)

**⏱️ Temps** : 4-5 heures

---

### 📅 SEMAINE 8 : Génération PDF avec @react-pdf/renderer

**🎯 Objectif** : Créer des factures PDF téléchargeables

**📝 Tâche** :
1. Installer @react-pdf/renderer
2. Créer template PDF facture
3. Ajouter bouton "Télécharger PDF"
4. Styliser le PDF (logo, tableau, totaux)

**✅ Validation** :
- [ ] PDF se télécharge correctement
- [ ] Design professionnel (ressemble à vraie facture)
- [ ] Multi-pages si >10 items
- [ ] Logo de l'entreprise inclus

**📚 Ressources** :
- 📺 [@react-pdf Tutorial](https://www.youtube.com/watch?v=QlF8wZw77H4) (Coding With Adam - 25min)
- 📺 [Invoice PDF Generator](https://www.youtube.com/watch?v=Xdd0MeJLaP8) (Code Commerce - 40min)
- 📖 [@react-pdf Docs](https://react-pdf.org/)

**⏱️ Temps** : 6-8 heures

---

### 📅 SEMAINE 9 : Realtime Supabase + Notifications

**🎯 Objectif** : Implémenter temps réel et notifications toast

**📝 Tâche** :
1. Configurer Supabase Realtime
2. Écouter INSERT/UPDATE sur invoices
3. Afficher notifications toast (Sonner)
4. Tester avec 2 navigateurs ouverts

**✅ Validation** :
- [ ] Nouvelle facture → notification toast
- [ ] Facture payée → notification "💰 Payé"
- [ ] Changements visibles dans tous les onglets

**📚 Ressources** :
- 📺 [Supabase Realtime Tutorial](https://www.youtube.com/watch?v=CGZDSDdWmHY) (Supabase - 15min)
- 📺 [Toast Notifications with Sonner](https://www.youtube.com/watch?v=8I1F7nLI8pI) (Coding in Flow - 8min)
- 📖 [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)

**⏱️ Temps** : 5-6 heures

---

### 📅 SEMAINE 10 : i18next (Internationalisation)

**🎯 Objectif** : Support multi-langues (FR/EN/DE)

**📝 Tâche** :
1. Installer i18next
2. Créer fichiers de traduction (FR/EN)
3. Traduire toute l'interface
4. Ajouter sélecteur de langue

**✅ Validation** :
- [ ] Toggle FR ↔ EN fonctionne
- [ ] Toutes les strings sont traduites
- [ ] Langue persiste après refresh
- [ ] Formats dates localisés

**📚 Ressources** :
- 📺 [i18next Tutorial](https://www.youtube.com/watch?v=SA_9i4TtxLQ) (Coding With Adam - 30min)
- 📺 [React i18n Complete Guide](https://www.youtube.com/watch?v=VyQy5nh0QeA) (Laith Academy - 45min)
- 📖 [i18next Docs](https://www.i18next.com/)

**⏱️ Temps** : 6-7 heures

---

### 📅 SEMAINE 11 : Edge Functions + Resend (Emails)

**🎯 Objectif** : Envoyer factures par email automatiquement

**📝 Tâche** :
1. Créer Edge Function `send-invoice`
2. Intégrer Resend API
3. Créer template email React
4. Ajouter bouton "Envoyer par email"

**✅ Validation** :
- [ ] Email reçu avec PDF en pièce jointe
- [ ] Template professionnel (HTML)
- [ ] Logs Edge Function OK

**📚 Ressources** :
- 📺 [Supabase Edge Functions](https://www.youtube.com/watch?v=rzglqRdZUQE) (Supabase - 12min)
- 📺 [Resend Tutorial](https://www.youtube.com/watch?v=S9KSVgYzOA0) (Web Dev Simplified - 15min)
- 📖 [Resend Docs](https://resend.com/docs/introduction)

**⏱️ Temps** : 5-6 heures

---

### 📅 SEMAINE 12 : Claude AI + pgvector (Recherche Sémantique)

**🎯 Objectif** : Ajouter chatbot IA + recherche intelligente

**📝 Tâche** :
1. Installer SDK Anthropic
2. Créer chatbot assistant comptable
3. Installer pgvector dans Supabase
4. Implémenter recherche sémantique factures

**✅ Validation** :
- [ ] Chatbot répond aux questions comptables
- [ ] Recherche "factures consulting janvier" trouve résultats pertinents
- [ ] Embeddings générés et stockés en DB

**📚 Ressources** :
- 📺 [Claude API Tutorial](https://www.youtube.com/watch?v=CX7JvN5a1b8) (AI Jason - 20min)
- 📺 [pgvector Explained](https://www.youtube.com/watch?v=Lbv_8rjg_Qw) (Supabase - 15min)
- 📖 [Anthropic SDK Docs](https://docs.anthropic.com/en/api/getting-started)

**⏱️ Temps** : 8-10 heures (Avancé)

---

## 💡 ASTUCES NINJA PAR TECHNOLOGIE

### ⚛️ React + TypeScript

#### **Astuce #1 : Typer les événements correctement**
```typescript
// ❌ MAUVAIS
function handleClick(e: any) { }

// ✅ BON
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  console.log(e.currentTarget.value)
}

function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value)
}
```

#### **Astuce #2 : Utiliser les types génériques pour composants réutilisables**
```typescript
// ✅ Composant DataTable générique
interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
}

function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <table>
      {data.map(row => (
        <tr>{/* ... */}</tr>
      ))}
    </table>
  )
}

// Utilisation
<DataTable<Invoice> data={invoices} columns={invoiceColumns} />
```

#### **Astuce #3 : useMemo pour optimiser les calculs**
```typescript
// ✅ BON : Recalculer uniquement si invoices change
function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const totalAmount = useMemo(() => {
    return invoices.reduce((sum, inv) => sum + inv.amount, 0)
  }, [invoices]) // ← Dependency array
  
  return <div>Total : {totalAmount}€</div>
}
```

---

### 🎨 Tailwind CSS

#### **Astuce #1 : Utiliser @apply pour éviter la répétition**
```css
/* ✅ globals.css */
@layer components {
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
  }
}
```

#### **Astuce #2 : Responsive design avec breakpoints**
```jsx
// ✅ Mobile-first approach
<div className="
  grid 
  grid-cols-1     /* 1 colonne sur mobile */
  md:grid-cols-2  /* 2 colonnes sur tablette */
  lg:grid-cols-3  /* 3 colonnes sur desktop */
">
  {invoices.map(inv => <Card key={inv.id} />)}
</div>
```

#### **Astuce #3 : Dark mode avec class strategy**
```jsx
// tailwind.config.js
module.exports = {
  darkMode: 'class', // ← Active dark mode
}

// Composant
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Contenu
</div>
```

---

### 🗄️ Supabase

#### **Astuce #1 : Utiliser les types générés**
```typescript
// ✅ Générer types depuis le schéma DB
// Terminal : npx supabase gen types typescript --local > lib/database.types.ts

import { Database } from '@/lib/database.types'

type Invoice = Database['public']['Tables']['invoices']['Row']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
```

#### **Astuce #2 : Transactions avec .maybeSingle()**
```typescript
// ✅ BON : Gérer le cas "aucun résultat"
const { data, error } = await supabase
  .from('invoices')
  .select('*')
  .eq('id', invoiceId)
  .maybeSingle() // ← Renvoie null si aucun résultat (pas d'erreur)

if (!data) {
  return { error: 'Facture non trouvée' }
}
```

#### **Astuce #3 : RLS avec fonctions SQL**
```sql
-- ✅ Créer fonction réutilisable
CREATE FUNCTION auth.user_company_id() 
RETURNS UUID AS $$
  SELECT company_id 
  FROM profiles 
  WHERE id = auth.uid()
$$ LANGUAGE SQL STABLE;

-- Utiliser dans policies
CREATE POLICY "user_access" ON invoices
USING (company_id = auth.user_company_id());
```

---

### 📊 TanStack Query

#### **Astuce #1 : Prefetching pour UX instantanée**
```typescript
// ✅ Prefetch au hover
function InvoiceLink({ invoiceId }: { invoiceId: string }) {
  const queryClient = useQueryClient()
  
  const prefetchInvoice = () => {
    queryClient.prefetchQuery({
      queryKey: ['invoice', invoiceId],
      queryFn: () => fetchInvoice(invoiceId),
    })
  }
  
  return (
    <Link 
      to={`/invoices/${invoiceId}`}
      onMouseEnter={prefetchInvoice} // ← Charge avant le clic
    >
      Voir facture
    </Link>
  )
}
```

#### **Astuce #2 : Optimistic Updates**
```typescript
// ✅ UI instantanée pendant la mutation
const mutation = useMutation({
  mutationFn: updateInvoice,
  onMutate: async (newData) => {
    // Annuler requêtes en cours
    await queryClient.cancelQueries(['invoices'])
    
    // Snapshot de l'état actuel
    const previous = queryClient.getQueryData(['invoices'])
    
    // Mise à jour optimistic
    queryClient.setQueryData(['invoices'], (old: Invoice[]) => 
      old.map(inv => inv.id === newData.id ? newData : inv)
    )
    
    return { previous }
  },
  onError: (err, newData, context) => {
    // Rollback en cas d'erreur
    queryClient.setQueryData(['invoices'], context.previous)
  },
})
```

---

### 🤖 Anthropic Claude

#### **Astuce #1 : Streaming pour réponses progressives**
```typescript
// ✅ Afficher la réponse mot par mot
async function streamChatResponse(question: string) {
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: question }],
  })
  
  let fullResponse = ''
  
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      fullResponse += chunk.delta.text
      updateUI(fullResponse) // ← Update progressif
    }
  }
}
```

#### **Astuce #2 : Caching pour économiser tokens**
```typescript
// ✅ Cache les instructions système
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: 'Tu es un expert-comptable...', // ← Prompt long
      cache_control: { type: 'ephemeral' }, // ← Cache 5min
    }
  ],
  messages: [{ role: 'user', content: question }],
})
```

---

## 📚 RESSOURCES D'APPRENTISSAGE CATÉGORISÉES

### 🟢 NIVEAU DÉBUTANT (0-3 mois d'expérience)

#### **Fondamentaux Web**
- 📺 [HTML/CSS Crash Course](https://www.youtube.com/watch?v=UB1O30fR-EE) (Traversy Media - 2h)
- 📺 [JavaScript Basics](https://www.youtube.com/watch?v=W6NZfCO5SIk) (Mosh - 1h)
- 📖 [MDN Web Docs](https://developer.mozilla.org/en-US/) - Référence complète

#### **Git & GitHub**
- 📺 [Git Tutorial for Beginners](https://www.youtube.com/watch?v=8JJ101D3knE) (Mosh - 1h)
- 🌐 [Learn Git Branching](https://learngitbranching.js.org/) - Interactif
- 📖 [GitHub Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

#### **TypeScript**
- 📺 [TypeScript for Beginners](https://www.youtube.com/watch?v=d56mG7DezGs) (Mosh - 1h30)
- 📖 [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- 🎮 [TypeScript Exercises](https://www.typescriptlang.org/play)

#### **React**
- 📺 [React Full Course](https://www.youtube.com/watch?v=bMknfKXIFA8) (freeCodeCamp - 11h)
- 📖 [React Dev Docs](https://react.dev/learn) - Nouvelle doc officielle
- 🌐 [React Tutorial](https://react-tutorial.app/) - Interactif

---

### 🟡 NIVEAU INTERMÉDIAIRE (3-12 mois d'expérience)

#### **Architecture & Patterns**
- 📺 [Clean Code JavaScript](https://www.youtube.com/watch?v=RR_dQ4sBSBM) (freeCodeCamp - 3h)
- 📖 [Patterns.dev](https://www.patterns.dev/) - Design patterns React
- 📺 [SOLID Principles](https://www.youtube.com/watch?v=pTB30aXS77U) (Web Dev Simplified - 45min)

#### **State Management**
- 📺 [Zustand vs Redux](https://www.youtube.com/watch?v=KCr-0RO7Eb8) (Jack Herrington - 25min)
- 📺 [TanStack Query Deep Dive](https://www.youtube.com/watch?v=r8Dg0KVnfMA) (Theo - 1h)
- 📖 [State Management Guide](https://kentcdodds.com/blog/application-state-management-with-react)

#### **Backend avec Supabase**
- 📺 [Supabase Full Course](https://www.youtube.com/watch?v=dU7GwCOgvNY) (freeCodeCamp - 5h)
- 📺 [PostgreSQL Tutorial](https://www.youtube.com/watch?v=qw--VYLpxG4) (freeCodeCamp - 4h)
- 📖 [SQL Cheat Sheet](https://www.sqltutorial.org/sql-cheat-sheet/)

#### **Testing**
- 📺 [Vitest Tutorial](https://www.youtube.com/watch?v=7f-71kYhK00) (Coding in Public - 30min)
- 📺 [Playwright E2E Testing](https://www.youtube.com/watch?v=wawbt1cATsk) (Academind - 1h)
- 📖 [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)

---

### 🔴 NIVEAU AVANCÉ (12+ mois d'expérience)

#### **Performance Optimization**
- 📺 [React Performance](https://www.youtube.com/watch?v=00Q8H-qRBdo) (Jack Herrington - 1h)
- 📺 [Web Vitals Explained](https://www.youtube.com/watch?v=4jtzKBU62yI) (Google Chrome - 30min)
- 📖 [Web.dev Performance](https://web.dev/explore/performance)

#### **AI & Machine Learning**
- 📺 [Vector Databases Explained](https://www.youtube.com/watch?v=dN0lsF2cvm4) (Fireship - 10min)
- 📺 [RAG Tutorial](https://www.youtube.com/watch?v=wd7TZ4w1mSw) (AI Jason - 1h)
- 📖 [Anthropic Prompt Engineering](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)

#### **Architecture Distribuée**
- 📺 [Microservices vs Monolith](https://www.youtube.com/watch?v=qYhRvH9tJKw) (Fireship - 10min)
- 📺 [Edge Computing Explained](https://www.youtube.com/watch?v=yOP5-3_WFus) (IBM Technology - 8min)
- 📖 [System Design Primer](https://github.com/donnemartin/system-design-primer)

---

### 🎓 COURS COMPLETS & CERTIFICATIONS

#### **Gratuit**
- 🎓 [freeCodeCamp](https://www.freecodecamp.org/) - Full Stack Certification (300h)
- 🎓 [The Odin Project](https://www.theodinproject.com/) - Full Stack (1000h)
- 🎓 [CS50](https://cs50.harvard.edu/) - Computer Science de Harvard

#### **Payant (Investissement recommandé)**
- 💰 [Frontend Masters](https://frontendmasters.com/) - 39$/mois (meilleurs cours React/TypeScript)
- 💰 [Egghead.io](https://egghead.io/) - 25$/mois (tutoriels courts et pratiques)
- 💰 [Total TypeScript](https://www.totaltypescript.com/) - 300$ (Matt Pocock)

---

### 📱 CHAÎNES YOUTUBE ESSENTIELLES

#### **Tutoriels Pratiques**
- 🎬 [Fireship](https://www.youtube.com/@Fireship) - Tutoriels 100 secondes + projets
- 🎬 [Theo - t3.gg](https://www.youtube.com/@t3dotgg) - Full Stack best practices
- 🎬 [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified) - Concepts expliqués simplement
- 🎬 [Jack Herrington](https://www.youtube.com/@jherr) - TypeScript & React avancé

#### **En Français**
- 🎬 [Grafikart](https://www.youtube.com/@grafikart) - Tutoriels web FR
- 🎬 [Le Designer du Web](https://www.youtube.com/@LeDesignerduWeb) - Frontend FR
- 🎬 [From Scratch](fromscratch.podia.com) - Formations complètes FR

---

### 🌐 SITES & OUTILS INTERACTIFS

#### **Apprendre en Codant**
- 🎮 [TypeScript Playground](https://www.typescriptlang.org/play)
- 🎮 [CodeSandbox](https://codesandbox.io/) - IDE en ligne
- 🎮 [StackBlitz](https://stackblitz.com/) - Projets full-stack en ligne

#### **Challenges & Pratique**
- 🏆 [Frontend Mentor](https://www.frontendmentor.io/) - Projets UI réalistes
- 🏆 [Codewars](https://www.codewars.com/) - Challenges JavaScript/TypeScript
- 🏆 [LeetCode](https://leetcode.com/) - Algorithmes (pour entretiens)

#### **Documentation & Références**
- 📚 [DevDocs](https://devdocs.io/) - Toutes les docs au même endroit
- 📚 [Can I Use](https://caniuse.com/) - Compatibilité navigateurs
- 📚 [Roadmap.sh](https://roadmap.sh/) - Parcours d'apprentissage visuels

---

## ❓ FAQ & TROUBLESHOOTING

### 🔧 Problèmes Fréquents

#### **Q : "Module not found" après npm install**
```bash
# Solution 1 : Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Solution 2 : Vérifier que le package est bien installé
npm list @supabase/supabase-js

# Solution 3 : Redémarrer le serveur dev
# Ctrl+C puis npm run dev
```

---

#### **Q : Erreurs TypeScript "Cannot find name"**
```typescript
// ❌ MAUVAIS
const user = await supabase.auth.getUser()

// ✅ BON : Importer les types
import { User } from '@supabase/supabase-js'
const { data: { user } }: { data: { user: User } } = await supabase.auth.getUser()
```

---

#### **Q : CORS errors avec Supabase**
```typescript
// Vérifier que l'URL Supabase est correcte
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, // ← Doit commencer par https://
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Vérifier .env.local
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

---

#### **Q : RLS bloque tout, même les requêtes valides**
```sql
-- Debug RLS : Désactiver temporairement
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

-- Tester si la requête fonctionne
SELECT * FROM invoices;

-- Si ça fonctionne, le problème vient de la policy
-- Réactiver RLS
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Débugger la policy
SELECT * FROM invoices WHERE company_id = auth.user_company_id();
-- Si erreur ici, la fonction auth.user_company_id() est le problème
```

---

#### **Q : Tailwind classes ne s'appliquent pas**
```javascript
// Vérifier tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ← Doit inclure tous les fichiers
  ],
}

// Si les classes disparaissent en production :
// → Désactiver PurgeCSS ou ajouter safelist
safelist: ['bg-blue-500', 'text-red-600'],
```

---

#### **Q : React Hook Form ne détecte pas les changements**
```typescript
// ❌ MAUVAIS
<input name="amount" />

// ✅ BON : Utiliser register
<input {...register('amount')} />

// Pour les valeurs par défaut
const { register } = useForm({
  defaultValues: {
    amount: invoice?.amount || 0,
  }
})
```

---

#### **Q : Mutation TanStack Query ne rafraîchit pas l'UI**
```typescript
// ✅ Invalider le cache après mutation
const mutation = useMutation({
  mutationFn: createInvoice,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] })
    // ↑ Force le re-fetch des invoices
  },
})
```

---

### 💡 Bonnes Pratiques

#### **1. Structure de Dossiers**
```
src/
├── components/        # Composants réutilisables
│   ├── ui/           # shadcn/ui
│   └── features/     # Composants métier
├── hooks/            # Custom hooks
├── lib/              # Utils & configs
├── pages/            # Routes/pages
├── schemas/          # Zod schemas
└── types/            # TypeScript types
```

#### **2. Naming Conventions**
```typescript
// ✅ BON
// - Composants : PascalCase
const InvoiceCard = () => {}

// - Fonctions : camelCase
const calculateTotal = () => {}

// - Constants : UPPER_SNAKE_CASE
const API_BASE_URL = 'https://...'

// - Types : PascalCase
type InvoiceStatus = 'draft' | 'sent' | 'paid'
```

#### **3. Git Commit Messages**
```bash
# ✅ BON : Convention Conventional Commits
feat: add invoice PDF export
fix: resolve RLS policy bug
docs: update README with setup instructions
refactor: extract useInvoices hook
test: add E2E tests for invoice creation

# ❌ MAUVAIS
git commit -m "fix bug"
git commit -m "update"
```

---

## 🎯 ROADMAP DE PROGRESSION

### Mois 1-3 : Fondations
- [ ] HTML/CSS/JavaScript maîtrisés
- [ ] Git & GitHub utilisés quotidiennement
- [ ] React + TypeScript (composants, hooks, props)
- [ ] Premier projet déployé sur Cloudflare Pages

### Mois 4-6 : Intermédiaire
- [ ] TanStack Query pour data fetching
- [ ] Zustand pour état global
- [ ] Supabase (Auth + DB + RLS)
- [ ] Formulaires avec React Hook Form + Zod

### Mois 7-9 : Avancé
- [ ] Tests E2E avec Playwright
- [ ] CI/CD automatisé
- [ ] Performance optimization (Lighthouse >90)
- [ ] i18next (multi-langues)

### Mois 10-12 : Expert
- [ ] AI integration (Claude API)
- [ ] pgvector (recherche sémantique)
- [ ] Architecture microservices
- [ ] Contribution open-source

---

## 🏆 PROJET FINAL : ERP Complet

À la fin des 12 semaines, vous aurez :

✅ ERP fonctionnel avec :
- Authentification multi-utilisateurs
- Gestion factures (CRUD complet)
- Export PDF professionnel
- Envoi emails automatique
- Dashboard temps réel
- Multi-langues (FR/EN)
- Chatbot IA assistant comptable
- Recherche sémantique

✅ Compétences acquises :
- Full Stack TypeScript
- Architecture moderne (React + Supabase)
- Déploiement production (Cloudflare)
- Tests automatisés
- Intégration IA

✅ Portfolio :
- Projet GitHub public
- Site live accessible
- Documentation complète

---

## 🚀 NEXT STEPS

**Aujourd'hui** :
1. ⭐ Bookmark ce guide
2. 📅 Bloquer 1-2h/jour dans votre agenda
3. 🎯 Commencer Défi Semaine 1

**Cette semaine** :
1. Setup environnement dev (VS Code, Node.js, Git)
2. Créer premier projet Vite
3. Déployer sur GitHub

**Ce mois** :
1. Finir défis Semaines 1-4
2. Avoir un projet fonctionnel déployé
3. Rejoindre communautés Discord (React, Supabase)

---

*"Le seul moyen de faire du bon travail est d'aimer ce que vous faites."* - Steve Jobs

**Let's build! 🚀**
