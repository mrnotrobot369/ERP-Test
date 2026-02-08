import { useState } from 'react'
import { Button } from '@/components/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui'
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@/components/ui'
import {
  useFactures,
  useCreateFacture,
  useUpdateFacture,
  type FactureWithClient,
} from '@/hooks/useFactures'
import { useClients } from '@/hooks/useClients'
import type { FactureInsert } from '@/types/database'
import { Plus, Loader2, Pencil } from 'lucide-react'

const STATUS_LABELS: Record<FactureWithClient['status'], string> = {
  draft: 'Brouillon',
  sent: 'Envoyée',
  paid: 'Payée',
}

const STATUS_BADGE_VARIANT = {
  draft: 'secondary' as const,
  sent: 'warning' as const,
  paid: 'success' as const,
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('fr-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(value)
}

/** ISO date string → YYYY-MM-DD pour input type="date" */
function toDateInputValue(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 10)
}

export function Factures() {
  const [open, setOpen] = useState(false)
  const [editingFacture, setEditingFacture] = useState<FactureWithClient | null>(
    null
  )
  const { data: factures, isLoading, error } = useFactures()
  const { data: clients } = useClients()
  const createFacture = useCreateFacture()
  const updateFacture = useUpdateFacture()

  const [clientId, setClientId] = useState('')
  const [number, setNumber] = useState('')
  const [status, setStatus] = useState<'draft' | 'sent' | 'paid'>('draft')
  const [totalHt, setTotalHt] = useState('')
  const [totalTtc, setTotalTtc] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleOpenCreate = () => {
    setEditingFacture(null)
    setClientId('')
    setNumber('')
    setStatus('draft')
    setTotalHt('')
    setTotalTtc('')
    setDueDate('')
    setOpen(true)
  }

  const handleOpenEdit = (f: FactureWithClient) => {
    setEditingFacture(f)
    setClientId(f.client_id)
    setNumber(f.number)
    setStatus(f.status)
    setTotalHt(String(f.total_ht))
    setTotalTtc(String(f.total_ttc))
    setDueDate(toDateInputValue(f.due_date))
    setOpen(true)
  }

  const handleClose = (open: boolean) => {
    if (!open) setEditingFacture(null)
    setOpen(open)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId.trim()) return
    const ht = parseFloat(totalHt.replace(',', '.'))
    const ttc = parseFloat(totalTtc.replace(',', '.'))
    if (Number.isNaN(ht) || Number.isNaN(ttc)) return
    const payload = {
      client_id: clientId,
      number: number.trim(),
      status,
      total_ht: ht,
      total_ttc: ttc,
      due_date: dueDate.trim() || null,
    }
    try {
      if (editingFacture) {
        await updateFacture.mutateAsync({
          id: editingFacture.id,
          payload: payload as Parameters<typeof updateFacture.mutateAsync>[0]['payload'],
        })
      } else {
        await createFacture.mutateAsync(payload as FactureInsert)
      }
      setOpen(false)
      setEditingFacture(null)
    } catch {
      // Erreur affichée via isError
    }
  }

  const isPending = createFacture.isPending || updateFacture.isPending
  const isError = createFacture.isError || updateFacture.isError
  const errorMessage = (createFacture.error ??
    updateFacture.error) as Error | undefined

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Factures</h1>
          <p className="text-muted-foreground">
            Création et suivi des factures
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Nouvelle facture
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des factures</CardTitle>
          <CardDescription>
            Numéro, client, statut, montant et échéance. Cliquez sur le crayon pour modifier.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          {error && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              Erreur : {(error as Error).message}. Vérifiez que la table
              &quot;factures&quot; existe et que la relation vers
              &quot;clients&quot; est configurée (clé étrangère client_id).
            </p>
          )}
          {!isLoading && !error && (!factures || factures.length === 0) && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucune facture. Cliquez sur &quot;Nouvelle facture&quot; pour en
              créer une.
            </p>
          )}
          {!isLoading && !error && factures && factures.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">N°</th>
                    <th className="px-4 py-3 text-left font-medium">Client</th>
                    <th className="px-4 py-3 text-left font-medium">Statut</th>
                    <th className="px-4 py-3 text-right font-medium">
                      Total TTC
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Échéance</th>
                    <th className="w-10 px-2 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {factures.map((f) => (
                    <tr key={f.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{f.number}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {f.clients?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_BADGE_VARIANT[f.status]}>
                          {STATUS_LABELS[f.status]}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        {formatMoney(f.total_ttc)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {formatDate(f.due_date)}
                      </td>
                      <td className="px-2 py-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(f)}
                          aria-label="Modifier la facture"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFacture ? 'Modifier la facture' : 'Nouvelle facture'}
            </DialogTitle>
            <DialogDescription>
              {editingFacture
                ? 'Modifiez le statut, les montants ou l\'échéance.'
                : 'Choisissez le client et renseignez le numéro, le statut et les montants.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select
                value={clientId}
                onValueChange={setClientId}
                required
                disabled={!!editingFacture}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {(clients ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="facture-number">Numéro de facture *</Label>
              <Input
                id="facture-number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="ex. FAC-2025-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select
                value={status}
                onValueChange={(v) =>
                  setStatus(v as 'draft' | 'sent' | 'paid')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{STATUS_LABELS.draft}</SelectItem>
                  <SelectItem value="sent">{STATUS_LABELS.sent}</SelectItem>
                  <SelectItem value="paid">{STATUS_LABELS.paid}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facture-ht">Total HT (CHF) *</Label>
                <Input
                  id="facture-ht"
                  type="text"
                  inputMode="decimal"
                  value={totalHt}
                  onChange={(e) => setTotalHt(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facture-ttc">Total TTC (CHF) *</Label>
                <Input
                  id="facture-ttc"
                  type="text"
                  inputMode="decimal"
                  value={totalTtc}
                  onChange={(e) => setTotalTtc(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="facture-due">Date d&apos;échéance</Label>
              <Input
                id="facture-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            {isError && errorMessage && (
              <p className="text-sm text-destructive">{errorMessage.message}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enregistrement…
                  </>
                ) : editingFacture ? (
                  'Mettre à jour'
                ) : (
                  'Créer la facture'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
