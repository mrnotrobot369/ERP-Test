/**
 * Composant pour le dashboard analytics
 * Analytics dashboard component
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

interface KPICardProps {
  title: string
  value: string
  trend?: number
  color?: string
}

function KPICard({ title, value, trend, color = 'blue' }: KPICardProps) {
  const trendColor = trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-600' : 'text-gray-600'
  const trendIcon = trend && trend > 0 ? '↑' : trend && trend < 0 ? '↓' : ''

  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-2xl font-black text-${color}-600`}>{value}</p>
          </div>
          {trend ? (
            <div className={`text-xs font-bold px-2 py-1 rounded-full bg-slate-50 ${trendColor}`}>
              {trendIcon}{Math.abs(trend)}%
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export function DocumentAnalytics() {
  const [kpiData, setKpiData] = useState({
    totalRevenue: 0,
    paidAmount: 0,
    outstandingAmount: 0,
    overdueAmount: 0,
    avgPaymentDays: 0
  })
  const [topClients, setTopClients] = useState<Array<{ name: string; revenue: number; count: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const [
        totalRevenueResult,
        paidResult,
        outstandingResult,
        overdueResult,
        paymentDaysResult
      ] = await Promise.all([
        calculateTotalRevenue(startOfMonth),
        calculatePaidAmount(startOfMonth),
        calculateOutstandingAmount(),
        calculateOverdueAmount(),
        calculateAveragePaymentDays()
      ])

      setKpiData({
        totalRevenue: totalRevenueResult,
        paidAmount: paidResult,
        outstandingAmount: outstandingResult,
        overdueAmount: overdueResult,
        avgPaymentDays: paymentDaysResult
      })

      const topClientsData = await getTopClientsData(startOfMonth)
      setTopClients(topClientsData)

    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalRevenue = async (startDate: Date): Promise<number> => {
    const { data } = await (supabase
      .from('documents') as any)
      .select('total_amount')
      .gte('issue_date', startDate.toISOString())
      .eq('status', 'paid');

    return (data as any[])?.reduce((sum: number, doc: any) => sum + (doc.total_amount || 0), 0) || 0;
  }

  const calculatePaidAmount = async (startDate: Date): Promise<number> => {
    const { data } = await (supabase
      .from('documents') as any)
      .select('total_amount')
      .gte('paid_date', startDate.toISOString())
      .eq('status', 'paid');

    return (data as any[])?.reduce((sum: number, doc: any) => sum + (doc.total_amount || 0), 0) || 0;
  }

  const calculateOutstandingAmount = async (): Promise<number> => {
    const { data } = await (supabase
      .from('documents') as any)
      .select('total_amount')
      .in('status', ['sent', 'accepted']);

    return (data as any[])?.reduce((sum: number, doc: any) => sum + (doc.total_amount || 0), 0) || 0;
  }

  const calculateOverdueAmount = async (): Promise<number> => {
    const { data } = await (supabase
      .from('documents') as any)
      .select('total_amount')
      .eq('status', 'sent')
      .lt('due_date', new Date().toISOString());

    return (data as any[])?.reduce((sum: number, doc: any) => sum + (doc.total_amount || 0), 0) || 0;
  }

  const calculateAveragePaymentDays = async (): Promise<number> => {
    const { data } = await (supabase
      .from('documents') as any)
      .select('issue_date, paid_date')
      .eq('status', 'paid')
      .not('paid_date', 'is', null);

    if (!data || (data as any[]).length === 0) return 0;

    const totalDays = (data as any[]).reduce((sum: number, doc: any) => {
      const issueDate = new Date(doc.issue_date);
      const paidDate = new Date(doc.paid_date);
      const days = Math.floor((paidDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    return Math.round(totalDays / (data as any[]).length);
  }

  const getTopClientsData = async (startDate: Date): Promise<Array<{ name: string; revenue: number; count: number }>> => {
    const { data } = await (supabase
      .from('documents') as any)
      .select(`
        total_amount,
        clients!documents_client_id_fkey(name)
      `)
      .gte('issue_date', startDate.toISOString())
      .eq('status', 'paid');

    const clientRevenue = new Map<string, { revenue: number; count: number }>();

    (data as any[])?.forEach((doc: any) => {
      const clientName = doc.clients?.name || 'Client inconnu';
      const current = clientRevenue.get(clientName) || { revenue: 0, count: 0 };
      clientRevenue.set(clientName, {
        revenue: current.revenue + (doc.total_amount || 0),
        count: current.count + 1
      });
    });

    return Array.from(clientRevenue.entries())
      .map(([name, data]: [string, any]) => ({ name, revenue: data.revenue, count: data.count }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 5);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  const currencyFormatter = new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0
  });

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Revenu total"
          value={currencyFormatter.format(kpiData.totalRevenue)}
          trend={12}
          color="blue"
        />
        <KPICard
          title="Montant payé"
          value={currencyFormatter.format(kpiData.paidAmount)}
          color="green"
        />
        <KPICard
          title="En attente"
          value={currencyFormatter.format(kpiData.outstandingAmount)}
          color="orange"
        />
        <KPICard
          title="En retard"
          value={currencyFormatter.format(kpiData.overdueAmount)}
          color="red"
        />
        <KPICard
          title="Délai moyen"
          value={`${kpiData.avgPaymentDays}j`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Summary */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">Résumé de performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-3xl font-black text-emerald-600">{kpiData.totalRevenue > 0 ? Math.round((kpiData.paidAmount / kpiData.totalRevenue) * 100) : 0}%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Taux de paiement</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-3xl font-black text-rose-600">{kpiData.outstandingAmount > 0 ? Math.round((kpiData.overdueAmount / kpiData.outstandingAmount) * 100) : 0}%</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Impayés critiques</p>
              </div>
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-3xl font-black text-indigo-600">{topClients.length}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Clients actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topClients.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-4">Aucune donnée</p>
              ) : (
                topClients.map((client, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{client.name}</p>
                      <p className="text-[10px] text-slate-400">{client.count} docs</p>
                    </div>
                    <p className="text-xs font-black text-blue-600">
                      {currencyFormatter.format(client.revenue)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
