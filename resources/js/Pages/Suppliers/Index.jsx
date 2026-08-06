import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Search, Plus, Users, UserCheck, ShoppingCart,
    DollarSign, Phone, Mail, MapPin, Eye, ShoppingBag,
    X, Truck, TrendingUp, Package
} from 'lucide-react';

/* ─── Glass card — blurred court image bg ───────────────────── */
function GlassCard({ className = '', children }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/[0.11] shadow-[0_4px_24px_rgba(0,0,0,0.45)] ${className}`}>
            <img
                src="/images/padel_hero.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                style={{ filter:'blur(24px) brightness(0.4) saturate(1.3)', transform:'scale(1.12)' }}
            />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/* ─── Colored avatar — uses app's dark palette only ────────────── */
const AVATAR_BG = [
    'bg-lime-400/20 text-lime-400 ring-1 ring-lime-400/30',
    'bg-white/10 text-white ring-1 ring-white/15',
    'bg-lime-400/10 text-lime-300 ring-1 ring-lime-400/20',
    'bg-white/8 text-gray-200 ring-1 ring-white/10',
    'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/25',
    'bg-white/12 text-gray-100 ring-1 ring-white/20',
];
function SupplierAvatar({ name, idx }) {
    const cls = AVATAR_BG[idx % AVATAR_BG.length];
    return (
        <div className={`w-12 h-12 rounded-xl ${cls} flex items-center justify-center font-black text-xl flex-shrink-0`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

/* ─── Modal input ─────────────────────────────────────────────── */
function Field({ label, ...props }) {
    return (
        <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
            <input {...props}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/50 transition-all" />
        </div>
    );
}

export default function SuppliersIndex({ suppliers = [], metrics = {}, facility }) {
    const [search, setSearch]       = useState('');
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ name:'', category:'', contact:'', phone:'', email:'', location:'' });

    const m = {
        total_suppliers:  metrics.total_suppliers  ?? 6,
        active_suppliers: metrics.active_suppliers ?? 5,
        total_orders:     metrics.total_orders     ?? 107,
        pending_balance:  metrics.pending_balance  ?? 59550,
    };

    const filtered = suppliers.filter(s =>
        [s.name, s.category, s.location].some(v => v.toLowerCase().includes(search.toLowerCase()))
    );

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const handleSave   = () => { setShowModal(false); setForm({ name:'', category:'', contact:'', phone:'', email:'', location:'' }); };

    const stats = [
        { label:'Total Suppliers', value: m.total_suppliers,                          icon: Truck,        ring:'ring-lime-400/30', text:'text-lime-400'  },
        { label:'Active',          value: m.active_suppliers,                         icon: UserCheck,    ring:'ring-white/15',    text:'text-white'     },
        { label:'Total Orders',    value: m.total_orders,                             icon: ShoppingCart, ring:'ring-lime-400/20', text:'text-lime-300'  },
        { label:'Pending Balance', value:`PKR ${m.pending_balance.toLocaleString()}`, icon: DollarSign,   ring:'ring-white/12',    text:'text-gray-200'  },
    ];

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Suppliers" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Page header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Suppliers</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Manage your padel equipment suppliers</p>
                    </div>
                    <button onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-black text-xs font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_18px_rgba(163,230,53,0.35)]">
                        <Plus className="w-4 h-4" /> Add Supplier
                    </button>
                </div>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {stats.map(({ label, value, icon: Icon, ring, text }) => (
                        <GlassCard key={label}>
                            <div className="p-4 flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-xl ring-1 ${ring} bg-white/[0.06] flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${text}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-gray-400 truncate">{label}</p>
                                    <p className={`text-base font-bold leading-tight truncate ${text}`}>{value}</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* ── Search ── */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                    <input type="text" placeholder="Search suppliers by name, category or location…"
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/40 transition-all" />
                </div>

                {/* ── Supplier cards grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((s, idx) => (
                        <GlassCard key={s.id} className="group hover:border-white/20 hover:-translate-y-0.5 transition-all duration-200">
                            <div className="p-5 flex flex-col gap-4">

                                {/* ── Header ── */}
                                <div className="flex items-center gap-3.5">
                                    <SupplierAvatar name={s.name} idx={idx} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white leading-snug truncate">{s.name}</p>
                                        <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.08] text-gray-400 border border-white/[0.10]">
                                            {s.category}
                                        </span>
                                    </div>
                                    <span className={`flex-shrink-0 text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${
                                        s.status === 'Active'
                                            ? 'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/30'
                                            : 'bg-gray-500/15 text-gray-400 ring-1 ring-gray-500/20'
                                    }`}>
                                        {s.status}
                                    </span>
                                </div>

                                {/* ── Contact info ── */}
                                <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                                    {[
                                        { icon: Users,  val: s.contact  },
                                        { icon: Phone,  val: s.phone    },
                                        { icon: Mail,   val: s.email    },
                                        { icon: MapPin, val: s.location },
                                    ].map(({ icon: Icon, val }) => (
                                        <div key={val} className="flex items-center gap-1.5 min-w-0">
                                            <Icon className="w-3 h-3 text-gray-500 flex-shrink-0" />
                                            <span className="text-[10px] text-gray-300 truncate">{val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Stats bar ── */}
                                <div className="flex items-stretch rounded-xl overflow-hidden bg-white/[0.05] ring-1 ring-white/[0.08]">
                                    {[
                                        { label:'Orders',     val: s.total_orders,                                            color:'text-white'    },
                                        { label:'Last Order', val: s.last_order,                                              color:'text-gray-300' },
                                        { label:'Balance',    val: s.balance > 0 ? `PKR ${s.balance.toLocaleString()}` : '—', color:'text-lime-400' },
                                    ].map(({ label, val, color }, i, arr) => (
                                        <div key={label}
                                            className={`flex-1 flex flex-col items-center justify-center py-2.5 px-2 ${i < arr.length - 1 ? 'border-r border-white/[0.08]' : ''}`}>
                                            <span className="text-[8px] text-gray-500 uppercase tracking-wider mb-0.5">{label}</span>
                                            <span className={`text-xs font-bold ${color} truncate max-w-full text-center`}>{val}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* ── Actions ── */}
                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 rounded-xl bg-white/[0.07] ring-1 ring-white/[0.12] text-gray-200 hover:text-white hover:bg-white/[0.12] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                                        <Eye className="w-3.5 h-3.5" /> View Details
                                    </button>
                                    <button className="flex-1 py-2 rounded-xl bg-lime-400 text-black text-xs font-extrabold flex items-center justify-center gap-1.5 hover:bg-lime-300 transition-all shadow-[0_0_12px_rgba(163,230,53,0.3)]">
                                        <ShoppingBag className="w-3.5 h-3.5" /> New Order
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-600">
                        <Truck className="w-10 h-10 opacity-25" />
                        <p className="text-sm">No suppliers found.</p>
                    </div>
                )}
            </div>

            {/* ── Add Supplier Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowModal(false)} />
                    <GlassCard className="relative w-full max-w-lg">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-base font-bold text-white">Add New Supplier</h2>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Fill in the supplier details below</p>
                                </div>
                                <button onClick={() => setShowModal(false)}
                                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Company Name" name="name"     value={form.name}     onChange={handleChange} placeholder="Babolat Sports" />
                                    <Field label="Category"     name="category" value={form.category} onChange={handleChange} placeholder="Rackets & Balls" />
                                </div>
                                <Field label="Contact Person" name="contact" value={form.contact} onChange={handleChange} placeholder="Ahmed Raza" />
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Phone" name="phone" type="tel"   value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" />
                                    <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="contact@supplier.com" />
                                </div>
                                <Field label="Location" name="location" value={form.location} onChange={handleChange} placeholder="Karachi, Pakistan" />
                            </div>
                            <div className="flex gap-2.5 mt-5">
                                <button onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-white/[0.18] text-gray-300 hover:text-white hover:bg-white/[0.08] text-sm font-semibold transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex-1 py-2.5 rounded-xl bg-lime-400 text-black text-sm font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_16px_rgba(163,230,53,0.35)]">
                                    Save Supplier
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
