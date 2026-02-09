import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { FactureInsert, FactureRow } from '@/types/database'
import { useAuthStore } from '@/stores/authStore'

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
  console.log('🧾 FACTURES - Hook appelé depuis le composant')
  const { user, initialized } = useAuthStore()

  return useQuery({
    queryKey,
    queryFn: async (): Promise<FactureWithClient[]> => {
      console.log('🧾 FACTURES - Début récupération des factures')
      
      const { data, error } = await supabase
        .from('factures')
        .select('*, clients(name)')
        .order('created_at', { ascending: false })
        
      if (error) {
        console.error('❌ FACTURES - Erreur récupération:', error)
        throw error
      }
      
      console.log('✅ FACTURES - Factures récupérées:', data?.length || 0)
      return data as FactureWithClient[]
    },
    enabled: !!user && initialized, // ❌ Seulement si connecté et initialisé
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
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
