/**
 * Hook pour l'activité des documents
 * Document activity hook
 */

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useDocumentActivity(documentId: string) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data, error } = await supabase
          .from('document_activity')
          .select('*')
          .eq('document_id', documentId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setActivities(data || [])
      } catch (error) {
        console.error('Error fetching activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivity()
  }, [documentId])

  return { activities, loading }
}
