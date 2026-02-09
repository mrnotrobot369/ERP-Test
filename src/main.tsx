import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: false, // ❌ DÉSACTIVÉ TEMPORAIREMENT pour voir la vraie erreur
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // ❌ DÉSACTIVÉ TEMPORAIREMENT
    },
    mutations: {
      retry: false, // ❌ DÉSACTIVÉ TEMPORAIREMENT
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
