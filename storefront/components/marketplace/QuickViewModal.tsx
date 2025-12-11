'use client';
import { useEffect } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    description?: string;
    category: string;
    storeName: string;
    storeUrl: string;
}

interface QuickViewModalProps {
    product: Product | null;
    onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 transition shadow-sm"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {/* Imagen */}
                <div className="w-full md:w-1/2 h-96 md:h-[600px] bg-gray-100 relative">
                    <img
                        src={product.image || 'https://via.placeholder.com/600'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Info */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto max-h-[600px]">
                    <div className="flex items-center space-x-2 text-sm text-purple-600 font-bold uppercase tracking-wider mb-2">
                        <span>{product.category}</span>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4 lh-tight">{product.name}</h2>

                    <div className="text-4xl font-bold text-gray-900 mb-6 font-mono">
                        ${product.price}
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {product.description || 'Sin descripción disponible para este producto exclusivo.'}
                    </p>

                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Vendido por</p>
                                    <p className="font-bold text-gray-900">{product.storeName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <Link
                                href={product.storeUrl}
                                className="flex-1 bg-gray-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Ver en Tienda
                            </Link>
                            <button className="flex-none w-14 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-red-400 hover:text-red-500 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
