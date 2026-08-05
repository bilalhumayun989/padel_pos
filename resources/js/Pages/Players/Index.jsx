import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Users, Trophy, TrendingUp, Plus, SlidersHorizontal, ChevronDown, ExternalLink } from 'lucide-react';

/* ─── Reusable blurred-glass card (same as Dashboard) ─────────── */
function GlassCard({ className = '', children, tint = 'rgba(0,0,0,0)' }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl border border-white/[0.14] shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${className}`}>
            <img
                src="/images/padel_hero.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                style={{ filter: 'blur(22px) brightness(0.55) saturate(1.3)', transform: 'scale(1.1)' }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: tint }} />
            <div className="absolute inset-x-0 top-0 h-px bg-white/20 pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">{children}</div>
        </div>
    );
}

/* ─── Skill-level display ─────────────────────────────────────── */
function SkillLevel({ value, max }) {
    return (
        <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold text-white leading-none">{value.toFixed(1)}</span>
            <span className="text-xs text-gray-400 font-medium">/{max.toFixed(1)}</span>
        </div>
    );
}

/* ─── Single Player Card ──────────────────────────────────────── */
function PlayerCard({ player }) {
    const isPro = player.tier.toLowerCase().includes('pro');

    return (
        <GlassCard className="flex flex-col">
            <div className="p-4 flex flex-col gap-3 h-full">
                {/* Avatar + name + badge */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <img
                            src={player.avatar}
                            alt={player.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/15"
                        />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white leading-tight truncate">{player.name}</p>
                        <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                                isPro
                                    ? 'bg-lime-400/20 text-lime-400 border border-lime-400/30'
                                    : 'bg-white/10 text-gray-300 border border-white/15'
                            }`}
                        >
                            {player.tier}
                        </span>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10" />

                {/* Stats row */}
                <div className="flex items-start gap-6">
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">Skill Level</p>
                        <SkillLevel value={player.skill} max={player.skill_max} />
                    </div>
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-gray-500 mb-1">Matches</p>
                        <p className="text-lg font-bold text-white leading-none">{player.matches}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-[10px] text-gray-500 flex items-center gap-1">
                        <span className="text-gray-600">⏱</span> Last visit: <span className="text-gray-400 font-medium">{player.last_visit}</span>
                    </span>
                    <button className="text-lime-400 text-[11px] font-bold hover:text-lime-300 transition-colors flex items-center gap-0.5">
                        View Profile <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                </div>
            </div>
        </GlassCard>
    );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function PlayersIndex({ metrics, players = [], facility }) {
    const [skillFilter, setSkillFilter] = useState('Any Skill Level');
    const [statusFilter, setStatusFilter] = useState('Any Skill Level');

    const data = {
        active_players: metrics?.active_players ?? 43,
        players_trend:  metrics?.players_trend  ?? 6,
        matches_played: metrics?.matches_played ?? 36,
        matches_trend:  metrics?.matches_trend  ?? 9,
    };

    /* Demo fallback players */
    const playerList = players.length > 0 ? players : Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: 'Alex Mercer',
        tier: 'Pro Member',
        avatar: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=80&q=80`,
        skill: 5.5,
        skill_max: 7.0,
        matches: 142,
        last_visit: 'Today',
    }));

    const skillLevels  = ['Any Skill Level', 'Beginner (1-3)', 'Intermediate (4-5)', 'Advanced (6-7)'];
    const statusLevels = ['Any Skill Level', 'Active', 'Inactive', 'Paused'];

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS – Players" />

            <div className="flex flex-col flex-1 w-full gap-5">

                {/* ── Row 1 — Stat Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Active Players */}
                    <GlassCard>
                        <div className="p-6 flex flex-col justify-between min-h-[148px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Users className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-200 tracking-wide">Active Players</h3>
                                </div>
                                <Users className="w-6 h-6 text-lime-400 opacity-70" />
                            </div>
                            <div>
                                <p className="text-5xl font-bold text-lime-400 leading-none drop-shadow-[0_0_14px_rgba(163,230,53,0.5)]">
                                    {data.active_players}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2 text-sm">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">{data.players_trend}%</span>
                                    <span className="text-gray-400">vs Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Matches Played */}
                    <GlassCard>
                        <div className="p-6 flex flex-col justify-between min-h-[148px]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Trophy className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-sm font-semibold text-gray-200 tracking-wide">Matches Played</h3>
                                </div>
                                <Trophy className="w-6 h-6 text-lime-400 opacity-70" />
                            </div>
                            <div>
                                <p className="text-5xl font-bold text-lime-400 leading-none drop-shadow-[0_0_14px_rgba(163,230,53,0.5)]">
                                    {data.matches_played}
                                </p>
                                <div className="flex items-center gap-1.5 mt-2 text-sm">
                                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">{data.matches_trend}%</span>
                                    <span className="text-gray-400">vs Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </div>

                {/* ── Row 2 — Filter bar + Add button ── */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-lime-400/50 bg-lime-400/5 text-lime-400 text-xs font-semibold">
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                            <span className="uppercase tracking-wider">Filters:</span>
                        </div>

                        {/* Skill Level dropdown */}
                        <div className="relative">
                            <select
                                value={skillFilter}
                                onChange={e => setSkillFilter(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-white/15 bg-white/5 text-gray-200 text-xs font-medium cursor-pointer focus:outline-none focus:border-lime-400/40 transition-all"
                            >
                                {skillLevels.map(l => <option key={l} value={l} className="bg-gray-900">{l}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Status dropdown */}
                        <div className="relative">
                            <select
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-white/15 bg-white/5 text-gray-200 text-xs font-medium cursor-pointer focus:outline-none focus:border-lime-400/40 transition-all"
                            >
                                {statusLevels.map(l => <option key={l} value={l} className="bg-gray-900">{l}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Add New Player */}
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 text-black text-xs font-extrabold uppercase tracking-wider hover:bg-lime-300 transition-all shadow-[0_0_20px_rgba(163,230,53,0.35)]">
                        <Plus className="w-4 h-4" /> Add New Player
                    </button>
                </div>

                {/* ── Row 3 — Player Ranking Grid ── */}
                <div>
                    <h2 className="text-lg font-bold text-white mb-4 tracking-wide">Player Ranking</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {playerList.map(player => (
                            <PlayerCard key={player.id} player={player} />
                        ))}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
