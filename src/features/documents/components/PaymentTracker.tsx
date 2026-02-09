/**
 * Composant pour le suivi des paiements
 * Payment tracking component
 */

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import type { Document } from '../types/document'

interface Payment {
  id: string
  document_id: string
  amount: number
  payment_date: string
  payment_method: string
  notes?: string
  created_at: string
}

interface PaymentTrackerProps {
  document: Document
}

export function PaymentTracker({ document }: PaymentTrackerProps) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [newPayment, setNewPayment] = useState({
    amount: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'bank_transfer'
  })

  useEffect(() => {
    loadPayments()
  }, [document.id])

  const loadPayments = async () => {
    try {
      const { data, error } = await (supabase
        .from('document_payments') as any)
        .select('*')
        .eq('document_id', document.id)
        .order('payment_date', { ascending: false })

      if (error) throw error
      setPayments(data || [])
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const remaining = document.total_amount - totalPaid
  const isOverdue = document.due_date ? new Date(document.due_date) < new Date() : false
  const isFullyPaid = remaining <= 0
  const paymentProgress = Math.min((totalPaid / document.total_amount) * 100, 100)

  const handleRecordPayment = async () => {
    try {
      const { error } = await (supabase
        .from('document_payments') as any)
        .insert({
          document_id: document.id,
          amount: newPayment.amount,
          payment_date: newPayment.payment_date,
          payment_method: newPayment.payment_method,
          created_at: new Date().toISOString()
        })

      if (error) throw error

      // Mettre à jour le statut du document si complètement payé
      if (totalPaid + newPayment.amount >= document.total_amount) {
        await (supabase
          .from('documents') as any)
          .update({
            status: 'paid',
            paid_date: newPayment.payment_date,
            updated_at: new Date().toISOString()
          })
          .eq('id', document.id)
      }

      // Recharger les paiements
      await loadPayments()

      // Réinitialiser le formulaire
      setNewPayment({
        amount: 0,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'bank_transfer'
      })
      setShowPaymentForm(false)
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error)
    }
  }

  const handleSendReminder = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-payment-reminder', {
        body: { documentId: document.id }
      })

      if (error) throw error
      alert('Rappel envoyé avec succès')
    } catch (error) {
      console.error('Erreur lors de l\'envoi du rappel:', error)
      alert('Erreur lors de l\'envoi du rappel')
    }
  }

  const getProgressColor = () => {
    if (isFullyPaid) return 'bg-green-500'
    if (isOverdue) return 'bg-red-500'
    return 'bg-blue-500'
  }

  const getStatusBadge = () => {
    if (isFullyPaid) return <Badge variant="success">✓ Entièrement payé</Badge>
    if (isOverdue) return <Badge variant="destructive">⚠️ En retard</Badge>
    return <Badge variant="warning">💰 En attente</Badge>
  }

  if (loading) {
    return (
      <Card className="border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="animate-pulse">Chargement des paiements...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Suivi des paiements</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barre de progression */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Payé:</span>
            <span className="font-bold text-emerald-600">
              {new Intl.NumberFormat('fr-CH', {
                style: 'currency',
                currency: 'CHF'
              }).format(totalPaid)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Restant:</span>
            <span className={`font-bold ${remaining > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {new Intl.NumberFormat('fr-CH', {
                style: 'currency',
                currency: 'CHF'
              }).format(Math.abs(remaining))}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${paymentProgress}%` }}
            />
          </div>
          <div className="text-[10px] text-muted-foreground text-center uppercase tracking-wider font-semibold">
            Progression: {paymentProgress.toFixed(1)}%
          </div>
        </div>

        {/* Liste des paiements */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900 border-b pb-1">Historique des paiements</h4>
          {payments.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm italic">
              Aucun paiement enregistré pour ce document.
            </div>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-2 bg-slate-50 rounded-md border border-slate-100 text-sm"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      {new Intl.NumberFormat('fr-CH', {
                        style: 'currency',
                        currency: 'CHF'
                      }).format(payment.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>{new Date(payment.payment_date).toLocaleDateString('fr-CH')}</span>
                      <span>•</span>
                      <span className="capitalize">{payment.payment_method.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
          {!isFullyPaid && (
            <>
              <Button
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {showPaymentForm ? 'Annuler' : 'Enregistrer un paiement'}
              </Button>
              {isOverdue && (
                <Button
                  onClick={handleSendReminder}
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  Envoyer un rappel
                </Button>
              )}
            </>
          )}
          {isFullyPaid && (
            <div className="w-full text-center py-2 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 font-medium text-sm">
              ✓ Document entièrement payé
            </div>
          )}
        </div>

        {/* Formulaire de paiement */}
        {showPaymentForm && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <h4 className="font-semibold text-slate-900 text-sm">Nouveau paiement</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                  Montant (CHF)
                </label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0
                  }))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newPayment.payment_date}
                  onChange={(e) => setNewPayment(prev => ({
                    ...prev,
                    payment_date: e.target.value
                  }))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                  Mode
                </label>
                <select
                  value={newPayment.payment_method}
                  onChange={(e) => setNewPayment(prev => ({
                    ...prev,
                    payment_method: e.target.value
                  }))}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="bank_transfer">Virement</option>
                  <option value="cash">Espèces</option>
                  <option value="card">Carte</option>
                  <option value="check">Chèque</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
            <Button
              onClick={handleRecordPayment}
              disabled={newPayment.amount <= 0}
              size="sm"
              className="w-full"
            >
              Confirmer le paiement
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
