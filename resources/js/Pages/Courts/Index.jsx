import React, { useState, useRef } from 'react';
import { router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Plus, X, Edit2, Trash2, MapPin, Clock, Users,
    DollarSign, Zap, CheckCircle, AlertTriangle,
    Grid3x3, TrendingUp, Upload, Image
} from 'lucide-react';

/* ─── Glass card ─────────────────────────────────────────────── */
function GlassCard({ className = '', children }) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/[0.13] shadow-[0_8px_32px_rgba(0,0,0,0.55)] ${className}`}>
            <img src="/images/padel_hero.png" alt="" aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                style={{ filter:'blur(26px) brightness(0.35) saturate(1.4)', transform:'scale(1.15)' }} />
            {/* subtle dark scrim so content is readable */}
            <div className="absolute inset-0 bg-black/20 pointer-events-none" />
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
function Select({ children, ...props }) {
    return (
        <select {...props}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all [color-scheme:dark]">
            {children}
        </select>
    );
}

/* ─── Status badge ───────────────────────────────────────────── */
function StatusBadge({ status }) {
    const map = {
        Active:      'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/30',
        Maintenance: 'bg-amber-400/15 text-amber-400 ring-1 ring-amber-400/30',
        Inactive:    'bg-white/8 text-gray-400 ring-1 ring-white/15',
    };
    return (
        <span className={`text-[9px] font-bold uppercase px-2.5 py-1 rounded-full ${map[status] ?? map.Inactive}`}>
            {status}
        </span>
    );
}

const EMPTY = {
    name: '', type: 'Indoor', location: '', price_per_hour: '',
    capacity: 4, surface: 'Glass', lights: true,
    description: '', image: '', status: 'Active',
};

export default function CourtsIndex({ courts: initialCourts = [], metrics = {}, facility }) {
    const courts = initialCourts;
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId]       = useState(null);
    const [form, setForm]           = useState(EMPTY);
    const [preview, setPreview]     = useState('');
    const fileRef = useRef();

    const m = {
        total:         metrics.total         ?? courts.length,
        active:        metrics.active        ?? courts.length,
        maintenance:   metrics.maintenance   ?? 0,
        revenue_today: metrics.revenue_today ?? 0,
    };

    const openAdd = () => {
        setForm(EMPTY); setEditId(null); setPreview(''); setShowModal(true);
    };
    const openEdit = (c) => {
        setForm({ ...c, price_per_hour: String(c.price_per_hour) });
        setEditId(c.id); setPreview(c.image || ''); setShowModal(true);
    };
    const close = () => { setShowModal(false); setEditId(null); setPreview(''); };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageFile = e => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview('');
        setForm(f => ({ ...f, image: '' }));
    };

    const handleSave = () => {
        const payload = { ...form };
        router[editId ? 'put' : 'post'](route(editId ? 'courts.update' : 'courts.store', editId || undefined), payload, { onSuccess: close });
    };
    const handleDelete = (id, e) => { e?.stopPropagation(); router.delete(route('courts.destroy', id), { onSuccess: () => {  } }); };

    const stats = [
        { label:'Total Courts',    value: m.total,                          icon: Grid3x3,    accent:'text-lime-400',  ring:'ring-lime-400/30'  },
        { label:'Active',          value: m.active,                         icon: CheckCircle, accent:'text-white',     ring:'ring-white/15'     },
        { label:'Maintenance',     value: m.maintenance,                    icon: AlertTriangle, accent:'text-amber-400', ring:'ring-amber-400/25'},
        { label:"Today's Revenue", value:`PKR ${(m.revenue_today).toLocaleString()}`, icon: TrendingUp, accent:'text-lime-300', ring:'ring-lime-300/25'},
    ];

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Courts" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Courts</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Manage your padel courts</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-black text-xs font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_18px_rgba(163,230,53,0.35)]">
                        <Plus className="w-4 h-4" /> Add Court
                    </button>
                </div>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {stats.map(({ label, value, icon: Icon, accent, ring }) => (
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

                {/* ── Courts grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {courts.map(court => (
                        <GlassCard key={court.id} className="group hover:border-white/25 hover:-translate-y-0.5 transition-all duration-200">
                            {/* Court image */}
                            <div className="relative h-44 overflow-hidden rounded-t-2xl">
                                {court.image ? (
                                    <img src={court.image} alt={court.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-white/[0.04] flex items-center justify-center">
                                        <Grid3x3 className="w-14 h-14 text-gray-700" />
                                    </div>
                                )}
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

                                {/* Badges */}
                                <div className="absolute top-3 right-3">
                                    <StatusBadge status={court.status} />
                                </div>
                                <div className="absolute top-3 left-3">
                                    <span className="text-[9px] font-bold uppercase px-2 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-lime-400 border border-lime-400/30">
                                        {court.type}
                                    </span>
                                </div>

                                {/* Court name over image bottom */}
                                <div className="absolute bottom-3 left-4 right-4">
                                    <p className="text-base font-extrabold text-white drop-shadow-lg leading-tight">{court.name}</p>
                                    {court.description && (
                                        <p className="text-[10px] text-gray-300 mt-0.5 line-clamp-1 drop-shadow">{court.description}</p>
                                    )}
                                </div>

                                {/* Edit/Delete overlay */}
                                <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                    <button onClick={() => openEdit(court)}
                                        className="p-3 rounded-xl bg-white/15 backdrop-blur-sm text-white hover:bg-white/25 transition-all border border-white/20">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(court.id)}
                                        className="p-3 rounded-xl bg-red-400/20 backdrop-blur-sm text-red-400 hover:bg-red-400/35 transition-all border border-red-400/20">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Info section */}
                            <div className="p-4 flex flex-col gap-3">
                                {/* Price highlight */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-extrabold text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.4)]">
                                        ${court.price_per_hour}<span className="text-xs font-medium text-gray-400">/hr</span>
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${court.lights ? 'bg-lime-400' : 'bg-gray-600'}`} />
                                        <span className="text-[10px] text-gray-400">{court.lights ? 'Flood lights' : 'No lights'}</span>
                                    </div>
                                </div>

                                {/* Detail grid */}
                                <div className="grid grid-cols-2 gap-1.5">
                                    {[
                                        { icon: MapPin,  val: court.location },
                                        { icon: Users,   val: `${court.capacity} Players` },
                                        { icon: Zap,     val: court.surface },
                                        { icon: Clock,   val: 'Available Now' },
                                    ].map(({ icon: Icon, val }) => (
                                        <div key={val} className="flex items-center gap-1.5 bg-white/[0.06] rounded-lg px-2.5 py-2 border border-white/[0.08]">
                                            <Icon className="w-3 h-3 text-lime-400/70 flex-shrink-0" />
                                            <span className="text-[10px] text-gray-200 truncate font-medium">{val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {/* Add placeholder */}
                    <button onClick={openAdd}
                        className="rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-lime-400/40 text-gray-600 hover:text-lime-400 transition-all flex flex-col items-center justify-center gap-2 py-16 bg-transparent min-h-[300px]">
                        <Plus className="w-8 h-8" />
                        <span className="text-xs font-semibold">Add New Court</span>
                    </button>
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
                    <GlassCard className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-base font-bold text-white">{editId ? 'Edit Court' : 'Add New Court'}</h2>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Fill in the court details below</p>
                                </div>
                                <button onClick={close}
                                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Image upload */}
                                <Field label="Court Image">
                                    <div className="flex gap-3 items-start">
                                        {/* Preview */}
                                        <div className="w-32 h-24 rounded-xl overflow-hidden bg-white/[0.06] border border-white/[0.12] flex items-center justify-center flex-shrink-0">
                                            {preview ? (
                                                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <Image className="w-8 h-8 text-gray-600" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col gap-2">
                                            
                                            
                                            <Input name="image" value={form.image} onChange={handleChange} placeholder="or paste image URL..." />
                                        </div>
                                    </div>
                                </Field>

                                {/* Name + Type */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Court Name">
                                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Court 1" />
                                    </Field>
                                    <Field label="Type">
                                        <Select name="type" value={form.type} onChange={handleChange}>
                                            <option value="Indoor">Indoor</option>
                                            <option value="Outdoor">Outdoor</option>
                                            <option value="Panoramic">Panoramic</option>
                                            
                                        </Select>
                                    </Field>
                                </div>

                                {/* Location */}
                                <Field label="Location / Area">
                                    <Input name="location" value={form.location} onChange={handleChange} placeholder="Ground Floor, Block A" />
                                </Field>

                                {/* Price + Capacity + Surface */}
                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="Price / Hour ($)">
                                        <Input name="price_per_hour" type="number" value={form.price_per_hour} onChange={handleChange} placeholder="25" />
                                    </Field>
                                    <Field label="Capacity">
                                        <Select name="capacity" value={form.capacity} onChange={handleChange}>
                                            {[2, 4, 6].map(n => <option key={n} value={n}>{n} Players</option>)}
                                        </Select>
                                    </Field>
                                    <Field label="Surface">
                                        <Select name="surface" value={form.surface} onChange={handleChange}>
                                            <option value="Glass">Glass</option>
                                            <option value="Panoramic Glass">Panoramic Glass</option>
                                            <option value="Artificial Turf">Artificial Turf</option>
                                            <option value="Concrete">Concrete</option>
                                        </Select>
                                    </Field>
                                </div>

                                {/* Status + Lights */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Status">
                                        <Select name="status" value={form.status} onChange={handleChange}>
                                            <option value="Active">Active</option>
                                            <option value="Maintenance">Maintenance</option>
                                            
                                        </Select>
                                    </Field>
                                    <Field label="Flood Lights">
                                        <div className="flex items-center gap-3 h-[42px]">
                                            <button type="button"
                                                onClick={() => setForm(f => ({ ...f, lights: !f.lights }))}
                                                className={`relative w-12 h-6 rounded-full transition-all ${form.lights ? 'bg-lime-400' : 'bg-white/15'}`}>
                                                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.lights ? 'left-6' : 'left-0.5'}`} />
                                            </button>
                                            <span className="text-xs text-gray-300">{form.lights ? 'Available' : 'Not available'}</span>
                                        </div>
                                    </Field>
                                </div>

                                {/* Description */}
                                <Field label="Description (optional)">
                                    <textarea name="description" value={form.description} onChange={handleChange}
                                        rows={2} placeholder="Describe the court..."
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/50 transition-all resize-none" />
                                </Field>
                            </div>

                            <div className="flex gap-2.5 mt-5">
                                <button onClick={close}
                                    className="flex-1 py-2.5 rounded-xl border border-white/[0.18] text-gray-300 hover:text-white hover:bg-white/[0.08] text-sm font-semibold transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex-1 py-2.5 rounded-xl bg-lime-400 text-black text-sm font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_16px_rgba(163,230,53,0.35)]">
                                    {editId ? 'Save Changes' : 'Add Court'}
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
