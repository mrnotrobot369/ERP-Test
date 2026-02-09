# 🏗️ Architecture Technique - GTBP ERP

## 📋 Vue d'Ensemble

Architecture moderne basée sur React + TypeScript avec Supabase comme backend.

## 🎯 Principes d'Architecture

### 1. **Séparation des Responsabilités**
- **Frontend**: React + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Zustand (local) + TanStack Query (server)
- **UI**: shadcn/ui + Tailwind CSS

### 2. **Type Safety**
- TypeScript strict mode activé
- Types générés depuis Supabase
- Validation Zod pour les formulaires
- Props typées dans tous les composants

### 3. **Performance**
- Code splitting avec React.lazy
- Cache intelligent avec TanStack Query
- Optimisation du bundle avec Vite
- Lazy loading des composants

## 🏛️ Structure des Composants

### Architecture en Couches

```
src/
├── components/
│   ├── ui/              # Composants UI de base (shadcn/ui)
│   ├── layout/          # Composants de layout
│   └── features/        # Composants métier
│       ├── auth/        # Authentification
│       ├── clients/     # Module clients
│       ├── invoices/    # Module factures
│       └── products/    # Module produits
├── pages/               # Pages de l'application
├── hooks/               # Hooks personnalisés
├── lib/                 # Utilitaires et configuration
├── stores/              # State management local
└── types/               # Définitions de types
```

### Hiérarchie des Composants

```
App
├── Layout
│   ├── Sidebar (Navigation)
│   ├── Header (User actions)
│   └── Main (Page content)
└── Routes
    ├── ProtectedRoute
    │   ├── Dashboard
    │   ├── Clients
    │   ├── Invoices
    │   └── Products
    └── Public
        ├── Login
        └── Signup
```

## 🗄️ Architecture des Données

### Supabase Schema

```sql
-- Tables principales
users (auth.users)
clients
invoices
invoice_items
products

-- Relations
clients.invoices (1:N)
invoices.invoice_items (1:N)
products.invoice_items (1:N)
```

### Types TypeScript

```typescript
// Types générés depuis Supabase
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: ClientRow
        Insert: ClientInsert
        Update: ClientUpdate
      }
      // ... autres tables
    }
  }
}

// Types métier
export interface Client {
  id: string
  name: string
  email: string
  // ...
}
```

## 🔄 State Management

### 1. **Zustand** (State Local)
```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}
```

### 2. **TanStack Query** (State Serveur)
```typescript
// hooks/useClients.ts
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: () => supabase.from('clients').select('*')
  })
}
```

## 🎨 Architecture UI

### Design System

```typescript
// Base: shadcn/ui + Tailwind CSS
// Thème: Light/Dark (prévu)
// Responsive: Mobile-first
// Accessibilité: WCAG 2.1 AA
```

### Composants UI

```typescript
// components/ui/
├── button.tsx          # Bouton réutilisable
├── card.tsx            # Carte générique
├── input.tsx           # Champ de saisie
├── select.tsx          # Sélecteur
├── dialog.tsx          # Modal
├── dropdown-menu.tsx   # Menu déroulant
└── toast.tsx           # Notifications
```

### Patterns de Composants

#### 1. **Compound Components**
```typescript
// ProductCard avec actions intégrées
<ProductCard product={product}>
  <ProductCard.Actions>
    <ProductCard.ActionEdit />
    <ProductCard.ActionDelete />
  </ProductCard.Actions>
</ProductCard>
```

#### 2. **Render Props**
```typescript
// DataTable flexible
<DataTable
  data={products}
  columns={columns}
  renderActions={(item) => <Actions item={item} />}
/>
```

#### 3. **Custom Hooks**
```typescript
// Hook pour les formulaires
export function useProductForm(initialData?: Product) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
  })
  
  return { form, submit: handleSubmit }
}
```

## 🔌 Architecture API

### Hooks TanStack Query

```typescript
// hooks/use-products.ts
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000  // 10 minutes
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}
```

### Validation avec Zod

```typescript
// lib/validations/product.ts
export const productSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  cost_price: z.number().min(0, "Prix de coût positif"),
  selling_price: z.number().min(0, "Prix de vente positif")
}).refine(
  (data) => data.selling_price >= data.cost_price,
  "Le prix de vente doit être supérieur au prix de coût"
)
```

## 🛡️ Sécurité

### 1. **Authentification Supabase**
```typescript
// lib/supabase.ts
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
)
```

### 2. **Row Level Security (RLS)**
```sql
-- Politiques RLS
CREATE POLICY "Users can view their own data" 
ON public.clients 
FOR SELECT 
USING (auth.uid() = user_id);
```

### 3. **Validation Côté Client**
```typescript
// Validation des entrées utilisateur
const validatedData = productSchema.parse(formData)
```

## 🚀 Performance

### 1. **Code Splitting**
```typescript
// Lazy loading des pages
const Products = lazy(() => import('./pages/Products'))
const Invoices = lazy(() => import('./pages/Invoices'))
```

### 2. **Optimisation du Bundle**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select']
        }
      }
    }
  }
})
```

### 3. **Cache Strategy**
```typescript
// TanStack Query cache
useQuery({
  queryKey: ['products'],
  staleTime: 5 * 60 * 1000,  // 5 minutes
  cacheTime: 10 * 60 * 1000  // 10 minutes
})
```

## 🧪 Tests (Prévu)

### Architecture de Test

```typescript
// Tests unitaires
describe('ProductCard', () => {
  it('should display product name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument()
  })
})

// Tests d'intégration
describe('Product Creation', () => {
  it('should create product successfully', async () => {
    const result = await createProduct(mockProductData)
    expect(result).toBeDefined()
  })
})
```

## 📦 Déploiement

### Architecture de Déploiement

```
Development (local)
├── Vite dev server
├── Supabase local
└── Hot reload

Staging (preview)
├── Vercel/Netlify preview
├── Supabase staging
└── Automated tests

Production (main)
├── Vercel/Netlify production
├── Supabase production
└── CI/CD pipeline
```

## 🔮 Évolution Future

### Prochaines Améliorations

1. **Micro-frontends**: Modules indépendants
2. **Server Components**: React 18+ features
3. **PWA**: Application mobile offline
4. **Real-time**: WebSocket pour les notifications
5. **GraphQL**: Alternative à REST API

### Scalabilité

```typescript
// Architecture modulaire prévue
src/
├── modules/
│   ├── auth/           # Module authentification
│   ├── crm/            # Module CRM
│   ├── inventory/      # Module inventaire
│   └── accounting/     # Module comptabilité
└── shared/             # Composants partagés
```

---

**Architecture conçue pour évoluer et être maintenable. 🏗️**
