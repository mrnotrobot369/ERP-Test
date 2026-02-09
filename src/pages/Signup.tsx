import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Input } from '@/components/ui'
import { LoadingSpinner } from '@/components/ui'
import { StatusBadge } from '@/components/ui'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react'

export function Signup() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const signUp = useAuthStore((s) => s.signUp)
  const loading = useAuthStore((s) => s.loading)

  if (user) return <Navigate to="/" replace />

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateForm = (): boolean => {
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return false
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return false
    }
    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    const { error: err } = await signUp(email, password)
    if (err) {
      setError(err.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-xl shadow-lg mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Inscription réussie !</h1>
            <p className="text-gray-600">Votre compte a été créé avec succès</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <StatusBadge status="success">
                  Compte créé avec succès
                </StatusBadge>
                <p className="text-sm text-gray-600">
                  Vous pouvez maintenant vous connecter avec vos identifiants
                </p>
              </div>

              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12 text-base font-semibold"
              >
                Aller à la connexion
              </Button>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <StatusBadge status="info">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Prêt à démarrer
              </span>
            </StatusBadge>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl shadow-lg mb-4">
            <span className="text-white font-bold text-xl">ERP</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Créer votre compte</h1>
          <p className="text-gray-600">Rejoignez votre espace de gestion</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-gray-900">Inscription</CardTitle>
            <CardDescription className="text-center">
              Créez votre compte pour accéder à l'ERP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Erreur d'inscription</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                id="fullName"
                type="text"
                label="Nom complet"
                placeholder="Jean Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                icon={<User className="h-4 w-4" />}
              />

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
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                icon={<Lock className="h-4 w-4" />}
              />

              <Input
                id="confirm-password"
                type="password"
                label="Confirmer le mot de passe"
                placeholder="Répétez le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                icon={<Lock className="h-4 w-4" />}
              />

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                loading={loading}
                disabled={loading || !email || !password || !confirmPassword || !fullName}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Déjà un compte ?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Se connecter
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
              Sécurisé et fiable
            </span>
          </StatusBadge>
          <p className="text-xs text-gray-500 mt-2">
            Version 1.0.0 • Protection des données garantie
          </p>
        </div>
      </div>
    </div>
  )
}
