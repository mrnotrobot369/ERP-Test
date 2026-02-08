import { z } from 'zod'

/**
 * Schéma Zod pour la validation d'un produit.
 * Correspond à la structure de la table `products` Supabase.
 */
export const productSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom du produit est requis')
    .max(200, 'Le nom ne peut pas dépasser 200 caractères'),
  
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .nullable()
    .optional()
    .or(z.literal('')),
  
  reference: z
    .string()
    .max(50, 'La référence ne peut pas dépasser 50 caractères')
    .nullable()
    .optional()
    .or(z.literal('')),
  
  sku: z
    .string()
    .max(50, 'Le SKU ne peut pas dépasser 50 caractères')
    .nullable()
    .optional()
    .or(z.literal('')),
  
  cost_price: z
    .string()
    .min(0, 'Le prix de coût doit être positif')
    .refine(
      (val) => {
        const num = parseFloat(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Le prix de coût doit être un nombre valide' }
    ),
  
  selling_price: z
    .string()
    .min(0, 'Le prix de vente doit être positif')
    .refine(
      (val) => {
        const num = parseFloat(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Le prix de vente doit être un nombre valide' }
    ),
  
  stock_quantity: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'La quantité en stock doit être un entier positif' }
    ),
  
  min_stock_level: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Le stock minimum doit être un entier positif' }
    ),
  
  max_stock_level: z
    .string()
    .refine(
      (val) => {
        const num = parseInt(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Le stock maximum doit être un entier positif' }
    ),
  
  category: z
    .string()
    .max(100, 'La catégorie ne peut pas dépasser 100 caractères')
    .nullable()
    .optional()
    .or(z.literal('')),
  
  brand: z
    .string()
    .max(100, 'La marque ne peut pas dépasser 100 caractères')
    .nullable()
    .optional()
    .or(z.literal('')),
  
  weight: z
    .string()
    .refine(
      (val) => {
        if (val === '') return true
        const num = parseFloat(val)
        return !isNaN(num) && num >= 0
      },
      { message: 'Le poids doit être un nombre positif' }
    )
    .nullable()
    .optional()
    .or(z.literal('')),
  
  dimensions: z
    .string()
    .max(50, 'Les dimensions ne peuvent pas dépasser 50 caractères')
    .regex(
      /^(\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?)?$/,
      'Les dimensions doivent être au format "LxWxH" (ex: 10x5x3)'
    )
    .nullable()
    .optional()
    .or(z.literal('')),
  
  is_active: z
    .boolean(),
})
// Validation croisée : coût <= prix de vente
.refine(
  (data) => {
    const cost = parseFloat(data.cost_price)
    const selling = parseFloat(data.selling_price)
    return !isNaN(cost) && !isNaN(selling) && selling >= cost
  },
  {
    message: 'Le prix de vente doit être supérieur ou égal au prix de coût',
    path: ['selling_price'],
  }
)
// Validation croisée : stock min <= stock max
.refine(
  (data) => {
    const min = parseInt(data.min_stock_level)
    const max = parseInt(data.max_stock_level)
    return !isNaN(min) && !isNaN(max) && max >= min
  },
  {
    message: 'Le stock maximum doit être supérieur ou égal au stock minimum',
    path: ['max_stock_level'],
  }
)
// Validation croisée : quantité actuelle <= stock max
.refine(
  (data) => {
    const quantity = parseInt(data.stock_quantity)
    const max = parseInt(data.max_stock_level)
    return !isNaN(quantity) && !isNaN(max) && quantity <= max
  },
  {
    message: 'La quantité en stock ne peut pas dépasser le stock maximum',
    path: ['stock_quantity'],
  }
)

/** Type inféré du schéma produit */
export type ProductFormData = z.infer<typeof productSchema>

/**
 * Schéma pour les filtres de recherche de produits
 */
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  is_active: z.boolean().optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  low_stock: z.boolean().optional(),
})

/** Type inféré du schéma de filtres */
export type ProductFilters = z.infer<typeof productFiltersSchema>

/**
 * Transforme les valeurs du formulaire pour Supabase.
 * Convertit les chaînes vides en null et les nombres.
 */
export function transformProductData(data: ProductFormData) {
  return {
    name: data.name,
    description: data.description || null,
    reference: data.reference || null,
    sku: data.sku || null,
    cost_price: parseFloat(data.cost_price),
    selling_price: parseFloat(data.selling_price),
    stock_quantity: parseInt(data.stock_quantity),
    min_stock_level: parseInt(data.min_stock_level),
    max_stock_level: parseInt(data.max_stock_level),
    category: data.category || null,
    brand: data.brand || null,
    weight: data.weight ? parseFloat(data.weight) : null,
    dimensions: data.dimensions || null,
    is_active: data.is_active,
  }
}

/**
 * Transforme les données de Supabase pour le formulaire.
 * Convertit les nombres en chaînes pour les champs de formulaire.
 */
export function transformProductToFormData(product: any): ProductFormData {
  return {
    name: product.name || '',
    description: product.description || '',
    reference: product.reference || '',
    sku: product.sku || '',
    cost_price: product.cost_price?.toString() || '0',
    selling_price: product.selling_price?.toString() || '0',
    stock_quantity: product.stock_quantity?.toString() || '0',
    min_stock_level: product.min_stock_level?.toString() || '0',
    max_stock_level: product.max_stock_level?.toString() || '1000',
    category: product.category || '',
    brand: product.brand || '',
    weight: product.weight?.toString() || '',
    dimensions: product.dimensions || '',
    is_active: product.is_active ?? true,
  }
}

/**
 * Valide les dimensions au format "LxWxH"
 */
export function validateDimensions(dimensions: string): boolean {
  if (!dimensions) return true
  const pattern = /^\d+(\.\d+)?x\d+(\.\d+)?x\d+(\.\d+)?$/
  return pattern.test(dimensions)
}

/**
 * Calcule la marge bénéficiaire
 */
export function calculateMargin(costPrice: number, sellingPrice: number): number {
  if (costPrice === 0) return 0
  return ((sellingPrice - costPrice) / costPrice) * 100
}

/**
 * Vérifie si le stock est faible
 */
export function isLowStock(currentStock: number, minStock: number): boolean {
  return currentStock <= minStock
}

/**
 * Vérifie si le produit est en rupture de stock
 */
export function isOutOfStock(currentStock: number): boolean {
  return currentStock === 0
}
