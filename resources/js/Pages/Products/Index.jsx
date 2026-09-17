import { PADEL_BACKGROUND } from '@/lib/images';
import React, { useState, useMemo } from 'react';
import { router, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Plus, Search, Edit2, Trash2, X,
    Package, Coffee, ShoppingBag, LayoutList,
    TrendingUp, Tag, AlertTriangle
} from 'lucide-react';

/* ─── Glass card ─────────────────────────────────────────────── */
function GlassCard({ className = '', children }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/[0.11] shadow-[0_4px_24px_rgba(0,0,0,0.45)] ${className}`}>
            <img src={PADEL_BACKGROUND} alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                style={{ filter:'blur(24px) brightness(0.4) saturate(1.3)', transform:'scale(1.12)' }} />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/* ─── Form field ─────────────────────────────────────────────── */
function Field({ label, children }) {
    return (
        <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
            {children}
        </div>
    );
}
function Input({ ...props }) {
    return (
        <input {...props}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/50 transition-all" />
    );
}

const CAFE_CATS   = ['All', 'Drinks', 'Snacks', 'Bundles'];
const PADDLE_CATS = ['All', 'Rackets', 'Balls'];

const CAT_ICON = {
    Drinks:    <Coffee className="w-3.5 h-3.5" />,
    Snacks:    <ShoppingBag className="w-3.5 h-3.5" />,
    Bundles:   <ShoppingBag className="w-3.5 h-3.5" />,
    Rackets:   <Package className="w-3.5 h-3.5" />,
    Balls:     <Package className="w-3.5 h-3.5" />,
    Equipment: <Package className="w-3.5 h-3.5" />,
};

const EMPTY_FORM = { name:'', category:'Cafe', price:'', cost:'', stock:'', unit:'cup', supplier:'', image:'', status:'Active' };

export default function ProductsIndex({ products = [], suppliers = [], metrics = {}, tab = 'cafe', facility }) {
    const [search, setSearch]     = useState('');
    const [cat, setCat]           = useState('All');

    // Reset category filter when tab changes
    React.useEffect(() => { setCat('All'); }, [tab]);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem]   = useState(null);
    const [form, setForm]           = useState(EMPTY_FORM);

    const CATS = tab === 'cafe' ? CAFE_CATS : PADDLE_CATS;

    const m = {
        total_products: metrics.total     ?? products.length,
        active:         metrics.active    ?? products.length,
        low_stock:      metrics.low_stock ?? 0,
        categories:     metrics.categories ?? 0,
    };

    const filtered = useMemo(() =>
        products.filter(p => {
            const matchCat  = cat === 'All' || p.category === cat;
            const matchText = !search || p.name.toLowerCase().includes(search.toLowerCase())
                || p.category.toLowerCase().includes(search.toLowerCase())
                || (p.supplier ?? '').toLowerCase().includes(search.toLowerCase());
            return matchCat && matchText;
        }),
    [products, cat, search]);

    const openAdd  = () => { setForm(EMPTY_FORM); setEditItem(null); setShowModal(true); };
    const openEdit = (p) => { setForm({ ...p, price: String(p.price), cost: String(p.cost), stock: String(p.stock) }); setEditItem(p.id); setShowModal(true); };
    const closeModal = () => { setShowModal(false); setEditItem(null); };
    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = () => router[editItem ? 'put' : 'post'](route(editItem ? 'products.update' : 'products.store', editItem || undefined), form, { onSuccess: closeModal });

    const statCards = [
        { label:'Total Products', value: m.total_products, icon: LayoutList,    accent:'text-lime-400',  ring:'ring-lime-400/30'  },
        { label:'Active',         value: m.active,         icon: TrendingUp,    accent:'text-white',     ring:'ring-white/15'     },
        { label:'Low Stock',      value: m.low_stock,      icon: AlertTriangle, accent:'text-lime-300',  ring:'ring-lime-300/25'  },
        { label:'Categories',     value: m.categories,     icon: Tag,           accent:'text-gray-200',  ring:'ring-white/12'     },
    ];

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Products" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Products</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Manage cafe items, bundles and equipment</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-black text-xs font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_18px_rgba(163,230,53,0.35)]">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>

                {/* ── Tab bar ── */}
                <div className="flex items-center gap-1.5">
                    <Link href={route('products.cafe')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            tab === 'cafe'
                                ? 'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/40'
                                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}>
                        Cafe Stuff
                    </Link>
                    <Link href={route('products.paddle')}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            tab === 'paddle'
                                ? 'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/40'
                                : 'bg-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}>
                        Paddle Stuff
                    </Link>
                </div>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {statCards.map(({ label, value, icon: Icon, accent, ring }) => (
                        <GlassCard key={label}>
                            <div className="p-4 flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-xl ring-1 ${ring} bg-white/[0.06] flex items-center justify-center flex-shrink-0 ${accent}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 truncate">{label}</p>
                                    <p className={`text-lg font-bold leading-tight ${accent}`}>{value}</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* ── Filter + Search row ── */}
                <div className="flex flex-wrap items-center gap-2">
                    {CATS.map(c => (
                        <button key={c} onClick={() => setCat(c)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                cat === c
                                    ? 'bg-lime-400 text-black shadow-[0_0_12px_rgba(163,230,53,0.35)]'
                                    : 'bg-white/[0.06] border border-white/[0.12] text-gray-300 hover:text-white hover:border-white/25'
                            }`}>
                            {c}
                        </button>
                    ))}
                    <div className="relative ml-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
                        <input type="text" placeholder="Search products…"
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/40 transition-all w-52" />
                    </div>
                </div>

                {/* ── Products grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filtered.map(p => (
                        <GlassCard key={p.id} className="group hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200">
                            <div className="flex flex-col">
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-black/20">
                                    <img src={p.image} alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    {/* Category badge */}
                                    <div className="absolute top-2 right-2">
                                        <span className="flex items-center gap-1 text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-lime-400 border border-lime-400/30">
                                            {CAT_ICON[p.category]} {p.category}
                                        </span>
                                    </div>
                                    {/* Low stock warning */}
                                    {p.status === 'Low Stock' && (
                                        <div className="absolute top-2 left-2">
                                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                                                Low Stock
                                            </span>
                                        </div>
                                    )}
                                    {/* Edit overlay */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => openEdit(p)}
                                            className="p-2 rounded-xl bg-white/15 text-white hover:bg-white/25 transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 rounded-xl bg-red-400/20 text-red-400 hover:bg-red-400/30 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-3 flex flex-col gap-1.5">
                                    <p className="text-xs font-bold text-white leading-tight truncate">{p.name}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-extrabold text-lime-400">${p.price.toFixed(2)}</span>
                                        <span className="text-[10px] text-gray-500">{p.stock} {p.unit}</span>
                                    </div>
                                    {p.supplier && (
                                        <p className="text-[9px] text-gray-500 truncate">📦 {p.supplier}</p>
                                    )}
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {/* Add new product placeholder card */}
                    <button onClick={openAdd}
                        className="aspect-auto rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-lime-400/40 text-gray-600 hover:text-lime-400 transition-all flex flex-col items-center justify-center gap-2 py-10 bg-transparent">
                        <Plus className="w-8 h-8" />
                        <span className="text-xs font-semibold">Add Product</span>
                    </button>
                </div>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-600">
                        <Package className="w-10 h-10 opacity-25" />
                        <p className="text-sm">No products found.</p>
                    </div>
                )}
            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closeModal} />
                    <GlassCard className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-base font-bold text-white">{editItem ? 'Edit Product' : 'Add New Product'}</h2>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Fill in the product details below</p>
                                </div>
                                <button onClick={closeModal}
                                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Name + Category */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Product Name">
                                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Cold Brew Coffee" />
                                    </Field>
                                    <Field label="Category">
                                        <select name="category" value={form.category} onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all [color-scheme:dark]">
                                            <option value="Cafe">Cafe</option>
                                            <option value="Bundles">Bundles</option>
                                            <option value="Equipment">Equipment</option>
                                        </select>
                                    </Field>
                                </div>

                                {/* Price + Cost + Stock */}
                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="Selling Price ($)">
                                        <Input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="4.50" />
                                    </Field>
                                    <Field label="Cost Price ($)">
                                        <Input name="cost" type="number" step="0.01" value={form.cost} onChange={handleChange} placeholder="2.00" />
                                    </Field>
                                    <Field label="Stock Qty">
                                        <Input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="50" />
                                    </Field>
                                </div>

                                {/* Unit + Status */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Unit">
                                        <select name="unit" value={form.unit} onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all [color-scheme:dark]">
                                            <option value="cup">Cup</option>
                                            <option value="pack">Pack</option>
                                            <option value="bundle">Bundle</option>
                                            <option value="roll">Roll</option>
                                            <option value="piece">Piece</option>
                                        </select>
                                    </Field>
                                    <Field label="Status">
                                        <select name="status" value={form.status} onChange={handleChange}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all [color-scheme:dark]">
                                            <option value="Active">Active</option>
                                            <option value="Low Stock">Low Stock</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    </Field>
                                </div>

                                {/* Supplier (optional) */}
                                <Field label="Supplier (optional)">
                                    <select name="supplier" value={form.supplier} onChange={handleChange}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all [color-scheme:dark]">
                                        <option value="">— No supplier —</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.name} className="bg-gray-900">{s.name}</option>
                                        ))}
                                    </select>
                                </Field>

                                {/* Image URL */}
                                <Field label="Image URL (optional)">
                                    <Input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                                </Field>
                            </div>

                            <div className="flex gap-2.5 mt-5">
                                <button onClick={closeModal}
                                    className="flex-1 py-2.5 rounded-xl border border-white/[0.18] text-gray-300 hover:text-white hover:bg-white/[0.08] text-sm font-semibold transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex-1 py-2.5 rounded-xl bg-lime-400 text-black text-sm font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_16px_rgba(163,230,53,0.35)]">
                                    {editItem ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
