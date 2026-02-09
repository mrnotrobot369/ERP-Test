import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase-debug'
import type { ProductInsert, ProductRow } from '@/types/database'
import type { ProductFilters } from '@/types/product'
import { useAuthStore } from '@/stores/authStore'

const queryKey = ['products'] as const

/**
 * Liste des produits depuis Supabase (TanStack Query).
 * @param filters - Filtres optionnels pour la recherche
 */
export function useProducts(filters?: ProductFilters) {
  const { user, initialized } = useAuthStore()

  return useQuery({
    queryKey: [...queryKey, filters],
    queryFn: async (): Promise<ProductRow[]> => {
      console.log('📦 PRODUCTS - Début récupération des produits')
      
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,reference.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
        )
      }

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.brand) {
        query = query.eq('brand', filters.brand)
      }

      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      if (filters?.min_price !== undefined) {
        query = query.gte('selling_price', filters.min_price)
      }

      if (filters?.max_price !== undefined) {
        query = query.lte('selling_price', filters.max_price)
      }

      if (filters?.low_stock) {
        query = query.lte('stock_quantity', 'min_stock_level')
      }

      const { data, error } = await query
      if (error) {
        console.error('❌ PRODUCTS - Erreur récupération:', error)
        throw error
      }
      
      console.log('✅ PRODUCTS - Produits récupérés:', data?.length || 0)
      return data as ProductRow[]
    },
    enabled: !!user && initialized, // N'exécuter que si l'utilisateur est connecté
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/**
 * Récupère un produit par son ID.
 * @param id - ID du produit
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: [...queryKey, id],
    queryFn: async (): Promise<ProductRow> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as ProductRow
    },
    enabled: !!id,
  })
}

/**
 * Recherche de produits avec texte plein.
 * @param searchTerm - Terme de recherche
 */
export function useSearchProducts(searchTerm: string) {
  return useQuery({
    queryKey: [...queryKey, 'search', searchTerm],
    queryFn: async (): Promise<ProductRow[]> => {
      if (!searchTerm.trim()) return []

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(
          `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`
        )
        .order('name')
        .limit(50)

      if (error) throw error
      return data as ProductRow[]
    },
    enabled: searchTerm.trim().length > 0,
  })
}

/**
 * Création d'un produit + invalidation du cache liste.
 */
export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert(payload as never)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

/**
 * Mise à jour d'un produit + invalidation du cache.
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: ProductRow['id']
      payload: Partial<Omit<ProductRow, 'id' | 'created_at'>>
    }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ ...payload, updated_at: new Date().toISOString() } as never)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['products', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

/**
 * Suppression d'un produit + invalidation du cache.
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: ProductRow['id']) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

/**
 * Bascule le statut actif/inactif d'un produit.
 */
export function useToggleProductActive() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: ProductRow['id']
      isActive: boolean
    }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ 
          is_active: isActive, 
          updated_at: new Date().toISOString() 
        } as never)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['products', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

/**
 * Mise à jour du stock d'un produit.
 */
export function useUpdateProductStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      quantity,
      operation,
    }: {
      id: ProductRow['id']
      quantity: number
      operation: 'set' | 'add' | 'subtract'
    }) => {
      // D'abord récupérer le produit actuel
      const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      if (!currentProduct) throw new Error('Produit non trouvé')

      let newQuantity: number
      switch (operation) {
        case 'set':
          newQuantity = quantity
          break
        case 'add':
          newQuantity = (currentProduct as any).stock_quantity + quantity
          break
        case 'subtract':
          newQuantity = Math.max(0, (currentProduct as any).stock_quantity - quantity)
          break
        default:
          throw new Error('Opération invalide')
      }

      const { data, error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newQuantity,
          updated_at: new Date().toISOString()
        } as never)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['products', id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

/**
 * Récupère les catégories uniques des produits.
 */
export function useProductCategories() {
  return useQuery({
    queryKey: [...queryKey, 'categories'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)
        .not('category', 'eq', '')

      if (error) throw error

      // Extraire les catégories uniques
      const categories = [...new Set(data.map((item: any) => item.category).filter(Boolean))]
      return categories.sort()
    },
  })
}

/**
 * Récupère les marques uniques des produits.
 */
export function useProductBrands() {
  return useQuery({
    queryKey: [...queryKey, 'brands'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('brand')
        .not('brand', 'is', null)
        .not('brand', 'eq', '')

      if (error) throw error

      // Extraire les marques uniques
      const brands = [...new Set(data.map((item: any) => item.brand).filter(Boolean))]
      return brands.sort()
    },
  })
}

/**
 * Récupère les produits avec stock faible.
 */
export function useLowStockProducts() {
  const { user, initialized } = useAuthStore()

  return useQuery({
    queryKey: [...queryKey, 'low-stock'],
    queryFn: async (): Promise<ProductRow[]> => {
      console.log('📦 LOW STOCK - Début récupération produits stock faible')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lte('stock_quantity', 'min_stock_level')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true })

      if (error) {
        console.error('❌ LOW STOCK - Erreur récupération:', error)
        throw error
      }
      
      console.log('✅ LOW STOCK - Produits stock faible récupérés:', data?.length || 0)
      return data as ProductRow[]
    },
    enabled: !!user && initialized, // N'exécuter que si l'utilisateur est connecté
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
