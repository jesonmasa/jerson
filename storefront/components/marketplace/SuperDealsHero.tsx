'use client';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    discount?: number;
    storeName?: string;
    storeUrl?: string;
}

interface SuperDealsHeroProps {
    topDiscountProduct?: Product | null;
}

export default function SuperDealsHero({ topDiscountProduct }: SuperDealsHeroProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
            {/* Main Banner - 8 cols */}
            <div className="md:col-span-8 relative h-64 md:h-96 rounded-2xl overflow-hidden group cursor-pointer">
                {topDiscountProduct ? (
                    /* Mostrar producto con mayor descuento */
                    <Link href={topDiscountProduct.storeUrl || '#'} className="block w-full h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 to-orange-500/90"></div>
                        <div className="absolute inset-0">
                            <img 
                                src={topDiscountProduct.image || 'https://via.placeholder.com/800x400'} 
                                alt={topDiscountProduct.name}
                                className="w-full h-full object-cover opacity-30"
                            />
                        </div>

                        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 text-white">
                            {/* Contenido Izquierdo */}
                            <div className="flex-1">
                                <span className="bg-yellow-400 text-red-600 self-start px-4 py-2 rounded-full text-sm font-black mb-4 inline-block shadow-lg animate-pulse">
                                    🔥 SUPER DESCUENTO -{topDiscountProduct.discount || 0}% OFF
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black mb-3 leading-tight drop-shadow-2xl">
                                    {topDiscountProduct.name}
                                </h2>
                                <p className="text-lg md:text-2xl text-white/90 mb-4 max-w-md">
                                    ¡El precio más bajo del mercado! No te lo pierdas.
                                </p>
                                <div className="flex items-baseline gap-4 mb-6">
                                    <span className="text-4xl md:text-6xl font-black text-yellow-300">
                                        ${Math.round(topDiscountProduct.price * (1 - (topDiscountProduct.discount || 0) / 100)).toLocaleString()}
                                    </span>
                                    {topDiscountProduct.discount && topDiscountProduct.discount > 0 && (
                                        <span className="text-xl md:text-2xl line-through text-white/60">
                                            ${topDiscountProduct.price.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <button className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:bg-yellow-50 transition transform hover:-translate-y-1 hover:scale-105">
                                    Ver Oferta Ahora →
                                </button>
                            </div>

                            {/* Imagen del Producto (Derecha) */}
                            <div className="hidden md:block w-64 h-64 relative">
                                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl border-4 border-white/30 overflow-hidden">
                                    <img 
                                        src={topDiscountProduct.image || 'https://via.placeholder.com/256'} 
                                        alt={topDiscountProduct.name}
                                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-overlay opacity-50 blur-3xl group-hover:scale-110 transition duration-700"></div>
                    </Link>
                ) : (
                    /* Banner Genérico si no hay producto */
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500"></div>
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>

                        <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white">
                            <span className="bg-white/20 backdrop-blur-md self-start px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/30">
                                MEGA PROMOCIÓN
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                                Festival de <br />
                                <span className="text-yellow-300">Moda & Estilo</span>
                            </h2>
                            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md">
                                Hasta 80% OFF en marcas seleccionadas. Envío gratis en tu primera compra.
                            </p>
                            <button className="self-start bg-white text-red-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-50 transition transform hover:-translate-y-1">
                                Comprar Ahora
                            </button>
                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-overlay opacity-50 blur-3xl group-hover:scale-110 transition duration-700"></div>
                    </>
                )}
            </div>

            {/* Side Banners - 4 cols */}
            <div className="md:col-span-4 flex flex-col gap-4 h-64 md:h-96">
                {/* Top Side Banner */}
                <div className="flex-1 rounded-2xl bg-gray-900 relative overflow-hidden p-6 text-white group cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 opacity-90"></div>
                    <div className="relative z-10">
                        <div className="font-bold text-yellow-300 text-sm mb-1">NUEVO USUARIO</div>
                        <h3 className="text-2xl font-bold mb-2">Cupones de $50</h3>
                        <p className="text-xs text-white/80">Para pedidos superiores a $10</p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-tl-full"></div>
                </div>

                {/* Bottom Side Banner */}
                <div className="flex-1 rounded-2xl bg-gray-100 relative overflow-hidden p-6 group cursor-pointer border border-gray-200 hover:border-orange-300 transition">
                    <div className="relative z-10">
                        <div className="font-bold text-orange-500 text-sm mb-1">ENVÍO RÁPIDO</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Llega Mañana</h3>
                        <p className="text-xs text-gray-500">En productos seleccionados</p>
                    </div>
                    <div className="absolute right-4 bottom-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
