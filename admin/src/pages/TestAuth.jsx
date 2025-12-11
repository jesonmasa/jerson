import React from 'react';
import { useAuthStore } from '../store/authStore';

const TestAuth = () => {
    const { token, user, logout } = useAuthStore();
    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test de Autenticación</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Estado de Autenticación</h2>
                
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium">Token:</h3>
                        <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                            {token ? `${token.substring(0, 20)}...` : 'No hay token'}
                        </pre>
                    </div>
                    
                    <div>
                        <h3 className="font-medium">Usuario:</h3>
                        <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                            {user ? JSON.stringify(user, null, 2) : 'No hay usuario'}
                        </pre>
                    </div>
                    
                    <div>
                        <h3 className="font-medium">Tipo de token:</h3>
                        <p>{token ? typeof token : 'undefined'}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-medium">Token válido (JWT):</h3>
                        <p>{token && typeof token === 'string' && token.split('.').length === 3 ? 'Sí' : 'No'}</p>
                    </div>
                    
                    <button 
                        onClick={logout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TestAuth;