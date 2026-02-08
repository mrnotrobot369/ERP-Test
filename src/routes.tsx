import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Dashboard } from '@/pages/Dashboard'
import { Clients } from '@/pages/Clients'
import { Factures } from '@/pages/Factures'
import { Products } from '@/pages/Products'
import { ProductNew } from '@/pages/ProductNew'
import { ProductEdit } from '@/pages/ProductEdit'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'clients', element: <Clients /> },
      { path: 'factures', element: <Factures /> },
      { path: 'products', element: <Products /> },
      { path: 'products/new', element: <ProductNew /> },
      { path: 'products/:id/edit', element: <ProductEdit /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
