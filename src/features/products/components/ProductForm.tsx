import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { productSchema, type ProductFormData } from '@/lib/validations/product'
import type { ProductRow } from '@/types/database'
import { calculateMargin } from '@/lib/validations/product'

interface ProductFormProps {
  product?: ProductRow
  onSubmit: (data: ProductFormData) => void
  onCancel: () => void
  isLoading?: boolean
  categories?: string[]
  brands?: string[]
}

/**
 * Formulaire de création/modification de produit
 * Utilise react-hook-form avec validation Zod
 */
export function ProductForm({ 
  product, 
  onSubmit, 
  onCancel, 
  isLoading = false,
  categories = [],
  brands = []
}: ProductFormProps) {
  const isEditing = !!product

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      reference: product?.reference || '',
      sku: product?.sku || '',
      cost_price: product?.cost_price?.toString() || '0',
      selling_price: product?.selling_price?.toString() || '0',
      stock_quantity: product?.stock_quantity?.toString() || '0',
      min_stock_level: product?.min_stock_level?.toString() || '0',
      max_stock_level: product?.max_stock_level?.toString() || '1000',
      category: product?.category || '',
      brand: product?.brand || '',
      weight: product?.weight?.toString() || '',
      dimensions: product?.dimensions || '',
      is_active: product?.is_active ?? true,
    },
  })

  // Watch les prix pour calculer la marge
  const costPrice = watch('cost_price')
  const sellingPrice = watch('selling_price')
  const stockQuantity = watch('stock_quantity')
  const minStockLevel = watch('min_stock_level')

  // Calculer la marge bénéficiaire
  const margin = costPrice && sellingPrice 
    ? calculateMargin(parseFloat(costPrice), parseFloat(sellingPrice))
    : 0

  // Vérifier le statut du stock
  const stockStatus = stockQuantity && minStockLevel
    ? parseInt(stockQuantity) <= parseInt(minStockLevel)
      ? 'low'
      : 'normal'
    : 'normal'

  const onFormSubmit = (data: ProductFormData) => {
    onSubmit(data)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
        </CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Modifiez les informations du produit ci-dessous'
            : 'Remplissez les informations pour créer un nouveau produit'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informations générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du produit *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Nom du produit"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input
                  id="reference"
                  {...register('reference')}
                  placeholder="REF-001"
                  className={errors.reference ? 'border-red-500' : ''}
                />
                {errors.reference && (
                  <p className="text-sm text-red-500">{errors.reference.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  {...register('sku')}
                  placeholder="SKU-001"
                  className={errors.sku ? 'border-red-500' : ''}
                />
                {errors.sku && (
                  <p className="text-sm text-red-500">{errors.sku.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={watch('category') || ''}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marque</Label>
                <Select
                  value={watch('brand') || ''}
                  onValueChange={(value) => setValue('brand', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.001"
                  {...register('weight')}
                  placeholder="0.000"
                  className={errors.weight ? 'border-red-500' : ''}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500">{errors.weight.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Description du produit..."
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimensions">Dimensions (LxlxH en cm)</Label>
              <Input
                id="dimensions"
                {...register('dimensions')}
                placeholder="10x5x3"
                className={errors.dimensions ? 'border-red-500' : ''}
              />
              {errors.dimensions && (
                <p className="text-sm text-red-500">{errors.dimensions.message}</p>
              )}
            </div>
          </div>

          {/* Prix */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Prix</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost_price">Prix de coût (€) *</Label>
                <Input
                  id="cost_price"
                  type="number"
                  step="0.01"
                  {...register('cost_price')}
                  placeholder="0.00"
                  className={errors.cost_price ? 'border-red-500' : ''}
                />
                {errors.cost_price && (
                  <p className="text-sm text-red-500">{errors.cost_price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="selling_price">Prix de vente (€) *</Label>
                <Input
                  id="selling_price"
                  type="number"
                  step="0.01"
                  {...register('selling_price')}
                  placeholder="0.00"
                  className={errors.selling_price ? 'border-red-500' : ''}
                />
                {errors.selling_price && (
                  <p className="text-sm text-red-500">{errors.selling_price.message}</p>
                )}
              </div>
            </div>

            {margin > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Marge bénéficiaire:</span>
                <Badge variant={margin > 20 ? 'default' : margin > 10 ? 'secondary' : 'destructive'}>
                  {margin.toFixed(1)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Stock</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantité en stock *</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  {...register('stock_quantity')}
                  placeholder="0"
                  className={errors.stock_quantity ? 'border-red-500' : ''}
                />
                {errors.stock_quantity && (
                  <p className="text-sm text-red-500">{errors.stock_quantity.message}</p>
                )}
                {stockStatus === 'low' && (
                  <p className="text-sm text-orange-500">⚠️ Stock faible</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="min_stock_level">Stock minimum *</Label>
                <Input
                  id="min_stock_level"
                  type="number"
                  {...register('min_stock_level')}
                  placeholder="0"
                  className={errors.min_stock_level ? 'border-red-500' : ''}
                />
                {errors.min_stock_level && (
                  <p className="text-sm text-red-500">{errors.min_stock_level.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_stock_level">Stock maximum *</Label>
                <Input
                  id="max_stock_level"
                  type="number"
                  {...register('max_stock_level')}
                  placeholder="1000"
                  className={errors.max_stock_level ? 'border-red-500' : ''}
                />
                {errors.max_stock_level && (
                  <p className="text-sm text-red-500">{errors.max_stock_level.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Statut</h3>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                {...register('is_active')}
                className="rounded border-gray-300"
              />
              <Label htmlFor="is_active">Produit actif</Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isValid || !isDirty}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditing ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                isEditing ? 'Modifier' : 'Créer'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
