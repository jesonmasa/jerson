'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Steps: 'register' | 'verify'
    const [step, setStep] = useState('register');

    // Form Data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Verification Data
    const [verificationCode, setVerificationCode] = useState('');

    // Registro con Supabase Auth
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            // Si está vacío, usa path relativo para que el proxy de Vercel maneje la ruta

            // Limpieza robusta: Quitar todas las barras finales y asegurar /api
            if (apiUrl) {
                apiUrl = apiUrl.replace(/\/+$/, '');
                if (!apiUrl.endsWith('/api')) {
                    apiUrl = `${apiUrl}/api`;
                }
            } else {
                apiUrl = '/api'; // Relative
            }
            const res = await fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al registrar');
            }

            // Si hay sesión activa (email ya confirmado), redirigir
            if (data.session?.accessToken) {
                handleLoginSuccess(data);
            } else {
                // Ir al paso de verificación
                setStep('verify');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            if (apiUrl) {
                apiUrl = apiUrl.replace(/\/+$/, '');
                if (!apiUrl.endsWith('/api')) {
                    apiUrl = `${apiUrl}/api`;
                }
            } else {
                apiUrl = '/api';
            }

            // 1. Verificar Código
            const resVerify = await fetch(`${apiUrl}/auth/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: verificationCode })
            });

            const dataVerify = await resVerify.json();

            if (!resVerify.ok) {
                throw new Error(dataVerify.error || 'Código inválido');
            }

            // 2. Si es válido, intentar Auto-Login con el password que tenemos en estado
            const resLogin = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const dataLogin = await resLogin.json();

            if (!resLogin.ok) {
                // Si falla el login automático, redirigir al login manual
                router.push(`/login?email=${encodeURIComponent(email)}&verified=true`);
                return;
            }

            handleLoginSuccess(dataLogin);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = (data: any) => {
        localStorage.setItem('token', data.token || data.session?.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        const role = data.user.role;
        if (role === 'super_admin' || role === 'owner' || role === 'admin') {
            window.location.href = `https://jerson-admin.vercel.app/login?email=${encodeURIComponent(email)}&auto=true`;
        } else {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center text-4xl font-black tracking-tighter text-red-600 mb-6">
                    Ura<span className="text-gray-800 text-lg font-normal ml-1 mt-auto mb-1">Market</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {step === 'register' ? 'Crea tu cuenta nueva' : 'Verifica tu cuenta'}
                </h2>
                {step === 'register' && (
                    <p className="mt-2 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
                            Inicia sesión aquí
                        </Link>
                    </p>
                )}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'register' ? (
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nombre completo
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Correo electrónico
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Contraseña
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
                                >
                                    {loading ? 'Enviando...' : 'Enviar código de verificación'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form className="space-y-6" onSubmit={handleVerify}>
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-600">
                                    Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
                                </p>
                            </div>

                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                                    Código de verificación
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="code"
                                        name="code"
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-2xl text-center tracking-widest"
                                        placeholder="000000"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
                                >
                                    {loading ? 'Verificando...' : 'Mi Cuenta'}
                                </button>
                            </div>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep('register')}
                                    className="text-sm text-gray-500 hover:text-gray-900 underline"
                                >
                                    Volver / Cambiar correo
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-6">
                        <p className="text-xs text-center text-gray-500">
                            Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
