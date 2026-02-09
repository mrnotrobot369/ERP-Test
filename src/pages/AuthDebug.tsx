import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { LoadingSpinner } from '@/components/ui'
import { StatusBadge } from '@/components/ui'
import { testSupabaseConnection, testSupabaseAuth } from '@/lib/supabase-debug'
import { useAuthStore } from '@/stores/authStore'
import { Database, User, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react'

export function AuthDebug() {
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)
  const { user, session, loading, initialized } = useAuthStore()

  const runFullTest = async () => {
    setIsTesting(true)
    try {
      console.log('🧪 AUTH DEBUG - Début test complet')
      
      // Test 1: Configuration Supabase
      console.log('🧪 Test 1: Configuration Supabase')
      const connectionResults = await testSupabaseConnection()
      
      // Test 2: Authentification
      console.log('🧪 Test 2: Authentification')
      const authResults = await testSupabaseAuth()
      
      // Test 3: Store state
      console.log('🧪 Test 3: Store state')
      const storeState = {
        hasUser: !!user,
        userId: user?.id,
        email: user?.email,
        hasSession: !!session,
        sessionId: session?.access_token ? session.access_token.substring(0, 20) + '...' : null,
        loading,
        initialized
      }
      
      const combinedResults = {
        connection: connectionResults,
        auth: authResults,
        store: storeState,
        success: connectionResults.success && authResults.success,
        timestamp: new Date().toISOString()
      }
      
      console.log('🧪 AUTH DEBUG - Résultats complets:', combinedResults)
      setTestResults(combinedResults)
    } catch (err: any) {
      console.error('❌ AUTH DEBUG - Erreur test complet:', err)
      setTestResults({ 
        success: false, 
        error: err.message,
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Debug Authentification</h1>
        <p className="text-gray-600">Diagnostic complet du système d'authentification Supabase</p>
      </div>
      
      {/* Bouton de test */}
      <div className="flex items-center gap-4">
        <button
          onClick={runFullTest}
          disabled={isTesting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isTesting ? (
            <>
              <LoadingSpinner size="sm" />
              Test en cours...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Lancer le test complet
            </>
          )}
        </button>
      </div>

      {/* État actuel du store */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            État Actuel du Store
          </CardTitle>
          <CardDescription>Informations en temps réel de l'état d'authentification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Utilisateur:</span>
              <StatusBadge status={user ? 'success' : 'error'}>
                {user ? `Connecté (${user.email})` : 'Non connecté'}
              </StatusBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Session:</span>
              <StatusBadge status={session ? 'success' : 'warning'}>
                {session ? 'Active' : 'Aucune'}
              </StatusBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Loading:</span>
              <StatusBadge status={loading ? 'loading' : 'success'}>
                {loading ? 'Chargement...' : 'Prêt'}
              </StatusBadge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Initialisé:</span>
              <StatusBadge status={initialized ? 'success' : 'error'}>
                {initialized ? 'Oui' : 'Non'}
              </StatusBadge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats du test */}
      {testResults && (
        <div className="space-y-4">
          <Card className={testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResults.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                )}
                Résultats du Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Connexion */}
                <div>
                  <h4 className="font-semibold mb-2">Connexion Base:</h4>
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={testResults.connection?.success ? 'success' : 'error'}>
                        {testResults.connection?.success ? 'OK' : 'Échec'}
                      </StatusBadge>
                      {testResults.connection?.data && (
                        <span className="text-gray-600">
                          {testResults.connection.data.products || 0} produits
                        </span>
                      )}
                    </div>
                    {testResults.connection?.error && (
                      <p className="text-red-600 mt-1">{testResults.connection.error}</p>
                    )}
                  </div>
                </div>

                {/* Authentification */}
                <div>
                  <h4 className="font-semibold mb-2">Authentification:</h4>
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={testResults.auth?.success ? 'success' : 'error'}>
                        {testResults.auth?.success ? 'OK' : 'Échec'}
                      </StatusBadge>
                      {testResults.auth?.data && (
                        <span className="text-gray-600">
                          {testResults.auth.data.hasUser ? 'Session active' : 'Aucune session'}
                        </span>
                      )}
                    </div>
                    {testResults.auth?.error && (
                      <p className="text-red-600 mt-1">{testResults.auth.error}</p>
                    )}
                  </div>
                </div>

                {/* Store */}
                <div>
                  <h4 className="font-semibold mb-2">Store:</h4>
                  <div className="text-sm space-y-1">
                    <div>User ID: {testResults.store?.userId || 'N/A'}</div>
                    <div>Email: {testResults.store?.email || 'N/A'}</div>
                    <div>Session: {testResults.store?.hasSession ? 'Active' : 'Aucune'}</div>
                    <div>Initialisé: {testResults.store?.initialized ? 'Oui' : 'Non'}</div>
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500 pt-2 border-t">
                  Test effectué: {new Date(testResults.timestamp).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Instructions de Débogage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <div>
                <strong>Ouvrez la console</strong> (F12) pour voir les logs détaillés
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <div>
                <strong>Vérifiez .env.local</strong> avec vos vraies clés Supabase
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <div>
                <strong>Exécutez le script SQL</strong> dans Supabase Dashboard
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">4</span>
              </div>
              <div>
                <strong>Testez la connexion</strong> avec le bouton ci-dessus
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
