import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Layout = () => {
    const { logout, user } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Menú para Propietarios de Tienda (Owners)
    const ownerNavItems = [
        { path: '/', label: 'Dashboard', icon: '📊', gradient: 'from-primary-500 to-primary-600' },
        { path: '/products', label: 'Productos', icon: '🏷️', gradient: 'from-secondary-500 to-secondary-600' },
        { path: '/categories', label: 'Categorías', icon: '📂', gradient: 'from-blue-500 to-blue-600' },
        { path: '/orders', label: 'Órdenes', icon: '📦', gradient: 'from-accent-500 to-accent-600' },
        { path: '/customers', label: 'Clientes', icon: '👥', gradient: 'from-green-500 to-green-600' },
        { path: '/datasheet', label: 'Hoja de Datos', icon: '📋', gradient: 'from-teal-500 to-teal-600' },
        { path: '/gallery', label: 'Galería', icon: '🖼️', gradient: 'from-pink-500 to-pink-600' },
        { path: '/builder', label: 'Builder', icon: '🔨', gradient: 'from-purple-500 to-purple-600' },
        { path: '/billing', label: 'Mi Plan', icon: '💳', gradient: 'from-indigo-500 to-indigo-600' },

    ];

    // Menú para Super Administrador
    const superAdminNavItems = [
        { path: '/super-admin', label: 'Dashboard Global', icon: '🌎', gradient: 'from-purple-600 to-indigo-600' },
        { path: '/super-admin?tab=users', label: 'Usuarios y Tiendas', icon: '👥', gradient: 'from-blue-500 to-blue-600' },
        { path: '/super-admin?tab=revenue', label: 'Planes y Precios', icon: '💳', gradient: 'from-green-500 to-green-600' },
        { path: '/super-admin?tab=analytics', label: 'Reportes', icon: '📈', gradient: 'from-pink-500 to-red-600' }
    ];

    // Seleccionar menú según rol
    const navItems = user?.role === 'super_admin' ? superAdminNavItems : ownerNavItems;

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Premium Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                ${sidebarCollapsed ? 'md:w-20' : 'md:w-72'} 
                ${mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'}
                bg-white shadow-xl flex flex-col transition-all duration-300 border-r-2 border-gray-100
            `}>
                {/* Logo */}
                <div className="p-6 border-b-2 border-gray-100 bg-gradient-to-br from-primary-50 to-secondary-50 flex justify-between items-center">
                    {(mobileMenuOpen || !sidebarCollapsed) && (
                        <div>
                            <h1 className="text-2xl font-bold gradient-text" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                Constructor
                            </h1>
                            <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-all"
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                    >
                        ✕
                    </button>
                </div>

                {/* User Info */}
                {(mobileMenuOpen || !sidebarCollapsed) && (
                    <div className="p-4 border-b-2 border-gray-100">
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
                            <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-md">
                                {user?.email?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate text-sm">
                                    {user?.name || 'Admin'}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@constructor.com'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path.split('?')[0] && location.search === (item.path.split('?')[1] ? `?${item.path.split('?')[1]}` : '');
                        // Fallback simple por si la lógica anterior falla en algunos casos o para el dashboard root
                        const isActiveSimple = location.pathname === item.path;
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive || isActiveSimple
                                    ? 'bg-gradient-primary text-white shadow-lg shadow-primary-500/30'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                title={sidebarCollapsed && !mobileMenuOpen ? item.label : ''}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                )}
                                <span className={`text-2xl relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
                                    {item.icon}
                                </span>
                                {(mobileMenuOpen || !sidebarCollapsed) && (
                                    <span className={`font-semibold relative z-10 ${isActive ? 'text-white' : ''}`}>
                                        {item.label}
                                    </span>
                                )}
                                {isActive && (mobileMenuOpen || !sidebarCollapsed) && (
                                    <div className="ml-auto">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t-2 border-gray-100">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300 group ${sidebarCollapsed && !mobileMenuOpen ? 'justify-center' : ''
                            }`}
                    >
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto w-full">
                {/* Top Bar */}
                <div className="bg-white border-b-2 border-gray-100 px-4 md:px-8 py-4 shadow-sm sticky top-0 z-30">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
                            >
                                <span className="text-2xl">☰</span>
                            </button>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                                </h2>
                                <p className="text-sm text-gray-500 mt-0.5 hidden md:block">
                                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-green-50 rounded-lg px-4 py-2 border border-green-200 flex items-center gap-3">
                                <div>
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider block">Ventas Hoy</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-green-900">$1,234</span>
                                        <span className="text-xs text-green-600 font-medium">+12%</span>
                                    </div>
                                </div>
                                <div className="bg-white p-1.5 rounded-md shadow-sm">
                                    <span className="text-lg">💰</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="p-4 md:p-8 animate-fadeIn pb-20 md:pb-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
