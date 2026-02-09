/**
 * Page pour modifier un document existant
 * Page to edit an existing document
 */

import { useParams } from 'react-router-dom'
import { DocumentForm } from '../components/DocumentForm'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export default function EditDocumentPage() {
    const { id } = useParams<{ id: string }>()

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Breadcrumbs
                items={[
                    { label: 'Tableau de bord', href: '/' },
                    { label: 'Documents', href: '/documents' },
                    { label: `Modifier ${id}` }
                ]}
            />

            <DocumentForm documentId={id} />
        </div>
    )
}
