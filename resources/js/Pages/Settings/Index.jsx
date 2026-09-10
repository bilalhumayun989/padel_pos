import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function SettingsIndex({ settings, facility }) {
    const form = useForm({ name: settings?.name ?? facility?.name ?? '', email: settings?.email ?? '', phone: settings?.phone ?? '', website: settings?.website ?? '', address: settings?.address ?? '', about: settings?.about ?? '' });
    return <AuthenticatedLayout facility={facility}>
        <Head title="Club Settings" />
        <div className="glass-panel p-8 rounded-3xl max-w-3xl w-full">
            <h1 className="text-2xl font-bold text-white mb-6">Club Settings</h1>
            <form onSubmit={e=>{e.preventDefault();form.put(route('settings.update'));}} className="space-y-5">
                {['name','email','phone','website','address','about'].map(field=><label key={field} className="block text-sm text-gray-300 capitalize">{field}
                    <input type={field==='email'?'email':field==='website'?'url':'text'} value={form.data[field]} onChange={e=>form.setData(field,e.target.value)} className="block w-full mt-2 bg-white/5 border-white/20 rounded-xl text-white" required={field==='name'} />
                    {form.errors[field] && <span className="text-red-300">{form.errors[field]}</span>}
                </label>)}
                <button disabled={form.processing} className="bg-lime-400 text-black px-5 py-3 rounded-xl font-bold">Save Settings</button>
            </form>
            <Link href={route('profile.edit')} className="block mt-6 text-lime-400">Manage your account and password</Link>
        </div>
    </AuthenticatedLayout>;
}
