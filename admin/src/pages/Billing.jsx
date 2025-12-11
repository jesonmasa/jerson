import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:3001/api';

const Billing = () => {
    const [plans, setPlans] = useState([]);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const { token, user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Cargar planes
            const plansRes = await fetch(`${API_URL}/subscriptions/plans`);
            const plansData = await plansRes.json();
            setPlans(plansData.plans || []);

            // Cargar suscripción actual
            if (token) {
                const subRes = await fetch(`${API_URL}/subscriptions/current`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const subData = await subRes.json();
                setCurrentSubscription(subData.subscription);
            }
        } catch (error) {
            console.error('Error loading billing data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch(`${API_URL}/subscriptions/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId: selectedPlan.id,
                    paymentDetails: {
                        // Datos simulados para desarrollo
                        cardLast4: paymentData.cardNumber.slice(-4),
                        cardName: paymentData.cardName
                    }
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al procesar pago');
            }

            setMessage({ type: 'success', text: `¡${data.message}` });
            setCurrentSubscription(data.subscription);
            setShowPaymentModal(false);

            // Recargar datos
            await loadData();

        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelSubscription = async () => {
        if (!confirm('¿Estás seguro de cancelar tu suscripción?')) return;

        try {
            const res = await fetch(`${API_URL}/subscriptions/cancel`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessage({ type: 'success', text: data.message });
            await loadData();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Planes y Precios
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Elige el plan perfecto para hacer crecer tu negocio
                    </p>
                </div>

                {/* Mensajes */}
                {message.text && (
                    <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-xl ${message.type === 'success'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-red-50 border border-red-200 text-red-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Suscripción Actual */}
                {currentSubscription && (
                    <div className="max-w-2xl mx-auto mb-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <span className="text-purple-200 text-sm">Tu Plan Actual</span>
                                <h3 className="text-2xl font-bold">{currentSubscription.planName}</h3>
                                <p className="text-purple-200 mt-1">
                                    Válido hasta: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${currentSubscription.status === 'active'
                                        ? 'bg-green-500'
                                        : 'bg-yellow-500'
                                    }`}>
                                    {currentSubscription.status === 'active' ? 'Activo' : 'Cancelado'}
                                </span>
                            </div>
                        </div>
                        {currentSubscription.status === 'active' && (
                            <button
                                onClick={handleCancelSubscription}
                                className="mt-4 text-sm text-purple-200 hover:text-white underline"
                            >
                                Cancelar suscripción
                            </button>
                        )}
                    </div>
                )}

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => {
                        const isCurrentPlan = currentSubscription?.planId === plan.id;
                        const isPro = plan.id === 'pro';

                        return (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isPro ? 'ring-2 ring-purple-500 scale-105' : ''
                                    }`}
                            >
                                {isPro && (
                                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 text-sm font-bold">
                                        ⭐ MÁS POPULAR
                                    </div>
                                )}

                                <div className={`p-8 ${isPro ? 'pt-14' : ''}`}>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                        <span className="text-gray-500">/mes</span>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">✓</span>
                                                <span className="text-gray-600">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {isCurrentPlan ? (
                                        <button
                                            disabled
                                            className="w-full py-4 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed"
                                        >
                                            Plan Actual
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleSelectPlan(plan)}
                                            className={`w-full py-4 font-bold rounded-xl transition-all duration-300 ${isPro
                                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {currentSubscription ? 'Cambiar a Este Plan' : 'Comenzar Ahora'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Features Comparison */}
                <div className="mt-16 text-center">
                    <p className="text-gray-500">
                        Todos los planes incluyen: SSL gratis, soporte por WhatsApp, y actualizaciones automáticas
                    </p>
                </div>
            </div>

            {/* Payment Modal */}
            {showPaymentModal && selectedPlan && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Completar Suscripción</h2>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Plan Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-gray-500 text-sm">Plan seleccionado</span>
                                        <h3 className="font-bold text-lg">{selectedPlan.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold">${selectedPlan.price}</span>
                                        <span className="text-gray-500">/mes</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Form (Simulado) */}
                            <form onSubmit={handleSubscribe}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nombre en la tarjeta
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentData.cardName}
                                            onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                            placeholder="Juan Pérez"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número de tarjeta
                                        </label>
                                        <input
                                            type="text"
                                            value={paymentData.cardNumber}
                                            onChange={(e) => setPaymentData({
                                                ...paymentData,
                                                cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16)
                                            })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                            placeholder="4242 4242 4242 4242"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Vencimiento
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentData.expiry}
                                                onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                                placeholder="MM/AA"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentData.cvv}
                                                onChange={(e) => setPaymentData({
                                                    ...paymentData,
                                                    cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                                                })}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                                                placeholder="123"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                    <p className="text-sm text-yellow-700">
                                        🔒 <strong>Modo de Prueba:</strong> Los datos de pago son simulados.
                                        No se realizará ningún cobro real.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full mt-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Procesando...
                                        </span>
                                    ) : `Pagar $${selectedPlan.price}/mes`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
