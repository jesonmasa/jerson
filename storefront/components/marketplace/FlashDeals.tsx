'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    storeUrl: string;
    description?: string;
    discount?: number;
    storeName?: string;
}

interface FlashDealsProps {
    products: Product[];
}

export default function FlashDeals({ products }: FlashDealsProps) {
    const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number }>({ h: 12, m: 45, s: 30 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { h, m, s } = prev;
                if (s > 0) s--;
                else {
                    s = 59;
                    if (m > 0) m--;
                    else {
                        m = 59;
                        if (h > 0) h--;
                    }
                }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!products || products.length === 0) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-black text-gray-900 italic uppercase">Ofertas Relámpago</h2>
                    <div className="flex space-x-1 text-sm font-bold text-white">
                        <span className="bg-red-500 rounded px-2 py-1">{timeLeft.h.toString().padStart(2, '0')}</span>
                        <span className="text-gray-400 py-1">:</span>
                        <span className="bg-red-500 rounded px-2 py-1">{timeLeft.m.toString().padStart(2, '0')}</span>
                        <span className="text-gray-400 py-1">:</span>
                        <span className="bg-red-500 rounded px-2 py-1">{timeLeft.s.toString().padStart(2, '0')}</span>
                    </div>
                </div>
                <Link href="/search?filter=deals" className="text-sm font-bold text-red-500 hover:underline">
                    Ver todo
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {products.map(product => {
                    const discount = product.discount || 0;
                    // Assuming price is the final price, calculate original
                    const originalPrice = discount > 0
                        ? Math.round(product.price / (1 - discount / 100))
                        : product.price;

                    return (
                        <div key={product.id} className="group cursor-pointer">
                            <div className="relative aspect-square rounded-lg overflow-hidden mb-2">
                                <img
                                    src={product.image || 'https://via.placeholder.com/150'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-0 right-0 bg-yellow-400 text-red-600 text-xs font-bold px-2 py-1 rounded-bl-lg">
                                        -{discount}%
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <div className="font-bold text-red-600 text-lg leading-tight">
                                    ${product.price?.toLocaleString()}
                                </div>
                                {discount > 0 && (
                                    <div className="text-xs text-gray-400 line-through">
                                        ${originalPrice.toLocaleString()}
                                    </div>
                                )}
                                <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-red-500"
                                        style={{ width: `${Math.floor(Math.random() * 90) + 10}%` }}
                                    ></div>
                                </div>
                                <div className="text-[10px] text-gray-500 truncate">
                                    {product.storeName || 'Tienda Oficial'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
