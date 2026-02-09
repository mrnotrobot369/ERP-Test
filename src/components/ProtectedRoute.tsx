import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

/**
 * Redirige vers /login si l'utilisateur n'est pas authentifié.
 * Affiche un loader pendant la récupération de la session.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  console.log('🛡️ PROTECTED ROUTE - Render du composant')
  const location = useLocation()
  const { user, loading, initialized } = useAuthStore()

  console.log('🛡️ PROTECTED ROUTE - État:', { user: !!user, loading, initialized })

  if (loading || !initialized) {
    console.log('🛡️ PROTECTED ROUTE - Affichage loader')
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    console.log('🛡️ PROTECTED ROUTE - Redirection vers login')
    return <Navigate to="/login" state={{ from: location }} replace /> 
  }

  console.log('🛡️ PROTECTED ROUTE - Accès autorisé')
  return <>{children}</>
}
