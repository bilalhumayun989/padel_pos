import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Minus, Trash2, ShoppingCart, MoreVertical } from 'lucide-react';

const TAX_RATE = 0.05;
const TABS = ['All', 'Cafe', 'Bundles'];

export default function CafeIndex({ products = [], facility }) {
    const [activeTab, setActiveTab] = useState('All');

    // Load cart from localStorage on mount, fallback to empty
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('cafe_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('cafe_cart', JSON.stringify(cart));
        } catch {}
    }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id, delta) => {
        setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
    };

    const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
    const clearCart  = ()   => setCart([]);

    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const tax      = subtotal * TAX_RATE;
    const total    = subtotal + tax;

    const filtered = activeTab === 'All' ? products : products.filter(p => p.category === activeTab);

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Cafe" />

            {/* Full-height two-column layout */}
            <div className="flex flex-col lg:flex-row flex-1 w-full gap-5 min-h-0">

                {/* ══════════════ LEFT — Products ══════════════ */}
                <div className="flex-1 flex flex-col gap-3 min-w-0">

                    {/* Title outside the panel */}
                    <h1 className="text-xl font-bold text-white tracking-wide px-1">Products</h1>

                    {/* Big bordered glass container */}
                    <div
                        className="flex-1 rounded-3xl overflow-hidden flex flex-col"
                        style={{
                            background: 'rgba(12,18,30,0.55)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Filter tabs row */}
                        <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-white/8">
                            {TABS.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                                        activeTab === tab
                                            ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_14px_rgba(163,230,53,0.4)]'
                                            : 'bg-transparent text-gray-300 border-white/25 hover:border-white/50 hover:text-white'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Scrollable product grid */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {filtered.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAdd={addToCart}
                                    />
                                ))}
                                {filtered.length === 0 && (
                                    <div className="col-span-3 text-center py-16 text-gray-500 text-sm">
                                        No products in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ══════════════ RIGHT — Current Sale ══════════════ */}
                <div className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0 flex flex-col">
                    <div
                        className="flex-1 rounded-3xl flex flex-col overflow-hidden"
                        style={{
                            background: 'rgba(12,18,30,0.55)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                        }}
                    >
                        <div className="flex flex-col h-full p-5 gap-4">

                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-base font-bold text-white">Current Sale</h2>
                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                        {cart.reduce((s,i)=>s+i.qty,0)} Item{cart.reduce((s,i)=>s+i.qty,0) !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {cart.length > 0 && (
                                        <button
                                            onClick={clearCart}
                                            className="text-[10px] text-gray-400 hover:text-red-400 transition-colors font-semibold flex items-center gap-1"
                                        >
                                            Clear All <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                    <MoreVertical className="w-4 h-4 text-gray-500" />
                                </div>
                            </div>

                            {/* Cart items — scrollable */}
                            <div className="flex-1 overflow-y-auto space-y-0 min-h-[100px]">
                                {cart.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full py-10 gap-3 text-gray-600">
                                        <ShoppingCart className="w-9 h-9 opacity-30" />
                                        <p className="text-xs">Cart is empty</p>
                                    </div>
                                ) : (
                                    cart.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={`py-3 ${idx < cart.length - 1 ? 'border-b border-white/8' : ''}`}
                                        >
                                            {/* Row 1: thumb + name + price */}
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-11 h-11 object-contain flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    <span className="text-xs font-bold text-white">
                                                        ${(item.price * item.qty).toFixed(2)}
                                                    </span>
                                                    <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Row 2: qty controls */}
                                            <div className="flex items-center gap-3 mt-2 pl-14">
                                                <button
                                                    onClick={() => item.qty === 1 ? removeItem(item.id) : updateQty(item.id, -1)}
                                                    className="w-6 h-6 rounded-lg border border-white/20 bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white flex items-center justify-center transition-all text-sm font-bold"
                                                >
                                                    −
                                                </button>
                                                <span className="text-sm font-bold text-white min-w-[1.25rem] text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateQty(item.id, 1)}
                                                    className="w-6 h-6 rounded-lg border border-white/20 bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white flex items-center justify-center transition-all text-sm font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-white/10 pt-3 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-gray-200 font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-400">Tax (5%)</span>
                                    <span className="text-gray-200 font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold pt-2 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="text-lime-400 text-base">${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout */}
                            <button
                                disabled={cart.length === 0}
                                className={`w-full py-3 rounded-2xl text-sm font-extrabold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 ${
                                    cart.length > 0
                                        ? 'bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.35)]'
                                        : 'bg-white/8 text-gray-600 cursor-not-allowed'
                                }`}
                            >
                                <ShoppingCart className="w-4 h-4" /> Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* ── Product Card — matches reference exactly ─────────────────── */
function ProductCard({ product, onAdd }) {
    return (
        <div
            onClick={() => onAdd(product)}
            className="relative rounded-2xl overflow-hidden flex flex-col cursor-pointer group"
            style={{
                background: 'rgba(18,26,42,0.70)',
                border: '1px solid rgba(255,255,255,0.10)',
            }}
        >
            {/* Category badge — top right */}
            <div className="absolute top-2 right-2 z-10">
                <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-lime-400/20 text-lime-400 border border-lime-400/30">
                    {product.category}
                </span>
            </div>

            {/* Product image — large, centered */}
            <div className="flex items-center justify-center px-4 pt-6 pb-3 flex-1">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-32 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-200"
                />
            </div>

            {/* Bottom bar: name + price + add button */}
            <div className="flex items-end justify-between px-3 pb-3 pt-1">
                <div>
                    <p className="text-xs font-bold text-white leading-tight">{product.name}</p>
                    <p className="text-sm font-bold text-lime-400 mt-0.5">${product.price.toFixed(2)}</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onAdd(product); }}
                    className="w-8 h-8 rounded-xl border border-lime-400/50 bg-lime-400/10 text-lime-400 flex items-center justify-center hover:bg-lime-400 hover:text-black transition-all duration-200 flex-shrink-0"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
