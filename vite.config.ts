import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Configuration Vite pour l'ERP React + Supabase.
 * Path alias @/ → src/ pour imports propres.
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          vendor: ['react', 'react-dom', 'react-router-dom'],

          // State management and data fetching
          query: ['@tanstack/react-query', 'zustand'],

          // Database and auth
          supabase: ['@supabase/supabase-js'],

          // UI components and styling
          ui: [
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'lucide-react',
          ],

          // Forms and validation
          forms: ['@hookform/resolvers', 'react-hook-form', 'zod'],

          // Charts and analytics
          charts: ['recharts'],

          // PDF generation
          pdf: ['jspdf', 'jspdf-autotable', 'html2canvas'],

          // Date utilities
          date: ['date-fns'],

          // Document features (lazy loaded)
          documents: [
            './src/features/documents/components/BulkActions',
            './src/features/documents/components/SmartSearch',
            './src/features/documents/components/TemplateEditor',
            './src/features/documents/components/DocumentHistory',
            './src/features/documents/components/DocumentAnalytics',
            './src/features/documents/components/PaymentTracker',
          ],

          // Product features (lazy loaded)
          products: [
            './src/features/products/components/ProductCard',
            './src/features/products/pages/ProductsPage',
          ],
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            const fileName = facadeModuleId.split('/').pop()?.replace(/\.[^.]*$/, '')
            return `assets/${fileName}-[hash].js`
          }
          return 'assets/[name]-[hash].js'
        },
      },
    },
  },
})
