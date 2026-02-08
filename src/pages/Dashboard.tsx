import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useProducts, useLowStockProducts } from '@/hooks/use-products'
import { Loader2, Users, FileText, Banknote, Package, AlertTriangle } from 'lucide-react'

function formatMoney(value: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(value)
}

export function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats()
  const { data: products } = useProducts()
  const { data: lowStockProducts } = useLowStockProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d’ensemble de l’activité en temps réel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Clients</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {error && (
              <p className="text-sm text-destructive">
                Erreur chargement
              </p>
            )}
            {!isLoading && !error && (
              <>
                <CardTitle className="text-3xl">{stats?.clientsCount ?? 0}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Total clients actifs
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Factures ce mois</CardDescription>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {!isLoading && !error && (
              <>
                <CardTitle className="text-3xl">
                  {stats?.invoicesThisMonth ?? 0}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Créées ce mois
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Produits</CardDescription>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {!isLoading && !error && (
              <>
                <CardTitle className="text-3xl">
                  {products?.length ?? 0}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Total produits
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Stock faible</CardDescription>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {!isLoading && !error && (
              <>
                <CardTitle className="text-3xl">
                  {lowStockProducts?.length ?? 0}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Produits à réapprovisionner
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>CA en attente</CardDescription>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading && (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            )}
            {!isLoading && !error && (
              <>
                <CardTitle className="text-3xl tabular-nums">
                  {stats != null ? formatMoney(stats.pendingRevenue) : '—'}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Brouillons + envoyées non payées
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
