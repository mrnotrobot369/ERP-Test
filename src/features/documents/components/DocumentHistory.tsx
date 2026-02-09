/**
 * Composant pour l'historique des documents
 * Document history component
 */

import React from 'react'
import { useDocumentActivity } from '../hooks/useDocumentActivity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, FileText } from 'lucide-react'

interface DocumentHistoryProps {
  documentId: string
}

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({ documentId }) => {
  const { activities, loading } = useDocumentActivity(documentId)

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      created: '📄 Créé',
      sent: '📨 Envoyé',
      viewed: '👁️ Consulté',
      paid: '✅ Payé',
      status_changed: '🔄 Statut modifié',
      deleted: '🗑️ Supprimé',
      edited: '✏️ Modifié',
      downloaded: '⬇️ Téléchargé',
    }
    return labels[action] || action
  }

  const getActionColor = (action: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (action.includes('paid')) return 'default'
    if (action.includes('sent')) return 'secondary'
    if (action.includes('deleted')) return 'destructive'
    return 'outline'
  }

  if (loading) {
    return <div className="text-center py-8 text-sm text-muted-foreground animate-pulse">Chargement de l'historique...</div>
  }

  return (
    <Card className="shadow-sm border-slate-200">
      <CardHeader className="pb-3 border-b bg-slate-50/50">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          <Clock className="w-4 h-4 text-blue-600" />
          Historique d'activité
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {activities.length === 0 ? (
          <div className="text-center py-10">
            <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400 italic">Aucune activité enregistrée.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-8">
                {/* Timeline line */}
                {index !== activities.length - 1 && (
                  <div className="absolute left-3 top-6 w-0.5 h-full bg-slate-100" />
                )}

                {/* Timeline point */}
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getActionColor(activity.action)} className="text-[10px] font-bold uppercase tracking-wider h-5">
                      {getActionLabel(activity.action)}
                    </Badge>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {activity.user_email || 'Système'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 font-medium">
                    {new Date(activity.created_at).toLocaleString('fr-CH', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {/* Changes detail */}
                  {activity.changes && Object.keys(activity.changes).length > 0 && (
                    <div className="mt-2 bg-slate-50 p-2 rounded-md border border-slate-100 text-[11px] text-slate-600 animate-in fade-in duration-300">
                      {Object.entries(activity.changes).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-bold text-slate-500">{key}:</span>
                          <span className="text-blue-700 truncate">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
