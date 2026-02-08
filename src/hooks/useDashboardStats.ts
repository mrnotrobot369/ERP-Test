import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

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
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
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

      if (clientsRes.error) throw clientsRes.error
      if (invoicesMonthRes.error) throw invoicesMonthRes.error
      if (pendingRes.error) throw pendingRes.error

      const pendingRevenue =
        (pendingRes.data ?? []).reduce((sum, row) => sum + Number((row as { total_ttc: number }).total_ttc), 0) ?? 0

      return {
        clientsCount: clientsRes.count ?? 0,
        invoicesThisMonth: invoicesMonthRes.count ?? 0,
        pendingRevenue,
      }
    },
  })
}
