import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { FactureInsert, FactureRow } from '@/types/database'

const queryKey = ['factures'] as const

/** Facture avec nom du client (pour affichage liste). */
export type FactureWithClient = {
  id: string
  created_at: string
  updated_at: string
  client_id: string
  number: string
  status: 'draft' | 'sent' | 'paid'
  total_ht: number
  total_ttc: number
  due_date: string | null
  clients: { name: string } | null
}

/** Liste des factures avec nom client (TanStack Query). */
export function useFactures() {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('factures')
        .select('*, clients(name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as FactureWithClient[]
    },
  })
}

/** Création d'une facture + invalidation du cache. */
export function useCreateFacture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: FactureInsert) => {
      // Assertion nécessaire : le client Supabase typé peut inférer 'never' selon la version des types.
      const { data, error } = await supabase
        .from('factures')
        .insert(payload as never)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}

/** Mise à jour d'une facture + invalidation du cache. */
export function useUpdateFacture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: FactureRow['id']
      payload: Partial<Omit<FactureRow, 'id' | 'created_at'>>
    }) => {
      const body = { ...payload, updated_at: new Date().toISOString() }
      const { data, error } = await supabase
        .from('factures')
        .update(body as never)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
  })
}
