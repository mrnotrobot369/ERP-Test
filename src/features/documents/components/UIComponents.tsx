/**
 * États vides pour les composants
 * Empty states for components
 */

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { FileText, Plus } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="text-center py-12">
    <div className="mx-auto max-w-md">
      <div className="mb-4">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          {action.label}
        </button>
      )}
    </div>
  </div>
)

/**
 * Skeleton de chargement pour la liste de documents
 * Loading skeleton for document list
 */

export const DocumentListSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/12"></div>
        </div>
      </div>
    ))}
  </div>
)

/**
 * Composant d'erreur pour les documents
 * Error boundary for documents
 */

interface DocumentErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface DocumentErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class DocumentErrorBoundary extends Component<
  DocumentErrorBoundaryProps,
  DocumentErrorBoundaryState
> {
  constructor(props: DocumentErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): DocumentErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Document Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="mb-4">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 mb-4">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
