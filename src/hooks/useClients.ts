import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ClientInsert, ClientRow } from '@/types/database'
import { useAuthStore } from '@/stores/authStore'

const queryKey = ['clients'] as const

/** Liste des clients depuis Supabase (TanStack Query). */
export function useClients() {
  console.log('👥 CLIENTS - Hook appelé depuis le composant')
  const { user, initialized } = useAuthStore()

  return useQuery({
    queryKey,
    queryFn: async (): Promise<ClientRow[]> => {
      console.log('👥 CLIENTS - Début récupération des clients')
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })
        
      if (error) {
        console.error('❌ CLIENTS - Erreur récupération:', error)
        throw error
      }
      
      console.log('✅ CLIENTS - Clients récupérés:', data?.length || 0)
      return data as ClientRow[]
    },
    enabled: !!user && initialized, // ❌ Seulement si connecté et initialisé
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

/** Création d'un client + invalidation du cache liste. */
export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ClientInsert) => {
      const { data, error } = await supabase
        .from('clients')
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

/** Mise à jour d'un client + invalidation du cache. */
export function useUpdateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: ClientRow['id']
      payload: Partial<Omit<ClientRow, 'id' | 'created_at'>>
    }) => {
      const { data, error } = await supabase
        .from('clients')
        .update({ ...payload, updated_at: new Date().toISOString() } as never)
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
