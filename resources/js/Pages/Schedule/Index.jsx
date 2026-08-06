import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft, ChevronRight, Plus, Wrench } from 'lucide-react';

/* Avatar stack */
function Avatars() {
    return (
        <div className="flex items-center gap-1">
            <div className="flex -space-x-1.5">
                {['bg-blue-400','bg-purple-400','bg-teal-400'].map((c,i) => (
                    <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-black/40 text-[7px] font-bold text-white flex items-center justify-center`}>
                        {String.fromCharCode(65+i)}
                    </div>
                ))}
            </div>
            <span className="text-[9px] font-bold text-gray-300 ml-1">4/4</span>
        </div>
    );
}

/* Individual court row */
function CourtRow({ court, showTimeLine }) {
    const isMaintenance = court.id === 5;

    return (
        <div
            className="flex items-stretch rounded-2xl overflow-hidden"
            style={{ background:'rgba(14,20,34,0.70)', border:'1px solid rgba(255,255,255,0.09)', minHeight: 80 }}
        >
            {/* Left label */}
            <div className="w-28 flex-shrink-0 flex flex-col justify-center px-4 border-r border-white/8">
                <div className="flex items-center gap-1.5 mb-0.5">
                    {/* Small court icon */}
                    <div className="w-6 h-6 rounded-md bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 16 16">
                            <rect x="1" y="1" width="14" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                            <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1"/>
                            <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1"/>
                        </svg>
                    </div>
                    <span className="text-xs font-bold text-white">{court.name}</span>
                </div>
                <span className="text-[9px] text-gray-500 pl-7">{court.type}</span>
            </div>

            {/* Timeline */}
            <div className="flex-1 relative flex items-stretch">

                {/* Current time vertical line */}
                {showTimeLine && (
                    <div className="absolute inset-y-0 z-20 pointer-events-none" style={{ left: '41.5%' }}>
                        <div className="w-px h-full bg-lime-400/80" />
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-lime-400 text-black text-[7px] font-extrabold px-1 rounded">2pm</div>
                    </div>
                )}

                {isMaintenance ? (
                    /* Maintenance row */
                    <div className="flex-1 flex items-center px-6 gap-3">
                        <Wrench className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-yellow-400">Maintenance</p>
                            <p className="text-[10px] text-yellow-600">All day</p>
                        </div>
                    </div>
                ) : (
                    /* Normal row — 3 blocks */
                    <div className="flex-1 flex">

                        {/* Block 1 — Booked (green) ~40% */}
                        <div
                            className="flex flex-col justify-center px-4 py-2"
                            style={{ width: '40%', background:'rgba(22,163,74,0.20)', borderRight:'1px solid rgba(34,197,94,0.20)' }}
                        >
                            <p className="text-xs font-extrabold text-emerald-400 leading-tight">Team Alpha</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">12 Players</p>
                            <Avatars />
                        </div>

                        {/* Block 2 — Reserved (dark) ~30% */}
                        <div
                            className="flex flex-col justify-center px-4 py-2"
                            style={{ width: '30%', background:'rgba(255,255,255,0.04)', borderRight:'1px solid rgba(255,255,255,0.08)' }}
                        >
                            <p className="text-xs font-semibold text-gray-200 leading-tight">Team Smashers</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">12 Players</p>
                            <Avatars />
                        </div>

                        {/* Block 3 — Book Now (dashed) ~30% */}
                        <div
                            className="flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-lime-400/5 transition-all"
                            style={{ width: '30%', border:'1.5px dashed rgba(163,230,53,0.35)', margin:'6px', borderRadius:12 }}
                        >
                            <span className="text-[10px] font-bold text-lime-400">Book Now</span>
                            <div className="w-5 h-5 rounded-lg border border-lime-400/50 bg-lime-400/10 flex items-center justify-center">
                                <Plus className="w-3 h-3 text-lime-400" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ScheduleIndex({ courts = [], bookings = [], today = 'Tuesday, Oct 24', facility }) {
    const [view, setView]         = useState('Daily');
    const [activeCourt, setActiveCourt] = useState('All Courts');
    const [courtChecks, setCourtChecks] = useState(
        Object.fromEntries((courts.length ? courts : defaultCourts).map(c => [c.id, c.active]))
    );

    const allCourts  = courts.length ? courts : defaultCourts;
    const courtTabs  = ['All Courts','1 Courts','2 Courts','3 Courts','4Courts','5 Courts','1 Courts','2 Courts','3 Courts','4Courts'];
    const visible    = allCourts.filter(c => courtChecks[c.id]);

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Schedule" />

            <div className="flex flex-col flex-1 w-full gap-4 min-h-0">

                {/* ── Top bar ── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Court Schedule</h1>
                        <p className="text-xs text-gray-400 mt-0.5">Manage bookings for {today}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Date nav */}
                        <div className="flex items-center glass-panel rounded-2xl px-3 py-2 gap-1">
                            <ChevronLeft className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                            <span className="text-xs font-semibold text-white px-2">Today</span>
                            <ChevronRight className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
                        </div>
                        {/* Daily/Weekly */}
                        <div className="flex glass-panel rounded-2xl overflow-hidden">
                            {['Daily','Weekly'].map(v => (
                                <button key={v} onClick={() => setView(v)}
                                    className={`px-4 py-2 text-xs font-semibold transition-all ${view===v ? 'bg-lime-400/20 text-lime-400' : 'text-gray-400 hover:text-white'}`}>
                                    {v}
                                </button>
                            ))}
                        </div>
                        {/* New Booking */}
                        <Link
                            href={route('bookings.create')}
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-lime-400 text-black text-xs font-extrabold hover:bg-lime-300 transition-all shadow-[0_0_18px_rgba(163,230,53,0.35)]"
                        >
                            <Plus className="w-4 h-4" /> New Booking
                        </Link>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex flex-1 gap-4 min-h-0">

                    {/* Left sidebar */}
                    <div className="w-52 flex-shrink-0 rounded-2xl p-4 flex flex-col gap-5"
                        style={{ background:'rgba(12,18,30,0.65)', border:'1px solid rgba(255,255,255,0.10)' }}>

                        {/* Jump to date */}
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">Jump to Date</p>
                            <input type="text" placeholder="mm/dd/yyyy"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-lime-400/40" />
                        </div>

                        {/* Courts */}
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Courts</p>
                            <div className="space-y-2">
                                {allCourts.map(court => (
                                    <label key={court.id} className="flex items-center gap-2 cursor-pointer group" onClick={() => setCourtChecks(p=>({...p,[court.id]:!p[court.id]}))}>
                                        <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-all ${courtChecks[court.id] ? 'bg-lime-400 border-lime-400' : 'bg-transparent border-gray-600'}`}>
                                            {courtChecks[court.id] && (
                                                <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 10 10">
                                                    <path d="M1.5 5l2.5 2.5L8.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-300">{court.name} ({court.type})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Legend */}
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2">Legend</p>
                            <div className="space-y-2">
                                {[
                                    {color:'bg-emerald-400', label:'Booked (Paid)'},
                                    {color:'bg-gray-400',    label:'Reserved (Unpaid)'},
                                    {color:'bg-gray-600',    label:'Available'},
                                ].map(({color,label}) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                                        <span className="text-[10px] text-gray-400">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main panel */}
                    <div className="flex-1 rounded-2xl flex flex-col min-w-0 overflow-hidden"
                        style={{ background:'rgba(12,18,30,0.65)', border:'1px solid rgba(255,255,255,0.10)' }}>

                        {/* Panel header */}
                        <div className="px-5 pt-4 pb-3 border-b border-white/8">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-base font-bold text-white">Court Schedule</h2>
                                <button className="flex items-center gap-1 text-xs font-semibold text-white border border-white/25 rounded-full px-3 py-1.5 hover:border-white/50 transition-all">
                                    View All Bookings <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {/* Court tabs */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                {courtTabs.map((tab, i) => (
                                    <button key={i} onClick={() => setActiveCourt(tab)}
                                        className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${activeCourt===tab ? 'bg-lime-400 text-black border-lime-400' : 'text-gray-300 border-white/20 hover:border-white/40 hover:text-white'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hour ruler */}
                        <div className="flex px-5 pt-3 pb-1 border-b border-white/5">
                            <div className="w-28 flex-shrink-0" />
                            <div className="flex-1 flex justify-between">
                                {['8 am','10 am','12 pm','2 pm','4 pm','6 pm','8 pm'].map(h => (
                                    <span key={h} className="text-[10px] text-gray-500 font-medium">{h}</span>
                                ))}
                            </div>
                        </div>

                        {/* Court rows */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                            {visible.map((court, idx) => (
                                <CourtRow key={court.id} court={court} showTimeLine={idx === 0} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* Default courts for when controller doesn't pass data */
const defaultCourts = [
    { id:1, name:'Court 1', type:'Indoor',    active:true  },
    { id:2, name:'Court 2', type:'Indoor',    active:true  },
    { id:3, name:'Court 3', type:'Panoramic', active:true  },
    { id:4, name:'Court 4', type:'Outdoor',   active:false },
    { id:5, name:'Court 5', type:'Indoor',    active:true  },
];
