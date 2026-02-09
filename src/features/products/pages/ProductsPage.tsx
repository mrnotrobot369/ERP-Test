import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProductCard } from '@/features/products/components/ProductCard'
import {
  useProducts,
  useProductCategories,
  useProductBrands,
  useDeleteProduct,
  useToggleProductActive
} from '@/features/products/hooks/useProducts'
import type { ProductFilters } from '@/features/products/types'
import type { ProductRow } from '@/types/database'
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  X,
  Grid,
  List
} from 'lucide-react'

/**
 * Page principale de gestion des produits
 * Liste avec recherche, filtres et actions
 */
export function Products() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<ProductFilters>({})
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const { data: products, isLoading, error } = useProducts(
    searchTerm || Object.keys(filters).length > 0 ? {
      ...(searchTerm && { search: searchTerm }),
      ...filters
    } : undefined
  )

  const { data: categories } = useProductCategories()
  const { data: brands } = useProductBrands()
  const deleteProduct = useDeleteProduct()
  const toggleProductActive = useToggleProductActive()

  // Calculer les statistiques
  const stats = {
    total: products?.length || 0,
    active: products?.filter(p => p.is_active).length || 0,
    inactive: products?.filter(p => !p.is_active).length || 0,
    lowStock: products?.filter(p => p.stock_quantity <= p.min_stock_level).length || 0,
    outOfStock: products?.filter(p => p.stock_quantity === 0).length || 0,
  }

  const handleCreateProduct = () => {
    navigate('/products/new')
  }

  const handleEditProduct = (product: ProductRow) => {
    navigate(`/products/${product.id}/edit`)
  }

  const handleDeleteProduct = async (product: ProductRow) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${product.name}" ?`)) {
      try {
        await deleteProduct.mutateAsync(product.id)
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const handleToggleActive = async (product: ProductRow, isActive: boolean) => {
    try {
      await toggleProductActive.mutateAsync({ id: product.id, isActive })
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
    }
  }

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
  }

  const hasActiveFilters = searchTerm || Object.values(filters).some(v => v !== undefined)

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-600">
              <p>Erreur lors du chargement des produits</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-gray-600">Gérez votre catalogue de produits</p>
        </div>
        <Button onClick={handleCreateProduct} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nouveau produit
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-gray-600">Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{stats.inactive}</p>
                <p className="text-sm text-gray-600">Inactifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.lowStock}</p>
                <p className="text-sm text-gray-600">Stock faible</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-2xl font-bold">{stats.outOfStock}</p>
                <p className="text-sm text-gray-600">Rupture</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche et filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.values(filters).filter(v => v !== undefined).length + (searchTerm ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Effacer
                </Button>
              )}
            </div>
          </div>

          {/* Filtres détaillés */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
              <Select
                value={filters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.brand || ''}
                onValueChange={(value) => handleFilterChange('brand', value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Marque" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les marques</SelectItem>
                  {brands?.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.is_active?.toString() || ''}
                onValueChange={(value) => handleFilterChange('is_active', value === 'true' ? true : value === 'false' ? false : undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les statuts</SelectItem>
                  <SelectItem value="true">Actifs</SelectItem>
                  <SelectItem value="false">Inactifs</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.low_stock?.toString() || ''}
                onValueChange={(value) => handleFilterChange('low_stock', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les stocks</SelectItem>
                  <SelectItem value="true">Stock faible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Liste des produits */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des produits...</p>
        </div>
      ) : products && products.length > 0 ? (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleActive={handleToggleActive}
              compact={viewMode === 'list'}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'Aucun produit trouvé' : 'Aucun produit'}
            </h3>
            <p className="text-gray-600 mb-6">
              {hasActiveFilters
                ? 'Essayez de modifier vos filtres de recherche'
                : 'Commencez par ajouter votre premier produit'
              }
            </p>
            {!hasActiveFilters && (
              <Button onClick={handleCreateProduct}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
