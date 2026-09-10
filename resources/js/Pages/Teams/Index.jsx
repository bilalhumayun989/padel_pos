import React, { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Plus, X, Users, Trophy, CalendarDays,
    MapPin, DollarSign, CheckCircle, XCircle,
    TrendingUp, Shield, ChevronRight, Clock,
    CreditCard, Star
} from 'lucide-react';

/* ─── Glass card ─────────────────────────────────────────────── */
function GlassCard({ className = '', children, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`rounded-2xl border border-white/[0.13] shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-lime-400/30 hover:-translate-y-0.5' : ''} ${className}`}
            style={{ background:'rgba(10,16,28,0.35)', backdropFilter:'blur(20px) saturate(160%)', WebkitBackdropFilter:'blur(20px) saturate(160%)' }}
        >
            {children}
        </div>
    );
}

/* ─── Avatar stack ───────────────────────────────────────────── */
function MemberAvatars({ members }) {
    return (
        <div className="flex -space-x-2">
            {members.slice(0,4).map((m, i) => (
                <div key={i}
                    className="w-7 h-7 rounded-full bg-lime-400/20 border-2 border-black/40 flex items-center justify-center text-[9px] font-bold text-lime-400 flex-shrink-0">
                    {m.charAt(0).toUpperCase()}
                </div>
            ))}
            {members.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-black/40 flex items-center justify-center text-[9px] font-bold text-gray-400">
                    +{members.length - 4}
                </div>
            )}
        </div>
    );
}

/* ─── Payment badge ──────────────────────────────────────────── */
function PaymentBadge({ payment }) {
    const map = {
        Paid:   'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/30',
        Unpaid: 'bg-red-400/15 text-red-400 ring-1 ring-red-400/25',
        'N/A':  'bg-white/8 text-gray-500 ring-1 ring-white/10',
    };
    return (
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${map[payment] ?? map['N/A']}`}>
            {payment}
        </span>
    );
}

/* ─── Skill badge ────────────────────────────────────────────── */
function SkillBadge({ level }) {
    const map = {
        Pro:          'bg-lime-400/15 text-lime-400 ring-1 ring-lime-400/30',
        Advanced:     'bg-white/12 text-white ring-1 ring-white/20',
        Intermediate: 'bg-white/8 text-gray-300 ring-1 ring-white/12',
        Beginner:     'bg-white/5 text-gray-500 ring-1 ring-white/8',
    };
    return (
        <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${map[level] ?? map.Beginner}`}>
            {level}
        </span>
    );
}

const EMPTY = {
    name:'', captain:'', members:['','','',''],
    skill_level:'Intermediate', court:'', court_booked:false,
    booking_date:'', booking_time:'', payment:'Unpaid',
    payment_amount:'', status:'Active',
};

export default function TeamsIndex({ teams: initial = [], metrics = {}, facility }) {
    const teams = initial;
    const [selectedTeam, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId]       = useState(null);
    const [form, setForm]           = useState(EMPTY);

    const m = {
        total_teams:   metrics.total_teams   ?? teams.length,
        active_teams:  metrics.active_teams  ?? teams.length,
        courts_booked: metrics.courts_booked ?? 0,
        total_matches: metrics.total_matches ?? 0,
    };

    const openAdd  = () => { setForm(EMPTY); setEditId(null); setShowModal(true); };
    const openEdit = (t, e) => {
        e.stopPropagation();
        setForm({ ...t, payment_amount: String(t.payment_amount), members: [...t.members] });
        setEditId(t.id); setShowModal(true);
    };
    const close = () => { setShowModal(false); setEditId(null); };

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    const setMember = (i, v) => setForm(f => { const m=[...f.members]; m[i]=v; return {...f,members:m}; });
    const addMember = () => setForm(f => ({ ...f, members: [...f.members, ''] }));
    const removeMember = i => setForm(f => ({ ...f, members: f.members.filter((_,idx)=>idx!==i) }));

    const handleSave = () => {
        const payload = { ...form };
        router[editId ? 'put' : 'post'](route(editId ? 'teams.update' : 'teams.store', editId || undefined), payload, { onSuccess: close });
    };
    const handleDelete = (id, e) => { e?.stopPropagation(); router.delete(route('teams.destroy', id), { onSuccess: () => { setSelected(null); } }); };

    const stats = [
        { label:'Total Teams',   value: m.total_teams,   icon: Users,       accent:'text-lime-400', ring:'ring-lime-400/30' },
        { label:'Active',        value: m.active_teams,  icon: CheckCircle, accent:'text-white',    ring:'ring-white/15'    },
        { label:'Courts Booked', value: m.courts_booked, icon: MapPin,      accent:'text-lime-300', ring:'ring-lime-300/25' },
        { label:'Total Matches', value: m.total_matches, icon: Trophy,      accent:'text-gray-200', ring:'ring-white/12'    },
    ];

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Teams" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">Teams</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Manage padel teams, court bookings & payments</p>
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 text-black text-xs font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_18px_rgba(163,230,53,0.35)]">
                        <Plus className="w-4 h-4" /> New Team
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

                {/* ── Two-column layout: teams grid + detail panel ── */}
                <div className="flex gap-4 flex-1 min-h-0">

                    {/* Teams grid */}
                    <div className={`grid gap-4 content-start transition-all duration-300 ${selectedTeam ? 'flex-1 grid-cols-1 sm:grid-cols-2' : 'flex-1 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}>
                        {teams.map(team => (
                            <GlassCard key={team.id}
                                onClick={() => setSelected(s => s?.id === team.id ? null : team)}
                                className={`${selectedTeam?.id === team.id ? 'border-lime-400/40 shadow-[0_0_20px_rgba(163,230,53,0.15)]' : ''}`}>
                                <div className="p-4 flex flex-col gap-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{team.name}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                                <Shield className="w-2.5 h-2.5" /> Captain: {team.captain}
                                            </p>
                                        </div>
                                        <div className="flex gap-1.5 flex-shrink-0">
                                            <SkillBadge level={team.skill_level} />
                                        </div>
                                    </div>

                                    {/* Members */}
                                    <div className="flex items-center justify-between">
                                        <MemberAvatars members={team.members} />
                                        <span className="text-[10px] text-gray-400">{team.members.length} players</span>
                                    </div>

                                    {/* Court status */}
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs ${
                                        team.court_booked
                                            ? 'bg-lime-400/10 border border-lime-400/20'
                                            : 'bg-white/5 border border-white/10'
                                    }`}>
                                        <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${team.court_booked ? 'text-lime-400' : 'text-gray-500'}`} />
                                        <span className={team.court_booked ? 'text-lime-400 font-semibold' : 'text-gray-500'}>
                                            {team.court_booked ? `${team.court} — ${team.booking_time}` : 'No court booked'}
                                        </span>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-1">
                                        <PaymentBadge payment={team.payment} />
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-gray-400">{team.wins}W</span>
                                            <span className="text-[10px] text-gray-600">/</span>
                                            <span className="text-[10px] text-gray-400">{team.losses}L</span>
                                            <button onClick={e => openEdit(team, e)}
                                                className="ml-2 text-[10px] text-gray-500 hover:text-lime-400 transition-colors px-1.5 py-0.5 rounded-lg hover:bg-lime-400/10">
                                                Edit
                                            </button>
                                            <button onClick={e => handleDelete(team.id, e)}
                                                className="text-[10px] text-gray-500 hover:text-red-400 transition-colors px-1.5 py-0.5 rounded-lg hover:bg-red-400/10">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}

                        {/* Add placeholder */}
                        <button onClick={openAdd}
                            className="rounded-2xl border-2 border-dashed border-white/[0.12] hover:border-lime-400/35 text-gray-600 hover:text-lime-400 transition-all flex flex-col items-center justify-center gap-2 py-10 bg-transparent min-h-[160px]">
                            <Plus className="w-6 h-6" />
                            <span className="text-xs font-semibold">Add Team</span>
                        </button>
                    </div>

                    {/* Detail panel */}
                    {selectedTeam && (
                        <GlassCard className="w-80 flex-shrink-0 self-start">
                            <div className="p-5 flex flex-col gap-4">
                                {/* Panel header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white">{selectedTeam.name}</h3>
                                    <button onClick={() => setSelected(null)}
                                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Court image */}
                                {selectedTeam.image && (
                                    <div className="h-32 rounded-xl overflow-hidden bg-white/5">
                                        <img src={selectedTeam.image} alt="Court" className="w-full h-full object-cover" />
                                    </div>
                                )}

                                {/* Info rows */}
                                {[
                                    { icon: Shield,      label:'Captain',     val: selectedTeam.captain           },
                                    { icon: Star,        label:'Skill',       val: selectedTeam.skill_level       },
                                    { icon: MapPin,      label:'Court',       val: selectedTeam.court || 'None'   },
                                    { icon: CalendarDays,label:'Booking',     val: selectedTeam.booking_date || 'N/A' },
                                    { icon: Clock,       label:'Time',        val: selectedTeam.booking_time || 'N/A' },
                                    { icon: CreditCard,  label:'Payment',     val: selectedTeam.payment           },
                                    { icon: DollarSign,  label:'Amount',      val: selectedTeam.payment_amount > 0 ? `PKR ${selectedTeam.payment_amount}` : 'N/A' },
                                ].map(({ icon: Icon, label, val }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <Icon className="w-3.5 h-3.5 text-lime-400/70 flex-shrink-0" />
                                        <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">{label}</span>
                                        <span className="text-xs font-semibold text-white truncate">{val}</span>
                                    </div>
                                ))}

                                {/* Members list */}
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Members</p>
                                    <div className="space-y-1.5">
                                        {selectedTeam.members.map((m, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center text-[9px] font-bold text-lime-400">
                                                    {m.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-xs text-gray-200">{m}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-3">
                                    {[
                                        { label:'Matches', val: selectedTeam.matches },
                                        { label:'Wins',    val: selectedTeam.wins    },
                                        { label:'Losses',  val: selectedTeam.losses  },
                                    ].map(({ label, val }) => (
                                        <div key={label} className="text-center">
                                            <p className="text-[9px] text-gray-500 uppercase tracking-wider">{label}</p>
                                            <p className="text-base font-bold text-white">{val}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </GlassCard>
                    )}
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={close} />
                    <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.13]"
                        style={{ background:'rgba(10,16,28,0.75)', backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)' }}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <h2 className="text-base font-bold text-white">{editId ? 'Edit Team' : 'Create New Team'}</h2>
                                    <p className="text-[10px] text-gray-400 mt-0.5">Fill in team details below</p>
                                </div>
                                <button onClick={close} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {/* Team name + Captain */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[['Team Name','name','Team Alpha'],['Captain','captain','Umar Iqbal']].map(([label,name,ph]) => (
                                        <div key={name}>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
                                            <input name={name} value={form[name]} onChange={handleChange} placeholder={ph}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/50 transition-all" />
                                        </div>
                                    ))}
                                </div>

                                {/* Skill + Status */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label:'Skill Level', name:'skill_level', opts:['Beginner','Intermediate','Advanced','Pro'] },
                                        { label:'Status',      name:'status',      opts:['Active','Inactive'] },
                                    ].map(({ label, name, opts }) => (
                                        <div key={name}>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
                                            <select name={name} value={form[name]} onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all [color-scheme:dark]">
                                                {opts.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-sm text-gray-400">Use New Booking on the Schedule page to reserve a court for this team.</p>
                            </div>

                            <div className="flex gap-2.5 mt-5">
                                <button onClick={close}
                                    className="flex-1 py-2.5 rounded-xl border border-white/[0.18] text-gray-300 hover:text-white hover:bg-white/[0.08] text-sm font-semibold transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex-1 py-2.5 rounded-xl bg-lime-400 text-black text-sm font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_16px_rgba(163,230,53,0.35)]">
                                    {editId ? 'Save Changes' : 'Create Team'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
