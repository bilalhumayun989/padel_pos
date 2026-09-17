import { PADEL_BACKGROUND } from '@/lib/images';
import { Link } from '@inertiajs/react';
import { Trophy } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div
            className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 text-gray-100 sm:px-6 lg:px-8"
            style={{
                backgroundImage: `url("${PADEL_BACKGROUND}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <div className="absolute inset-0 bg-slate-950/70" />
            <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-lime-400/15 blur-[120px]" />
            <div className="pointer-events-none absolute -bottom-28 -right-24 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[130px]" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.9)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.9)_1px,transparent_1px)] [background-size:48px_48px]" />

            <main className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-[#121826]/60 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
                <section className="relative hidden min-h-[650px] overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#07100a]/95 via-[#0b0f17]/75 to-[#0b0f17]/90" />
                    <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full border border-lime-300/20" />
                    <div className="absolute bottom-16 left-20 h-56 w-56 rounded-full border border-white/10" />
                    <Link href="/" className="relative flex items-center gap-3 self-start">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-lime-300/30 bg-lime-400/15 text-lime-400 shadow-glow-lime"><Trophy className="h-5 w-5" /></span>
                        <span><span className="block text-sm font-extrabold tracking-[0.18em] text-white">SKYLINE</span><span className="block text-[10px] font-semibold tracking-[0.24em] text-lime-400">PADEL POS</span></span>
                    </Link>
                    <div className="relative my-auto max-w-sm">
                        <span className="mb-5 inline-flex rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-lime-400">Court management, simplified</span>
                        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">Keep every match moving.</h1>
                        <p className="mt-4 text-sm leading-6 text-gray-400">A calm, focused home for bookings, players, payments, and everything that keeps your club in play.</p>
                    </div>
                    <div className="relative flex items-center gap-3 text-xs text-gray-400"><span className="h-2 w-2 rounded-full bg-lime-400 shadow-glow-lime" /><span>Your club, always in motion.</span></div>
                </section>
                <section className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
                    <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-300/30 bg-lime-400/15 text-lime-400"><Trophy className="h-5 w-5" /></span><span className="text-sm font-extrabold tracking-[0.18em] text-white">SKYLINE <span className="text-lime-400">PADEL</span></span></Link>
                    {children}
                </section>
            </main>
        </div>
    );
}
