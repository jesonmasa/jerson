import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:3001/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.code === 'EMAIL_NOT_VERIFIED') {
                    setNeedsVerification(true);
                    setError(data.message);
                    return;
                }
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Login exitoso
            setAuth(data.token, data.user);
            navigate('/');

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">C</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">Constructor</h2>
                        <p className="text-purple-100 mt-2">Panel de Administración</p>
                    </div>

                    <div className="p-8">
                        {/* Error */}
                        {error && (
                            <div className={`mb-6 p-4 rounded-lg text-sm ${needsVerification
                                    ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                                    : 'bg-red-50 border border-red-200 text-red-600'
                                }`}>
                                {needsVerification && <span className="font-bold">📧 </span>}
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Iniciando sesión...
                                    </span>
                                ) : 'Iniciar Sesión'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">o</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <Link
                            to="/register"
                            className="block w-full text-center py-4 border-2 border-purple-500 text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all duration-300"
                        >
                            🚀 Crear Nueva Cuenta
                        </Link>

                        <div className="mt-6 text-center">
                            <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-purple-600">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-400">
                                Constructor © 2024 - Plataforma E-commerce SaaS
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
