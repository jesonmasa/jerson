'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form Data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                localStorage.setItem('token', data.session.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                const role = data.user.role;
                if (role === 'super_admin' || role === 'owner' || role === 'admin') {
                    window.location.href = `https://jerson-admin.vercel.app/login?email=${encodeURIComponent(email)}&auto=true`;
                } else {
                    router.push('/');
                }
            } else {
                // Mostrar mensaje de verificación
                setSuccess(true);
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Pantalla de éxito (verificar email)
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link href="/" className="flex justify-center text-4xl font-black tracking-tighter text-red-600 mb-6">
                        Ura<span className="text-gray-800 text-lg font-normal ml-1 mt-auto mb-1">Market</span>
                    </Link>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Revisa tu correo!</h2>
                        <p className="text-gray-600 mb-4">
                            Hemos enviado un enlace de verificación a:
                        </p>
                        <p className="font-semibold text-gray-900 mb-6">{email}</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Haz clic en el enlace del correo para activar tu cuenta.
                        </p>
                        <p className="text-xs text-gray-400">
                            ¿No lo ves? Revisa tu carpeta de spam.
                        </p>
                        <div className="mt-6">
                            <Link href="/login" className="text-red-600 hover:text-red-500 font-medium">
                                Ir a iniciar sesión
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center text-4xl font-black tracking-tighter text-red-600 mb-6">
                    Ura<span className="text-gray-800 text-lg font-normal ml-1 mt-auto mb-1">Market</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Crea tu cuenta nueva
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link href="/login" className="font-medium text-red-600 hover:text-red-500">
                        Inicia sesión aquí
                    </Link>
                </p>
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
                                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                            </button>
                        </div>
                    </form>

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
