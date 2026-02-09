import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ProductForm } from '@/features/products/components/ProductForm'
import {
  useProduct,
  useUpdateProduct,
  useProductCategories,
  useProductBrands
} from '@/features/products/hooks/useProducts'
import { transformProductData, type ProductFormData } from '@/lib/validations/product'
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'

/**
 * Page de modification d'un produit
 * Formulaire pré-rempli avec les données du produit
 */
export function ProductEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: product, isLoading: productLoading, error: productError } = useProduct(id!)
  const updateProduct = useUpdateProduct()
  const { data: categories } = useProductCategories()
  const { data: brands } = useProductBrands()

  useEffect(() => {
    if (!id) {
      navigate('/products')
    }
  }, [id, navigate])

  const handleSubmit = async (data: ProductFormData) => {
    if (!id || !product) return

    setIsSubmitting(true)
    try {
      const transformedData = transformProductData(data)
      await updateProduct.mutateAsync({
        id,
        payload: transformedData as any
      })
      navigate('/products')
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/products')
  }

  if (productLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement du produit...</p>
          </div>
        </div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {productError ? 'Erreur lors du chargement' : 'Produit non trouvé'}
              </h3>
              <p className="text-gray-600 mb-4">
                {productError?.message || 'Le produit demandé n\'existe pas ou a été supprimé.'}
              </p>
              <Button onClick={() => navigate('/products')}>
                Retour aux produits
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      {/* En-tête */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleCancel}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux produits
        </Button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Modifier le produit</h1>
            <p className="text-gray-600">
              Modifiez les informations du produit "{product.name}"
            </p>
          </div>

          {/* Informations rapides */}
          <div className="flex gap-2">
            <Card className="px-4 py-2">
              <div className="text-sm text-gray-600">Référence</div>
              <div className="font-medium">{product.reference || 'N/A'}</div>
            </Card>
            <Card className="px-4 py-2">
              <div className="text-sm text-gray-600">SKU</div>
              <div className="font-medium">{product.sku || 'N/A'}</div>
            </Card>
            <Card className="px-4 py-2">
              <div className="text-sm text-gray-600">Stock actuel</div>
              <div className="font-medium">{product.stock_quantity}</div>
            </Card>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting || updateProduct.isPending}
        categories={categories || []}
        brands={brands || []}
      />

      {/* État de chargement global */}
      {(isSubmitting || updateProduct.isPending) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Modification du produit en cours...</span>
          </div>
        </div>
      )}
    </div>
  )
}
