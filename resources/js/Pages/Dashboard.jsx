import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    DollarSign, Calendar, Coffee, Wallet, Trophy, Package,
    TrendingUp, ChevronRight, ShieldCheck, PauseCircle,
    Plus, Sparkles, Activity, Clock
} from 'lucide-react';

/* ─── GlassCard — blurred hero image bg, zero dark tint ────────── */
function GlassCard({ className = '', children }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl border border-white/[0.14] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}>
            <img
                src="/images/padel_hero.png"
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

export default function Dashboard({ metrics, teams = [], recentBookings = [], facility }) {
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
            </div>
        </AuthenticatedLayout>
    );
}
