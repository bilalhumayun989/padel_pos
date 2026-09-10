import RecordForm from '@/Components/RecordForm';
import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Plus, X, Edit2, Trash2, Check, Crown,
    Users, TrendingUp, DollarSign, Zap,
    Star, Shield, Award
} from 'lucide-react';

/* ─── Glass card — pure backdrop-filter, no embedded image ─────── */
function GlassCard({ className = '', children }) {
    return (
        <div
            className={`rounded-2xl border border-white/[0.13] shadow-[0_8px_32px_rgba(0,0,0,0.45)] ${className}`}
            style={{
                background: 'rgba(10,16,28,0.35)',
                backdropFilter: 'blur(20px) saturate(160%)',
                WebkitBackdropFilter: 'blur(20px) saturate(160%)',
            }}
        >
            {children}
        </div>
    );
}

/* ─── Form helpers ───────────────────────────────────────────── */
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

/* ─── Badge icon by plan level ───────────────────────────────── */
function PlanIcon({ color }) {
    const map = {
        gray:  { icon: Shield, cls: 'text-gray-300 bg-white/10 ring-white/20'   },
        lime:  { icon: Star,   cls: 'text-lime-400 bg-lime-400/15 ring-lime-400/30' },
        white: { icon: Award,  cls: 'text-white bg-white/15 ring-white/30'      },
    };
    const { icon: Icon, cls } = map[color] ?? map.gray;
    return (
        <div className={`w-12 h-12 rounded-2xl ring-1 flex items-center justify-center flex-shrink-0 ${cls}`}>
            <Icon className="w-6 h-6" />
        </div>
    );
}

const EMPTY = {
    name: '', badge: '', price: '', duration: 30,
    color: 'lime', status: 'Active',
    perks: [''],
};

export default function MembershipsIndex({ plans: initialPlans = [], metrics = {}, clients = [], facility }) {
    const plans = initialPlans;
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId]       = useState(null);
    const [form, setForm]           = useState(EMPTY);

    const m = {
        total_plans:     metrics.total_plans     ?? plans.length,
        active_members:  metrics.active_members  ?? 0,
        monthly_revenue: metrics.monthly_revenue ?? 0,
        new_this_month:  metrics.new_this_month  ?? 0,
    };

    const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
    const openEdit = (p) => {
        setForm({ ...p, price: String(p.price), duration: String(p.duration), perks: [...p.perks] });
        setEditId(p.id); setShowModal(true);
    };
    const close = () => { setShowModal(false); setEditId(null); };

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    /* Perks management */
    const setPerk  = (i, v) => setForm(f => { const p=[...f.perks]; p[i]=v; return {...f,perks:p}; });
    const addPerk  = ()     => setForm(f => ({ ...f, perks: [...f.perks, ''] }));
    const removePerk = (i)  => setForm(f => ({ ...f, perks: f.perks.filter((_,idx)=>idx!==i) }));

    const handleSave = () => {
        const payload = { ...form };
        router[editId ? 'put' : 'post'](route(editId ? 'memberships.update' : 'memberships.store', editId || undefined), payload, { onSuccess: close });
    };
    const handleDelete = (id, e) => { e?.stopPropagation(); router.delete(route('memberships.destroy', id), { onSuccess: () => {  } }); };

    const stats = [
        { label:'Total Plans',     value: m.total_plans,                             icon: Crown,       accent:'text-lime-400', ring:'ring-lime-400/30'  },
        { label:'Active Members',  value: m.active_members,                          icon: Users,       accent:'text-white',    ring:'ring-white/15'     },
        { label:'Monthly Revenue', value:`PKR ${m.monthly_revenue.toLocaleString()}`,icon: DollarSign,  accent:'text-lime-300', ring:'ring-lime-300/25'  },
        { label:'New This Month',  value: m.new_this_month,                          icon: TrendingUp,  accent:'text-gray-200', ring:'ring-white/12'     },
    ];

    return (
        <AuthenticatedLayout facility={facility}>
            <div className="flex flex-wrap gap-3 mb-4"><RecordForm label="Enroll Client" endpoint={route('memberships.enroll')} fields={[
 {name:'client_id',label:'Client',required:true,options:clients.map(c=>({value:c.id,label:c.name}))},
 {name:'membership_plan_id',label:'Plan',required:true,options:plans.filter(p=>p.status==='Active').map(p=>({value:p.id,label:p.name}))},
 {name:'starts_at',label:'Start Date',type:'date',required:true}
 ]} /></div>
            <Head title="Padel POS – Memberships" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Membership Plans</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Create and manage Pro Member subscriptions</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-black text-xs font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_18px_rgba(163,230,53,0.35)]">
                        <Plus className="w-4 h-4" /> New Plan
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
                                    <p className={`text-base font-bold leading-tight ${accent}`}>{value}</p>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* ── Plans grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {plans.map(plan => (
                        <GlassCard key={plan.id}
                            className={`group hover:-translate-y-1 transition-all duration-200 h-full ${
                                plan.color === 'lime'  ? 'border-lime-400/25 hover:border-lime-400/50 shadow-[0_8px_32px_rgba(163,230,53,0.12)]'  :
                                plan.color === 'white' ? 'border-white/20   hover:border-white/40'   :
                                'border-white/[0.13] hover:border-white/25'
                            }`}>
                            <div className="p-5 flex flex-col gap-4 h-full">
                                {/* Colored top accent bar */}
                                <div className={`absolute inset-x-0 top-0 h-0.5 ${
                                    plan.color === 'lime'  ? 'bg-lime-400/60'  :
                                    plan.color === 'white' ? 'bg-white/40'     :
                                    'bg-white/20'
                                }`} />

                                {/* Plan header */}
                                <div className="flex items-start gap-3.5">
                                    <PlanIcon color={plan.color} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-extrabold text-white">{plan.name}</p>
                                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ring-1 ${
                                                plan.color === 'lime'  ? 'bg-lime-400/15 text-lime-400 ring-lime-400/30'  :
                                                plan.color === 'white' ? 'bg-white/12 text-white ring-white/25'            :
                                                'bg-white/8 text-gray-300 ring-white/15'
                                            }`}>{plan.badge}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{plan.subscribers ?? 0} active subscribers</p>
                                    </div>
                                    {/* Actions */}
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(plan)}
                                            className="p-1.5 rounded-lg bg-white/8 text-gray-300 hover:text-white hover:bg-white/15 transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDelete(plan.id)}
                                            className="p-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="flex items-end gap-1.5">
                                    <span className="text-3xl font-extrabold text-lime-400 leading-none drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]">
                                        PKR {plan.price.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-400 mb-0.5">/ {plan.duration} days</span>
                                </div>

                                {/* Perks list */}
                                <div className="space-y-2 flex-1">
                                    {plan.perks.map((perk, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <div className="w-4 h-4 rounded-full bg-lime-400/20 ring-1 ring-lime-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-2.5 h-2.5 text-lime-400" />
                                            </div>
                                            <span className="text-xs text-gray-200">{perk}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
                                    <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded-full ring-1 ${
                                        plan.status === 'Active'
                                            ? 'bg-lime-400/10 text-lime-400 ring-lime-400/25'
                                            : 'bg-white/8 text-gray-400 ring-white/15'
                                    }`}>{plan.status}</span>
                                    <button className="text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> Assign to Member
                                    </button>
                                </div>
                            </div>
                        </GlassCard>
                    ))}

                    {/* Add placeholder */}
                    <button onClick={openAdd}
                        className="rounded-2xl border-2 border-dashed border-white/[0.15] hover:border-lime-400/40 text-gray-600 hover:text-lime-400 transition-all flex flex-col items-center justify-center gap-2 py-16 min-h-[260px] bg-transparent">
                        <Crown className="w-8 h-8" />
                        <span className="text-xs font-semibold">Create New Plan</span>
                    </button>
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
                    <GlassCard className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-base font-bold text-white">{editId ? 'Edit Plan' : 'Create New Plan'}</h2>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Define membership perks and pricing</p>
                                </div>
                                <button onClick={close}
                                    className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Name + Badge */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Plan Name">
                                        <Input name="name" value={form.name} onChange={handleChange} placeholder="Pro Member" />
                                    </Field>
                                    <Field label="Badge Label">
                                        <Input name="badge" value={form.badge} onChange={handleChange} placeholder="Pro Member" />
                                    </Field>
                                </div>

                                {/* Price + Duration */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Price (PKR)">
                                        <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="3500" />
                                    </Field>
                                    <Field label="Duration (days)">
                                        <Select name="duration" value={form.duration} onChange={handleChange}>
                                            {[7,15,30,60,90,180,365].map(d => <option key={d} value={d}>{d} days</option>)}
                                        </Select>
                                    </Field>
                                </div>

                                {/* Color + Status */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="Badge Color">
                                        <Select name="color" value={form.color} onChange={handleChange}>
                                            <option value="gray">Gray (Basic)</option>
                                            <option value="lime">Lime (Pro)</option>
                                            <option value="white">White (Elite)</option>
                                        </Select>
                                    </Field>
                                    <Field label="Status">
                                        <Select name="status" value={form.status} onChange={handleChange}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </Select>
                                    </Field>
                                </div>

                                {/* Perks */}
                                <Field label="Perks / Benefits">
                                    <div className="space-y-2">
                                        {form.perks.map((perk, i) => (
                                            <div key={i} className="flex gap-2">
                                                <div className="flex items-center justify-center w-8 h-[42px] flex-shrink-0">
                                                    <Check className="w-3.5 h-3.5 text-lime-400" />
                                                </div>
                                                <input
                                                    value={perk}
                                                    onChange={e => setPerk(i, e.target.value)}
                                                    placeholder={`Perk ${i + 1}...`}
                                                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/50 transition-all"
                                                />
                                                {form.perks.length > 1 && (
                                                    <button onClick={() => removePerk(i)}
                                                        className="w-8 h-[42px] flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors flex-shrink-0">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button onClick={addPerk}
                                            className="flex items-center gap-1.5 text-xs text-lime-400 hover:text-lime-300 transition-colors font-semibold px-2 py-1">
                                            <Plus className="w-3.5 h-3.5" /> Add Perk
                                        </button>
                                    </div>
                                </Field>
                            </div>

                            <div className="flex gap-2.5 mt-5">
                                <button onClick={close}
                                    className="flex-1 py-2.5 rounded-xl border border-white/[0.18] text-gray-300 hover:text-white hover:bg-white/[0.08] text-sm font-semibold transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex-1 py-2.5 rounded-xl bg-lime-400 text-black text-sm font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_16px_rgba(163,230,53,0.35)]">
                                    {editId ? 'Save Changes' : 'Create Plan'}
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
