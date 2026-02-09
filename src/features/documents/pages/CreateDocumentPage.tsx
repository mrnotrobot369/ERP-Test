/**
 * Page pour créer un nouveau document (Enterprise Grade)
 * Page to create a new document
 */

import { DocumentForm } from '../components/DocumentForm'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export default function CreateDocumentPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Tableau de bord', href: '/' },
          { label: 'Documents', href: '/documents' },
          { label: 'Nouveau document' }
        ]}
      />

      <DocumentForm />
    </div>
  )
}
