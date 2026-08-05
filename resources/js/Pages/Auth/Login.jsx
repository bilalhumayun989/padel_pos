import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });
    const submit = (event) => { event.preventDefault(); post(route('login'), { onFinish: () => reset('password') }); };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="max-w-md">
                <div className="mb-8"><span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-lime-400"><ShieldCheck className="h-4 w-4" /> Secure access</span><h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h2><p className="mt-2 text-sm leading-6 text-gray-400">Sign in to manage your padel club.</p></div>
                {status && <div className="mb-5 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-300">{status}</div>}
                <form onSubmit={submit} className="space-y-5">
                    <div><label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-300">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="email" type="email" name="email" value={data.email} className="block w-full rounded-xl border border-white/10 bg-[#0B0F17]/70 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/15" placeholder="you@skylinepadel.com" autoComplete="username" autoFocus onChange={(event) => setData('email', event.target.value)} /></div>{errors.email && <p className="mt-2 text-xs font-medium text-red-400">{errors.email}</p>}</div>
                    <div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-300">Password</label>{canResetPassword && <Link href={route('password.request')} className="text-xs font-semibold text-lime-400 transition hover:text-lime-300">Forgot password?</Link>}</div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input id="password" type={showPassword ? 'text' : 'password'} name="password" value={data.password} className="block w-full rounded-xl border border-white/10 bg-[#0B0F17]/70 py-3.5 pl-11 pr-12 text-sm text-white placeholder:text-gray-600 focus:border-lime-400/60 focus:ring-2 focus:ring-lime-400/15" placeholder="Enter your password" autoComplete="current-password" onChange={(event) => setData('password', event.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 transition hover:bg-white/5 hover:text-lime-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>{errors.password && <p className="mt-2 text-xs font-medium text-red-400">{errors.password}</p>}</div>
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-400"><input className="h-4 w-4 rounded border-white/20 bg-[#0B0F17] text-lime-400 focus:ring-lime-400/30" name="remember" type="checkbox" checked={data.remember} onChange={(event) => setData('remember', event.target.checked)} />Remember this device</label>
                    <button type="submit" disabled={processing} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3.5 text-sm font-extrabold text-[#11170a] shadow-glow-lime transition hover:bg-lime-300 hover:shadow-[0_0_28px_rgba(163,230,53,0.45)] disabled:cursor-not-allowed disabled:opacity-60">{processing ? 'Signing you in...' : 'Sign in'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></button>
                </form>
                <p className="mt-7 text-center text-xs text-gray-500">Protected club access · Skyline Padel POS</p>
            </div>
        </GuestLayout>
    );
}
