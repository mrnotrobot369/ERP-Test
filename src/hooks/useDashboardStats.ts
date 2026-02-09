import { useQuery } from '@tanstack/react-query'
import supabase from '@/lib/supabaseClient' // ❌ SINGLETON CLIENT
import { useAuthStore } from '@/stores/authStore'

export interface DashboardStats {
  clientsCount: number
  invoicesThisMonth: number
  pendingRevenue: number
}

function startOfMonthISO(): string {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

/** Stats dashboard : nombre de clients, factures du mois, CA en attente (draft + sent). */
export function useDashboardStats() {
  console.log('📊 DASHBOARD STATS - Hook appelé depuis le composant')
  const { user, initialized } = useAuthStore()

  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      console.log('📊 DASHBOARD STATS - Début récupération des stats')
      
      const startMonth = startOfMonthISO()

      const [clientsRes, invoicesMonthRes, pendingRes] = await Promise.all([
        supabase.from('clients').select('*', { count: 'exact', head: true }),
        supabase
          .from('factures')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startMonth),
        supabase
          .from('factures')
          .select('total_ttc')
          .in('status', ['draft', 'sent']),
      ])

      if (clientsRes.error) {
        console.error('❌ DASHBOARD STATS - Erreur clients:', clientsRes.error)
        throw clientsRes.error
      }
      if (invoicesMonthRes.error) {
        console.error('❌ DASHBOARD STATS - Erreur factures mois:', invoicesMonthRes.error)
        throw invoicesMonthRes.error
      }
      if (pendingRes.error) {
        console.error('❌ DASHBOARD STATS - Erreur CA en attente:', pendingRes.error)
        throw pendingRes.error
      }

      const pendingRevenue =
        (pendingRes.data ?? []).reduce((sum, row) => sum + Number((row as { total_ttc: number }).total_ttc), 0) ?? 0

      const stats = {
        clientsCount: clientsRes.count ?? 0,
        invoicesThisMonth: invoicesMonthRes.count ?? 0,
        pendingRevenue,
      }
      
      console.log('✅ DASHBOARD STATS - Stats récupérées:', stats)
      return stats
    },
    enabled: !!user && initialized, // N'exécuter que si l'utilisateur est connecté et le store initialisé
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
