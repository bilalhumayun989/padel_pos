import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Users,
    Trophy,
    TrendingUp,
    ChevronRight,
    ShieldCheck,
    PauseCircle,
    MoreHorizontal
} from 'lucide-react';

export default function PlayersIndex({ metrics, players, facility }) {
    const data = {
        active_players: metrics?.active_players ?? 43,
        players_trend: metrics?.players_trend ?? 6,
        matches_played: metrics?.matches_played ?? 36,
        matches_trend: metrics?.matches_trend ?? 9,
    };

    const playerList = players || [];

    const getTierColor = (tier) => {
        const lower = tier.toLowerCase();
        if (lower.includes('platinum')) return 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20';
        if (lower.includes('gold')) return 'bg-olive-500/20 text-yellow-500 border border-yellow-500/20';
        if (lower.includes('silver')) return 'bg-gray-400/20 text-gray-300 border border-gray-400/20';
        return 'bg-gray-500/20 text-gray-300 border border-gray-500/20';
    };

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS - Players" />

            <div className="flex flex-col flex-1 min-h-[calc(100vh-6.5rem)] py-2 max-w-[1600px] mx-auto w-full">
                
                {/* Top Stat Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Active Players Card */}
                    <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                        <div className="glass-light-streak opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="glow-spot-lime top-4 left-6 opacity-40" />

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-gray-400" />
                                <h3 className="text-[15px] font-semibold text-gray-100 tracking-wide">Active Players</h3>
                            </div>
                            <Users className="w-6 h-6 text-lime-400 opacity-80" />
                        </div>

                        <div className="mt-4 relative z-10 flex flex-col gap-2">
                            <span className="text-[2.75rem] leading-none font-bold text-lime-400 drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]">
                                {data.active_players}
                            </span>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <span className="flex items-center text-emerald-400 font-semibold gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    {data.players_trend}%
                                </span>
                                <span>vs Yesterday</span>
                            </div>
                        </div>
                    </div>

                    {/* Matches Played Card */}
                    <div className="glass-panel p-6 rounded-[2rem] flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
                        <div className="glass-light-streak opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="glow-spot-lime top-4 left-6 opacity-40" />

                        <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-5 h-5 text-gray-400" />
                                <h3 className="text-[15px] font-semibold text-gray-100 tracking-wide">Matches Played</h3>
                            </div>
                            <Trophy className="w-6 h-6 text-lime-400 opacity-80" />
                        </div>

                        <div className="mt-4 relative z-10 flex flex-col gap-2">
                            <span className="text-[2.75rem] leading-none font-bold text-lime-400 drop-shadow-[0_0_12px_rgba(163,230,53,0.4)]">
                                {data.matches_played}
                            </span>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                <span className="flex items-center text-emerald-400 font-semibold gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    {data.matches_trend}%
                                </span>
                                <span>vs Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Player Ranking Table Panel */}
                <div className="glass-panel flex-1 rounded-[2rem] p-6 relative overflow-hidden flex flex-col">
                    <div className="glass-light-streak opacity-30" />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 relative z-10">
                        <h2 className="text-xl font-bold text-white tracking-wide">Player Ranking</h2>
                        <button className="bg-gray-100/90 hover:bg-white text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg">
                            View All <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Table Container */}
                    <div className="relative z-10 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                                    <th className="pb-3 px-2 font-semibold w-[25%]">Player</th>
                                    <th className="pb-3 px-2 font-semibold">Tier</th>
                                    <th className="pb-3 px-2 font-semibold">Rating</th>
                                    <th className="pb-3 px-2 font-semibold">W-L</th>
                                    <th className="pb-3 px-2 font-semibold">Streak</th>
                                    <th className="pb-3 px-2 font-semibold text-right"></th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {playerList.map((player, idx) => (
                                    <tr 
                                        key={idx} 
                                        className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                {player.status.toLowerCase() === 'active' ? (
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                                                        <PauseCircle className="w-4 h-4 text-red-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-gray-100 text-[15px]">{player.name}</div>
                                                    <div className="text-[10px] text-gray-400 mt-0.5 font-medium tracking-wide">{player.status}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="py-4 px-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierColor(player.tier)}`}>
                                                {player.tier}
                                            </span>
                                        </td>
                                        
                                        <td className="py-4 px-2 text-gray-300 font-medium">
                                            {player.rating}
                                        </td>
                                        
                                        <td className="py-4 px-2 text-gray-300 font-medium">
                                            {player.wl}
                                        </td>
                                        
                                        <td className="py-4 px-2">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 uppercase">
                                                {player.streak}
                                            </span>
                                        </td>
                                        
                                        <td className="py-4 px-2 text-right">
                                            <button className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
