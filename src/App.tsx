import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/routes'
import { useAuthStore } from '@/stores/authStore'

/**
 * Initialise l’auth Supabase au démarrage et affiche le routeur.
 */
function App() {
  const init = useAuthStore((s) => s.init)

  useEffect(() => {
    init()
  }, [init])

  return <RouterProvider router={router} />
}

export default App
