import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SupportIndex({ tickets = [], facility }) {
    const form = useForm({ subject: '', category: 'General', message: '' });
    return <AuthenticatedLayout facility={facility}>
        <Head title="Support Tickets" />
        <div className="glass-panel p-8 rounded-3xl max-w-3xl w-full">
            <h1 className="text-2xl font-bold text-white mb-3">Support Tickets</h1>
            <p className="text-gray-400 mb-6">Record and track issues for your club. Tickets are stored in this app.</p>
            <form onSubmit={e=>{e.preventDefault();form.post(route('support.store'),{onSuccess:()=>form.reset()});}} className="space-y-4">
                {['subject','category'].map(field=><label key={field} className="block text-gray-300 capitalize">{field}<input required value={form.data[field]} onChange={e=>form.setData(field,e.target.value)} className="block w-full bg-white/5 border-white/20 rounded-xl mt-2" /></label>)}
                <label className="block text-gray-300">Message<textarea required value={form.data.message} onChange={e=>form.setData('message',e.target.value)} rows={5} className="block w-full bg-white/5 border-white/20 rounded-xl mt-2" /></label>
                <button disabled={form.processing} className="bg-lime-400 text-black px-5 py-3 rounded-xl font-bold">Save Ticket</button>
            </form>
            <h2 className="text-lg text-white font-bold mt-8 mb-3">Your Tickets</h2>
            {tickets.length===0 && <p className="text-gray-400">No tickets yet.</p>}
            {tickets.map(ticket=><article key={ticket.id} className="border-t border-white/10 py-4"><h3 className="text-white">#{ticket.id} {ticket.subject}</h3><p className="text-lime-400 text-sm">{ticket.status}</p><p className="text-gray-400 text-sm whitespace-pre-wrap">{ticket.message}</p></article>)}
        </div>
    </AuthenticatedLayout>;
}
