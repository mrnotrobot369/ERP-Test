import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, User, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export const CalendarPage: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Consultations</h1>
                    <p className="text-slate-500 font-medium">Gestion épurée de vos rendez-vous patients.</p>
                </div>
                <Button className="rounded-2xl font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau RDV
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Mini Calendar / Sidebar */}
                <Card className="lg:col-span-4 rounded-3xl border-slate-200/60 bg-white/50 backdrop-blur-sm shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm font-black text-slate-900 uppercase">Février 2026</p>
                        <div className="flex gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full border border-slate-100"><ChevronLeft className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full border border-slate-100"><ChevronRight className="w-4 h-4" /></Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase mb-2">
                        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {[...Array(28)].map((_, i) => (
                            <div key={i} className={cn(
                                "aspect-square flex items-center justify-center text-xs font-bold rounded-xl cursor-pointer transition-all",
                                i + 1 === 12 ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-slate-100 text-slate-600"
                            )}>
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Rappels urgents</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-2xl bg-red-50 border border-red-100">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <p className="text-[10px] font-bold text-red-900">Appeler Mme. Martin</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Main Schedule */}
                <Card className="lg:col-span-8 rounded-3xl border-slate-200/60 bg-white shadow-xl shadow-slate-200/20 overflow-hidden">
                    <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            Planning du jour
                        </CardTitle>
                        <p className="text-xs font-bold text-slate-400 uppercase">Jeudi 12 Février</p>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {[
                                { time: '09:00', patient: 'Jean Dupont', desc: 'Anamnèse 1h', status: 'confirmé' },
                                { time: '10:30', patient: 'Marie Curie', desc: 'Suivi 45min', status: 'confirmé' },
                                { time: '11:30', patient: 'Pause Déjeuner', desc: '-', status: 'break' },
                                { time: '14:00', patient: 'Albert Einstein', desc: 'Consultation 1h', status: 'pending' },
                                { time: '15:30', patient: 'Isaac Newton', desc: 'Gravité & Stress 1h', status: 'confirmé' },
                            ].map((slot, idx) => (
                                <div key={idx} className={cn(
                                    "flex items-center gap-6 p-6 transition-all hover:bg-slate-50/50 group",
                                    slot.status === 'break' && "bg-slate-50/30 opacity-60"
                                )}>
                                    <div className="text-sm font-black text-slate-400 w-16 group-hover:text-primary transition-colors">{slot.time}</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{slot.patient}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{slot.desc}</p>
                                    </div>
                                    {slot.status !== 'break' && (
                                        <div className="flex items-center gap-2">
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors">
                                                <User className="w-4 h-4" />
                                            </Button>
                                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-emerald-100 hover:text-emerald-700 transition-colors">
                                                <CalendarIcon className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
