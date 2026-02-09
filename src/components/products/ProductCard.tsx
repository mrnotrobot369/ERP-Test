import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Package, AlertTriangle, DollarSign, Package2 } from 'lucide-react'
import type { ProductRow } from '@/types/database'
import { calculateMargin, isLowStock, isOutOfStock } from '@/lib/validations/product'

interface ProductCardProps {
  product: ProductRow
  onView?: (product: ProductRow) => void
  onEdit?: (product: ProductRow) => void
  onDelete?: (product: ProductRow) => void
  onToggleActive?: (product: ProductRow, isActive: boolean) => void
  showActions?: boolean
  compact?: boolean
}

/**
 * Carte d'affichage d'un produit
 * Affiche les informations principales avec actions rapides
 */
export function ProductCard({ 
  product, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleActive,
  showActions = true,
  compact = false 
}: ProductCardProps) {
  const margin = calculateMargin(product.cost_price, product.selling_price)
  const isLow = isLowStock(product.stock_quantity, product.min_stock_level)
  const isOut = isOutOfStock(product.stock_quantity)

  const getStockBadge = () => {
    if (isOut) {
      return <Badge variant="destructive">Rupture</Badge>
    }
    if (isLow) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Stock faible
      </Badge>
    }
    return <Badge variant="default" className="bg-green-100 text-green-800">
      En stock
    </Badge>
  }

  const getMarginBadge = () => {
    if (margin > 30) {
      return <Badge variant="default" className="bg-green-100 text-green-800">
        Excellente ({margin.toFixed(1)}%)
      </Badge>
    }
    if (margin > 15) {
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">
        Bonne ({margin.toFixed(1)}%)
      </Badge>
    }
    if (margin > 0) {
      return <Badge variant="outline" className="text-orange-600">
        Faible ({margin.toFixed(1)}%)
      </Badge>
    }
    return <Badge variant="destructive">
      Aucune
    </Badge>
  }

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm">{product.name}</h3>
                {!product.is_active && (
                  <Badge variant="outline" className="text-gray-500">
                    Inactif
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {product.reference || product.sku || 'N/A'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="font-semibold">{product.selling_price.toFixed(2)}€</p>
                <p className="text-xs text-gray-500">
                  {product.stock_quantity} en stock
                </p>
              </div>
              {showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(product)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-600" />
              {product.name}
              {!product.is_active && (
                <Badge variant="outline" className="text-gray-500">
                  Inactif
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {product.reference && (
                <span className="mr-3">Ref: {product.reference}</span>
              )}
              {product.sku && (
                <span>SKU: {product.sku}</span>
              )}
              {!product.reference && !product.sku && (
                <span className="text-gray-400">Aucune référence</span>
              )}
            </CardDescription>
          </div>
          {showActions && (
            <div className="flex gap-1">
              {onView && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(product)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(product)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Catégorie et Marque */}
        <div className="flex flex-wrap gap-2">
          {product.category && (
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
          )}
          {product.brand && (
            <Badge variant="outline" className="text-xs">
              {product.brand}
            </Badge>
          )}
        </div>

        {/* Prix et Marge */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Prix de vente</span>
            </div>
            <p className="font-semibold text-lg">
              {product.selling_price.toFixed(2)}€
            </p>
            <p className="text-xs text-gray-500">
              Coût: {product.cost_price.toFixed(2)}€
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>Marge</span>
            </div>
            {getMarginBadge()}
          </div>
        </div>

        {/* Stock */}
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Package2 className="w-4 h-4" />
                <span>Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {product.stock_quantity} unités
                </span>
                {getStockBadge()}
              </div>
              <p className="text-xs text-gray-500">
                Min: {product.min_stock_level} | Max: {product.max_stock_level}
              </p>
            </div>

            {/* Dimensions et Poids */}
            <div className="text-right text-sm text-gray-600">
              {product.weight && (
                <p>Poids: {product.weight}kg</p>
              )}
              {product.dimensions && (
                <p>Dim: {product.dimensions}</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions supplémentaires */}
        {showActions && (onDelete || onToggleActive) && (
          <div className="flex justify-end gap-2 pt-3 border-t">
            {onToggleActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleActive(product, !product.is_active)}
              >
                {product.is_active ? 'Désactiver' : 'Activer'}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(product)}
              >
                Supprimer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
