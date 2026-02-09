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
import { Input, Label, Textarea } from '@/components/ui'
import { useClients, useCreateClient, useUpdateClient } from '@/features/clients/hooks/useClients'
import type { ClientInsert, ClientRow } from '@/types/database'
import { Plus, Loader2, Pencil } from 'lucide-react'

export function Clients() {
  const [open, setOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null)
  const { data: clients, isLoading, error } = useClients()
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  // Validation errors state
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const handleOpenCreate = () => {
    setEditingClient(null)
    setName('')
    setEmail('')
    setPhone('')
    setAddress('')
    setErrors({})
    setOpen(true)
  }

  const handleOpenEdit = (c: ClientRow) => {
    setEditingClient(c)
    setName(c.name)
    setEmail(c.email ?? '')
    setPhone(c.phone ?? '')
    setAddress(c.address ?? '')
    setErrors({})
    setOpen(true)
  }

  const handleClose = (open: boolean) => {
    if (!open) setEditingClient(null)
    setOpen(open)
  }

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Le nom est requis'
    } else if (name.length > 100) {
      newErrors.name = 'Le nom ne peut pas dépasser 100 caractères'
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email invalide'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const payload = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      address: address.trim() || null,
    }
    try {
      if (editingClient) {
        await updateClient.mutateAsync({ id: editingClient.id, payload })
      } else {
        await createClient.mutateAsync(payload as ClientInsert)
      }
      setOpen(false)
      setEditingClient(null)
    } catch {
      // Erreur affichée via isError
    }
  }

  const isPending = createClient.isPending || updateClient.isPending
  const isError = createClient.isError || updateClient.isError
  const errorMessage = (createClient.error ?? updateClient.error) as Error | undefined

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Liste et gestion des clients
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            Données chargées depuis Supabase. Cliquez sur le crayon pour modifier.
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
              &quot;clients&quot; existe dans Supabase et que RLS autorise la
              lecture.
            </p>
          )}
          {!isLoading && !error && (!clients || clients.length === 0) && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucun client. Cliquez sur &quot;Nouveau client&quot; pour en
              ajouter un.
            </p>
          )}
          {!isLoading && !error && clients && clients.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Nom</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Téléphone</th>
                    <th className="px-4 py-3 text-left font-medium">Adresse</th>
                    <th className="w-10 px-2 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {c.email ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {c.phone ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {c.address ?? '—'}
                      </td>
                      <td className="px-2 py-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenEdit(c)}
                          aria-label="Modifier le client"
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Modifier le client' : 'Nouveau client'}
            </DialogTitle>
            <DialogDescription>
              {editingClient
                ? 'Modifiez les informations du client.'
                : 'Renseignez les informations du client. Le nom est obligatoire.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nom *</Label>
              <Input
                id="client-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Raison sociale ou nom"
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@exemple.ch"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-phone">Téléphone</Label>
              <Input
                id="client-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+41 00 000 00 00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-address">Adresse</Label>
              <Textarea
                id="client-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Rue, NPA, Ville"
                rows={2}
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
                ) : editingClient ? (
                  'Mettre à jour'
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
