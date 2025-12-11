import React, { useState } from 'react';

const Customers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSegment, setSelectedSegment] = useState('all');

    // Los clientes se poblarán cuando se implemente el registro de compradores
    // Por ahora muestra un estado vacío para evitar datos falsos
    const customers = [];

    const segments = {
        all: { label: 'Todos', count: customers.length, icon: '👥' },
        vip: { label: 'VIP', count: customers.filter(c => c.segment === 'vip').length, icon: '⭐' },
        regular: { label: 'Regulares', count: customers.filter(c => c.segment === 'regular').length, icon: '👤' },
        new: { label: 'Nuevos', count: customers.filter(c => c.segment === 'new').length, icon: '🆕' },
    };

    const stats = [
        { label: 'Total Clientes', value: customers.length, icon: '👥', color: 'primary' },
        { label: 'Clientes VIP', value: customers.filter(c => c.segment === 'vip').length, icon: '⭐', color: 'accent' },
        { label: 'Nuevos (30d)', value: customers.filter(c => c.segment === 'new').length, icon: '🆕', color: 'success' },
        { label: 'Valor Promedio', value: customers.length > 0 ? `$${(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(2)}` : '$0.00', icon: '💰', color: 'secondary' },
    ];

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSegment = selectedSegment === 'all' || customer.segment === selectedSegment;
        return matchesSearch && matchesSegment;
    });

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

            {/* Empty State - Siempre se muestra porque no hay clientes aún */}
            <div className="card text-center py-16">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    No tienes clientes aún
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Los clientes aparecerán aquí cuando realicen compras en tu tienda a través de WhatsApp.
                    <br /><br />
                    <span className="text-blue-500">💡 Próximamente:</span> Registro de compradores con Gmail
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    🚧 Esta función está en desarrollo
                </div>
            </div>
        </div>
    );
};

export default Customers;
