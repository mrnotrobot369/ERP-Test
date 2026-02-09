/**
 * Hook centralisé pour les notifications multi-secteurs
 * Centralized hook for multi-sector notifications
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { logger } from '@/lib/logger'
import type { MultiSectorNotification, BusinessSector } from '@/types/multi-sector'

export interface NotificationState {
  notifications: MultiSectorNotification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

export interface NotificationFilters {
  sector?: BusinessSector
  type?: MultiSectorNotification['type']
  priority?: MultiSectorNotification['priority']
  read?: boolean
}

export function useNotification(userId?: string) {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  })

  // Récupérer les notifications
  const fetchNotifications = useCallback(async (filters?: NotificationFilters) => {
    if (!userId) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters?.sector) {
        query = query.eq('sector', filters.sector)
      }
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority)
      }
      if (filters?.read !== undefined) {
        query = query.eq('read', filters.read)
      }

      const { data, error } = await query

      if (error) throw error

      const notifications = (data || []) as MultiSectorNotification[]
      const unreadCount = notifications.filter(n => !n.read).length

      setState({
        notifications,
        unreadCount,
        loading: false,
        error: null,
      })

      logger.info(`Notifications récupérées: ${notifications.length}`, 'useNotification', { unreadCount })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la récupération des notifications'
      setState(prev => ({ ...prev, loading: false, error: errorMessage }))
      logger.error(errorMessage, 'useNotification', error)
    }
  }, [userId])

  // Marquer comme lu
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await (supabase
        .from('notifications') as any)
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }))

      logger.info(`Notification marquée comme lue: ${notificationId}`, 'useNotification')
    } catch (error) {
      logger.error('Erreur lors du marquage comme lu', 'useNotification', error)
      throw error
    }
  }, [])

  // Marquer toutes comme lues
  const markAllAsRead = useCallback(async () => {
    if (!userId) return

    try {
      const { error } = await (supabase
        .from('notifications') as any)
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error

      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      }))

      logger.info('Toutes les notifications marquées comme lues', 'useNotification')
    } catch (error) {
      logger.error('Erreur lors du marquage de toutes comme lues', 'useNotification', error)
      throw error
    }
  }, [userId])

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      setState(prev => {
        const notification = prev.notifications.find(n => n.id === notificationId)
        return {
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== notificationId),
          unreadCount: notification && !notification.read 
            ? Math.max(0, prev.unreadCount - 1) 
            : prev.unreadCount,
        }
      })

      logger.info(`Notification supprimée: ${notificationId}`, 'useNotification')
    } catch (error) {
      logger.error('Erreur lors de la suppression', 'useNotification', error)
      throw error
    }
  }, [])

  // Créer une notification
  const createNotification = useCallback(async (
    notification: Omit<MultiSectorNotification, 'id' | 'user_id' | 'created_at' | 'read'>
  ) => {
    if (!userId) throw new Error('User ID requis')

    try {
      const { data, error } = await (supabase
        .from('notifications') as any)
        .insert({
          ...notification,
          user_id: userId,
          read: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      const newNotification = data as MultiSectorNotification
      setState(prev => ({
        ...prev,
        notifications: [newNotification, ...prev.notifications],
        unreadCount: prev.unreadCount + 1,
      }))

      logger.info(`Notification créée: ${newNotification.type}`, 'useNotification', newNotification)
      return newNotification
    } catch (error) {
      logger.error('Erreur lors de la création', 'useNotification', error)
      throw error
    }
  }, [userId])

  // Notifications prédéfinies pour les cas d'usage
  const notifyStockAlert = useCallback(async (
    productName: string,
    currentStock: number,
    minStock: number,
    sector: BusinessSector
  ) => {
    return createNotification({
      sector,
      type: 'stock_alert',
      title: 'Alerte Stock',
      message: `Le produit "${productName}" est en stock faible (${currentStock} / ${minStock})`,
      priority: currentStock === 0 ? 'urgent' : 'high',
      metadata: { productName, currentStock, minStock },
    })
  }, [createNotification])

  const notifyPaymentDue = useCallback(async (
    clientName: string,
    documentNumber: string,
    amount: number,
    dueDate: string,
    sector: BusinessSector
  ) => {
    return createNotification({
      sector,
      type: 'payment_due',
      title: 'Échéance de Paiement',
      message: `Paiement dû: ${documentNumber} - ${clientName} - ${amount.toFixed(2)} CHF`,
      priority: new Date(dueDate) <= new Date() ? 'urgent' : 'medium',
      action_url: `/documents/${documentNumber}`,
      metadata: { clientName, documentNumber, amount, dueDate },
    })
  }, [createNotification])

  const notifyAppointment = useCallback(async (
    clientName: string,
    appointmentDate: string,
    service: string,
    sector: BusinessSector
  ) => {
    return createNotification({
      sector,
      type: 'appointment',
      title: 'Rendez-vous',
      message: `Rendez-vous avec ${clientName} le ${new Date(appointmentDate).toLocaleDateString('fr-CH')} - ${service}`,
      priority: 'medium',
      action_url: `/appointments`,
      metadata: { clientName, appointmentDate, service },
    })
  }, [createNotification])

  const notifyDeadline = useCallback(async (
    taskName: string,
    deadline: string,
    sector: BusinessSector
  ) => {
    const daysUntilDeadline = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    return createNotification({
      sector,
      type: 'deadline',
      title: 'Échéance Approchante',
      message: `Échéance "${taskName}" dans ${daysUntilDeadline} jours`,
      priority: daysUntilDeadline <= 1 ? 'urgent' : daysUntilDeadline <= 7 ? 'high' : 'medium',
      metadata: { taskName, deadline, daysUntilDeadline },
    })
  }, [createNotification])

  // Écouter les nouvelles notifications en temps réel
  useEffect(() => {
    if (!userId) return

    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as MultiSectorNotification
          setState(prev => ({
            ...prev,
            notifications: [newNotification, ...prev.notifications],
            unreadCount: prev.unreadCount + 1,
          }))
          logger.info('Nouvelle notification reçue en temps réel', 'useNotification', newNotification)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  // Charger les notifications au montage
  useEffect(() => {
    if (userId) {
      fetchNotifications()
    }
  }, [userId, fetchNotifications])

  return {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    notifyStockAlert,
    notifyPaymentDue,
    notifyAppointment,
    notifyDeadline,
  }
}
