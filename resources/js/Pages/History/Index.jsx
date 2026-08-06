import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    TrendingUp, TrendingDown, Search, Download,
    RefreshCcw, XCircle, ShoppingBag, Coffee,
    CalendarDays, Package, Wallet
} from 'lucide-react';

/* ─── Blurred glass card ─────────────────────────────────────── */
function GlassCard({ className = '', children }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl border border-white/[0.13] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}>
            <img src="/images/padel_hero.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                style={{ filter:'blur(22px) brightness(0.45) saturate(1.2)', transform:'scale(1.1)' }} />
            <div className="absolute inset-x-0 top-0 h-px bg-white/15 pointer-events-none" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/* ─── Category icon ──────────────────────────────────────────── */
function CatIcon({ category }) {
    const map = {
        Cafe:      <Coffee className="w-3.5 h-3.5 text-lime-400" />,
        Bookings:  <CalendarDays className="w-3.5 h-3.5 text-blue-400" />,
        Bundles:   <Package className="w-3.5 h-3.5 text-purple-400" />,
        Maintenance: <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />,
        Payroll:   <Wallet className="w-3.5 h-3.5 text-pink-400" />,
        Utilities: <Wallet className="w-3.5 h-3.5 text-orange-400" />,
        Equipment: <Package className="w-3.5 h-3.5 text-teal-400" />,
        Supplies:  <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />,
        Marketing: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
    };
    return (
        <div className="w-8 h-8 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
            {map[category] ?? <ShoppingBag className="w-3.5 h-3.5 text-gray-400" />}
        </div>
    );
}

/* ─── Status badge ───────────────────────────────────────────── */
function StatusBadge({ status }) {
    const styles = {
        Completed: 'bg-lime-400/15 text-lime-400 border-lime-400/25',
        Refunded:  'bg-blue-400/15 text-blue-400 border-blue-400/25',
        Cancelled: 'bg-red-400/15 text-red-400 border-red-400/25',
    };
    return (
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${styles[status] ?? styles.Completed}`}>
            {status}
        </span>
    );
}

const TAB_STYLES = {
    active:   'bg-white/10 text-white border-0',
    inactive: 'bg-transparent text-gray-400 border-0 hover:text-gray-200',
};

export default function HistoryIndex({ tab = 'sales', transactions = [], expenses = [], reconciliation = [], metrics = {}, facility }) {
    const [search, setSearch]       = useState('');
    const [catFilter, setCatFilter] = useState('All');

    const m = {
        total_events:  metrics.total_events  ?? 12,
        events_trend:  metrics.events_trend  ?? 6,
        refunds:       metrics.refunds       ?? 1,
        refunds_total: metrics.refunds_total ?? 12,
        refunds_trend: metrics.refunds_trend ?? -9,
        cancellations: metrics.cancellations ?? 1,
        cancel_trend:  metrics.cancel_trend  ?? 0,
    };

    /* ── Derive category tabs ── */
    const isSales = tab === 'sales' || tab === 'purchases';
    const rows    = isSales ? transactions : expenses;

    const allCats = useMemo(() => {
        const s = new Set(rows.map(r => r.category));
        return ['All', ...Array.from(s)];
    }, [rows]);

    const catCounts = useMemo(() => {
        const c = {};
        rows.forEach(r => { c[r.category] = (c[r.category] ?? 0) + 1; });
        return c;
    }, [rows]);

    const filtered = useMemo(() => {
        return rows.filter(r => {
            const matchCat  = catFilter === 'All' || r.category === catFilter;
            const matchText = !search || JSON.stringify(r).toLowerCase().includes(search.toLowerCase());
            return matchCat && matchText;
        });
    }, [rows, catFilter, search]);

    /* Group by day */
    const groups = useMemo(() => {
        const g = {};
        filtered.forEach(r => {
            const key = r.group ?? r.date ?? 'Today';
            if (!g[key]) g[key] = [];
            g[key].push(r);
        });
        return g;
    }, [filtered]);

    const totalAll = filtered.reduce((s, r) => s + r.amount, 0);

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – History" />

            <div className="flex flex-col flex-1 w-full gap-4">

                {/* ── Top tab bar ── */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <Link href={route('history.sales')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            tab === 'sales'
                                ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}>
                        Sales history
                    </Link>

                    <Link href={route('history.purchases')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            tab === 'purchases'
                                ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}>
                        Purches history
                    </Link>

                    <Link href={route('history.expenses')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            tab === 'expenses'
                                ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}>
                        Expenses history
                    </Link>

                    <Link href={route('history.reconciliation')}
                        className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                            tab === 'reconciliation'
                                ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]'
                                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}>
                        Cash Reconciliation
                    </Link>
                </div>

                {/* ── 3 stat cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Total Events */}
                    <GlassCard>
                        <div className="p-5 flex flex-col justify-between min-h-[120px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <RefreshCcw className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Total Events</span>
                                </div>
                                <RefreshCcw className="w-4 h-4 text-lime-400 opacity-60" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-lime-400 leading-none drop-shadow-[0_0_14px_rgba(163,230,53,0.45)]">{m.total_events}</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400">{m.events_trend}%</span>
                                    <span className="text-xs text-gray-400">Last 48 hours</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Refunds */}
                    <GlassCard>
                        <div className="p-5 flex flex-col justify-between min-h-[120px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <RefreshCcw className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Refunds</span>
                                </div>
                                <RefreshCcw className="w-4 h-4 text-lime-400 opacity-60" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-lime-400 leading-none drop-shadow-[0_0_14px_rgba(163,230,53,0.45)]">{m.refunds}</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                                    <span className="text-xs font-bold text-red-400">{Math.abs(m.refunds_trend)}%</span>
                                    <span className="text-xs text-gray-400">${m.refunds_total.toFixed(2)} total</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Cancellations */}
                    <GlassCard>
                        <div className="p-5 flex flex-col justify-between min-h-[120px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-4 h-4 text-gray-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">Cancellations</span>
                                </div>
                                <XCircle className="w-4 h-4 text-lime-400 opacity-60" />
                            </div>
                            <div>
                                <p className="text-4xl font-bold text-lime-400 leading-none drop-shadow-[0_0_14px_rgba(163,230,53,0.45)]">{m.cancellations}</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400">{m.cancel_trend}%</span>
                                    <span className="text-xs text-gray-400">No show</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* ── Activity Log panel ── */}
                <GlassCard className="flex-1">
                    <div className="p-5 flex flex-col gap-4">

                        {/* Panel header */}
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-lime-400" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-white">Activity Log</h2>
                                    <p className="text-[10px] text-gray-400">Group By day – Newest first</p>
                                </div>
                            </div>

                            {/* Search + export */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search Id, Client, Items..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-8 pr-4 py-2 rounded-xl bg-white/5 border border-white/12 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/40 w-52"
                                    />
                                </div>
                                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/12 text-xs text-gray-300 hover:text-white hover:border-white/25 transition-all">
                                    <Download className="w-3.5 h-3.5" /> CSV
                                </button>
                            </div>
                        </div>

                        {/* Category filter pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {allCats.map(cat => {
                                const count = cat === 'All'
                                    ? filtered.length
                                    : (catCounts[cat] ?? 0);
                                const active = catFilter === cat;
                                return (
                                    <button key={cat}
                                        onClick={() => setCatFilter(cat)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 ${
                                            active
                                                ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_10px_rgba(163,230,53,0.3)]'
                                                : 'bg-white/5 text-gray-300 border-white/15 hover:border-white/30 hover:text-white'
                                        }`}
                                    >
                                        {cat} <span className={`font-bold ${active ? 'text-black/70' : 'text-gray-500'}`}>{count}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* ── Grouped rows OR Reconciliation table ── */}
                        <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1">

                            {/* Reconciliation view */}
                            {tab === 'reconciliation' && (
                                <div className="space-y-2">
                                    {/* Header row */}
                                    <div className="grid grid-cols-6 gap-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                        <span className="col-span-2">Shift</span>
                                        <span>Cashier</span>
                                        <span className="text-right">Expected</span>
                                        <span className="text-right">Actual</span>
                                        <span className="text-right">Variance</span>
                                    </div>

                                    {Object.entries(
                                        reconciliation.reduce((g, r) => {
                                            (g[r.date] = g[r.date] || []).push(r);
                                            return g;
                                        }, {})
                                    ).map(([day, sessions]) => (
                                        <div key={day}>
                                            <p className="text-xs font-bold text-white px-3 mb-1.5">{day}</p>
                                            {sessions.map(s => (
                                                <div key={s.id}
                                                    className="grid grid-cols-6 gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/8 transition-all items-center"
                                                >
                                                    <div className="col-span-2">
                                                        <p className="text-xs font-semibold text-white">{s.shift}</p>
                                                        <p className="text-[10px] text-gray-500 mt-0.5">Session #{s.id}</p>
                                                    </div>
                                                    <span className="text-xs text-gray-300">{s.cashier}</span>
                                                    <span className="text-xs font-semibold text-white text-right">${s.expected.toLocaleString()}</span>
                                                    <span className="text-xs font-semibold text-white text-right">${s.actual.toLocaleString()}</span>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className={`text-xs font-bold ${s.variance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {s.variance >= 0 ? '+' : ''}${s.variance.toLocaleString()}
                                                        </span>
                                                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                                                            s.status === 'Balanced' ? 'bg-lime-400/15 text-lime-400 border-lime-400/25'
                                                            : s.status === 'Over' ? 'bg-blue-400/15 text-blue-400 border-blue-400/25'
                                                            : 'bg-red-400/15 text-red-400 border-red-400/25'
                                                        }`}>{s.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Sales / Expenses grouped rows */}
                            {tab !== 'reconciliation' && Object.entries(groups).map(([day, items]) => {
                                const dayTotal = items.reduce((s, i) => s + i.amount, 0);
                                return (
                                    <div key={day}>
                                        <div className="flex items-center justify-between mb-2 px-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white">{day}</span>
                                                <span className="text-[10px] text-gray-500">— {items.length} Events</span>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-300">Total ${dayTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="space-y-1">
                                            {items.map(row => (
                                                <div key={row.id}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/8"
                                                >
                                                    <CatIcon category={row.category} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-white truncate">{row.item ?? row.name}</p>
                                                        <p className="text-[10px] text-gray-500 mt-0.5">
                                                            Txn {row.id}
                                                            {row.client && <> — {row.client}</>}
                                                            {row.time   && <> — {row.time}</>}
                                                            {row.by     && <> — by {row.by}</>}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <span className="text-sm font-bold text-white">${row.amount.toFixed(2)}</span>
                                                        {row.status && <StatusBadge status={row.status} />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {tab !== 'reconciliation' && filtered.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
                                    <Search className="w-10 h-10 opacity-30" />
                                    <p className="text-sm">No records found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </div>
        </AuthenticatedLayout>
    );
}
