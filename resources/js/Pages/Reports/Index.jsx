import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    TrendingUp, TrendingDown, Download, Search,
    DollarSign, ShoppingCart, Coffee, Users, CalendarDays,
    CheckCircle, XCircle, Clock, BarChart3
} from 'lucide-react';

/* ─── Glass card ─────────────────────────────────────────────── */
function GlassCard({ className='', children }) {
    return (
        <div className={`rounded-2xl border border-white/[0.13] shadow-[0_8px_32px_rgba(0,0,0,0.45)] ${className}`}
            style={{ background:'rgba(10,16,28,0.35)', backdropFilter:'blur(20px) saturate(160%)', WebkitBackdropFilter:'blur(20px) saturate(160%)' }}>
            {children}
        </div>
    );
}

/* ─── Summary stat ───────────────────────────────────────────── */
function SumCard({ label, value, icon: Icon, accent, ring }) {
    return (
        <GlassCard>
            <div className="p-4 flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl ring-1 ${ring} bg-white/[0.06] flex items-center justify-center flex-shrink-0 ${accent}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 truncate">{label}</p>
                    <p className={`text-base font-bold leading-tight ${accent}`}>{value}</p>
                </div>
            </div>
        </GlassCard>
    );
}

/* ─── Trend chip ─────────────────────────────────────────────── */
function Trend({ v }) {
    const pos = v >= 0;
    return (
        <span className={`flex items-center gap-0.5 text-[10px] font-bold ${pos ? 'text-lime-400' : 'text-red-400'}`}>
            {pos ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
            {Math.abs(v)}%
        </span>
    );
}

/* ─── Tab link ───────────────────────────────────────────────── */
function Tab({ href, active, children }) {
    return (
        <Link href={href}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                active ? 'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/40' : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}>
            {children}
        </Link>
    );
}

/* ─── Status badge ───────────────────────────────────────────── */
function StatusBadge({ s }) {
    const map = {
        Completed: 'text-lime-400 bg-lime-400/10 ring-lime-400/25',
        Upcoming:  'text-white bg-white/10 ring-white/20',
        Cancelled: 'text-red-400 bg-red-400/10 ring-red-400/20',
    };
    return <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ring-1 ${map[s] ?? map.Upcoming}`}>{s}</span>;
}

const TABS = [
    { key:'revenue',  label:'Revenue',  route:'reports.revenue'  },
    { key:'expenses', label:'Expenses', route:'reports.expenses' },
    { key:'bookings', label:'Bookings', route:'reports.bookings' },
    { key:'cafe',     label:'Cafe',     route:'reports.cafe'     },
    { key:'players',  label:'Players',  route:'reports.players'  },
];

export default function ReportsIndex({ tab='revenue', summary={}, rows=[], facility }) {
    const [search, setSearch] = useState('');

    /* ── CSV export ── */
    const exportCSV = () => {
        if (!rows.length) return;

        const headers = Object.keys(rows[0]);
        const csvContent = [
            headers.join(','),
            ...rows.map(row =>
                headers.map(h => {
                    const val = String(row[h] ?? '').replace(/"/g, '""');
                    return `"${val}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${tab}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const s = {
        total_revenue:  summary.total_revenue  ?? 0,
        total_expenses: summary.total_expenses ?? 0,
        net_profit:     summary.net_profit     ?? 0,
        total_bookings: summary.total_bookings ?? 0,
        cafe_revenue:   summary.cafe_revenue   ?? 0,
        active_players: summary.active_players ?? 0,
    };

    const filtered = rows.filter(r =>
        !search || Object.values(r).join(' ').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Reports" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Reports</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Full POS analytics and activity reports</p>
                    </div>
                    <button onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.07] border border-white/[0.15] text-gray-200 text-xs font-semibold hover:text-white hover:border-white/30 transition-all">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>

                {/* ── Summary cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    <SumCard label="Total Revenue"   value={`PKR ${s.total_revenue.toLocaleString()}`}  icon={DollarSign}   accent="text-lime-400"  ring="ring-lime-400/30" />
                    <SumCard label="Total Expenses"  value={`PKR ${s.total_expenses.toLocaleString()}`} icon={TrendingDown}  accent="text-white"     ring="ring-white/15"   />
                    <SumCard label="Net Profit"      value={`PKR ${s.net_profit.toLocaleString()}`}     icon={TrendingUp}   accent="text-lime-300"  ring="ring-lime-300/25"/>
                    <SumCard label="Total Bookings"  value={s.total_bookings}                           icon={CalendarDays} accent="text-gray-200"  ring="ring-white/12"   />
                    <SumCard label="Cafe Revenue"    value={`PKR ${s.cafe_revenue.toLocaleString()}`}   icon={Coffee}       accent="text-lime-400"  ring="ring-lime-400/20"/>
                    <SumCard label="Active Players"  value={s.active_players}                           icon={Users}        accent="text-white"     ring="ring-white/15"   />
                </div>

                {/* ── Tab bar ── */}
                <div className="flex items-center gap-1.5 flex-wrap">
                    {TABS.map(t => (
                        <Tab key={t.key} href={route(t.route)} active={tab===t.key}>{t.label} Report</Tab>
                    ))}
                </div>

                {/* ── Data panel ── */}
                <GlassCard className="flex-1">
                    <div className="p-5 flex flex-col gap-4">

                        {/* Panel header */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="text-sm font-bold text-white capitalize">{tab} Report</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                                <input type="text" placeholder="Search records..." value={search} onChange={e=>setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/40 w-52 transition-all" />
                            </div>
                        </div>

                        {/* ── Revenue table ── */}
                        {tab === 'revenue' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] text-gray-500 uppercase tracking-wider text-[10px]">
                                            {['Date','Bookings','Cafe','Other','Total Revenue','Trend'].map(h => (
                                                <th key={h} className="pb-2.5 px-2 font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r,i) => (
                                            <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/5 rounded-xl transition-all">
                                                <td className="py-3 px-2 font-semibold text-white">{r.date}</td>
                                                <td className="py-3 px-2 text-gray-300">{r.bookings}</td>
                                                <td className="py-3 px-2 text-gray-300">PKR {r.cafe}</td>
                                                <td className="py-3 px-2 text-gray-300">PKR {r.other}</td>
                                                <td className="py-3 px-2 font-bold text-lime-400">PKR {r.total.toLocaleString()}</td>
                                                <td className="py-3 px-2"><Trend v={r.trend} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── Expenses table ── */}
                        {tab === 'expenses' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] text-gray-500 uppercase tracking-wider text-[10px]">
                                            {['Date','Category','Amount','By','Note'].map(h=>(
                                                <th key={h} className="pb-2.5 px-2 font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r,i) => (
                                            <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/5 transition-all">
                                                <td className="py-3 px-2 font-semibold text-white">{r.date}</td>
                                                <td className="py-3 px-2"><span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/8 text-gray-300 ring-1 ring-white/12">{r.category}</span></td>
                                                <td className="py-3 px-2 font-bold text-white">PKR {r.amount.toLocaleString()}</td>
                                                <td className="py-3 px-2 text-gray-400">{r.by}</td>
                                                <td className="py-3 px-2 text-gray-400">{r.note}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── Bookings table ── */}
                        {tab === 'bookings' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] text-gray-500 uppercase tracking-wider text-[10px]">
                                            {['Txn #','Client','Court','Date','Time','Duration','Amount','Status'].map(h=>(
                                                <th key={h} className="pb-2.5 px-2 font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r,i) => (
                                            <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/5 transition-all">
                                                <td className="py-3 px-2 text-gray-500">#{r.id}</td>
                                                <td className="py-3 px-2 font-semibold text-white">{r.client}</td>
                                                <td className="py-3 px-2 text-gray-300">{r.court}</td>
                                                <td className="py-3 px-2 text-gray-300">{r.date}</td>
                                                <td className="py-3 px-2 text-gray-300">{r.time}</td>
                                                <td className="py-3 px-2 text-gray-300">{r.duration}h</td>
                                                <td className="py-3 px-2 font-bold text-lime-400">PKR {(r.amount).toLocaleString()}</td>
                                                <td className="py-3 px-2"><StatusBadge s={r.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── Cafe table ── */}
                        {tab === 'cafe' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] text-gray-500 uppercase tracking-wider text-[10px]">
                                            {['Date','Item','Qty Sold','Unit Price','Total Revenue'].map(h=>(
                                                <th key={h} className="pb-2.5 px-2 font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r,i) => (
                                            <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/5 transition-all">
                                                <td className="py-3 px-2 font-semibold text-white">{r.date}</td>
                                                <td className="py-3 px-2 text-gray-200">{r.item}</td>
                                                <td className="py-3 px-2 text-gray-300">{r.qty}</td>
                                                <td className="py-3 px-2 text-gray-300">${r.unit_price}</td>
                                                <td className="py-3 px-2 font-bold text-lime-400">${r.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── Players table ── */}
                        {tab === 'players' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-white/[0.08] text-gray-500 uppercase tracking-wider text-[10px]">
                                            {['Player','Tier','Matches','Wins','Losses','Win %','Revenue','Joined'].map(h=>(
                                                <th key={h} className="pb-2.5 px-2 font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((r,i) => (
                                            <tr key={i} className="border-b border-white/[0.05] last:border-0 hover:bg-white/5 transition-all">
                                                <td className="py-3 px-2 font-semibold text-white">{r.name}</td>
                                                <td className="py-3 px-2">
                                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ring-1 ${r.tier==='Pro Member'?'text-lime-400 bg-lime-400/10 ring-lime-400/25':r.tier==='Elite'?'text-white bg-white/12 ring-white/20':'text-gray-400 bg-white/5 ring-white/10'}`}>{r.tier}</span>
                                                </td>
                                                <td className="py-3 px-2 text-gray-300">{r.matches}</td>
                                                <td className="py-3 px-2 text-lime-400 font-semibold">{r.wins}</td>
                                                <td className="py-3 px-2 text-gray-400">{r.losses}</td>
                                                <td className="py-3 px-2 text-white font-semibold">{Math.round((r.wins/r.matches)*100)}%</td>
                                                <td className="py-3 px-2 font-bold text-lime-400">PKR {(r.revenue).toLocaleString()}</td>
                                                <td className="py-3 px-2 text-gray-400">{r.joined}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-600">
                                <BarChart3 className="w-10 h-10 opacity-20" />
                                <p className="text-sm">No records found.</p>
                            </div>
                        )}
                    </div>
                </GlassCard>
            </div>
        </AuthenticatedLayout>
    );
}
