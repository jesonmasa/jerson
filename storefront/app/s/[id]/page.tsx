'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description?: string;
    discount?: number;
    status: string;
}

export default function StorePage({ params }: { params: { id: string } }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [storeName, setStoreName] = useState(params.id);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStoreProducts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                // Usamos la ruta específica para obtener productos de una tienda
                const res = await fetch(`${apiUrl}/products/store/${params.id}`);

                if (!res.ok) {
                    if (res.status === 404) throw new Error('Tienda no encontrada');
                    throw new Error('Error al cargar la tienda');
                }

                const data = await res.json();
                setProducts(data);

                // Intentar obtener info extra de la tienda si es posible, o usar el ID formateado
                setStoreName(params.id.replace(/-/g, ' ').toUpperCase());

            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchStoreProducts();
        }
    }, [params.id]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <span className="text-6xl mb-4 block">🏪❌</span>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Tienda no encontrada</h1>
                    <p className="text-gray-500 mb-6">Lo sentimos, no pudimos encontrar la tienda "{params.id}". Es posible que no exista o haya sido desactivada.</p>
                    <Link href="/" className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md">
                        Volver al Mercado Principal
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header de la Tienda */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {storeName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                {storeName}
                            </h1>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                                Tienda Verificada
                            </p>
                        </div>
                    </div>
                    <Link href="/" className="text-sm text-red-600 hover:text-red-800 font-medium">
                        ← Ver otras tiendas
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Banner Promocional de la Tienda */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-900 h-48 mb-10 shadow-lg group">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?wb=1800&q=80"
                        alt="Store Banner"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <h2 className="text-white text-4xl font-extrabold tracking-tight drop-shadow-md">
                            Colección Exclusiva
                        </h2>
                        <p className="text-gray-200 mt-2 text-lg font-medium drop-shadow-md">
                            Los mejores productos seleccionados para ti
                        </p>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                        <span className="text-4xl mb-3 block">📦</span>
                        <h3 className="text-lg font-medium text-gray-900">Esta tienda aún no tiene productos.</h3>
                        <p className="text-gray-500">¡Vuelve pronto para ver sus novedades!</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Todos los productos ({products.length})</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image || 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Quick Add Button */}
                                        <button className="absolute bottom-4 right-4 bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-red-600 hover:text-white">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        </button>
                                    </div>
                                    <div className="p-4">
                                        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{product.category}</div>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 h-10 mb-2 group-hover:text-red-600 transition-colors">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-black text-gray-900">
                                                ${product.price}
                                            </p>
                                            {product.discount && (
                                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                                    -{product.discount}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
