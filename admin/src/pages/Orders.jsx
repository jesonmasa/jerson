import React, { useState, useEffect } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        completed: { label: 'Completada', color: 'green', icon: '✅', gradient: 'from-green-500 to-green-600' },
        processing: { label: 'Procesando', color: 'blue', icon: '⚙️', gradient: 'from-blue-500 to-blue-600' },
        pending: { label: 'Pendiente', color: 'yellow', icon: '⏳', gradient: 'from-yellow-500 to-yellow-600' },
        cancelled: { label: 'Cancelada', color: 'red', icon: '❌', gradient: 'from-red-500 to-red-600' },
    };

    const stats = [
        { label: 'Total Órdenes', value: orders.length, icon: '📦', color: 'primary' },
        { label: 'Completadas', value: orders.filter(o => o.status === 'completed').length, icon: '✅', color: 'success' },
        { label: 'Procesando', value: orders.filter(o => o.status === 'processing').length, icon: '⚙️', color: 'info' },
        { label: 'Pendientes', value: orders.filter(o => o.status === 'pending').length, icon: '⏳', color: 'warning' },
    ];

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(order => order.status === statusFilter);

    if (loading) {
        return <div className="p-8 text-center">Cargando órdenes...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="card group hover:scale-105 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    {stat.value}
                                </p>
                            </div>
                            <div className="text-4xl group-hover:scale-110 transition-transform">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card">
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-semibold text-gray-700 mr-2">Filtrar por estado:</span>
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${statusFilter === 'all'
                            ? 'bg-gradient-primary text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Todas
                    </button>
                    {Object.entries(statusConfig).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setStatusFilter(key)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${statusFilter === key
                                ? `bg-gradient-to-r ${config.gradient} text-white shadow-md`
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span>{config.icon}</span>
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.map((order) => {
                    const config = statusConfig[order.status] || statusConfig.pending;
                    return (
                        <div key={order.id} className="card group hover:shadow-xl transition-all duration-300">
                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Order Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                                    Orden {order.id}
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${config.gradient} text-white flex items-center gap-1 shadow-md`}>
                                                    {config.icon} {config.label}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    👤 {order.customer}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    📧 {order.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    📅 {new Date(order.created_at).toLocaleDateString('es-ES')}
                                                </span>
                                            </div>
                                            {/* Age and Gender */}
                                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                                {order.age && <span>Edad: {order.age}</span>}
                                                {order.gender && <span>Género: {order.gender}</span>}
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right w-full md:w-auto flex justify-between md:block items-center">
                                            <p className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                                ${order.total}
                                            </p>
                                            <p className="text-sm text-gray-500">{order.items_count} productos</p>
                                        </div>
                                    </div>

                                    {/* Order Details */}
                                    <div className="flex gap-4 pt-4 border-t-2 border-gray-100">
                                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Pago</p>
                                            <p className="font-semibold text-gray-900">{order.payment}</p>
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Envío</p>
                                            <p className="font-semibold text-gray-900">{order.shipping}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex lg:flex-col gap-2 lg:w-40">
                                    <button className="flex-1 btn btn-secondary text-sm">
                                        👁️ Ver Detalles
                                    </button>
                                    {order.status === 'pending' && (
                                        <button className="flex-1 btn btn-primary text-sm">
                                            ✅ Aprobar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
                <div className="card text-center py-16">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        No hay órdenes
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {statusFilter === 'all'
                            ? 'Aún no has recibido ninguna orden.'
                            : 'No hay órdenes con este estado.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Orders;
