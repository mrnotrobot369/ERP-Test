/**
 * Composant pour les opérations en lot
 * Bulk operations component
 */

import React, { useState } from 'react'
import { useDocuments } from '../hooks/useDocuments'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, Trash2, Download, Mail } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import type { Document } from '../types/document'

interface BulkActionsProps {
  documents: Document[]
  onSelectionChange: (selectedIds: string[]) => void
}

export const BulkActions: React.FC<BulkActionsProps> = ({ documents, onSelectionChange }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { deleteDocument, updateStatus } = useDocuments()

  const handleSelectAll = (checked: boolean) => {
    const ids = checked ? documents.map(d => d.id) : []
    setSelectedIds(ids)
    onSelectionChange(ids)
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedIds.length} document(s)?`)) return

    setLoading(true)
    try {
      for (const id of selectedIds) {
        await deleteDocument(id)
      }
      toast.success(`${selectedIds.length} document(s) supprimé(s)`)
      setSelectedIds([])
      onSelectionChange([])
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkChangeStatus = async (newStatus: any) => {
    setLoading(true)
    try {
      for (const id of selectedIds) {
        await updateStatus(id, newStatus)
      }
      toast.success(`${selectedIds.length} document(s) mis à jour`)
      setSelectedIds([])
      onSelectionChange([])
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  const handleBulkExport = async () => {
    toast.info('Génération de l\'export PDF...')
    // Implementation logic here
  }

  const handleBulkEmail = async () => {
    toast.info('Envoi des emails...')
    // Implementation logic here
  }

  if (selectedIds.length === 0) return null

  return (
    <div className="sticky top-0 z-10 bg-blue-50/90 backdrop-blur-sm p-4 rounded-xl mb-6 border border-blue-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={selectedIds.length === documents.length && documents.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
            {selectedIds.length} sélectionné(s)
          </span>
        </div>

        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="bg-white">
                Statut <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {['draft', 'sent', 'accepted', 'paid', 'overdue', 'cancelled'].map(status => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleBulkChangeStatus(status)}
                  className="capitalize"
                >
                  {status.replace('_', ' ')}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkExport}
            disabled={loading}
            className="bg-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export ZIP
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkEmail}
            disabled={loading}
            className="bg-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  )
}
