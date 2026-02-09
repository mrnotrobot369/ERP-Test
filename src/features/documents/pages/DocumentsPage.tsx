/**
 * Page de liste des documents (Enterprise Grade)
 * Documents list page
 */

import { DocumentList } from '../components/DocumentList'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'

export default function DocumentsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Tableau de bord', href: '/' },
          { label: 'Documents' }
        ]}
      />

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Gestion des Documents</h1>
        <p className="text-muted-foreground">
          Gérez vos factures, devis et autres documents commerciaux en un seul endroit.
        </p>
      </div>

      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <DocumentList />
        </CardContent>
      </Card>
    </div>
  )
}
