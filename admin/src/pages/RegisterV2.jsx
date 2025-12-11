import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://localhost:3001/api';

const RegisterV2 = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Verificar, 3: Completar
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const { setAuth } = useAuthStore();

    // PASO 1: Enviar código de verificación
    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register/init`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, name })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al enviar código');
            }

            setMessage('Código enviado a tu email');
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // PASO 2: Verificar código y completar registro
    const handleVerifyAndRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code, name, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al verificar');
            }

            // Guardar auth y redirigir
            setAuth(data.token, data.user);
            setStep(3);

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Reenviar código
    const handleResendCode = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/auth/resend-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setMessage('Código reenviado');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="max-w-md w-full mx-4">

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s
                                        ? 'bg-white text-purple-900'
                                        : 'bg-white/20 text-white/50'
                                    }`}>
                                    {step > s ? '✓' : s}
                                </div>
                                {s < 3 && (
                                    <div className={`w-8 h-1 rounded ${step > s ? 'bg-white' : 'bg-white/20'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-center">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">C</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            {step === 1 && 'Crear Cuenta'}
                            {step === 2 && 'Verificar Email'}
                            {step === 3 && '¡Bienvenido!'}
                        </h2>
                        <p className="text-blue-100 mt-2 text-sm">
                            {step === 1 && 'Únete a la plataforma más poderosa de e-commerce'}
                            {step === 2 && 'Ingresa el código enviado a tu email'}
                            {step === 3 && 'Tu cuenta ha sido creada exitosamente'}
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Mensajes */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {message && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm flex items-center gap-2">
                                <span>✅</span> {message}
                            </div>
                        )}

                        {/* PASO 1: Email y Nombre */}
                        {step === 1 && (
                            <form onSubmit={handleSendCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nombre Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        placeholder="Tu nombre"
                                        required
                                    />
                                </div>

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

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : 'Enviar Código de Verificación'}
                                </button>
                            </form>
                        )}

                        {/* PASO 2: Código y Contraseña */}
                        {step === 2 && (
                            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Código de Verificación
                                    </label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-center text-2xl font-bold tracking-[0.5em]"
                                        placeholder="000000"
                                        maxLength={6}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={loading}
                                        className="mt-2 text-sm text-purple-600 hover:text-purple-800 font-medium"
                                    >
                                        ¿No recibiste el código? Reenviar
                                    </button>
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
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                        placeholder="Repite tu contraseña"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || code.length !== 6}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {loading ? 'Creando cuenta...' : 'Crear Mi Cuenta'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full py-2 text-gray-500 hover:text-gray-700 font-medium"
                                >
                                    ← Volver
                                </button>
                            </form>
                        )}

                        {/* PASO 3: Éxito */}
                        {step === 3 && (
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                    <span className="text-4xl">🎉</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">¡Cuenta Creada!</h3>
                                <p className="text-gray-600 mb-6">
                                    Bienvenido a Constructor. Tu tienda está lista para ser configurada.
                                </p>
                                <div className="animate-pulse text-purple-600 font-medium">
                                    Redirigiendo al panel...
                                </div>
                            </div>
                        )}

                        {/* Link a Login */}
                        {step < 3 && (
                            <div className="mt-8 text-center border-t border-gray-100 pt-6">
                                <p className="text-gray-600">
                                    ¿Ya tienes cuenta?{' '}
                                    <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold">
                                        Iniciar Sesión
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-white/60 text-sm">
                        Al registrarte, aceptas nuestros términos y condiciones.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterV2;
