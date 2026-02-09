import React from 'react'
import { Card, Button } from '@/components/ui'
import { Plus, Trash2, Utensils, Move, Landmark, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const FloorPlanPage: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Plan de Salle</h1>
                    <p className="text-slate-500 font-medium">Gérez vos tables en drag & drop dynamique.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl font-bold border-slate-200">
                        Vue 3D
                    </Button>
                    <Button className="rounded-2xl font-bold shadow-xl shadow-primary/20">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter Table
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats / Zones Sidebar */}
                <div className="space-y-6">
                    <Card className="rounded-3xl border-slate-200/60 bg-indigo-900 text-white p-6 shadow-xl shadow-indigo-500/20">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Occupation Totale</p>
                        <p className="text-4xl font-black">78%</p>
                        <div className="w-full bg-white/10 h-1.5 rounded-full mt-4">
                            <div className="bg-white h-full w-[78%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                        <p className="text-[10px] font-bold mt-4 opacity-60">12 tables occupées sur 18</p>
                    </Card>

                    <Card className="rounded-3xl border-slate-200/60 bg-white p-6 space-y-4 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zones de service</p>
                        {['Terrasse', 'Salle Principale', 'Bar / VIP'].map(zone => (
                            <div key={zone} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 cursor-pointer transition-all">
                                <span className="text-xs font-black text-slate-900">{zone}</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Interactive Grid Overlay */}
                <Card className="lg:col-span-3 rounded-[40px] border-2 border-dashed border-slate-200 bg-slate-50/50 min-h-[600px] relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                        <Utensils className="w-64 h-64 text-slate-900" />
                    </div>

                    {/* Dummy Interactive Tables */}
                    <div className="absolute top-20 left-20">
                        <TableNode id="T1" status="occupied" persons={4} />
                    </div>
                    <div className="absolute top-20 left-80">
                        <TableNode id="T2" status="free" persons={2} />
                    </div>
                    <div className="absolute top-60 left-40">
                        <TableNode id="T3" status="occupied" persons={6} />
                    </div>
                    <div className="absolute top-80 right-40">
                        <TableNode id="T4" status="free" persons={4} />
                    </div>

                    {/* Footer Info */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-3xl border border-slate-200 shadow-xl flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">Occupée</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">Libre</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Move className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px] font-black uppercase text-slate-600 tracking-tight">Déplacer</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

const TableNode = ({ id, status, persons }: { id: string, status: 'free' | 'occupied', persons: number }) => (
    <div className={cn(
        "w-36 h-36 rounded-[32px] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-all hover:scale-105 shadow-xl group/table",
        status === 'occupied' ? "bg-white border-2 border-red-500 shadow-red-500/10" : "bg-white border border-slate-200"
    )}>
        <div className={cn(
            "w-8 h-8 rounded-full mb-3 flex items-center justify-center",
            status === 'occupied' ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-400"
        )}>
            <Landmark className="w-4 h-4" />
        </div>
        <p className="text-xl font-black text-slate-900">{id}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{persons} Pers.</p>

        <div className="absolute -top-2 -right-2 opacity-0 group-hover/table:opacity-100 transition-opacity flex gap-1">
            <Button size="sm" variant="destructive" className="h-8 w-8 p-0 rounded-xl shadow-lg border-2 border-white"><Trash2 className="w-3 h-3" /></Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 rounded-xl shadow-lg border-2 border-white text-slate-600"><Maximize2 className="w-3 h-3" /></Button>
        </div>
    </div>
)
