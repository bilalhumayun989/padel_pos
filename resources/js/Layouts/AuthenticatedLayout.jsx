import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Trophy,
    Coffee,
    Package,
    Settings,
    Headphones,
    PanelLeftClose,
    PanelLeftOpen,
    Bell,
    ChevronDown,
    LogOut,
    User as UserIcon,
    Menu,
    X,
    CalendarDays,
    History,
    Truck,
    LayoutList,
    Grid3x3,
    Crown
} from 'lucide-react';

export default function AuthenticatedLayout({ children, facility = { name: 'SKYLINE PADDLE COURT', subtext: 'Main Court' } }) {
    const { auth } = usePage().props;
    const user = auth?.user || { name: 'Admin', email: 'admin@skylinepadel.com' };
    // Persist collapsed state across page navigations
    const [collapsed, setCollapsed] = useState(() => {
        try { return localStorage.getItem('sidebar_collapsed') === '1'; } catch { return false; }
    });
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [logoHovered, setLogoHovered] = useState(false);

    const handleCollapse = () => {
        setCollapsed(true);
        setLogoHovered(false);
        try { localStorage.setItem('sidebar_collapsed', '1'); } catch {}
    };
    const handleExpand = () => {
        setCollapsed(false);
        setLogoHovered(false);
        try { localStorage.setItem('sidebar_collapsed', '0'); } catch {}
    };

    const navItems = [
        { name: 'Dashboard', routeName: 'dashboard', icon: LayoutGrid },
        { name: 'Clients', routeName: 'clients.index', icon: Users },
        { name: 'Players', routeName: 'players.index', icon: Trophy },
        { name: 'Cafe',  routeName: 'cafe.index',  icon: Coffee },
        { name: 'Stock',    routeName: 'stock.index',    icon: Package    },
        { name: 'Schedule', routeName: 'schedule.index', icon: CalendarDays },
        { name: 'History',  routeName: 'history.sales',  icon: History      },
        { name: 'Suppliers', routeName: 'suppliers.index', icon: Truck      },
        { name: 'Products',  routeName: 'products.cafe',  icon: LayoutList },
        { name: 'Courts',      routeName: 'courts.index',      icon: Grid3x3 },
        { name: 'Memberships', routeName: 'memberships.index', icon: Crown   },
    ];

    const bottomNavItems = [
        { name: 'Settings', routeName: 'settings.index', icon: Settings },
        { name: 'Support', routeName: 'support.index', icon: Headphones },
    ];

    const isCurrentRoute = (name) => {
        try {
            // Highlight History nav for both history sub-routes
            if (name === 'history.sales') {
                return route().current('history.sales') || route().current('history.purchases') || route().current('history.expenses') || route().current('history.reconciliation');
            }
            if (name === 'products.cafe') {
                return route().current('products.cafe') || route().current('products.paddle') || route().current('products.index');
            }
            return route().current(name);
        } catch {
            return name === 'dashboard';
        }
    };

    return (
        <div className="min-h-screen text-gray-100 flex relative overflow-x-hidden font-sans bg-[#080c14]">
            {/* Fullscreen Padel Court Background Image */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <img
                    src="/images/padel_hero.png"
                    alt="Padel Court Background"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
            </div>

            {/* Mobile Overlay Backdrop */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden transition-opacity duration-300"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`glass-sidebar fixed top-4 bottom-4 z-50 lg:z-40 flex flex-col transition-all duration-300 ease-out p-4 rounded-3xl ${
                    mobileOpen ? 'left-4 w-64' : '-left-80 lg:left-4'
                } ${collapsed ? 'lg:w-20' : 'lg:w-64'}`}
            >
                {/* Top Section — scrollable */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 scrollbar-hide min-h-0">

                    {/* ── Logo / Brand ── */}
                    <div className="flex items-center justify-between px-1 py-1 min-h-[44px]">

                        {/* ── EXPANDED STATE ── logo + name on left, close btn on right */}
                        {!collapsed && (
                            <>
                                {/* Logo + name — static, never changes */}
                                <div className="hidden lg:flex items-center gap-2.5">
                                    <img
                                        src="/images/logo.png"
                                        alt="Paddle Pro"
                                        className="w-8 h-8 object-contain rounded-xl flex-shrink-0"
                                    />
                                    <span className="text-sm font-extrabold text-white tracking-wide whitespace-nowrap">
                                        Paddle <span className="text-lime-400">Pro</span>
                                    </span>
                                </div>

                                {/* Collapse button — right side, same style as nav icons */}
                                <button
                                    onClick={handleCollapse}
                                    className="hidden lg:flex items-center justify-center p-2 rounded-2xl text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                                    title="Collapse sidebar"
                                >
                                    <PanelLeftClose className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        {/* ── COLLAPSED STATE ── just logo, hover swaps to expand icon */}
                        {collapsed && (
                            <button
                                onClick={handleExpand}
                                onMouseEnter={() => setLogoHovered(true)}
                                onMouseLeave={() => setLogoHovered(false)}
                                className="hidden lg:flex items-center justify-center mx-auto rounded-xl transition-all duration-200 focus:outline-none"
                                title="Expand sidebar"
                            >
                                <div className="relative w-8 h-8">
                                    {/* Logo — fades out on hover */}
                                    <img
                                        src="/images/logo.png"
                                        alt="Paddle Pro"
                                        className={`absolute inset-0 w-8 h-8 object-contain rounded-xl transition-all duration-200 ${
                                            logoHovered ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
                                        }`}
                                    />
                                    {/* Expand icon — fades in on hover */}
                                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                                        logoHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                    }`}>
                                        <PanelLeftOpen className="w-5 h-5 text-gray-300" />
                                    </div>
                                </div>
                            </button>
                        )}

                        {/* Mobile close */}
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-lime-400 hover:bg-white/10 transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isCurrentRoute(item.routeName);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.routeName.startsWith('#') ? '#' : route(item.routeName)}
                                    prefetch
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center py-3 rounded-2xl transition-all duration-200 font-medium ${
                                        collapsed
                                            ? 'justify-center px-0'
                                            : 'gap-3.5 px-4'
                                    } ${
                                        active
                                            ? 'glass-active-pill text-lime-400 font-bold shadow-[0_0_20px_rgba(163,230,53,0.25)]'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                    title={collapsed ? item.name : undefined}
                                >
                                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-lime-400' : 'text-gray-300'}`} />
                                    {!collapsed && (
                                        <span className="text-sm tracking-wide whitespace-nowrap overflow-hidden">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom Navigation Items */}
                <div className="space-y-1 pt-4 border-t border-white/10">
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isCurrentRoute(item.routeName);
                        return (
                            <Link
                                key={item.name}
                                href={item.routeName.startsWith('#') ? '#' : route(item.routeName)}
                                prefetch
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center py-3 rounded-2xl transition-all duration-200 font-medium ${
                                    collapsed
                                        ? 'justify-center px-0'
                                        : 'gap-3.5 px-4'
                                } ${
                                    active
                                        ? 'glass-active-pill text-lime-400 font-bold shadow-[0_0_20px_rgba(163,230,53,0.25)]'
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                                title={collapsed ? item.name : undefined}
                            >
                                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-lime-400' : 'text-gray-300'}`} />
                                {!collapsed && (
                                    <span className="text-sm tracking-wide whitespace-nowrap overflow-hidden">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={`flex-1 transition-all duration-300 w-full min-h-screen flex flex-col px-4 sm:px-6 lg:pr-6 py-4 max-w-[1920px] mx-auto ${
                collapsed ? 'lg:ml-28' : 'lg:ml-72'
            }`} style={{ isolation: 'isolate' }}>
                {/* Topbar Header */}
                <header className="flex items-center justify-between lg:justify-end gap-3 py-2 mb-2">
                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden glass-panel p-2.5 rounded-2xl text-gray-200 hover:text-lime-400 hover:border-lime-400/40 transition-all flex items-center gap-2"
                        title="Open Menu"
                    >
                        <Menu className="w-5 h-5" />
                        <span className="text-xs font-semibold text-gray-300">Menu</span>
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Facility Pill */}
                        <div className="glass-panel px-3.5 sm:px-4 py-2 flex items-center gap-2.5 sm:gap-3 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-lime-400/20 flex items-center justify-center border border-lime-400/40 shadow-[0_0_12px_rgba(163,230,53,0.35)]">
                                <span className="text-lime-400 text-xs font-bold">🎾</span>
                            </div>
                            <div className="text-left">
                                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">{facility.name}</h4>
                                <p className="text-[10px] sm:text-[11px] text-gray-300">{facility.subtext}</p>
                            </div>
                        </div>

                        {/* Notification Bell */}
                        <button className="glass-panel p-2.5 rounded-2xl text-gray-200 hover:text-lime-400 hover:border-lime-400/40 transition-all relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-lime-400 animate-ping"></span>
                            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-lime-400"></span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="glass-panel p-1 pl-1 pr-2 rounded-2xl flex items-center gap-2 hover:border-white/30 transition-all"
                            >
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1e293b&color=a3e635`} 
                                    alt={user.name} 
                                    className="w-9 h-9 rounded-xl object-cover border border-white/20"
                                />
                                <ChevronDown className="w-4 h-4 text-gray-300" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel py-2 shadow-2xl z-50">
                                    <div className="px-4 py-2 border-b border-white/10">
                                        <p className="text-xs font-semibold text-white">{user.name}</p>
                                        <p className="text-[10px] text-gray-300 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2 px-4 py-2 text-xs text-gray-200 hover:bg-white/10 hover:text-lime-400 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4" /> Profile
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" /> Log Out
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 flex flex-col">{children}</main>
            </div>
        </div>
    );
}
