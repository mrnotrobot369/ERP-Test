/**
 * Composant pour la recherche intelligente
 * Smart search component
 */

import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface SearchFilters {
  query: string
  type?: string | undefined
  status?: string | undefined
  dateRange?: [Date, Date] | undefined
  amountRange?: [number, number] | undefined
  clientId?: string | undefined
}

interface SmartSearchProps {
  onSearch: (filters: SearchFilters) => void
}

export const SmartSearch: React.FC<SmartSearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = useState<SearchFilters>({ query: '' })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [savedFilters, setSavedFilters] = useState<Record<string, SearchFilters>>({})

  const quickFilters: Record<string, Partial<SearchFilters>> = {
    thisMonth: {
      dateRange: [new Date(new Date().setDate(1)), new Date()],
    },
    overdue: {
      status: 'overdue',
    },
    unpaid: {
      status: 'sent',
    },
    last30Days: {
      dateRange: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
    },
  }

  const handleSearch = () => {
    onSearch(filters)
  }

  const handleQuickFilter = (key: string) => {
    const qf = quickFilters[key]
    if (!qf) return
    const newFilters = { ...filters, ...qf } as SearchFilters
    setFilters(newFilters)
    onSearch(newFilters)
  }

  const handleReset = () => {
    const resetFilters: SearchFilters = { query: '' }
    setFilters(resetFilters)
    onSearch(resetFilters)
  }

  const handleSaveFilter = () => {
    const name = window.prompt('Nom du filtre:')
    if (name) {
      setSavedFilters(prev => ({
        ...prev,
        [name]: { ...filters },
      }))
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative group">
        <Input
          placeholder="Rechercher par numéro, client ou montant..."
          value={filters.query}
          onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 h-11 bg-white border-slate-200 focus:border-blue-500 transition-all shadow-sm"
        />
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2 flex-grow">
          {Object.keys(quickFilters).map(key => (
            <Button
              key={key}
              size="sm"
              variant="outline"
              className="rounded-full bg-white text-xs font-medium border-slate-200 hover:bg-slate-50 transition-colors"
              onClick={() => handleQuickFilter(key)}
            >
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`text-xs font-semibold ${showAdvanced ? 'text-blue-600 bg-blue-50' : 'text-slate-500'}`}
        >
          <Filter className="w-3.5 h-3.5 mr-1.5" />
          {showAdvanced ? 'Masquer filtres' : 'Plus de filtres'}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card className="p-5 space-y-5 bg-slate-50/50 border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Type & Status */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Type</label>
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, type: value === 'all' ? undefined : value }))
                  }
                >
                  <SelectTrigger className="bg-white h-9 text-sm">
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="invoice">Facture</SelectItem>
                    <SelectItem value="quote">Devis</SelectItem>
                    <SelectItem value="delivery_note">Bon de livraison</SelectItem>
                    <SelectItem value="po">Commande fournisseur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Statut</label>
                <Select
                  value={filters.status || 'all'}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, status: value === 'all' ? undefined : value }))
                  }
                >
                  <SelectTrigger className="bg-white h-9 text-sm">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                    <SelectItem value="accepted">Accepté</SelectItem>
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4 text-sm">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Période</label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.dateRange?.[0] ? new Date(filters.dateRange[0]).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    setFilters(prev => {
                      if (!date) return { ...prev, dateRange: undefined }
                      const end = prev.dateRange?.[1] || new Date()
                      return { ...prev, dateRange: [date, end] as [Date, Date] }
                    })
                  }}
                  className="bg-white h-9"
                />
                <span className="text-slate-400">à</span>
                <Input
                  type="date"
                  value={filters.dateRange?.[1] ? new Date(filters.dateRange[1]).toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined
                    setFilters(prev => {
                      if (!date) return { ...prev, dateRange: undefined }
                      const start = prev.dateRange?.[0] || new Date()
                      return { ...prev, dateRange: [start, date] as [Date, Date] }
                    })
                  }}
                  className="bg-white h-9"
                />
              </div>
            </div>

            {/* Amount (Simplified without Slider) */}
            <div className="space-y-4 text-sm">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Montant min/max (CHF)</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.amountRange?.[0] || ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined
                    setFilters(prev => ({
                      ...prev,
                      amountRange: val !== undefined ? [val, prev.amountRange?.[1] || 100000] as [number, number] : undefined
                    }))
                  }}
                  className="bg-white h-9"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.amountRange?.[1] || ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : undefined
                    setFilters(prev => ({
                      ...prev,
                      amountRange: val !== undefined ? [prev.amountRange?.[0] || 0, val] as [number, number] : undefined
                    }))
                  }}
                  className="bg-white h-9"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex gap-2">
              <Button onClick={handleSearch} variant="default" size="sm" className="px-6 font-semibold">
                Appliquer
              </Button>
              <Button onClick={handleReset} variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800">
                Réinitialiser
              </Button>
            </div>
            <Button onClick={handleSaveFilter} variant="outline" size="sm" className="bg-white border-blue-100 text-blue-600 hover:bg-blue-50 text-xs font-bold">
              Enregistrer comme favori
            </Button>
          </div>
        </Card>
      )}

      {/* Saved Filters */}
      {Object.keys(savedFilters).length > 0 && (
        <div className="flex items-center gap-3 pt-1 border-t border-slate-50">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Favoris:</span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(savedFilters).map(key => (
              <Button
                key={key}
                size="sm"
                variant="ghost"
                className="h-7 px-3 bg-white border border-slate-100 rounded-md text-[11px] font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 shadow-xs"
                onClick={() => {
                  const saved = savedFilters[key]
                  if (saved) {
                    setFilters(saved)
                    onSearch(saved)
                  }
                }}
              >
                {key}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
