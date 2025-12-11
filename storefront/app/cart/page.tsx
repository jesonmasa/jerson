'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CartPage() {
    const [cart, setCart] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        email: '',
        phone: '',
        age: '',
        gender: ''
    });

    useEffect(() => {
        // Load cart from localStorage (simulated)
        // In a real app, this would come from a global store
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Save Order to Database
        try {
            const orderData = {
                store_id: '1', // Default store ID
                customer_name: formData.name,
                customer_email: formData.email,
                customer_phone: formData.phone,
                shipping_address: { address: formData.address },
                billing_address: { address: formData.address },
                items: cart,
                subtotal: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
                shipping: 0,
                tax: 0,
                total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
                // Custom fields
                age: formData.age,
                gender: formData.gender
            };

            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Error saving order');
            }

            const savedOrder = await response.json();
            console.log('Order saved:', savedOrder);

            // 2. Redirect to WhatsApp
            const message = `Hola, quiero realizar un pedido:
            
*Orden #${savedOrder.id}*
------------------
${cart.map(item => `- ${item.name} (x${item.quantity}): ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.price * item.quantity)}`).join('\n')}
------------------
*Total: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(orderData.total)}*

*Mis Datos:*
Nombre: ${formData.name}
Dirección: ${formData.address}
Teléfono: ${formData.phone}
Email: ${formData.email}
Edad: ${formData.age}
Género: ${formData.gender}
`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappNumber = '573001234567'; // Replace with actual store number
            window.location.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Hubo un error al procesar el pedido. Por favor intenta nuevamente.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-6xl mb-4">🛒</div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
                <Link href="/" className="text-blue-600 hover:underline">
                    Volver a la tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8">
                        {/* Order Summary */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                            <div className="space-y-4">
                                {cart.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold">
                                            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4 text-xl font-bold">
                                    <span>Total</span>
                                    <span>
                                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cart.reduce((acc, item) => acc + item.price * item.quantity, 0))}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Checkout Form */}
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Envío</label>
                                    <input
                                        type="text"
                                        name="address"
                                        required
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
                                    <input
                                        type="number"
                                        name="age"
                                        required
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
                                    <select
                                        name="gender"
                                        required
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Femenino">Femenino</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl">📱</span>
                                Realizar Pedido por WhatsApp
                            </button>
                            <p className="text-center text-sm text-gray-500 mt-4">
                                Al hacer clic, se guardará tu pedido y serás redirigido a WhatsApp para confirmar.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

