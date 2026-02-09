/**
 * Composant pour la liste des documents (Enterprise Grade)
 * Component for document list with TanStack Table v8
 */

import { useState, useMemo, useCallback } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getSortedRowModel,
  RowSelectionState,
} from '@tanstack/react-table'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronUp,
  ChevronDown,
  Plus
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useDocuments } from '../hooks/useDocuments'
import { usePDFGeneration } from '../hooks/usePDFGeneration'
import { documentService } from '../services/documentService'
import type { DocumentSummary, DocumentType, DocumentStatus } from '../types/document'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'

// Libellés pour les types de documents
const TYPE_LABELS: Record<DocumentType, string> = {
  invoice: 'Facture',
  quote: 'Devis',
  delivery_note: 'Bon de livraison',
  po: 'Commande',
  reminder: 'Rappel',
  receipt: 'Reçu'
}

// Couleurs pour les statuts
const STATUS_STYLES: Record<DocumentStatus, { label: string, variant: 'secondary' | 'outline' | 'default' | 'destructive' | 'success' | 'warning' }> = {
  draft: { label: 'Brouillon', variant: 'secondary' },
  sent: { label: 'Envoyé', variant: 'outline' },
  accepted: { label: 'Accepté', variant: 'success' as any },
  paid: { label: 'Payé', variant: 'success' as any },
  overdue: { label: 'En retard', variant: 'destructive' },
  cancelled: { label: 'Annulé', variant: 'outline' }
}

export function DocumentList() {
  const navigate = useNavigate()
  const {
    documents,
    loading,
    error,
    pagination,
    filters,
    changePage,
    changeFilters,
    deleteDocument,
    bulkDelete
  } = useDocuments()

  const { downloadPDF, loading: pdfLoading } = usePDFGeneration()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [searchTerm, setSearchTerm] = useState('')

  // Définition des colonnes
  const columnHelper = createColumnHelper<DocumentSummary>()

  const columns = useMemo(() => [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('document_number', {
      header: 'Numéro',
      cell: info => <span className="font-semibold">{info.getValue()}</span>,
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: info => TYPE_LABELS[info.getValue() as DocumentType] || info.getValue(),
    }),
    columnHelper.accessor('client_name', {
      header: 'Client',
      cell: info => info.getValue() || '-',
    }),
    columnHelper.accessor('issue_date', {
      header: 'Date',
      cell: info => format(new Date(info.getValue()), 'dd.MM.yyyy', { locale: fr }),
    }),
    columnHelper.accessor('total_amount', {
      header: 'Total',
      cell: info => new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(info.getValue()),
      meta: {
        headerClassName: 'text-right',
        cellClassName: 'text-right font-medium',
      }
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: info => {
        const style = STATUS_STYLES[info.getValue() as DocumentStatus]
        return (
          <Badge variant={style?.variant || 'secondary'}>
            {style?.label || info.getValue()}
          </Badge>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        const doc = row.original
        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate(`/documents/${doc.id}`)}>
                  <Eye className="mr-2 h-4 w-4" /> Voir les détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/documents/edit/${doc.id}`)}>
                  <Edit className="mr-2 h-4 w-4" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      const fullDoc = await documentService.getDocument(doc.id)
                      if (fullDoc) await downloadPDF(fullDoc)
                    } catch (err) {
                      console.error('Download error:', err)
                    }
                  }}
                  disabled={pdfLoading}
                >
                  <Download className="mr-2 h-4 w-4" /> Télécharger PDF
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
                      deleteDocument(doc.id)
                    }
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }),
  ], [columnHelper, downloadPDF, pdfLoading, navigate, deleteDocument])

  const table = useReactTable({
    data: documents,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  })

  // Gérer la recherche
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    changeFilters({ ...filters, search: searchTerm })
  }, [searchTerm, filters, changeFilters])

  // Gérer le bulk delete
  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(index => documents[parseInt(index)]?.id)
      .filter(Boolean) as string[]

    if (selectedIds.length === 0) return

    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.length} documents ?`)) {
      try {
        await bulkDelete(selectedIds)
        setRowSelection({})
      } catch (err) {
        console.error('Bulk delete error:', err)
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Barre d'outils et recherche */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher par numéro ou client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {Object.keys(rowSelection).length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer ({Object.keys(rowSelection).length})
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={() => navigate('/documents/templates')}>
            <Filter className="mr-2 h-4 w-4" /> Modèles
          </Button>

          <Button size="sm" onClick={() => navigate('/documents/create')}>
            <Plus className="mr-2 h-4 w-4" /> Créer
          </Button>
        </div>
      </div>

      {/* Message d'erreur local */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Table TanStack */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none flex items-center gap-1'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <ChevronUp className="h-4 w-4" />,
                            desc: <ChevronDown className="h-4 w-4" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading && documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  Aucun document trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {Object.keys(rowSelection).length} sur {pagination.total} ligne(s) sélectionnée(s)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(pagination.page - 1)}
            disabled={pagination.page <= 1 || loading}
          >
            Précédent
          </Button>
          <div className="text-sm font-medium">
            Page {pagination.page} sur {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages || loading}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
