'use client';
import { useEffect, useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getMarketplaceProducts, getMarketplaceStores } from '../lib/api';
import FilterSidebar from '../components/marketplace/FilterSidebar';
import QuickViewModal from '../components/marketplace/QuickViewModal';
import FlashDeals from '../components/marketplace/FlashDeals';
import SuperDealsHero from '../components/marketplace/SuperDealsHero';
import UnifiedTheme from '../components/themes/UnifiedTheme';
import { themeConfigs } from '../lib/themeConfigs';

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    storeName: string;
    storeUrl: string;
    tenantId: string;
    description?: string;
    discount?: number; // Porcentaje de descuento
    // Simulated Ali-style fields
    soldCount?: number;
    rating?: number;
    freeShipping?: boolean;
}

function MarketplaceContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [flashDeals, setFlashDeals] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Check for Preview Mode
    const searchParams = useSearchParams();
    const previewThemeId = searchParams.get('preview');

    if (previewThemeId) {
        // Look up specific theme configuration
        const specificTheme = themeConfigs[previewThemeId];

        return (
            <UnifiedTheme
                config={{
                    storeName: specificTheme ? specificTheme.name : 'Vista Previa',
                    themeId: previewThemeId,
                    logoUrl: '',
                    bannerImage: '',
                    contactPhone: '',
                    contactEmail: '',
                    address: '',
                    socialLinks: {}
                }}
                colors={specificTheme}
                themeName={specificTheme?.name}
            />
        );
    }

    // Filters State
    const [activeFilters, setActiveFilters] = useState({
        category: '',
        minPrice: 0,
        maxPrice: 10000
    });

    // UX State
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadProducts();

        // Load Wishlist
        const savedWishlist = localStorage.getItem('marketplace_wishlist');
        if (savedWishlist) {
            setWishlist(new Set(JSON.parse(savedWishlist)));
        }
    }, []);

    const loadProducts = (search?: string) => {
        setLoading(true);

        const isStoreMode = process.env.NEXT_PUBLIC_APP_MODE === 'stores';

        // Parallel fetching
        Promise.all([
            getMarketplaceProducts({ search }),
            // Only fetch flash deals if not searching and not in store viewer mode (optional optimization)
            !search ? import('../lib/api').then(({ getFlashDeals }) => getFlashDeals()) : Promise.resolve([])
        ])
            .then(([data, dealsData]) => {
                // Enrich general products
                const enriched = (data as Product[]).map(p => {
                    let finalStoreUrl = p.storeUrl;
                    if (!isStoreMode && (p.storeUrl.startsWith('/') || !p.storeUrl.startsWith('http'))) {
                        const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || '';
                        finalStoreUrl = `${baseUrl}${p.storeUrl.startsWith('/') ? '' : '/'}${p.storeUrl}`;
                    }

                    return {
                        ...p,
                        storeUrl: finalStoreUrl,
                        soldCount: p.soldCount || Math.floor(Math.random() * 5000) + 10,
                        rating: p.rating || (4 + Math.random()),
                        freeShipping: p.freeShipping ?? (Math.random() > 0.3)
                    };
                });

                // Enrich Flash Deals (ensure storeUrl is correct too)
                const enrichedDeals = (dealsData as Product[]).map(p => {
                    let finalStoreUrl = p.storeUrl;
                    if (!isStoreMode && (p.storeUrl.startsWith('/') || !p.storeUrl.startsWith('http'))) {
                        const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || '';
                        finalStoreUrl = `${baseUrl}${p.storeUrl.startsWith('/') ? '' : '/'}${p.storeUrl}`;
                    }
                    return { ...p, storeUrl: finalStoreUrl };
                });

                setProducts(enriched.sort(() => Math.random() - 0.5));
                setFlashDeals(enrichedDeals);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading marketplace:", err);
                setLoading(false);
            });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadProducts(searchTerm);
    };

    const toggleWishlist = (productId: string) => {
        const newWishlist = new Set(wishlist);
        if (newWishlist.has(productId)) {
            newWishlist.delete(productId);
        } else {
            newWishlist.add(productId);
        }
        setWishlist(newWishlist);
        localStorage.setItem('marketplace_wishlist', JSON.stringify(Array.from(newWishlist)));
    };

    // Derived State: Filtered Products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = activeFilters.category ? product.category === activeFilters.category : true;
            const matchesPrice = product.price >= activeFilters.minPrice && product.price <= activeFilters.maxPrice;
            return matchesCategory && matchesPrice;
        });
    }, [products, activeFilters]);

    // Extract unique categories for sidebar
    const categories = useMemo(() => {
        return Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    }, [products]);

    // Get product with highest discount for super hero banner
    const topDiscountProduct = useMemo(() => {
        const productsWithDiscount = products.filter(p => p.discount && p.discount > 0);
        if (productsWithDiscount.length === 0) return null;
        return productsWithDiscount.reduce((max, p) =>
            (p.discount || 0) > (max.discount || 0) ? p : max
        );
    }, [products]);

    // MODE CHECK: Store Viewer (Port 3002)
    const isStoreViewer = process.env.NEXT_PUBLIC_APP_MODE === 'stores';
    const [stores, setStores] = useState<any[]>([]);

    useEffect(() => {
        if (isStoreViewer) {
            import('../lib/api').then(({ getMarketplaceStores }) => {
                getMarketplaceStores().then(setStores).catch(console.error);
            });
        }
    }, [isStoreViewer]);

    if (isStoreViewer) {
        return (
            <div className="min-h-screen bg-gray-50 font-sans">
                <div className="bg-white shadow-sm border-b p-4">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                            <span>🏪</span> Visualizador de Tiendas
                        </h1>
                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full border">
                            Puerto: 3002
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto p-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido al Modo Tienda</h2>
                        <p className="text-gray-500 max-w-lg mx-auto">
                            Este puerto está dedicado exclusivamente para navegar y previsualizar las tiendas individuales creadas en la plataforma.
                        </p>
                    </div>

                    {loading && stores.length === 0 ? (
                        <div className="text-center py-12">Cargando tiendas disponibles...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stores.map((store) => (
                                <Link
                                    key={store.id}
                                    href={store.url}
                                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all group"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                                            {store.logo ? (
                                                <img src={store.logo} alt={store.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <span className="text-2xl">🛍️</span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{store.name}</h3>
                                            <p className="text-xs text-gray-500">ID: {store.id.substring(0, 8)}...</p>
                                            <p className="text-xs text-indigo-500 mt-1">{store.productCount} productos</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mt-4 pt-4 border-t border-gray-50">
                                        <span className="text-gray-500">Ver tienda completa</span>
                                        <span className="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </Link>
                            ))}

                            {stores.length === 0 && (
                                <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                    <p className="text-gray-400">No se encontraron tiendas publicadas aún.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-20">
            <QuickViewModal
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />

            {/* Header Marketplace (Ali-Style) */}
            <header className="bg-white sticky top-0 z-[40] border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-4 py-3">
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <Link href="/" className="text-3xl font-black tracking-tighter text-red-600 flex-shrink-0">
                            Ura<span className="text-gray-800 text-sm font-normal ml-1">Market</span>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex-1 max-w-3xl flex items-center relative">
                            <input
                                type="text"
                                placeholder="Busca productos, marcas y más..."
                                className="w-full h-10 px-4 pr-12 rounded-sm border-2 border-red-600 focus:outline-none focus:ring-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="submit" className="absolute right-0 top-0 h-10 w-12 bg-red-600 flex items-center justify-center text-white rounded-r-sm hover:bg-red-700 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>

                        {/* User Actions */}
                        <div className="flex items-center space-x-6 text-xs text-gray-600">
                            <button className="flex flex-col items-center hover:text-red-600 relative">
                                <svg className="w-6 h-6 mb-0.5" fill={wishlist.size > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                <span>Lista de Deseos</span>
                                {wishlist.size > 0 && <span className="absolute -top-1 right-2 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">{wishlist.size}</span>}
                            </button>

                            <div className="flex flex-col items-center hover:text-red-600 cursor-pointer">
                                <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                <span>Mi Cuenta</span>
                            </div>

                            {/* Botón de Carrito (Simulado) */}
                            <button className="flex flex-col items-center hover:text-red-600">
                                <svg className="w-6 h-6 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span>Cesta</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] mx-auto px-4 py-6">

                {/* HERO AREA (Super Deals) */}
                <SuperDealsHero topDiscountProduct={topDiscountProduct} />

                {/* FLASH DEALS ROW */}
                <FlashDeals products={flashDeals} />

                <div className="flex flex-col md:flex-row gap-6">

                    {/* Sidebar Filters */}
                    <div className="hidden md:block w-60 flex-shrink-0">
                        <FilterSidebar
                            categories={categories}
                            onFilterChange={setActiveFilters}
                        />
                    </div>

                    {/* Main Feed */}
                    <main className="flex-1">
                        {/* Quick Categories Mobile */}
                        <div className="md:hidden flex overflow-x-auto pb-4 mb-4 gap-2 scrollbar-hide">
                            {categories.map(cat => (
                                <button key={cat} className="px-3 py-1 bg-white rounded-full shadow-sm whitespace-nowrap text-xs font-medium border border-gray-200">
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                    <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
                                ))}
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl">
                                <p className="text-gray-500">No se encontraron productos.</p>
                            </div>
                        ) : (
                            /* ALI-EXPRESS DENSE GRID */
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Más para amar</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                    {filteredProducts.map((product) => (
                                        <div key={product.id} className="group bg-white rounded-lg hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-transparent hover:border-gray-200 cursor-pointer" onClick={() => setQuickViewProduct(product)}>

                                            {/* Image */}
                                            <div className="relative aspect-square">
                                                <img
                                                    src={product.image || 'https://via.placeholder.com/200'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Wishlist Button Overlay */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                                    className={`absolute bottom-2 right-2 p-1.5 rounded-full bg-white/90 shadow transition hover:scale-110 opacity-0 group-hover:opacity-100 ${wishlist.has(product.id) ? 'text-red-500 opacity-100' : 'text-gray-400 hover:text-red-500'}`}
                                                >
                                                    <svg className="w-4 h-4" fill={wishlist.has(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                                </button>
                                            </div>

                                            {/* Compact Info */}
                                            <div className="p-3">
                                                <h3 className="text-xs text-gray-700 line-clamp-2 min-h-[2.5em] leading-snug mb-2 group-hover:text-red-500 group-hover:underline">
                                                    {product.name}
                                                </h3>

                                                <div className="flex items-baseline gap-1 mb-1">
                                                    <span className="text-sm font-black text-gray-900">US ${product.price}</span>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1 mb-1.5">
                                                    {product.freeShipping && (
                                                        <span className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded">Envío Gratis</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-[10px] text-gray-500">
                                                    <div className="flex items-center">
                                                        <svg className="w-3 h-3 text-yellow-500 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                        <span>{product.rating?.toFixed(1) || '4.8'}</span>
                                                    </div>
                                                    <span>{product.soldCount} vendidos</span>
                                                </div>

                                                <div className="mt-2 pt-2 border-t border-gray-100">
                                                    <Link href={product.storeUrl} onClick={(e) => e.stopPropagation()} className="text-[10px] text-gray-400 hover:text-gray-700 truncate flex items-center gap-1">
                                                        <span>{product.storeName}</span>
                                                        {/* Badge de Verificación */}
                                                        <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function MarketplaceHome() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <MarketplaceContent />
        </Suspense>
    );
}

