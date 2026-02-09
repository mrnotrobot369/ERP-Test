import React from 'react'
import { Skeleton, Button, Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts'
import { TrendingUp, Package, Users, DollarSign, FileText, PlusCircle, Database, AlertCircle } from 'lucide-react'
import { seedService } from '@/services/seedService'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { cn } from '@/lib/utils'
import { VerticalWidgets } from './VerticalWidgets'

const StatCard: React.FC<{
    icon: React.ReactNode
    title: string
    value: string | number
    color?: 'blue' | 'green' | 'purple' | 'orange'
}> = ({ icon, title, value, color = 'blue' }) => {
    const colorConfigs = {
        blue: {
            bg: 'bg-blue-50/50',
            iconBg: 'bg-blue-100 text-blue-600',
            gradient: 'from-blue-500/10 to-transparent',
            border: 'hover:border-blue-200'
        },
        green: {
            bg: 'bg-emerald-50/50',
            iconBg: 'bg-emerald-100 text-emerald-600',
            gradient: 'from-emerald-500/10 to-transparent',
            border: 'hover:border-emerald-200'
        },
        purple: {
            bg: 'bg-purple-50/50',
            iconBg: 'bg-purple-100 text-purple-600',
            gradient: 'from-purple-500/10 to-transparent',
            border: 'hover:border-purple-200'
        },
        orange: {
            bg: 'bg-orange-50/50',
            iconBg: 'bg-orange-100 text-orange-600',
            gradient: 'from-orange-500/10 to-transparent',
            border: 'hover:border-orange-200'
        },
    }

    const config = colorConfigs[color]

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1 mb-1 border-slate-200/60 bg-white/50 backdrop-blur-sm",
            config.border
        )}>
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", config.gradient)} />
            <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{title}</p>
                        <p className="text-3xl font-black mt-1 text-slate-900">{value}</p>
                    </div>
                    <div className={cn("p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 shadow-sm", config.iconBg)}>
                        {icon}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export const DashboardAnalytics: React.FC = () => {
    const { stats, metrics, loading, error } = useDashboardStats()

    if (loading) {
        return (
            <div className="space-y-8 p-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="h-32 shadow-sm border-slate-100">
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-24 mb-4" />
                                <Skeleton className="h-8 w-32" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border-2 border-red-100 rounded-3xl p-8 text-center max-w-2xl mx-auto">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">Impossible de charger le tableau de bord</h3>
                    <p className="text-red-700 mb-6">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>Fermer et réessayer</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bonjour !</h1>
                    <p className="text-slate-500 font-medium">Voici l'état actuel de votre activité.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-xl font-bold text-xs h-9 bg-white shadow-sm border-slate-200">Rapport PDF</Button>
                    <Button className="rounded-xl font-bold text-xs h-9 shadow-lg shadow-primary/20">Exporter CSV</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Package className="w-5 h-5" />}
                    title="Produits en stock"
                    value={stats.totalProducts}
                    color="blue"
                />
                <StatCard
                    icon={<DollarSign className="w-5 h-5" />}
                    title="Chiffre d'Affaires"
                    value={`$${stats.totalRevenue.toLocaleString()}`}
                    color="green"
                />
                <StatCard
                    icon={<FileText className="w-5 h-5" />}
                    title="Documents"
                    value={stats.totalOrders}
                    color="purple"
                />
                <StatCard
                    icon={<Users className="w-5 h-5" />}
                    title="Clients Actifs"
                    value={stats.activeClients}
                    color="orange"
                />
            </div>

            {/* Specialized Industry Widgets */}
            <VerticalWidgets />

            {/* Seeding Section for New Users */}
            {stats.totalProducts === 0 && stats.totalRevenue === 0 && (
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 rounded-3xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 text-primary/10 transform translate-x-12 -translate-y-12 group-hover:scale-110 transition-transform duration-700">
                        <Database className="w-64 h-64" />
                    </div>
                    <CardContent className="p-10 relative z-10 text-center max-w-2xl mx-auto">
                        <div className="mx-auto w-20 h-20 bg-white rounded-2xl shadow-xl shadow-primary/10 flex items-center justify-center mb-6 border border-primary/10">
                            <Database className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Prêt à commencer ?</h3>
                        <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                            Votre espace est prêt. Souhaitez-vous générer des données de démonstration pour tester toutes les fonctionnalités dès maintenant ?
                        </p>
                        <Button
                            onClick={async () => {
                                const user = useAuthStore.getState().user
                                if (user) {
                                    const success = await seedService.seedDemoData(user.id)
                                    if (success) window.location.reload()
                                }
                            }}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white px-10 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all active:scale-95"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Générer les données modèles
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Revenue Trend */}
                <Card className="lg:col-span-8 rounded-3xl border-slate-200/60 shadow-sm overflow-hidden bg-white/40 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-50 bg-slate-50/30 p-6">
                        <CardTitle className="text-sm font-black text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            Évolution du Revenu
                        </CardTitle>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Revenu mensuel</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={320}>
                            <AreaChart data={metrics.revenueByMonth}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`$${value}`, 'Revenu']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="lg:col-span-4 rounded-3xl border-slate-200/60 shadow-sm overflow-hidden bg-white/40 backdrop-blur-sm">
                    <CardHeader className="pb-2 border-b border-slate-50 bg-slate-50/30 p-6">
                        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wide">Performance Produits</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {metrics.topProducts.length > 0 ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={metrics.topProducts} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={80}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 opacity-40">
                                <Package className="w-12 h-12 mb-2 text-slate-300" />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider text-center">Aucune donnée disponible</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardAnalytics
