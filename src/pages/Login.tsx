import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Input } from '@/components/ui'
import { LoadingSpinner } from '@/components/ui'
import { StatusBadge } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const signIn = useAuthStore((s) => s.signIn)
  const loading = useAuthStore((s) => s.loading)

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/'
  if (user) return <Navigate to={from} replace />

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowSuccess(false)
    
    const { error: err } = await signIn(email, password)
    if (err) {
      setError(err.message)
      return
    }
    
    setShowSuccess(true)
    setTimeout(() => {
      navigate(from, { replace: true })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl shadow-lg mb-4">
            <span className="text-white font-bold text-xl">ERP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue</h1>
          <p className="text-gray-600">Connectez-vous à votre espace de gestion</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Connexion</CardTitle>
            <CardDescription className="text-center">
              Utilisez vos identifiants pour accéder à l'ERP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Erreur de connexion</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {showSuccess && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Connexion réussie</p>
                  <p className="text-sm text-green-600 mt-1">Redirection en cours...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="email"
                type="email"
                label="Adresse email"
                placeholder="vous@entreprise.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                icon={<Mail className="h-4 w-4" />}
              />

              <Input
                id="password"
                type="password"
                label="Mot de passe"
                placeholder="•••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                icon={<Lock className="h-4 w-4" />}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                loading={loading}
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}

                <button 
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Créer un compte
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <StatusBadge status="info">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Système opérationnel
            </span>
          </StatusBadge>
          <p className="text-xs text-gray-500 mt-2">
            Version 1.0.0 • Sécurisé avec Supabase
          </p>
        </div>
      </div>
    </div>
  )
}
