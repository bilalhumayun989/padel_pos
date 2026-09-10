import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ScheduleIndex({ courts = [], bookings = [], today = '', date = '', facility }) {
    const [courtId, setCourtId] = useState('');
    const time = value => `${String(Math.floor(value)).padStart(2,'0')}:${value % 1 ? '30' : '00'}`;
    const changeDate = value => router.get(route('schedule.index'), { date: value });
    const offsetDate = days => { const d = new Date(date+'T12:00:00'); d.setDate(d.getDate()+days); changeDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`); };
    return <AuthenticatedLayout facility={facility}>
        <Head title="Court Schedule" />
        <div className="space-y-5">
            <div className="flex flex-wrap justify-between gap-3 items-center"><div><h1 className="text-2xl font-bold text-white">Court Schedule</h1><p className="text-gray-400">{today}</p></div><Link href={route('bookings.create')} className="bg-lime-400 text-black px-4 py-3 rounded-xl font-bold">New Booking</Link></div>
            <div className="flex flex-wrap gap-3 items-center text-gray-200"><button onClick={()=>offsetDate(-1)}>Previous day</button><input aria-label="Schedule date" type="date" value={date} onChange={e=>changeDate(e.target.value)} className="bg-slate-800 rounded-xl" /><button onClick={()=>offsetDate(1)}>Next day</button><select aria-label="Court filter" value={courtId} onChange={e=>setCourtId(e.target.value)} className="bg-slate-800 rounded-xl"><option value="">All courts</option>{courts.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            {courts.length===0 && <p className="text-gray-400">Add a court to start taking bookings.</p>}
            <div className="grid gap-4 lg:grid-cols-3">{courts.filter(c=>!courtId||c.id===Number(courtId)).map(court=><section key={court.id} className="glass-panel p-5 rounded-2xl space-y-3">
                <h2 className="text-lg text-white font-bold">{court.name}</h2><p className="text-gray-400 text-sm">{court.type} · {court.active?'Open':'Maintenance'}</p>
                {bookings.filter(b=>b.court_id===court.id).length===0 && <p className="text-gray-500">No bookings for this date.</p>}
                {bookings.filter(b=>b.court_id===court.id).sort((a,b)=>a.start-b.start).map(b=><article key={b.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-lime-400 font-bold">{time(b.start)} – {time(b.end)}</p><p className="text-white mt-1">{b.team}</p><p className="text-gray-400 text-sm">{b.players} players · {b.booking_status}</p>
                    {['confirmed','pending'].includes(b.booking_status)&&<div className="flex gap-3 text-xs mt-3"><button className="text-lime-300" onClick={()=>router.patch(route('bookings.update',b.id),{status:'completed'})}>Complete</button><button className="text-red-300" onClick={()=>router.patch(route('bookings.update',b.id),{status:'cancelled'})}>Cancel booking</button></div>}
                </article>)}
            </section>)}</div>
        </div>
    </AuthenticatedLayout>;
}
