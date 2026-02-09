import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { useVerticalStore } from '@/stores/useVerticalStore'
import {
    Car, Wrench, Clock, FileText,
    Calendar, Utensils, Scissors, Hammer, Ruler, TrendingUp,
    ShieldAlert, Camera, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

export const VerticalWidgets: React.FC = () => {
    const { currentVertical } = useVerticalStore()

    switch (currentVertical) {
        case 'automotive':
            return <AutomotiveWidgets />
        case 'healthcare':
            return <HealthcareWidgets />
        case 'restaurant':
            return <RestaurantWidgets />
        case 'hairdresser':
            return <HairdresserWidgets />
        case 'carpentry':
            return <CarpentryWidgets />
        case 'architect':
            return <ArchitectWidgets />
        default:
            return null
    }
}

const AutomotiveWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="rounded-3xl border-slate-200/60 bg-white/40 backdrop-blur-sm shadow-sm overflow-hidden group">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Wrench className="w-4 h-4 text-blue-500" />
                    Suivi Atelier (TRX)
                </CardTitle>
                <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />)}
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {[
                    { plate: 'VD 123 456', model: 'VW Golf VIII', status: 'En cours', color: 'text-blue-600 bg-blue-50' },
                    { plate: 'GE 789 012', model: 'Audi A3', status: 'En attente', color: 'text-orange-600 bg-orange-50' },
                    { plate: 'VS 456 789', model: 'Tesla Model 3', status: 'Terminé', color: 'text-emerald-600 bg-emerald-50' },
                ].map((car, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 hover:border-blue-200 transition-all hover:translate-x-1 duration-300 shadow-sm group/item">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-900 text-white px-2 py-1 rounded-md text-[10px] font-black tracking-tighter shadow-sm">
                                {car.plate}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">{car.model}</p>
                            </div>
                        </div>
                        <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full", car.color)}>
                            {car.status}
                        </span>
                    </div>
                ))}
                <Button variant="ghost" className="w-full text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl mt-2 group">
                    Voir tout le parc atelier
                    <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
            </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/60 bg-white/40 backdrop-blur-sm shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Car className="w-4 h-4 text-slate-600" />
                    Parc Véhicules
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 shadow-inner">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">42 Véhicules</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Gérés ce mois-ci (+12%)</p>
                <div className="flex gap-2 mt-6 w-full">
                    <div className="flex-1 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Expertises</p>
                        <p className="text-lg font-black text-slate-900">8</p>
                    </div>
                    <div className="flex-1 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Services</p>
                        <p className="text-lg font-black text-slate-900">14</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
)

const HealthcareWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="rounded-3xl border-slate-200/60 bg-white/40 backdrop-blur-sm shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Consultations du Jour
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {[
                    { time: '09:00', patient: 'Jean Dupont', task: 'Anamnèse initiale', color: 'border-purple-200' },
                    { time: '10:30', patient: 'Marie Curie', task: 'Suivi thérapeutique', color: 'border-blue-200' },
                    { time: '14:00', patient: 'Albert Einstein', task: 'Consultation urgente', color: 'border-red-200' },
                ].map((session, idx) => (
                    <div key={idx} className={cn("flex items-center gap-4 p-4 rounded-2xl bg-white border shadow-sm hover:translate-y-[-2px] transition-all", session.color)}>
                        <div className="text-xs font-black text-slate-400 w-12">{session.time}</div>
                        <div className="flex-1 border-l pl-4 border-slate-100">
                            <p className="text-sm font-black text-slate-900">{session.patient}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{session.task}</p>
                        </div>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/60 bg-white/40 backdrop-blur-sm shadow-sm overflow-hidden group">
            <CardHeader className="border-b border-slate-50 bg-slate-50/30 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4 text-emerald-500" />
                    Module Anamnèse Sécurisé
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="bg-emerald-50/50 rounded-2xl p-6 text-center border border-emerald-100 group-hover:bg-emerald-50 transition-colors">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-600">
                        <FileText className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-emerald-900 mb-2 uppercase tracking-tight">Espace Notes Zen</p>
                    <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                        Vos notes de consultation sont chiffrées de bout en bout et stockées séparément pour une confidentialité maximale.
                    </p>
                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs h-9 shadow-lg shadow-emerald-500/20">
                        Ouvrir le coffre-fort
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
)

const RestaurantWidgets = () => (
    <Card className="mt-8 rounded-3xl border-slate-200/60 bg-white shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <Utensils className="w-4 h-4 text-orange-500" />
                Plan de Salle Interactif (Aperçu)
            </CardTitle>
            <div className="flex gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">12 Libres</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-red-700 rounded-full">4 Occupées</span>
            </div>
        </CardHeader>
        <CardContent className="p-8">
            <div className="grid grid-cols-4 md:grid-cols-6 gap-6 h-64 bg-slate-50/50 rounded-3xl p-8 border-2 border-dashed border-slate-200 items-center justify-center text-center group cursor-grab active:cursor-grabbing">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black transition-all shadow-sm hover:scale-110",
                        i % 3 === 0 ? "bg-red-500 text-white" : "bg-white text-slate-400 border border-slate-200"
                    )}>
                        T{i + 1}
                    </div>
                ))}
                <div className="col-span-full border-t border-slate-200 pt-4 mt-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center justify-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        Glissez les tables pour réorganiser votre salle
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
)

const HairdresserWidgets = () => (
    <Card className="mt-8 rounded-3xl border-slate-200/60 bg-white/40 backdrop-blur-sm shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <Camera className="w-4 h-4 text-pink-500" />
                Bar à Styles & Inspiration
            </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative group cursor-pointer shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <p className="text-[10px] font-bold text-white uppercase">Style Modern Chic #{i}</p>
                        </div>
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Scissors className="w-8 h-8 opacity-20" />
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="w-full mt-6 rounded-2xl font-bold text-xs h-10 border-slate-200">
                Ajouter une réalisation client
            </Button>
        </CardContent>
    </Card>
)

const CarpentryWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="rounded-3xl border-slate-200/60 bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Hammer className="w-4 h-4 text-amber-600" />
                    Calculateur de Matériaux
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                        <span>Bois de Chêne (m³)</span>
                        <span>85% du stock</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full w-[85%] rounded-full" />
                    </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Estimation Devis Rapide</p>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Longueur" className="w-full bg-white rounded-lg px-3 py-1 text-xs border border-slate-200" />
                        <input type="text" placeholder="Largeur" className="w-full bg-white rounded-lg px-3 py-1 text-xs border border-slate-200" />
                        <Button className="bg-amber-600 hover:bg-amber-700 h-7 text-[10px] px-3">Go</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/60 bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Timeline Chantier
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="relative pl-8 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                    {[
                        { label: 'Conception & Plans', date: 'Terminé', active: false },
                        { label: 'Découpe & Façonnage', date: 'En cours', active: true },
                        { label: 'Livraison & Pose', date: 'Prévu 12/02', active: false },
                    ].map((step, idx) => (
                        <div key={idx} className="relative">
                            <div className={cn(
                                "absolute -left-6 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                                step.active ? "bg-amber-500 animate-pulse" : "bg-slate-200"
                            )} />
                            <p className={cn("text-xs font-bold", step.active ? "text-slate-900" : "text-slate-500")}>{step.label}</p>
                            <p className="text-[10px] font-medium text-slate-400">{step.date}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
)

const ArchitectWidgets = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="md:col-span-2 rounded-3xl border-slate-200/60 bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30 p-6 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                    <Ruler className="w-4 h-4 text-indigo-500" />
                    Explorateur de Projets (Blueprints)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-video bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center p-4 hover:border-indigo-300 transition-colors group cursor-pointer shadow-sm">
                        <FileText className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-[10px] font-black text-indigo-900 uppercase">Plan_R_{i}.dwg</p>
                        <p className="text-[8px] font-bold text-indigo-400 mt-1 uppercase tracking-tighter">Révision 2.1</p>
                    </div>
                ))}
            </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/60 bg-indigo-900 text-white shadow-xl shadow-indigo-500/20 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                <TrendingUp className="w-32 h-32" />
            </div>
            <CardHeader className="p-6">
                <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Budget Projet #402</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div>
                    <p className="text-3xl font-black">$42.5k</p>
                    <p className="text-[10px] font-bold text-indigo-300 uppercase mt-1 tracking-wider">Engagé sur $120k</p>
                </div>
                <div className="space-y-4">
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-white h-full w-[35%] rounded-full" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="opacity-60 uppercase">Matériaux</span>
                            <span>$30,200</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="opacity-60 uppercase">Main d'oeuvre</span>
                            <span>$12,300</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
)
