import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShoppingBag, ClipboardList, TrendingUp, TrendingDown } from 'lucide-react';

/* ─── Dark bordered panel (same dark glass as Cafe) ────────────── */
function Panel({ className = '', children }) {
    return (
        <div
            className={`rounded-2xl overflow-hidden ${className}`}
            style={{
                background: 'rgba(12,18,30,0.60)',
                border: '1px solid rgba(255,255,255,0.10)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}
        >
            {children}
        </div>
    );
}

/* ─── Stat card (top 3) ─────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, trend, trendPositive }) {
    return (
        <Panel className="flex-1 p-5 flex flex-col justify-between min-h-[130px]">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-300">{label}</span>
                </div>
                <Icon className="w-5 h-5 text-lime-400 opacity-60" />
            </div>
            <div>
                <p className="text-4xl font-bold text-lime-400 leading-none drop-shadow-[0_0_14px_rgba(163,230,53,0.45)]">
                    {value}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                    {trendPositive ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span className={`text-xs font-bold ${trendPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-xs text-gray-400">{label === 'Monthly Sales' ? 'vs Previus' : 'vs Yesterday'}</span>
                </div>
            </div>
        </Panel>
    );
}

/* ─── Inventory item card ───────────────────────────────────────── */
function ItemCard({ item }) {
    const pct      = Math.round((item.stock / item.max_stock) * 100);
    const isLow    = item.status === 'Low';

    return (
        <Panel className="flex flex-col p-4 gap-3">
            {/* Top row: icon + name/sku + badge */}
            <div className="flex items-start gap-3">
                {/* Lime icon square */}
                <div className="w-10 h-10 rounded-xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-lime-400" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white leading-tight truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.sku}</p>
                </div>

                {/* Low / Good badge */}
                <span
                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded flex-shrink-0 ${
                        isLow
                            ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                            : 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/25'
                    }`}
                >
                    {item.status}
                </span>
            </div>

            {/* Bottom row: in-stock + progress + value */}
            <div>
                {/* IN STOCK label + progress bar */}
                <div className="flex items-end justify-between mb-1">
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold leading-none mb-0.5">In Stock</p>
                        <p className="text-sm font-bold text-white leading-none">
                            {item.stock}
                            <span className="text-gray-500 text-[10px] font-normal">/{item.max_stock}</span>
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold leading-none mb-0.5">Value</p>
                        <p className="text-sm font-bold text-white leading-none">${item.value.toLocaleString()}</p>
                        <p className="text-[9px] text-gray-500">@ ${item.unit_price}</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-lime-400' : 'bg-emerald-400'}`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </Panel>
    );
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default function StockIndex({ metrics, items = [], facility }) {
    const m = {
        total_skus:    metrics?.total_skus    ?? 433,
        skus_trend:    metrics?.skus_trend    ?? 6,
        low_stock:     metrics?.low_stock     ?? 36,
        low_trend:     metrics?.low_trend     ?? -9,
        monthly_sales: metrics?.monthly_sales ?? 1220,
        sales_trend:   metrics?.sales_trend   ?? 9,
    };

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Stock" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Row 1 — 3 stat cards ── */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <StatCard
                        icon={ShoppingBag}
                        label="Total SKUs"
                        value={`$${m.total_skus}`}
                        trend={m.skus_trend}
                        trendPositive={m.skus_trend >= 0}
                    />
                    <StatCard
                        icon={ClipboardList}
                        label="Low Stock"
                        value={m.low_stock}
                        trend={m.low_trend}
                        trendPositive={m.low_trend >= 0}
                    />
                    <StatCard
                        icon={TrendingUp}
                        label="Monthly Sales"
                        value={`$${m.monthly_sales.toLocaleString()}`}
                        trend={m.sales_trend}
                        trendPositive={m.sales_trend >= 0}
                    />
                </div>

                {/* ── Row 2 — Inventory heading ── */}
                <div className="px-1">
                    <h2 className="text-lg font-bold text-white tracking-wide">Inventory</h2>
                    <p className="text-xs text-gray-400 mt-0.5">All Items in the shop</p>
                </div>

                {/* ── Row 3 — 3-col item grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
