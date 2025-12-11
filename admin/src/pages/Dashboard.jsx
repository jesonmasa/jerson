
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Si es Super Admin, redirigir a su panel propio
        if (user?.role === 'super_admin') {
            navigate('/super-admin');
            return;
        }

        const fetchStats = async () => {
            if (!user?.tenantId) {
                console.warn('No tenantId found for user, skipping stats fetch.');
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stats`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-Tenant-Id': user.tenantId // Enviar tenantId en el header
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al obtener estadísticas');
                }

                const data = await response.json();
                setStatsData(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
                // Opcional: mostrar un mensaje de error al usuario
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user, navigate]); // Dependencias: user y navigate

    if (loading) {
        return <div className="p-8 text-center">Cargando estadísticas...</div>;
    }

    const stats = [
        {
            label: 'Ventas Totales',
            value: `$${statsData?.totalSales || 0}`,
            change: '-',
            icon: '💰',
            gradient: 'from-primary-500 to-primary-600',
            bgGradient: 'from-primary-50 to-primary-100',
        },
        {
            label: 'Órdenes Activas',
            value: statsData?.activeOrders || 0,
            change: '-',
            icon: '📦',
            gradient: 'from-secondary-500 to-secondary-600',
            bgGradient: 'from-secondary-50 to-secondary-100',
        },
        {
            label: 'Total Productos',
            value: statsData?.totalProducts || 0,
            change: '-',
            icon: '🏷️',
            gradient: 'from-accent-500 to-accent-600',
            bgGradient: 'from-accent-50 to-accent-100',
        },
        {
            label: 'Tasa Conversión',
            value: '0%',
            change: '-',
            icon: '📈',
            gradient: 'from-green-500 to-green-600',
            bgGradient: 'from-green-50 to-green-100',
        },
    ];

    // Orders by Status Chart
    const ordersData = {
        labels: ['Completadas', 'Procesando', 'Pendientes', 'Canceladas'],
        datasets: [
            {
                data: [
                    statsData?.ordersByStatus?.completed || 0,
                    statsData?.ordersByStatus?.processing || 0,
                    statsData?.ordersByStatus?.pending || 0,
                    statsData?.ordersByStatus?.cancelled || 0
                ],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };



    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
        },
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="card card-premium group cursor-pointer transform hover:scale-105 transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                    {stat.label}
                                </p>
                                <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                                    {stat.value}
                                </h3>
                            </div>
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center text-2xl shadow-soft group-hover:shadow-md transition-all`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Orders by Status */}
                <div className="card">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Órdenes por Estado
                    </h3>
                    <div className="h-64">
                        {statsData?.totalSales === 0 ? (
                            <div className="h-full flex items-center justify-center text-gray-400">
                                Sin datos aún
                            </div>
                        ) : (
                            <Doughnut data={ordersData} options={doughnutOptions} />
                        )}
                    </div>
                </div>


            </div>

            {/* Recent Activity */}
            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Actividad Reciente
                    </h3>
                </div>
                <div className="space-y-4">
                    {statsData?.recentActivity?.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No hay actividad reciente.</p>
                    ) : (
                        statsData?.recentActivity?.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer border-2 border-transparent hover:border-gray-200"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center font-bold text-lg">
                                        {activity.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{activity.title}</p>
                                        <p className="text-sm text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                                {activity.amount && (
                                    <span className="text-lg font-bold text-green-600">{activity.amount}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


