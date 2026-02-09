/**
 * Page de détails d'un document (Enterprise Grade)
 * Specialized document detail view with live PDF preview
 */

import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Edit,
  Download,
  Send,
  MoreVertical,
  FileText,
  Clock,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

import { documentService } from '../services/documentService'
import { usePDFGeneration } from '../hooks/usePDFGeneration'
import { DocumentPDF } from '../components/DocumentPDF'
import type { Document, DocumentStatus } from '../types/document'

import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const STATUS_CONFIG: Record<DocumentStatus, { label: string, color: string, icon: any }> = {
  draft: { label: 'Brouillon', color: 'bg-slate-100 text-slate-800', icon: Clock },
  sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-800', icon: Send },
  accepted: { label: 'Accepté', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle2 },
  paid: { label: 'Payé', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  overdue: { label: 'En retard', color: 'bg-rose-100 text-rose-800', icon: AlertCircle },
  cancelled: { label: 'Annulé', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
}

export default function DocumentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { downloadPDF, loading: pdfLoading } = usePDFGeneration()

  useEffect(() => {
    async function loadDocument() {
      if (!id) return
      try {
        setLoading(true)
        const data = await documentService.getDocument(id)
        if (data) {
          setDocument(data)
        } else {
          setError('Document non trouvé')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }
    loadDocument()
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-1 h-[600px]" />
          <Skeleton className="lg:col-span-2 h-[800px]" />
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="container mx-auto py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">{error || 'Erreur inconnue'}</h2>
        <Button onClick={() => navigate('/documents')}>Retour aux documents</Button>
      </div>
    )
  }

  const status = STATUS_CONFIG[document.status]
  const StatusIcon = status.icon

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <Breadcrumbs
          items={[
            { label: 'Tableau de bord', href: '/' },
            { label: 'Documents', href: '/documents' },
            { label: document.document_number }
          ]}
        />

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size="sm" onClick={() => navigate(`/documents/edit/${document.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => downloadPDF(document)}
            disabled={pdfLoading}
          >
            {pdfLoading ? <Clock className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Télécharger PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Statut</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => documentService.updateDocumentStatus(document.id, 'sent')}>
                Marquer comme envoyé
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => documentService.updateDocumentStatus(document.id, 'paid')}>
                Marquer comme payé
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Annuler le document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Details & Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Résumé</CardTitle>
                <Badge className={status.color}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Numéro</p>
                  <p className="font-mono font-medium">{document.document_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Client</p>
                  <p className="font-medium">{document.client?.name || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{document.client?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</p>
                  <p className="text-xl font-bold text-primary">
                    {new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(document.total_amount)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails de facturation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date d'émission:</span>
                <span className="font-medium">{new Date(document.issue_date).toLocaleDateString('fr-CH')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Échéance:</span>
                <span className="font-medium text-rose-600">
                  {document.due_date ? new Date(document.due_date).toLocaleDateString('fr-CH') : 'Immédiate'}
                </span>
              </div>
              <div className="pt-2 border-t flex justify-between">
                <span className="text-muted-foreground">Sous-total HT:</span>
                <span>{new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(document.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA:</span>
                <span>{new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF' }).format(document.tax_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {document.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{document.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main: PDF Preview */}
        <div className="lg:col-span-2">
          <div className="bg-slate-500 p-4 md:p-8 rounded-xl shadow-inner min-h-[1000px] flex justify-center">
            <div className="origin-top scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform duration-300">
              <DocumentPDF document={document} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
