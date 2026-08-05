import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    LifeBuoy,
    MessageCircleQuestion,
    MessageSquare,
    BookOpen,
    Send,
    PhoneCall
} from 'lucide-react';

export default function SupportIndex({ facility }) {
    return (
        <AuthenticatedLayout facility={facility}>
            <Head title="Padel POS - Support" />

            <div className="flex flex-col flex-1 min-h-[calc(100vh-6.5rem)] py-2 max-w-[1600px] mx-auto w-full gap-6">
                
                {/* Header Section */}
                <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden flex items-center justify-between">
                    <div className="glass-light-streak opacity-40" />
                    <div className="glow-spot-lime top-1/2 -translate-y-1/2 right-1/4 opacity-30 w-64 h-64 blur-3xl" />
                    
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold text-white tracking-wide flex items-center gap-4">
                            <LifeBuoy className="w-8 h-8 text-lime-400" />
                            How can we help you?
                        </h1>
                        <p className="text-sm text-gray-400 mt-2 max-w-lg leading-relaxed">
                            Need assistance with your Padel POS? Search our knowledge base, submit a ticket, or reach out to our dedicated support team directly.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                    
                    {/* Left Column: Quick Actions & Help Cards */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        
                        {/* Live Chat Card */}
                        <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group cursor-pointer hover:border-lime-400/30 transition-colors">
                            <div className="glass-light-streak opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-lime-400/20 flex items-center justify-center border border-lime-400/30">
                                    <MessageSquare className="w-6 h-6 text-lime-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Live Chat</h3>
                                    <p className="text-sm text-gray-400 mt-1">Chat with our support agents instantly.</p>
                                </div>
                                <span className="text-xs font-bold text-lime-400 mt-2 bg-lime-400/10 px-3 py-1 rounded-full uppercase tracking-wide">Available Now</span>
                            </div>
                        </div>

                        {/* FAQs Card */}
                        <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group cursor-pointer hover:border-white/20 transition-colors">
                            <div className="glass-light-streak opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20">
                                    <MessageCircleQuestion className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">FAQs</h3>
                                    <p className="text-sm text-gray-400 mt-1">Find answers to common questions.</p>
                                </div>
                            </div>
                        </div>

                        {/* Documentation Card */}
                        <div className="glass-panel p-6 rounded-[2rem] relative overflow-hidden group cursor-pointer hover:border-white/20 transition-colors">
                            <div className="glass-light-streak opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20">
                                    <BookOpen className="w-6 h-6 text-gray-300" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Documentation</h3>
                                    <p className="text-sm text-gray-400 mt-1">Read guides and API references.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Support Ticket Form */}
                    <div className="lg:col-span-2 glass-panel p-8 rounded-[2rem] relative overflow-hidden flex flex-col">
                        <div className="glass-light-streak opacity-20" />
                        
                        <div className="relative z-10 mb-8">
                            <h2 className="text-xl font-bold text-white tracking-wide">Submit a Support Ticket</h2>
                            <p className="text-sm text-gray-400 mt-1">Fill out the form below and we'll get back to you as soon as possible.</p>
                        </div>

                        <form className="relative z-10 flex flex-col flex-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subject</label>
                                    <input 
                                        type="text" 
                                        placeholder="Brief description of the issue"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all placeholder-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Category</label>
                                    <select 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all appearance-none"
                                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%239CA3AF\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                                    >
                                        <option value="" className="bg-[#0f1623]">Select a category</option>
                                        <option value="billing" className="bg-[#0f1623]">Billing</option>
                                        <option value="technical" className="bg-[#0f1623]">Technical Issue</option>
                                        <option value="feature" className="bg-[#0f1623]">Feature Request</option>
                                        <option value="other" className="bg-[#0f1623]">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 flex-1 flex flex-col">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Message</label>
                                <textarea 
                                    placeholder="Please provide as much detail as possible..."
                                    className="w-full flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/50 transition-all resize-none placeholder-gray-500 min-h-[150px]"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <PhoneCall className="w-4 h-4" />
                                    <span>Urgent? Call us at <strong>+1 (800) 123-4567</strong></span>
                                </div>
                                <button 
                                    type="button"
                                    className="bg-lime-400 hover:bg-lime-500 text-gray-900 px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(163,230,53,0.3)]"
                                >
                                    <Send className="w-4 h-4" />
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}
