import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const API_URL = 'http://localhost:3001/api';

const SuperAdminDashboard = () => {
    const location = useLocation();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    const { token } = useAuthStore();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location.search]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError('');

            // Cargar stats
            const statsRes = await fetch(`${API_URL}/super-admin/dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!statsRes.ok) {
                if (statsRes.status === 403) {
                    setError('No tienes permisos de Super Admin');
                    return;
                }
                throw new Error('Error al cargar dashboard');
            }

            const statsData = await statsRes.json();
            setStats(statsData);

            // Cargar usuarios
            const usersRes = await fetch(`${API_URL}/super-admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!usersRes.ok) {
                throw new Error('Error al cargar usuarios');
            }
            
            const usersData = await usersRes.json();
            setUsers(Array.isArray(usersData.users) ? usersData.users : []);
        } catch (err) {
            console.error('Error loading dashboard:', err);
            setError(err.message);
            setUsers([]); // Asegurarse de que users sea un array vacío en caso de error
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(num || 0);
    };

    // Nueva función para acceder al panel del usuario
    const accessUserPanel = async (user) => {
        // Verificar que el usuario tenga tenantId
        if (!user.tenantId) {
            alert('Este usuario no tiene un panel administrativo configurado');
            return;
        }
        
        try {
            // Solicitar al backend un token para acceder al panel del usuario
            const response = await fetch(`${API_URL}/super-admin/generate-user-token/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al generar token de acceso');
            }

            // Crear una URL con el token para acceder al panel del usuario
            const origin = window.location.origin;
            const userPanelUrl = `${origin}/?token=${data.token}&tenantId=${user.tenantId}&userName=${encodeURIComponent(user.name || 'Usuario')}`;
            window.open(userPanelUrl, '_blank');
        } catch (error) {
            console.error('Error accessing user panel:', error);
            alert(`Error al acceder al panel del usuario: ${error.message}`);
        }
    };

    // Nueva función para ver la tienda pública del usuario
    const viewUserStore = (user) => {
        // Verificar que el usuario tenga tenantId
        if (!user.tenantId) {
            alert('Este usuario no tiene una tienda configurada');
            return;
        }
        
        // Abrir la tienda pública del usuario en una nueva pestaña
        const storeUrl = `http://localhost:3000/store/${user.tenantId}`;
        window.open(storeUrl, '_blank');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto"></div>
                    <p className="text-white mt-4">Cargando Super Admin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 text-center max-w-md">
                    <span className="text-4xl mb-4 block">🚫</span>
                    <h2 className="text-xl font-bold text-white mb-2">Acceso Denegado</h2>
                    <p className="text-red-300">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">👑</span>
                                Super Admin
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">Control total de la plataforma</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={loadDashboard}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition"
                            >
                                🔄 Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 mt-6">
                <div className="flex gap-2 bg-black/20 p-1 rounded-xl w-fit">
                    {[
                        { id: 'overview', label: '📊 Resumen', icon: '📊' },
                        { id: 'users', label: '👥 Usuarios', icon: '👥' },
                        { id: 'revenue', label: '💰 Ingresos', icon: '💰' },
                        { id: 'analytics', label: '📈 Analytics', icon: '📈' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.id
                                    ? 'bg-white text-gray-900'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-blue-100 text-sm">Total Usuarios</p>
                                        <p className="text-4xl font-bold mt-2">{stats?.overview?.totalTenants || 0}</p>
                                    </div>
                                    <span className="text-4xl opacity-50">👥</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-green-100 text-sm">Suscripciones Activas</p>
                                        <p className="text-4xl font-bold mt-2">{stats?.overview?.activeSubscriptions || 0}</p>
                                    </div>
                                    <span className="text-4xl opacity-50">✅</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-purple-100 text-sm">MRR (Ingresos Mensuales)</p>
                                        <p className="text-4xl font-bold mt-2">{formatCurrency(stats?.overview?.monthlyRecurringRevenue)}</p>
                                    </div>
                                    <span className="text-4xl opacity-50">💵</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-orange-100 text-sm">Total Productos</p>
                                        <p className="text-4xl font-bold mt-2">{stats?.overview?.totalProducts || 0}</p>
                                    </div>
                                    <span className="text-4xl opacity-50">🏷️</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Users & Activity */}
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Recent Users */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span>👥</span> Usuarios Recientes
                                </h3>
                                <div className="space-y-3">
                                    {users.slice(0, 5).map((user, i) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition cursor-pointer"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                {user.name?.charAt(0) || user.email?.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-gray-400 text-sm">{user.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${user.subscription ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {user.subscription?.planName || 'Sin plan'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {users.length === 0 && (
                                        <p className="text-gray-500 text-center py-8">No hay usuarios registrados aún</p>
                                    )}
                                </div>
                            </div>

                            {/* Top Products */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span>🔥</span> Productos Más Vendidos (Global)
                                </h3>
                                <div className="space-y-3">
                                    {(stats?.topProducts || []).slice(0, 5).map((product, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                                            <span className="text-2xl font-bold text-gray-500">#{i + 1}</span>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">{product.productName}</p>
                                                <p className="text-gray-400 text-sm">{product.quantity} vendidos</p>
                                            </div>
                                            <div className="text-green-400 font-bold">
                                                {formatCurrency(product.revenue)}
                                            </div>
                                        </div>
                                    ))}
                                    {(!stats?.topProducts || stats.topProducts.length === 0) && (
                                        <p className="text-gray-500 text-center py-8">No hay datos de ventas aún</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="text-lg font-bold text-white">Todos los Usuarios ({users.length})</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Usuario</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Tienda</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Plan</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Productos</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Ventas</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Registro</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-white/5 transition cursor-pointer" onClick={() => setSelectedUser(user)}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                        {(user.name || user.email || '?').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{user.name || 'Sin nombre'}</p>
                                                        <p className="text-gray-400 text-sm">{user.email || 'Sin email'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-white">{user.store?.storeName || '-'}</p>
                                                <p className="text-gray-500 text-xs">{user.store?.themeId || '-'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.subscription?.status === 'active'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {user.subscription?.planName || 'Sin plan'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white">
                                                {user.store?.productCount || 0}
                                            </td>
                                            <td className="px-6 py-4 text-green-400 font-medium">
                                                {formatCurrency(user.store?.totalSales)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {user.createdAt ? formatDate(user.createdAt) : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`w-3 h-3 rounded-full inline-block ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                            </td>
                                            {/* Nuevos botones de acción */}
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            accessUserPanel(user);
                                                        }}
                                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-xs hover:bg-blue-500/30 transition"
                                                        title="Acceder al panel del usuario"
                                                        disabled={!user.tenantId}
                                                    >
                                                        👤 Panel
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            viewUserStore(user);
                                                        }}
                                                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/30 transition"
                                                        title="Ver tienda pública"
                                                        disabled={!user.tenantId}
                                                    >
                                                        🛍️ Tienda
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    No hay usuarios registrados aún
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Revenue Tab */}
                {activeTab === 'revenue' && (
                    <div className="space-y-6">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
                                <p className="text-green-400 text-sm">Ingresos Mensuales (MRR)</p>
                                <p className="text-4xl font-bold text-white mt-2">{formatCurrency(stats?.overview?.monthlyRecurringRevenue)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
                                <p className="text-blue-400 text-sm">Proyección Anual</p>
                                <p className="text-4xl font-bold text-white mt-2">{formatCurrency((stats?.overview?.monthlyRecurringRevenue || 0) * 12)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6">
                                <p className="text-purple-400 text-sm">Suscriptores Activos</p>
                                <p className="text-4xl font-bold text-white mt-2">{stats?.overview?.activeSubscriptions || 0}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Distribución por Plan</h3>
                            <div className="space-y-4">
                                {users.filter(u => u.subscription).map(user => (
                                    <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                                        <div>
                                            <p className="text-white font-medium">{user.name}</p>
                                            <p className="text-gray-400 text-sm">{user.subscription?.planName}</p>
                                        </div>
                                        <p className="text-green-400 font-bold">
                                            {formatCurrency(user.subscription?.priceMonthly)}/mes
                                        </p>
                                    </div>
                                ))}
                                {users.filter(u => u.subscription).length === 0 && (
                                    <p className="text-gray-500 text-center py-8">No hay suscripciones activas</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">📊 Estadísticas Globales</h3>
                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-white">{stats?.overview?.totalProducts || 0}</p>
                                    <p className="text-gray-400 text-sm">Productos Totales</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-white">{stats?.overview?.totalOrders || 0}</p>
                                    <p className="text-gray-400 text-sm">Pedidos Totales</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-green-400">{formatCurrency(stats?.overview?.totalRevenue)}</p>
                                    <p className="text-gray-400 text-sm">Ventas Totales</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl text-center">
                                    <p className="text-3xl font-bold text-purple-400">{Object.keys(stats?.productsByCategory || {}).length}</p>
                                    <p className="text-gray-400 text-sm">Categorías Activas</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">🏆 Categorías con más productos</h3>
                            <div className="space-y-3">
                                {Object.entries(stats?.productsByCategory || {})
                                    .sort((a, b) => b[1] - a[1])
                                    .slice(0, 10)
                                    .map(([category, count], i) => (
                                        <div key={category} className="flex items-center gap-4">
                                            <span className="text-gray-500 w-6">{i + 1}.</span>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-white">{category}</span>
                                                    <span className="text-gray-400">{count} productos</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                                        style={{ width: `${Math.min((count / Math.max(...Object.values(stats?.productsByCategory || { 1: 1 }))) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedUser(null)}>
                    <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto border border-white/10" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-gray-900">
                            <h2 className="text-xl font-bold text-white">Detalle de Usuario</h2>
                            <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-white">✕</button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* User Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedUser.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                                    <p className="text-gray-400">{selectedUser.email}</p>
                                    <p className="text-gray-500 text-sm">Tenant: {selectedUser.tenantId}</p>
                                </div>
                            </div>

                            {/* Store Info */}
                            {selectedUser.store && (
                                <div className="bg-white/5 rounded-xl p-4">
                                    <h4 className="text-white font-medium mb-3">📦 Tienda</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Nombre:</span>
                                            <span className="text-white ml-2">{selectedUser.store.storeName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Plantilla:</span>
                                            <span className="text-white ml-2">{selectedUser.store.themeId}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Productos:</span>
                                            <span className="text-white ml-2">{selectedUser.store.productCount}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Pedidos:</span>
                                            <span className="text-white ml-2">{selectedUser.store.orderCount}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Ventas:</span>
                                            <span className="text-green-400 ml-2 font-bold">{formatCurrency(selectedUser.store.totalSales)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Subscription Info */}
                            <div className="bg-white/5 rounded-xl p-4">
                                <h4 className="text-white font-medium mb-3">💳 Suscripción</h4>
                                {selectedUser.subscription ? (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-400">Plan:</span>
                                            <span className="text-white ml-2">{selectedUser.subscription.planName}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Precio:</span>
                                            <span className="text-green-400 ml-2">${selectedUser.subscription.priceMonthly}/mes</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Estado:</span>
                                            <span className={`ml-2 ${selectedUser.subscription.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {selectedUser.subscription.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Sin suscripción activa</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                <button
                                    onClick={() => accessUserPanel(selectedUser)}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                                    disabled={!selectedUser.tenantId}
                                >
                                    👤 Abrir Panel
                                </button>
                                <button
                                    onClick={() => viewUserStore(selectedUser)}
                                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
                                    disabled={!selectedUser.tenantId}
                                >
                                    🛍️ Abrir Tienda
                                </button>
                            </div>

                            {/* Metadata */}
                            <div className="text-gray-500 text-sm">
                                <p>✓ Email verificado: {selectedUser.emailVerified ? 'Sí' : 'No'}</p>
                                <p>📅 Registro: {formatDate(selectedUser.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
