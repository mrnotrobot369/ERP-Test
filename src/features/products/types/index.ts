/**
 * Types pour le module Produits de l'ERP GTBP
 * Définit les interfaces pour les produits et les formulaires associés
 */

/**
 * Interface représentant un produit complet
 */
export interface Product {
  id: string
  created_at: string
  updated_at: string
  
  // Informations produit
  name: string
  description: string | null
  reference: string | null
  sku: string | null
  
  // Prix
  cost_price: number
  selling_price: number
  
  // Stock
  stock_quantity: number
  min_stock_level: number
  max_stock_level: number
  
  // Détails
  category: string | null
  brand: string | null
  weight: number | null
  dimensions: string | null
  
  // Statut
  is_active: boolean
}

/**
 * Interface pour les données du formulaire de produit
 * Utilisée pour la création et la modification
 */
export interface ProductFormData {
  name: string
  description: string
  reference: string
  sku: string
  cost_price: string
  selling_price: string
  stock_quantity: string
  min_stock_level: string
  max_stock_level: string
  category: string
  brand: string
  weight: string
  dimensions: string
  is_active: boolean
}

/**
 * Interface pour les filtres de recherche de produits
 */
export interface ProductFilters {
  search?: string
  category?: string
  brand?: string
  is_active?: boolean
  min_price?: number
  max_price?: number
  low_stock?: boolean // Filtre pour produits en stock faible
}

/**
 * Interface pour les statistiques de produits
 */
export interface ProductStats {
  total_products: number
  active_products: number
  total_value: number // Valeur totale du stock
  low_stock_count: number // Nombre de produits en stock faible
  categories_count: number
}

/**
 * Interface pour les options de tri
 */
export interface ProductSortOptions {
  field: 'name' | 'created_at' | 'updated_at' | 'selling_price' | 'stock_quantity'
  direction: 'asc' | 'desc'
}

/**
 * Interface pour la pagination
 */
export interface ProductPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Type pour les actions sur les produits
 */
export type ProductAction = 'view' | 'edit' | 'delete' | 'duplicate' | 'toggle_active'

/**
 * Interface pour le résultat d'une recherche de produits
 */
export interface ProductSearchResult {
  products: Product[]
  pagination: ProductPagination
  stats: ProductStats
}

/**
 * Interface pour les données d'export de produits
 */
export interface ProductExportData {
  id: string
  name: string
  reference: string | null
  sku: string | null
  category: string | null
  brand: string | null
  cost_price: number
  selling_price: number
  stock_quantity: number
  is_active: boolean
  created_at: string
}

/**
 * Interface pour les validations de stock
 */
export interface StockValidation {
  isValid: boolean
  message?: string
  suggestedQuantity?: number
}

/**
 * Interface pour les alertes de stock
 */
export interface StockAlert {
  productId: string
  productName: string
  currentStock: number
  minStock: number
  alertType: 'low_stock' | 'out_of_stock' | 'overstock'
}
