import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { Hammer, Calculator, Save, FileText, Ruler, Layers, ChevronRight, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export const CalculatorPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('bois')

    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calculateur Menuiserie</h1>
                    <p className="text-slate-500 font-medium">Estimez vos besoins en matériaux et quincaillerie en un clic.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="rounded-2xl font-bold bg-white shadow-sm border border-slate-100 text-slate-600">
                        Mes Sauvegardes
                    </Button>
                    <Button className="rounded-2xl font-bold bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-500/20">
                        <Save className="w-4 h-4 mr-2" />
                        Générer Devis
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Configuration Sidebar */}
                <Card className="lg:col-span-4 rounded-3xl border-slate-200/60 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Type de projet</p>
                        <div className="space-y-2">
                            {['bois', 'quincaillerie', 'finition'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-black text-xs uppercase tracking-tight",
                                        activeTab === tab ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        {tab === 'bois' && <Ruler className="w-4 h-4" />}
                                        {tab === 'quincaillerie' && <Hammer className="w-4 h-4" />}
                                        {tab === 'finition' && <Layers className="w-4 h-4" />}
                                        {tab}
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6 flex-1 bg-slate-50/50">
                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 items-start">
                            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-medium text-amber-800 leading-relaxed uppercase">
                                Conseil : Ajoutez 10% de marge pour les chutes de coupe sur les projets de parqueterie.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Main Calculator Input */}
                <Card className="lg:col-span-8 rounded-3xl border-slate-200/60 bg-white shadow-xl shadow-slate-200/10 overflow-hidden">
                    <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Calculator className="w-4 h-4 text-amber-600" />
                            Paramètres du calcul
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Longueur totale (mm)</label>
                                <div className="relative group">
                                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-2xl font-black text-slate-900 focus:border-amber-500 focus:bg-white outline-none transition-all group-hover:border-slate-200" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest">mm</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Largeur totale (mm)</label>
                                <div className="relative group">
                                    <input type="number" placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-2xl font-black text-slate-900 focus:border-amber-500 focus:bg-white outline-none transition-all group-hover:border-slate-200" />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 uppercase tracking-widest">mm</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                                <Calculator className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Résultat estimé</p>
                                    <p className="text-5xl font-black">12.5 m²</p>
                                    <div className="flex gap-4 mt-4">
                                        <div className="flex items-center gap-1.5 opacity-60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                            <span className="text-[8px] font-bold uppercase tracking-widest">Volume : 0.45 m³</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 opacity-60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            <span className="text-[8px] font-bold uppercase tracking-widest">Poids : 320 kg</span>
                                        </div>
                                    </div>
                                </div>
                                <Button className="bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black py-8 px-8 flex flex-col items-center gap-1 shadow-2xl shadow-amber-500/20">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        CRÉER FACTURE
                                    </div>
                                    <span className="text-[8px] font-bold opacity-60 uppercase tracking-widest">Montant : $1,450.00</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
