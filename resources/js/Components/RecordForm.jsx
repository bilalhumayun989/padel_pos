import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function RecordForm({ label, endpoint, fields, method = 'post' }) {
    const [open, setOpen] = useState(false);
    const form = useForm(Object.fromEntries(fields.map(f => [f.name, f.value ?? ''])));
    return <>
        <button type="button" onClick={() => setOpen(true)} className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold text-sm">{label}</button>
        {open && <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6">
            <form className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-auto space-y-4" onSubmit={e => {
                e.preventDefault(); form[method](endpoint, { onSuccess: () => { form.reset(); setOpen(false); } });
            }}>
                <h2 className="text-lg text-white font-bold">{label}</h2>
                {fields.map(f => <label key={f.name} className="block text-sm text-gray-300">{f.label}
                    {f.options ? <select value={form.data[f.name]} onChange={e => form.setData(f.name, e.target.value)} className="block w-full mt-1 bg-slate-800 rounded-lg" required={f.required}>
                        <option value="">Select...</option>
                        {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select> : <input type={f.type ?? 'text'} step={f.type === 'number' ? 'any' : undefined} required={f.required} value={form.data[f.name]} onChange={e => form.setData(f.name, e.target.value)} className="block w-full mt-1 bg-slate-800 rounded-lg" />}
                    {form.errors[f.name] && <span className="text-red-300">{form.errors[f.name]}</span>}
                </label>)}
                <div className="flex gap-3"><button disabled={form.processing} className="px-4 py-2 bg-lime-400 text-black rounded-lg">Save</button><button type="button" onClick={() => setOpen(false)} className="text-gray-300">Cancel</button></div>
            </form>
        </div>}
    </>;
}
