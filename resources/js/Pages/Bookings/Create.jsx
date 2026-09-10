import React, { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    CalendarDays, Clock, Users, MapPin, CreditCard,
    ChevronLeft, ChevronRight, Check, Zap
} from 'lucide-react';

/* ─── Glass card ─────────────────────────────────────────────── */
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

/* ─── Section heading ─────────────────────────────────────────── */
function SectionHead({ icon: Icon, title, subtitle }) {
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-2xl bg-lime-400/15 border border-lime-400/30 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-lime-400" />
            </div>
            <div>
                <h3 className="text-sm font-bold text-white">{title}</h3>
                {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

/* ─── Time slot button ────────────────────────────────────────── */
function TimeSlot({ time, selected, disabled, onClick }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                selected
                    ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.4)]'
                    : disabled
                        ? 'bg-white/5 text-gray-600 border-white/5 cursor-not-allowed'
                        : 'bg-white/5 text-gray-300 border-white/12 hover:border-lime-400/40 hover:text-white'
            }`}
        >
            {time}
        </button>
    );
}

/* ─── Court card ──────────────────────────────────────────────── */
function CourtCard({ court, selected, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                selected
                    ? 'border-lime-400/60 bg-lime-400/10 shadow-[0_0_18px_rgba(163,230,53,0.2)]'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
            }`}
        >
            {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-lime-400 flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                </div>
            )}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${selected ? 'bg-lime-400/20 border-lime-400/40' : 'bg-white/8 border-white/12'}`}>
                    <MapPin className={`w-5 h-5 ${selected ? 'text-lime-400' : 'text-gray-400'}`} />
                </div>
                <div className="min-w-0">
                    <p className={`text-sm font-bold ${selected ? 'text-lime-400' : 'text-white'}`}>{court.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{court.type}</p>
                </div>
                <div className="ml-auto text-right flex-shrink-0">
                    <p className="text-sm font-bold text-white">${court.price_per_hour}</p>
                    <p className="text-[9px] text-gray-500">per hour</p>
                </div>
            </div>
        </button>
    );
}

export default function BookingCreate({ courts = [], time_slots = [], clients = [], teams = [], facility }) {
    const { data, setData, post, processing, errors } = useForm({
        court_id:     '',
        team_id: '',
        date:         '',
        start_time:   '',
        duration:     1,
        players:      2,
        client_id:    '',
        client_name:  '',
        payment_type: 'cash',
        notes:        '',
    });

    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const selectedCourt = courts.find(c => c.id === Number(data.court_id));
    const totalPrice    = selectedCourt ? selectedCourt.price_per_hour * data.duration : 0;

    const canNext = useMemo(() => {
        if (step === 1) return data.court_id && data.date && data.start_time;
        if (step === 2) return data.players >= 2 && (data.client_id || data.client_name.trim());
        return true;
    }, [step, data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('bookings.store'));
    };

    const durations = [1, 1.5, 2, 2.5, 3];

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="New Booking" />

            <div className="flex flex-col flex-1 w-full max-w-4xl mx-auto gap-5">

                {/* ── Header ── */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href={route('schedule.index')}
                                className="text-gray-400 hover:text-white transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </Link>
                            <h1 className="text-xl font-bold text-white tracking-tight">New Booking</h1>
                        </div>
                        <p className="text-xs text-gray-400 pl-6">Schedule a padel court for your players</p>
                    </div>

                    {/* Step indicator */}
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                                    i + 1 < step
                                        ? 'bg-lime-400 border-lime-400 text-black'
                                        : i + 1 === step
                                            ? 'bg-lime-400/20 border-lime-400/60 text-lime-400'
                                            : 'bg-white/5 border-white/15 text-gray-500'
                                }`}>
                                    {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                {i < totalSteps - 1 && (
                                    <div className={`w-8 h-px ${i + 1 < step ? 'bg-lime-400/60' : 'bg-white/15'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="text-gray-300 text-sm">Team (optional)<select className="ml-3 bg-slate-800 rounded-lg" value={data.team_id} onChange={e=>setData('team_id',e.target.value)}><option value="">No team</option>{teams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
                    {Object.values(errors).map((e,i) => <p key={i} className="text-red-300">{e}</p>)}

                    {/* ══ STEP 1 — Court + Date + Time ══ */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* Court selection */}
                            <GlassCard>
                                <div className="p-5">
                                    <SectionHead icon={MapPin} title="Select Court" subtitle="Choose your padel court" />
                                    <div className="space-y-2">
                                        {courts.map(court => (
                                            <CourtCard
                                                key={court.id}
                                                court={court}
                                                selected={Number(data.court_id) === court.id}
                                                onClick={() => setData('court_id', court.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Date + Time + Duration */}
                            <div className="flex flex-col gap-4">
                                {/* Date */}
                                <GlassCard>
                                    <div className="p-5">
                                        <SectionHead icon={CalendarDays} title="Date" subtitle="Pick a booking date" />
                                        <input
                                            type="date"
                                            value={data.date}
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={e => setData('date', e.target.value)}
                                            className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </GlassCard>

                                {/* Time slot */}
                                <GlassCard>
                                    <div className="p-5">
                                        <SectionHead icon={Clock} title="Start Time" subtitle="Select an available slot" />
                                        <div className="grid grid-cols-4 gap-2">
                                            {time_slots.map(t => (
                                                <TimeSlot
                                                    key={t}
                                                    time={t}
                                                    selected={data.start_time === t}
                                                    onClick={() => setData('start_time', t)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>

                                {/* Duration */}
                                <GlassCard>
                                    <div className="p-5">
                                        <SectionHead icon={Clock} title="Duration" subtitle="How long?" />
                                        <div className="flex gap-2 flex-wrap">
                                            {durations.map(d => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    onClick={() => setData('duration', d)}
                                                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                                        data.duration === d
                                                            ? 'bg-lime-400 text-black border-lime-400'
                                                            : 'bg-white/5 text-gray-300 border-white/12 hover:border-lime-400/30'
                                                    }`}
                                                >
                                                    {d}h
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* ══ STEP 2 — Players + Client ══ */}
                    {step === 2 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* Player count */}
                            <GlassCard>
                                <div className="p-5">
                                    <SectionHead icon={Users} title="Players" subtitle="Number of players (2–4)" />
                                    <div className="flex items-center justify-center gap-6 py-4">
                                        <button type="button"
                                            onClick={() => setData('players', Math.max(2, data.players - 1))}
                                            className="w-12 h-12 rounded-2xl bg-white/8 border border-white/15 text-white text-2xl font-bold hover:bg-white/15 transition-all flex items-center justify-center"
                                        >−</button>
                                        <div className="text-center">
                                            <span className="text-5xl font-bold text-lime-400 drop-shadow-[0_0_14px_rgba(163,230,53,0.5)]">
                                                {data.players}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">players</p>
                                        </div>
                                        <button type="button"
                                            onClick={() => setData('players', Math.min(4, data.players + 1))}
                                            className="w-12 h-12 rounded-2xl bg-white/8 border border-white/15 text-white text-2xl font-bold hover:bg-white/15 transition-all flex items-center justify-center"
                                        >+</button>
                                    </div>

                                    {/* Player icons */}
                                    <div className="flex justify-center gap-3 mt-2">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                                                i < data.players
                                                    ? 'border-lime-400 bg-lime-400/20'
                                                    : 'border-white/15 bg-white/5'
                                            }`}>
                                                <Users className={`w-4 h-4 ${i < data.players ? 'text-lime-400' : 'text-gray-600'}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Client */}
                            <div className="flex flex-col gap-4">
                                <GlassCard>
                                    <div className="p-5">
                                        <SectionHead icon={Users} title="Client" subtitle="Select existing or enter new" />

                                        {/* Existing client */}
                                        <select
                                            value={data.client_id}
                                            onChange={e => { setData('client_id', e.target.value); setData('client_name', ''); }}
                                            className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 mb-3 [color-scheme:dark]"
                                        >
                                            <option value="">— Select existing client —</option>
                                            {clients.map(c => (
                                                <option key={c.id} value={c.id} className="bg-gray-900">{c.name}</option>
                                            ))}
                                        </select>

                                        <div className="flex items-center gap-2 my-2">
                                            <div className="flex-1 h-px bg-white/10" />
                                            <span className="text-[10px] text-gray-500 font-medium">or</span>
                                            <div className="flex-1 h-px bg-white/10" />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="New client name..."
                                            value={data.client_name}
                                            onChange={e => { setData('client_name', e.target.value); setData('client_id', ''); }}
                                            className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/50"
                                        />
                                    </div>
                                </GlassCard>

                                {/* Notes */}
                                <GlassCard>
                                    <div className="p-5">
                                        <SectionHead icon={CalendarDays} title="Notes" subtitle="Optional booking notes" />
                                        <textarea
                                            rows={3}
                                            placeholder="e.g. bring extra balls, birthday game..."
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            className="w-full bg-white/5 border border-white/12 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-lime-400/50 resize-none"
                                        />
                                    </div>
                                </GlassCard>
                            </div>
                        </div>
                    )}

                    {/* ══ STEP 3 — Payment + Summary ══ */}
                    {step === 3 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* Payment */}
                            <GlassCard>
                                <div className="p-5">
                                    <SectionHead icon={CreditCard} title="Payment Method" subtitle="How will this be paid?" />
                                    <div className="space-y-2">
                                        {[
                                            { value:'cash',   label:'Cash',         sub:'Pay at counter' },
                                            { value:'card',   label:'Card / Online', sub:'Debit or credit card' },
                                            { value:'wallet', label:'Wallet',        sub:'Pre-paid balance' },
                                        ].map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setData('payment_type', opt.value)}
                                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${
                                                    data.payment_type === opt.value
                                                        ? 'border-lime-400/60 bg-lime-400/10'
                                                        : 'border-white/10 bg-white/5 hover:border-white/20'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${data.payment_type === opt.value ? 'border-lime-400 bg-lime-400' : 'border-gray-500'}`} />
                                                <div className="text-left">
                                                    <p className={`text-sm font-semibold ${data.payment_type === opt.value ? 'text-lime-400' : 'text-white'}`}>{opt.label}</p>
                                                    <p className="text-[10px] text-gray-400">{opt.sub}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Summary */}
                            <GlassCard>
                                <div className="p-5">
                                    <SectionHead icon={Zap} title="Booking Summary" subtitle="Review before confirming" />
                                    <div className="space-y-3">
                                        {[
                                            { label:'Court',    value: selectedCourt?.name ?? '—' },
                                            { label:'Type',     value: selectedCourt?.type ?? '—' },
                                            { label:'Date',     value: data.date || '—' },
                                            { label:'Time',     value: data.start_time || '—' },
                                            { label:'Duration', value: `${data.duration}h` },
                                            { label:'Players',  value: data.players },
                                            { label:'Client',   value: clients.find(c=>c.id===Number(data.client_id))?.name || data.client_name || '—' },
                                            { label:'Payment',  value: data.payment_type },
                                        ].map(row => (
                                            <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-white/6 last:border-0">
                                                <span className="text-xs text-gray-400">{row.label}</span>
                                                <span className="text-xs font-semibold text-white capitalize">{row.value}</span>
                                            </div>
                                        ))}

                                        {/* Total */}
                                        <div className="flex justify-between items-center pt-3 border-t border-white/15 mt-1">
                                            <span className="text-sm font-bold text-white">Total</span>
                                            <span className="text-xl font-bold text-lime-400 drop-shadow-[0_0_10px_rgba(163,230,53,0.4)]">
                                                PKR {(totalPrice ).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}

                    {/* ── Step navigation ── */}
                    <div className="flex items-center justify-between mt-2">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep(s => s - 1)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/20 text-gray-300 text-sm font-semibold hover:border-white/40 hover:text-white transition-all">
                                <ChevronLeft className="w-4 h-4" /> Back
                            </button>
                        ) : (
                            <Link href={route('schedule.index')}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-white/20 text-gray-300 text-sm font-semibold hover:border-white/40 hover:text-white transition-all">
                                <ChevronLeft className="w-4 h-4" /> Cancel
                            </Link>
                        )}

                        {step < totalSteps ? (
                            <button type="button" disabled={!canNext}
                                onClick={() => setStep(s => s + 1)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-extrabold transition-all ${
                                    canNext
                                        ? 'bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_18px_rgba(163,230,53,0.35)]'
                                        : 'bg-white/8 text-gray-600 cursor-not-allowed'
                                }`}>
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button type="submit" disabled={processing}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-lime-400 text-black text-sm font-extrabold hover:bg-lime-300 shadow-[0_0_18px_rgba(163,230,53,0.35)] transition-all disabled:opacity-60">
                                <Check className="w-4 h-4" /> Confirm Booking
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
