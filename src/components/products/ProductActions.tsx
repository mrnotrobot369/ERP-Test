import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Edit, 
  Eye, 
  Trash2, 
  Copy, 
  Power,
  Download,
  Package
} from 'lucide-react'
import type { ProductRow } from '@/types/database'

interface ProductActionsProps {
  product: ProductRow
  onView?: (product: ProductRow) => void
  onEdit?: (product: ProductRow) => void
  onDelete?: (product: ProductRow) => void
  onDuplicate?: (product: ProductRow) => void
  onToggleActive?: (product: ProductRow, isActive: boolean) => void
  onExport?: (product: ProductRow) => void
  onAdjustStock?: (product: ProductRow) => void
  size?: 'sm' | 'default' | 'lg'
  variant?: 'ghost' | 'outline' | 'secondary'
}

/**
 * Actions pour un produit
 * Boutons d'action pour les opérations sur un produit
 */
export function ProductActions({ 
  product, 
  onView, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onToggleActive,
  onExport,
  onAdjustStock,
  size = 'sm',
  variant = 'ghost'
}: ProductActionsProps) {
  const [showMore, setShowMore] = useState(false)

  return (
    <div className="flex items-center gap-1">
      {/* Actions principales */}
      {onView && (
        <Button
          variant={variant}
          size={size}
          onClick={() => onView(product)}
          className="h-8 w-8 p-0"
          title="Voir les détails"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      
      {onEdit && (
        <Button
          variant={variant}
          size={size}
          onClick={() => onEdit(product)}
          className="h-8 w-8 p-0"
          title="Modifier"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}

      {onAdjustStock && (
        <Button
          variant={variant}
          size={size}
          onClick={() => onAdjustStock(product)}
          className="h-8 w-8 p-0"
          title="Ajuster le stock"
        >
          <Package className="h-4 w-4" />
        </Button>
      )}

      {/* Actions supplémentaires */}
      {showMore && (
        <>
          {onDuplicate && (
            <Button
              variant={variant}
              size={size}
              onClick={() => onDuplicate(product)}
              className="h-8 w-8 p-0"
              title="Dupliquer"
            >
              <Copy className="h-4 w-4" />
            </Button>
          )}

          {onToggleActive && (
            <Button
              variant={variant}
              size={size}
              onClick={() => onToggleActive(product, !product.is_active)}
              className="h-8 w-8 p-0"
              title={product.is_active ? 'Désactiver' : 'Activer'}
            >
              <Power className="h-4 w-4" />
            </Button>
          )}

          {onExport && (
            <Button
              variant={variant}
              size={size}
              onClick={() => onExport(product)}
              className="h-8 w-8 p-0"
              title="Exporter"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </>
      )}

      {/* Bouton plus/moins */}
      {(onDuplicate || onToggleActive || onExport) && (
        <Button
          variant={variant}
          size={size}
          onClick={() => setShowMore(!showMore)}
          className="h-8 w-8 p-0"
          title={showMore ? 'Moins d\'actions' : 'Plus d\'actions'}
        >
          <span className="text-xs font-bold">
            {showMore ? '−' : '+'}
          </span>
        </Button>
      )}

      {/* Action de suppression */}
      {onDelete && (
        <Button
          variant="ghost"
          size={size}
          onClick={() => onDelete(product)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

/**
 * Version compacte des actions pour les tableaux
 * Affiche seulement les actions essentielles
 */
export function ProductActionsCompact({ 
  product, 
  onEdit, 
  onDelete, 
  onToggleActive 
}: Pick<ProductActionsProps, 'product' | 'onEdit' | 'onDelete' | 'onToggleActive'>) {
  return (
    <div className="flex items-center gap-1">
      {onEdit && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
          className="h-8 w-8 p-0"
          title="Modifier"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      
      {onToggleActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleActive(product, !product.is_active)}
          className="h-8 w-8 p-0"
          title={product.is_active ? 'Désactiver' : 'Activer'}
        >
          <Power className="h-4 w-4" />
        </Button>
      )}
      
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(product)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
          title="Supprimer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
