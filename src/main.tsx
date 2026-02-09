import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import '@/styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: false, // ❌ KILL SWITCH - FORCE NO RETRY
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // ❌ KILL SWITCH - NO AUTO RECONNECT
      refetchInterval: false, // ❌ KILL SWITCH - NO INTERVAL
      refetchIntervalInBackground: false, // ❌ KILL SWITCH - NO BG
      refetchOnMount: false, // ❌ KILL SWITCH - NO MOUNT
    },
    mutations: {
      retry: false, // ❌ KILL SWITCH - NO MUTATION RETRY
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
