# 📚 API Reference - GTBP ERP

## 📋 Vue d'Ensemble

Documentation complète des hooks, types et validations utilisés dans l'application.

## 🪝 Hooks TanStack Query

### Authentification

#### `useAuthStore`
Hook pour la gestion de l'authentification avec Zustand.

```typescript
interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Usage
const { user, loading, signIn, signOut } = useAuthStore()
```

### Clients

#### `useClients`
Récupère la liste des clients.

```typescript
interface UseClientsOptions {
  search?: string
  isActive?: boolean
}

// Usage
const { data: clients, isLoading, error } = useClients({
  search: searchTerm,
  isActive: true
})
```

#### `useClient`
Récupère un client spécifique.

```typescript
// Usage
const { data: client, isLoading, error } = useClient(clientId)
```

#### `useCreateClient`
Crée un nouveau client.

```typescript
interface ClientCreateData {
  name: string
  email: string
  phone?: string
  address?: string
}

// Usage
const createClient = useCreateClient()
await createClient.mutateAsync(clientData)
```

#### `useUpdateClient`
Met à jour un client existant.

```typescript
interface ClientUpdateData {
  id: string
  data: Partial<ClientCreateData>
}

// Usage
const updateClient = useUpdateClient()
await updateClient.mutateAsync({ id, data: updatedData })
```

#### `useDeleteClient`
Supprime un client.

```typescript
// Usage
const deleteClient = useDeleteClient()
await deleteClient.mutateAsync(clientId)
```

### Factures

#### `useFactures`
Récupère la liste des factures.

```typescript
interface UseFacturesOptions {
  clientId?: string
  status?: 'draft' | 'sent' | 'paid' | 'overdue'
  search?: string
}

// Usage
const { data: factures, isLoading, error } = useFactures({
  status: 'sent',
  search: searchTerm
})
```

#### `useFacture`
Récupère une facture spécifique.

```typescript
// Usage
const { data: facture, isLoading, error } = useFacture(factureId)
```

#### `useCreateFacture`
Crée une nouvelle facture.

```typescript
interface FactureCreateData {
  clientId: string
  items: FactureItem[]
  dueDate: string
  notes?: string
}

// Usage
const createFacture = useCreateFacture()
await createFacture.mutateAsync(factureData)
```

### Produits

#### `useProducts`
Récupère la liste des produits.

```typescript
interface UseProductsOptions {
  search?: string
  category?: string
  brand?: string
  is_active?: boolean
  min_price?: number
  max_price?: number
  low_stock?: boolean
}

// Usage
const { data: products, isLoading, error } = useProducts({
  search: searchTerm,
  category: 'Électronique',
  low_stock: true
})
```

#### `useProduct`
Récupère un produit spécifique.

```typescript
// Usage
const { data: product, isLoading, error } = useProduct(productId)
```

#### `useCreateProduct`
Crée un nouveau produit.

```typescript
interface ProductCreateData {
  name: string
  description?: string
  reference?: string
  sku?: string
  cost_price: number
  selling_price: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level: number
  category?: string
  brand?: string
  weight?: number
  dimensions?: string
  is_active?: boolean
}

// Usage
const createProduct = useCreateProduct()
await createProduct.mutateAsync(productData)
```

#### `useUpdateProduct`
Met à jour un produit existant.

```typescript
interface ProductUpdateData {
  id: string
  data: Partial<ProductCreateData>
}

// Usage
const updateProduct = useUpdateProduct()
await updateProduct.mutateAsync({ id, data: updatedData })
```

#### `useDeleteProduct`
Supprime un produit.

```typescript
// Usage
const deleteProduct = useDeleteProduct()
await deleteProduct.mutateAsync(productId)
```

#### `useUpdateProductStock`
Met à jour le stock d'un produit.

```typescript
interface StockUpdateData {
  id: string
  quantity: number
  operation: 'add' | 'subtract' | 'set'
}

// Usage
const updateStock = useUpdateProductStock()
await updateStock.mutateAsync({
  id: productId,
  quantity: 10,
  operation: 'add'
})
```

#### `useProductCategories`
Récupère les catégories de produits uniques.

```typescript
// Usage
const { data: categories, isLoading } = useProductCategories()
```

#### `useProductBrands`
Récupère les marques de produits uniques.

```typescript
// Usage
const { data: brands, isLoading } = useProductBrands()
```

#### `useLowStockProducts`
Récupère les produits avec stock faible.

```typescript
// Usage
const { data: lowStockProducts, isLoading } = useLowStockProducts()
```

### Dashboard

#### `useDashboardStats`
Récupère les statistiques du dashboard.

```typescript
interface DashboardStats {
  clientsCount: number
  invoicesThisMonth: number
  pendingRevenue: number
  productsCount: number
  lowStockCount: number
}

// Usage
const { data: stats, isLoading, error } = useDashboardStats()
```

## 📝 Types TypeScript

### Types Supabase (Générés)

```typescript
export interface Database {
  public: {
    Tables: {
      clients: {
        Row: ClientRow
        Insert: ClientInsert
        Update: ClientUpdate
      }
      invoices: {
        Row: InvoiceRow
        Insert: InvoiceInsert
        Update: InvoiceUpdate
      }
      invoice_items: {
        Row: InvoiceItemRow
        Insert: InvoiceItemInsert
        Update: InvoiceItemUpdate
      }
      products: {
        Row: ProductRow
        Insert: ProductInsert
        Update: ProductUpdate
      }
    }
  }
}
```

### Types Métier

#### Client
```typescript
export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

#### Facture
```typescript
export interface Facture {
  id: string
  client_id: string
  number: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issue_date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  notes?: string
  created_at: string
  updated_at: string
}
```

#### Produit
```typescript
export interface Product {
  id: string
  name: string
  description?: string
  reference?: string
  sku?: string
  cost_price: number
  selling_price: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level: number
  category?: string
  brand?: string
  weight?: number
  dimensions?: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Types de Formulaire

#### ClientFormData
```typescript
export interface ClientFormData {
  name: string
  email: string
  phone?: string
  address?: string
  is_active: boolean
}
```

#### ProductFormData
```typescript
export interface ProductFormData {
  name: string
  description?: string
  reference?: string
  sku?: string
  cost_price: number
  selling_price: number
  stock_quantity: number
  min_stock_level: number
  max_stock_level: number
  category?: string
  brand?: string
  weight?: number
  dimensions?: string
  is_active: boolean
}
```

## ✅ Validations Zod

### Client Validation
```typescript
export const clientSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.string().optional(),
  is_active: z.boolean().default(true)
})
```

### Produit Validation
```typescript
export const productSchema = z.object({
  name: z.string().min(1, "Nom requis"),
  description: z.string().optional(),
  reference: z.string().optional(),
  sku: z.string().optional(),
  cost_price: z.number().min(0, "Prix de coût positif"),
  selling_price: z.number().min(0, "Prix de vente positif"),
  stock_quantity: z.number().min(0, "Stock positif"),
  min_stock_level: z.number().min(0, "Stock minimum positif"),
  max_stock_level: z.number().min(0, "Stock maximum positif"),
  category: z.string().optional(),
  brand: z.string().optional(),
  weight: z.number().min(0, "Poids positif").optional(),
  dimensions: z.string().optional(),
  is_active: z.boolean().default(true)
}).refine(
  (data) => data.selling_price >= data.cost_price,
  "Le prix de vente doit être supérieur ou égal au prix de coût"
).refine(
  (data) => data.max_stock_level >= data.min_stock_level,
  "Le stock maximum doit être supérieur au stock minimum"
).refine(
  (data) => data.stock_quantity >= 0,
  "Le stock actuel doit être positif"
)
```

### Facture Validation
```typescript
export const factureSchema = z.object({
  client_id: z.string().min(1, "Client requis"),
  issue_date: z.string().min(1, "Date d'émission requise"),
  due_date: z.string().min(1, "Date d'échéance requise"),
  items: z.array(z.object({
    product_id: z.string().min(1, "Produit requis"),
    quantity: z.number().min(1, "Quantité positive"),
    unit_price: z.number().min(0, "Prix unitaire positif")
  })).min(1, "Au moins un article requis"),
  notes: z.string().optional()
})
```

## 🔧 Fonctions Utilitaires

### Calculs Produits
```typescript
// Calcul de la marge bénéficiaire
export function calculateMargin(costPrice: number, sellingPrice: number): number {
  if (costPrice === 0) return 0
  return ((sellingPrice - costPrice) / costPrice) * 100
}

// Vérification stock faible
export function isLowStock(product: Product): boolean {
  return product.stock_quantity <= product.min_stock_level
}

// Vérification rupture de stock
export function isOutOfStock(product: Product): boolean {
  return product.stock_quantity === 0
}
```

### Formatage
```typescript
// Formatage monétaire
export function formatMoney(amount: number, currency = 'CHF'): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency
  }).format(amount)
}

// Formatage date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-CH').format(new Date(date))
}
```

### Validation
```typescript
// Transformation des données de formulaire
export function transformProductData(data: ProductFormData): ProductInsert {
  return {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}
```

## 🎯 Patterns d'Usage

### Hook Pattern
```typescript
// Pattern standard pour les hooks
export function useCustomHook(options?: CustomOptions) {
  return useQuery({
    queryKey: ['custom', options],
    queryFn: () => fetchCustomData(options),
    staleTime: 5 * 60 * 1000,
    enabled: !!options?.required
  })
}
```

### Mutation Pattern
```typescript
// Pattern standard pour les mutations
export function useCustomMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: customAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom'] })
      toast.success("Action réussie")
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`)
    }
  })
}
```

### Form Pattern
```typescript
// Pattern pour les formulaires
export function useCustomForm(initialData?: CustomData) {
  const form = useForm<CustomFormData>({
    resolver: zodResolver(customSchema),
    defaultValues: initialData
  })
  
  const mutation = useCustomMutation()
  
  const onSubmit = (data: CustomFormData) => {
    const transformedData = transformCustomData(data)
    return mutation.mutateAsync(transformedData)
  }
  
  return { form, onSubmit, isLoading: mutation.isPending }
}
```

---

**API complète pour le développement GTBP ERP. 📚**
