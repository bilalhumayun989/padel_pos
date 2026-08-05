import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Building2,
    User,
    Users,
    Bell,
    Shield,
    Globe,
    Upload
} from 'lucide-react';

export default function SettingsIndex({ facility }) {
    const [activeTab, setActiveTab] = useState('club_profile');

    const tabs = [
        { id: 'club_profile', label: 'Club Profile', icon: Building2 },
        { id: 'account', label: 'Account', icon: User },
        { id: 'team_roles', label: 'Team & Roles', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'localization', label: 'Localization', icon: Globe },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'club_profile':
                return (
                    <div className="flex flex-col gap-6">
                        {/* Club Profile Section */}
                        <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
                            <div className="glass-light-streak opacity-30" />
                            
                            <div className="relative z-10 mb-8">
                                <h2 className="text-xl font-bold text-white tracking-wide">Club Profile</h2>
                                <p className="text-sm text-gray-400 mt-1">Public Information Shown to members and on reciepets.</p>
                            </div>

                            <div className="relative z-10 flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 rounded-2xl bg-lime-400/20 flex items-center justify-center border border-lime-400/30">
                                    <span className="text-2xl font-bold text-lime-400">A</span>
                                </div>
                                <div>
                                    <button className="glass-panel px-4 py-2 rounded-xl text-xs font-semibold text-gray-200 hover:text-lime-400 flex items-center gap-2 transition-colors mb-2">
                                        <Upload className="w-4 h-4" />
                                        Upload Logo
                                    </button>
                                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">PNG OR SVG UPTO 2MB.</p>
                                </div>
                            </div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Club Name</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Contact Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Website</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Address</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Courts</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="relative z-10 space-y-2 mb-2">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">About the Club</label>
                                <textarea 
                                    rows="4"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all resize-none placeholder-gray-500"
                                ></textarea>
                            </div>
                        </div>

                        {/* Opening Hours Section */}
                        <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
                            <div className="glass-light-streak opacity-30" />
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold text-white tracking-wide">Opening Hours</h2>
                                <p className="text-sm text-gray-400 mt-1">Configure your facility's operating hours.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'account':
                return (
                    <div className="glass-panel p-8 rounded-[2rem] min-h-[400px]">
                        <h2 className="text-xl font-bold text-white tracking-wide mb-2">Account Settings</h2>
                        <p className="text-sm text-gray-400">Manage your personal account details.</p>
                    </div>
                );
            case 'team_roles':
                return (
                    <div className="glass-panel p-8 rounded-[2rem] min-h-[400px]">
                        <h2 className="text-xl font-bold text-white tracking-wide mb-2">Team & Roles</h2>
                        <p className="text-sm text-gray-400">Manage your staff and their permissions.</p>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="glass-panel p-8 rounded-[2rem] min-h-[400px]">
                        <h2 className="text-xl font-bold text-white tracking-wide mb-2">Notifications</h2>
                        <p className="text-sm text-gray-400">Configure your alert preferences.</p>
                    </div>
                );
            case 'security':
                return (
                    <div className="glass-panel p-8 rounded-[2rem] min-h-[400px]">
                        <h2 className="text-xl font-bold text-white tracking-wide mb-2">Security</h2>
                        <p className="text-sm text-gray-400">Update passwords and secure your account.</p>
                    </div>
                );
            case 'localization':
                return (
                    <div className="glass-panel p-8 rounded-[2rem] min-h-[400px]">
                        <h2 className="text-xl font-bold text-white tracking-wide mb-2">Localization</h2>
                        <p className="text-sm text-gray-400">Set region, currency, and language preferences.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS - Settings" />

            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-[calc(100vh-6.5rem)] py-2 max-w-[1600px] mx-auto w-full">
                
                {/* Left Navigation Sidebar for Settings */}
                <div className="w-full md:w-72 flex-shrink-0">
                    <div className="glass-panel rounded-[2rem] p-4 flex flex-col gap-2 relative overflow-hidden">
                        <div className="glass-light-streak opacity-20" />
                        
                        <div className="relative z-10 flex flex-col gap-1.5">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-[14px] tracking-wide ${
                                            isActive
                                                ? 'bg-lime-400/10 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.15)] border border-lime-400/20'
                                                : 'text-gray-300 hover:text-white hover:bg-white/10 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-lime-400' : 'text-gray-400'}`} />
                                            {tab.label}
                                        </div>
                                        {isActive && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 w-full">
                    {renderTabContent()}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
