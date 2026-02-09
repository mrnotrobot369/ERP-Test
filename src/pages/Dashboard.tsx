import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { LoadingSpinner } from '@/components/ui'
import { StatusBadge } from '@/components/ui'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useProducts, useLowStockProducts } from '@/hooks/use-products'
import { testSupabaseConnection, testSupabaseAuth } from '@/lib/supabase-debug'
import { Users, FileText, Banknote, Package, AlertTriangle, RefreshCw, Database, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

function formatMoney(value: number): string {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(value)
}

export function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats()
  const { data: products, isLoading: productsLoading } = useProducts()
  const { data: lowStockProducts, isLoading: lowStockLoading } = useLowStockProducts()
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const runConnectionTest = async () => {
    setIsTestingConnection(true)
    try {
      console.log('🧪 DASHBOARD - Début test de connexion complet')
      
      // Test de connexion à la base
      const connectionResults = await testSupabaseConnection()
      
      // Test d'authentification
      const authResults = await testSupabaseAuth()
      
      const combinedResults = {
        connection: connectionResults,
        auth: authResults,
        success: connectionResults.success && authResults.success,
        timestamp: new Date().toISOString()
      }
      
      console.log('🧪 DASHBOARD - Résultats combinés:', combinedResults)
      setTestResults(combinedResults)
    } catch (err: any) {
      console.error('❌ DASHBOARD - Erreur test global:', err)
      setTestResults({ 
        success: false, 
        error: err.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  useEffect(() => {
    // Test automatique au chargement seulement si aucune donnée et pas d'erreur
    if (!stats && !products && !error && !isLoading && !productsLoading) {
      console.log('🧪 DASHBOARD - Auto-test au chargement')
      runConnectionTest()
    }
  }, [stats, products, error, isLoading, productsLoading])

  // Loading state unifié
  const isAnyLoading = isLoading || productsLoading || lowStockLoading || isTestingConnection

  if (isAnyLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de l'activité en temps réel</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="flex items-center justify-center h-24">
                <LoadingSpinner size="md" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de l'activité en temps réel</p>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Erreur de chargement</h3>
                <p className="text-red-600 mt-2">{error.message}</p>
                <p className="text-sm text-red-500 mt-4">
                  Vérifiez votre connexion Supabase ou les permissions RLS.
                </p>
                <button
                  onClick={runConnectionTest}
                  disabled={isTestingConnection}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isTestingConnection ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Test en cours...
                    </>
                  ) : (
                    'Tester la connexion'
                  )}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header avec test de connexion */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de l'activité en temps réel</p>
        </div>
        
        <button
          onClick={runConnectionTest}
          disabled={isTestingConnection}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isTestingConnection ? (
            <>
              <LoadingSpinner size="sm" />
              Test en cours...
            </>
          ) : (
            <>
              <Database className="h-4 w-4" />
              Tester la connexion
            </>
          )}
        </button>
      </div>

      {/* Résultats du test */}
      {testResults && (
        <Card className={testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardContent className="p-4">
            <div className="space-y-3">
              {testResults.success ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-semibold text-green-800">Connexion réussie</h4>
                      <p className="text-sm text-green-600">
                        Base: {testResults.connection?.data?.products || 0} produits | 
                        Auth: {testResults.auth?.data?.hasUser ? 'Session active' : 'Aucune session'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-800">Échec de connexion</h4>
                      <p className="text-sm text-red-600">{testResults.error}</p>
                    </div>
                  </div>
                </>
              )}
              
              <div className="text-xs text-gray-500">
                Test: {new Date(testResults.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Clients</CardDescription>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl">{stats?.clientsCount ?? 0}</CardTitle>
            <p className="text-xs text-gray-600">Total clients actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Factures ce mois</CardDescription>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl">{stats?.invoicesThisMonth ?? 0}</CardTitle>
            <p className="text-xs text-gray-600">Créées ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Produits</CardDescription>
            <Package className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl">{products?.length ?? 0}</CardTitle>
            <p className="text-xs text-gray-600">Total produits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Stock faible</CardDescription>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl">{lowStockProducts?.length ?? 0}</CardTitle>
            <p className="text-xs text-gray-600">Produits à réapprovisionner</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>CA en attente</CardDescription>
            <Banknote className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-3xl tabular-nums">
              {stats != null ? formatMoney(stats.pendingRevenue) : '—'}
            </CardTitle>
            <p className="text-xs text-gray-600">Brouillons + envoyées non payées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Tendance</CardDescription>
            <TrendingUp className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <StatusBadge status="success">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Système opérationnel
                </span>
              </StatusBadge>
              <p className="text-sm text-gray-600 mt-2">
                Version 1.0.0 • Dernière synchronisation: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
