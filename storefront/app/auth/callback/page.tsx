'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        // El email ya fue verificado por Supabase al hacer clic en el enlace.
        // Redirigimos al login.
        const timer = setTimeout(() => {
            router.push('/login?verified=true');
        }, 2500);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Correo Verificado!</h2>
                <p className="text-gray-600 mb-6">
                    Tu cuenta ha sido activada exitosamente.
                    <br />
                    Te estamos redirigiendo al inicio de sesión...
                </p>

                <div className="flex justify-center mb-6">
                    <svg className="animate-spin h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>

                <Link href="/login" className="text-sm text-red-600 hover:text-red-500 font-medium">
                    ¿No redirige? Haz clic aquí
                </Link>
            </div>
        </div>
    );
}
