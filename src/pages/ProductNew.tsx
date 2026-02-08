import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/products/ProductForm'
import { useCreateProduct, useProductCategories, useProductBrands } from '@/hooks/use-products'
import { transformProductData, type ProductFormData } from '@/lib/validations/product'
import { ArrowLeft, Loader2 } from 'lucide-react'

/**
 * Page de création d'un nouveau produit
 * Formulaire complet avec validation
 */
export function ProductNew() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const createProduct = useCreateProduct()
  const { data: categories } = useProductCategories()
  const { data: brands } = useProductBrands()

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true)
    try {
      const transformedData = transformProductData(data)
      await createProduct.mutateAsync(transformedData as any)
      navigate('/products')
    } catch (error) {
      console.error('Erreur lors de la création du produit:', error)
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/products')
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
            <h1 className="text-3xl font-bold">Nouveau produit</h1>
            <p className="text-gray-600">Ajoutez un nouveau produit à votre catalogue</p>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting || createProduct.isPending}
        categories={categories || []}
        brands={brands || []}
      />

      {/* État de chargement global */}
      {(isSubmitting || createProduct.isPending) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Création du produit en cours...</span>
          </div>
        </div>
      )}
    </div>
  )
}
