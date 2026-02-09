import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ProductInsert, ProductRow } from '@/types/database'
import type { ProductFilters } from '@/features/products/types'

const queryKey = ['products'] as const

/**
 * Hook optimisé pour les produits avec cache et gestion d'erreurs
 */
export function useOptimizedProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: [...queryKey, filters],
    queryFn: async (): Promise<ProductRow[]> => {
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
        console.error('Erreur chargement produits:', error)
        throw new Error(`Impossible de charger les produits: ${error.message}`)
      }

      return data as ProductRow[]
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
    retry: (failureCount, error) => {
      // Ne pas réessayer si erreur de permission
      if (error.message.includes('permission denied')) {
        return false
      }
      // Réessayer jusqu'à 3 fois
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  })
}

/**
 * Hook optimisé pour la création avec rollback
 */
export function useOptimizedCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProductInsert) => {
      const { data, error } = await supabase
        .from('products')
        .insert(payload as never)
        .select()
        .single()

      if (error) {
        console.error('Erreur création produit:', error)
        throw new Error(`Impossible de créer le produit: ${error.message}`)
      }

      return data
    },
    onMutate: async (newProduct) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey })

      // Snapshot des données précédentes
      const previousProducts = queryClient.getQueryData<ProductRow[]>(queryKey)

      // Optimistic update
      queryClient.setQueryData<ProductRow[]>(queryKey, (old = []) => [
        {
          ...newProduct,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as ProductRow,
        ...old,
      ])

      return { previousProducts }
    },
    onError: (_error, _variables, context) => {
      // Rollback en cas d'erreur
      if (context?.previousProducts) {
        queryClient.setQueryData(queryKey, context.previousProducts)
      }
    },
    onSettled: () => {
      // Invalider le cache pour assurer la cohérence
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

/**
 * Hook pour les catégories avec cache
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

      if (error) {
        console.error('Erreur chargement catégories:', error)
        throw new Error(`Impossible de charger les catégories: ${error.message}`)
      }

      const categories = [...new Set(data.map((item: any) => item.category).filter(Boolean))]
      return categories.sort()
    },
    staleTime: 30 * 60 * 1000, // 30 minutes (les catégories changent peu)
    gcTime: 60 * 60 * 1000, // 1 heure
  })
}

/**
 * Hook pour les marques avec cache
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

      if (error) {
        console.error('Erreur chargement marques:', error)
        throw new Error(`Impossible de charger les marques: ${error.message}`)
      }

      const brands = [...new Set(data.map((item: any) => item.brand).filter(Boolean))]
      return brands.sort()
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 heure
  })
}

/**
 * Hook pour les produits avec stock faible
 */
export function useLowStockProducts() {
  return useQuery({
    queryKey: [...queryKey, 'low-stock'],
    queryFn: async (): Promise<ProductRow[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .lte('stock_quantity', 'min_stock_level')
        .eq('is_active', true)
        .order('stock_quantity', { ascending: true })

      if (error) {
        console.error('Erreur chargement stock faible:', error)
        throw new Error(`Impossible de charger les produits avec stock faible: ${error.message}`)
      }

      return data as ProductRow[]
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (le stock change plus fréquemment)
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Rafraîchir toutes les 5 minutes
  })
}
