import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/features/auth/stores/authStore'
import type { DashboardStats, DashboardMetrics } from '@/types/dashboard'

export function useDashboardStats() {
  const user = useAuthStore((state) => state.user)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalRevenue: 0,
    totalOrders: 0,
    activeClients: 0,
    clientsCount: 0,
    invoicesThisMonth: 0,
    pendingRevenue: 0,
  })
  const [metrics] = useState<DashboardMetrics>({
    revenueByMonth: [],
    topProducts: [],
    clientGrowth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        setError(null)

        // Fetch products count
        const { count: productsCount, error: productsError } =
          await supabase.from('products').select('*', { count: 'exact', head: true })

        if (productsError) console.error(productsError)

        // Fetch metrics from documents table
        const { data: docsResult, error: docsQueryError } =
          await (supabase.from('documents' as any)
            .select('total_amount, status, created_at, client_id, type') as any)

        let totalRevenue = 0
        let totalOrders = 0
        let pendingRevenue = 0
        let invoicesThisMonth = 0
        const activeClientsSet = new Set()

        if (!docsQueryError && docsResult) {
          const docs = docsResult as any[]
          const now = new Date()
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

          docs.forEach(doc => {
            if (doc.status === 'paid') {
              totalRevenue += (doc.total_amount || 0)
            }
            if (doc.status === 'sent' || doc.status === 'accepted') {
              pendingRevenue += (doc.total_amount || 0)
            }
            if (doc.type === 'invoice') {
              totalOrders++
              const docDate = new Date(doc.created_at)
              if (docDate >= startOfMonth) {
                invoicesThisMonth++
              }
            }
            activeClientsSet.add(doc.client_id)
          })
        }

        // Fetch clients count
        const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true })

        setStats(prev => ({
          ...prev,
          totalProducts: productsCount || 0,
          totalRevenue,
          totalOrders,
          activeClients: activeClientsSet.size,
          clientsCount: clientsCount || 0,
          invoicesThisMonth,
          pendingRevenue,
        }))

        setLoading(false)
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err)
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  return { stats, metrics, loading, error }
}