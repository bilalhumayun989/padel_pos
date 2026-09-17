import { PADEL_BACKGROUND } from '@/lib/images';
import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    DollarSign, Calendar, Coffee, Wallet, Trophy, Package,
    TrendingUp, ChevronRight, ShieldCheck, PauseCircle,
    Plus, Sparkles, Activity, Clock, BarChart3, Users,
    Crown, AlertTriangle, ArrowUpRight
} from 'lucide-react';

/* ─── GlassCard — blurred hero image bg, zero dark tint ────────── */
function GlassCard({ className = '', children }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl border border-white/[0.14] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}>
            <img
                src={PADEL_BACKGROUND}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                style={{ filter: 'blur(22px) brightness(0.55) saturate(1.3)', transform: 'scale(1.1)' }}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">{children}</div>
        </div>
    );
}

export default function Dashboard({ metrics, teams = [], recentBookings = [], analytics = {}, operations = {}, facility }) {
    const data = {
        revenue_today:      metrics?.revenue_today      ?? 0,
        revenue_trend:      metrics?.revenue_trend      ?? 0,
        today_bookings:     metrics?.today_bookings     ?? 0,
        bookings_trend:     metrics?.bookings_trend     ?? 0,
        cafe_revenue:       metrics?.cafe_revenue       ?? 0,
        cafe_trend:         metrics?.cafe_trend         ?? 0,
        expenses:           metrics?.expenses           ?? 0,
        expenses_trend:     metrics?.expenses_trend     ?? 0,
        players_percentage: metrics?.players_percentage ?? 0,
        players_trend:      metrics?.players_trend      ?? 0,
        stock_percentage:   metrics?.stock_percentage   ?? 0,
        stock_trend:        metrics?.stock_trend        ?? 0,
    };

    const formatCurrency = (v) => `PKR ${Math.round(v).toLocaleString()}`;

    const statCards = [
        { title: 'Revenue Today',  value: formatCurrency(data.revenue_today),  trend: `${data.revenue_trend}% vs Yesterday`,  icon: DollarSign },
        { title: 'Today Bookings', value: data.today_bookings,                 trend: `${data.bookings_trend}% vs Yesterday`, icon: Calendar   },
        { title: 'Cafe Revenue',   value: formatCurrency(data.cafe_revenue),   trend: `${data.cafe_trend}% vs Yesterday`,     icon: Coffee, subtitle: "Today's" },
        { title: 'Expenses',       value: Math.round(data.expenses),           trend: `${data.expenses_trend}% vs Yesterday`, icon: Wallet     },
        { title: 'Players',        value: `${data.players_percentage}%`,       trend: `${data.players_trend}% vs Yesterday`,  icon: Trophy     },
        { title: 'Stock',          value: `${data.stock_percentage}%`,         trend: `${data.stock_trend}% vs Yesterday`,    icon: Package    },
    ];

    const teamList = teams;

    const bookingsList = recentBookings;
    const weeklyData = analytics.week ?? [];
    const bookingStatuses = analytics.booking_statuses ?? [];
    const courtPerformance = analytics.courts ?? [];
    const maxWeeklyRevenue = Math.max(...weeklyData.map((day) => day.revenue + day.cafe), 1);
    const maxCourtBookings = Math.max(...courtPerformance.map((court) => court.bookings), 1);
    const chartPoints = weeklyData.map((day, index) => {
        const x = weeklyData.length > 1 ? (index / (weeklyData.length - 1)) * 100 : 50;
        const y = 92 - ((day.revenue + day.cafe) / maxWeeklyRevenue) * 76;
        return `${x},${y}`;
    }).join(' ');

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS - Dashboard" />

            <div className="flex flex-col flex-1 w-full gap-4">

                {/* ── Row 1 ── Hero + Active Teams ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

                    {/* Hero — transparent, image shows through directly */}
                    <div className="lg:col-span-8 relative rounded-3xl overflow-hidden flex flex-col justify-between min-h-[260px] sm:min-h-[300px] xl:min-h-[340px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-lime-400/20 text-lime-400 border border-lime-400/30 flex items-center gap-1 backdrop-blur-sm">
                                            <Sparkles className="w-3 h-3 animate-pulse" /> Live Arena Overview
                                        </span>
                                        <span className="text-xs text-gray-200 font-medium drop-shadow">Today's Schedule</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-200 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/15">
                                        <Clock className="w-3.5 h-3.5 text-lime-400" />
                                        <span>Peak Hours: 6:00 PM – 10:00 PM</span>
                                    </div>
                                </div>
                                <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                                    Welcome back, <span className="text-lime-400">Skyline Arena Admin</span> 👋
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-200 mt-1.5 max-w-xl drop-shadow">
                                    Facility efficiency at <span className="text-emerald-400 font-semibold">85%</span>. All 4 courts are booked — peak demand expected this evening.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-white/15">
                                <button className="px-4 py-2 rounded-xl text-xs font-bold bg-lime-400 text-black hover:bg-lime-300 transition-all flex items-center gap-1.5 shadow-[0_0_18px_rgba(163,230,53,0.4)]">
                                    <Plus className="w-4 h-4" /> New Booking
                                </button>
                                <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:border-lime-400/50 hover:text-lime-400 transition-all flex items-center gap-1.5">
                                    <Coffee className="w-4 h-4 text-lime-400" /> Cafe POS
                                </button>
                                <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:border-lime-400/50 hover:text-lime-400 transition-all flex items-center gap-1.5">
                                    <Activity className="w-4 h-4 text-emerald-400" /> Court Live Status
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Teams */}
                    <GlassCard className="lg:col-span-4 min-h-[260px] sm:min-h-[300px]">
                        <div className="p-4 sm:p-5 flex flex-col justify-between h-full">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-300">Active Teams</h3>
                                <span className="text-[10px] font-semibold text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded-full border border-lime-400/20">Live</span>
                            </div>
                            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
                                {teamList.map((team, idx) => {
                                    const isHighlight = idx === 0 || team.active;
                                    return (
                                        <div
                                            key={team.id}
                                            className={`p-3.5 rounded-2xl flex items-center justify-between transition-all duration-200 ${
                                                isHighlight
                                                    ? 'bg-emerald-500/20 border border-emerald-500/35'
                                                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            <div>
                                                <h4 className={`text-sm font-bold ${isHighlight ? 'text-emerald-400' : 'text-gray-100'}`}>{team.name}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">{team.players_count} Players</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-1.5">
                                                    <img className="h-6 w-6 rounded-full ring-2 ring-black/40 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80" alt="Player" />
                                                    <img className="h-6 w-6 rounded-full ring-2 ring-black/40 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&q=80" alt="Player" />
                                                    <img className="h-6 w-6 rounded-full ring-2 ring-black/40 object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=64&q=80" alt="Player" />
                                                </div>
                                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-lime-400/20 text-lime-400 border border-lime-400/30">
                                                    {team.ready_ratio || '4/4'}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* ── Row 2 ── 6 Stat Cards + Recent Bookings ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

                    {/* Stat Cards */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {statCards.map((card, idx) => {
                            const Icon = card.icon;
                            return (
                                <GlassCard
                                    key={idx}
                                    className="min-h-[130px] xl:min-h-[145px] hover:-translate-y-0.5 transition-transform duration-200"
                                >
                                    <div className="p-4 xl:p-5 flex flex-col justify-between h-full">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-xs font-semibold text-gray-200 tracking-wide leading-tight">{card.title}</h3>
                                                {card.subtitle && <span className="text-[10px] text-gray-400 block leading-tight">{card.subtitle}</span>}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-2xl xl:text-3xl font-bold text-lime-400 tracking-tight drop-shadow-[0_0_14px_rgba(163,230,53,0.45)]">
                                                {card.value}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span>{card.trend}</span>
                                        </div>
                                    </div>
                                </GlassCard>
                            );
                        })}
                    </div>

                    {/* Recent Bookings */}
                    <GlassCard className="lg:col-span-4">
                        <div className="p-4 xl:p-5 flex flex-col h-full">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-bold text-white tracking-wide">Recent Bookings</h3>
                                <button className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-[10px] font-semibold text-gray-200 hover:text-lime-400 flex items-center gap-1 transition-all">
                                    View All <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                <span>Clients</span>
                                <span>Last Visit</span>
                            </div>
                            <div className="space-y-1 flex-1">
                                {bookingsList.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between py-2 px-2.5 text-xs border-b border-white/8 last:border-0 hover:bg-white/10 rounded-xl transition-all"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {item.status.toLowerCase() === 'active' ? (
                                                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <PauseCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                            )}
                                            <div>
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="text-[10px] text-gray-300">{item.status}</p>
                                            </div>
                                        </div>
                                        <span className="text-gray-300 font-medium text-[11px]">{item.last_visit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    <GlassCard className="lg:col-span-8 min-h-[320px]">
                        <div className="p-4 sm:p-5 h-full">
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-lime-400" />
                                        <h3 className="text-sm font-bold text-white">Revenue & Booking Flow</h3>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Last 7 days across courts and cafe</p>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-gray-300">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-lime-400" /> Revenue</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-400" /> Bookings</span>
                                </div>
                            </div>
                            <div className="relative h-[205px] pl-1">
                                <div className="absolute inset-x-0 top-2 bottom-7 flex flex-col justify-between pointer-events-none">
                                    {[100, 75, 50, 25, 0].map((value) => <div key={value} className="border-t border-white/[0.08]" />)}
                                </div>
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-x-0 top-2 h-[170px] w-full overflow-visible">
                                    <polyline points={chartPoints} fill="none" stroke="#a3e635" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
                                    {weeklyData.map((day, index) => {
                                        const x = weeklyData.length > 1 ? (index / (weeklyData.length - 1)) * 100 : 50;
                                        const y = 92 - ((day.revenue + day.cafe) / maxWeeklyRevenue) * 76;
                                        return <circle key={day.date} cx={x} cy={y} r="1.8" fill="#a3e635" stroke="#172115" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
                                    })}
                                </svg>
                                <div className="absolute inset-x-0 bottom-0 flex justify-between text-[10px] text-gray-500">
                                    {weeklyData.map((day) => <span key={day.date}>{day.label}</span>)}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                                <div className="bg-white/[0.06] rounded-xl px-3 py-2"><p className="text-[10px] text-gray-400">7-day revenue</p><p className="text-sm font-bold text-lime-400">{formatCurrency(weeklyData.reduce((sum, day) => sum + day.revenue + day.cafe, 0))}</p></div>
                                <div className="bg-white/[0.06] rounded-xl px-3 py-2"><p className="text-[10px] text-gray-400">Bookings</p><p className="text-sm font-bold text-white">{weeklyData.reduce((sum, day) => sum + day.bookings, 0)}</p></div>
                                <div className="bg-white/[0.06] rounded-xl px-3 py-2"><p className="text-[10px] text-gray-400">Court revenue</p><p className="text-sm font-bold text-white">{formatCurrency(weeklyData.reduce((sum, day) => sum + day.revenue, 0))}</p></div>
                                <div className="bg-white/[0.06] rounded-xl px-3 py-2"><p className="text-[10px] text-gray-400">Cafe revenue</p><p className="text-sm font-bold text-white">{formatCurrency(weeklyData.reduce((sum, day) => sum + day.cafe, 0))}</p></div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="lg:col-span-4 min-h-[320px]">
                        <div className="p-4 sm:p-5 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-1"><Activity className="w-4 h-4 text-sky-400" /><h3 className="text-sm font-bold text-white">Operations Snapshot</h3></div>
                            <p className="text-xs text-gray-400 mb-4">Live records that need attention</p>
                            <div className="grid grid-cols-2 gap-2.5 mb-5">
                                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3"><Users className="w-4 h-4 text-sky-400 mb-2" /><p className="text-xl font-bold text-white">{operations.clients ?? 0}</p><p className="text-[10px] text-gray-400">Total clients</p></div>
                                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3"><Crown className="w-4 h-4 text-lime-400 mb-2" /><p className="text-xl font-bold text-white">{operations.active_memberships ?? 0}</p><p className="text-[10px] text-gray-400">Active members</p></div>
                                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3"><AlertTriangle className="w-4 h-4 text-amber-400 mb-2" /><p className="text-xl font-bold text-white">{operations.low_stock ?? 0}</p><p className="text-[10px] text-gray-400">Low stock items</p></div>
                                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3"><ShieldCheck className="w-4 h-4 text-emerald-400 mb-2" /><p className="text-xl font-bold text-white">{operations.open_tickets ?? 0}</p><p className="text-[10px] text-gray-400">Open tickets</p></div>
                            </div>
                            <div className="mt-auto">
                                <div className="flex items-center justify-between mb-2"><h4 className="text-xs font-semibold text-gray-200">Booking status mix</h4><span className="text-[10px] text-gray-500">All time</span></div>
                                <div className="space-y-2">
                                    {bookingStatuses.map((status) => {
                                        const total = bookingStatuses.reduce((sum, item) => sum + item.value, 0) || 1;
                                        return <div key={status.label} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} /><span className="text-[11px] text-gray-400 w-16">{status.label}</span><div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${(status.value / total) * 100}%`, backgroundColor: status.color }} /></div><span className="text-[11px] text-white font-semibold w-6 text-right">{status.value}</span></div>;
                                    })}
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                <GlassCard className="min-h-[220px]">
                    <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-4"><div><div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-lime-400" /><h3 className="text-sm font-bold text-white">Court Performance</h3></div><p className="text-xs text-gray-400 mt-1">Bookings and completed revenue over the last 7 days</p></div><span className="text-[10px] uppercase tracking-wider text-gray-500">{courtPerformance.length} courts</span></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {courtPerformance.map((court, index) => <div key={court.name} className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-3.5 hover:border-lime-400/30 transition-colors"><div className="flex items-start justify-between gap-2"><div><p className="text-sm font-bold text-white">{court.name}</p><p className="text-[10px] text-gray-400 mt-0.5">{court.status}</p></div><span className="text-[10px] font-bold text-lime-400">#{index + 1}</span></div><div className="mt-4 flex items-end justify-between"><div><p className="text-lg font-bold text-white">{court.bookings}</p><p className="text-[10px] text-gray-500">bookings</p></div><div className="text-right"><p className="text-sm font-bold text-lime-400">{formatCurrency(court.revenue)}</p><p className="text-[10px] text-gray-500">completed revenue</p></div></div><div className="h-1.5 mt-3 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-lime-400 rounded-full" style={{ width: `${(court.bookings / maxCourtBookings) * 100}%` }} /></div></div>)}
                        </div>
                    </div>
                </GlassCard>
            </div>
        </AuthenticatedLayout>
    );
}
