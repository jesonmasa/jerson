'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface UnifiedThemeProps {
    config: any;
    colors?: { primary: string; secondary: string };
    themeName?: string;
    initialProducts?: any[]; // Products passed from parent
    initialCategories?: any[];
    layoutVariant?: number;
}

export default function UnifiedTheme({ config, colors, themeName, initialProducts = [], initialCategories = [], layoutVariant }: UnifiedThemeProps) {
    const [products, setProducts] = useState<any[]>(initialProducts);
    const [categories, setCategories] = useState<any[]>(initialCategories);
    const [selectedCategory, setSelectedCategory] = useState<string>('all'); // 'all' or category ID/Name
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [cartItems, setCartItems] = useState<any[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter products based on selection
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory === 'all' || (p.category || 'General').toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Model State
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Carousel State
    const spinnerRef = useRef<HTMLDivElement>(null);
    const rotationRef = useRef(0);
    const isHovering = useRef(false);
    const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

    // Helpers
    // Fallback colors if none provided
    const themeColors = colors || { primary: '#ec4899', secondary: '#f97316' };

    // Currency Format
    // Currency Format
    const formatPrice = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

    // Image Optimization Helper
    const optimizeImage = (url: string) => {
        if (!url) return '';
        if (url.includes('cloudinary.com') && !url.includes('f_auto')) {
            // Inject f_auto,q_auto for automatic format (WebP) and quality optimization
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    };

    // Filter offers for carousel
    const offers = products.filter(p => p.discount > 0).sort((a: any, b: any) => b.discount - a.discount);
    let carouselItems = [...offers];
    if (carouselItems.length === 0 && products.length > 0) {
        // Fallback: if no offers, show random products in carousel
        carouselItems = products.slice(0, 12);
    }
    while (carouselItems.length < 12 && carouselItems.length > 0) { carouselItems = [...carouselItems, ...carouselItems]; }
    carouselItems = carouselItems.slice(0, 12);

    useEffect(() => {
        // Only load cart from local storage, NO FETCHING HERE
        try {
            const saved = localStorage.getItem('cart');
            if (saved) setCartItems(JSON.parse(saved));
        } catch (e) { }

        // Update products if props change
        if (initialProducts) {
            setProducts(initialProducts);
        }
        if (initialCategories) {
            setCategories(initialCategories);
        }
    }, [initialProducts, initialCategories]);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cartItems)); }, [cartItems]);

    // Carousel Animation Loop - Mejorado con velocidad más suave
    useEffect(() => {
        if (carouselItems.length === 0) return;
        let reqId: number;
        const loop = () => {
            if (!isHovering.current && spinnerRef.current) {
                rotationRef.current -= 0.08; // Velocidad reducida para experiencia más suave
                spinnerRef.current.style.transform = `rotateX(-8deg) rotateY(${rotationRef.current}deg)`; // Ángulo mejorado
            }
            reqId = requestAnimationFrame(loop);
        };
        loop();
        return () => cancelAnimationFrame(reqId);
    }, [carouselItems.length]);

    // Rotación manual del carrusel
    const rotateCarousel = (direction: 'left' | 'right') => {
        const anglePerItem = 360 / carouselItems.length;
        if (direction === 'left') {
            rotationRef.current += anglePerItem;
            setCurrentCarouselIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
        } else {
            rotationRef.current -= anglePerItem;
            setCurrentCarouselIndex((prev) => (prev + 1) % carouselItems.length);
        }
    };

    const addToCart = (p: any) => {
        setCartItems(prev => {
            const ex = prev.find(i => i.id === p.id);
            return ex ? prev.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...prev, { ...p, quantity: 1 }];
        });
        setCartOpen(true);
    };

    const updateQty = (idx: number, d: number) => {
        setCartItems(prev => {
            const nue = [...prev];
            nue[idx].quantity += d;
            if (nue[idx].quantity <= 0) nue.splice(idx, 1);
            return nue;
        });
    };

    const removeItem = (idx: number) => setCartItems(prev => prev.filter((_, i) => i !== idx));

    // Open Product Modal
    const openModal = (product: any) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const cartTotal = cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

    const sendWhatsApp = () => {
        if (cartItems.length === 0) return alert('Vacío');
        const msg = '🛒 *Pedido*\n\n' + cartItems.map(i => `• ${i.name} x${i.quantity}`).join('\n') + '\n💰 *' + formatPrice(cartTotal) + '*';
        window.open(`https://wa.me/${(config?.contactPhone || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    if (loading) return <div className="h-screen flex items-center justify-center text-xl">Cargando...</div>;

    return (
        <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gray-50 text-gray-800 font-sans">
            {/* Header omitted for brevity, assuming existing structure */}
            {/* ... */}

            {/* 1. NAV / HEADER */}
            <header className="sticky top-0 z-50 shadow-sm bg-white border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3">
                        {config?.logoUrl ? (
                            <img src={optimizeImage(config.logoUrl)} alt={config?.storeName} className="h-10 w-auto object-contain" />
                        ) : (
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl shadow-lg"
                                style={{ background: `linear-gradient(135deg, ${themeColors.primary}, ${themeColors.secondary})` }}>
                                {config?.storeName?.charAt(0) || 'T'}
                            </div>
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-xl tracking-tight text-gray-900 block leading-tight">{config?.storeName || 'Mi Tienda'}</span>
                                {/* Badge de Verificación */}
                                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {/* Debug / Verification Badge */}
                            {themeName && (
                                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded text-white"
                                    style={{ backgroundColor: themeColors.primary, opacity: 0.8 }}>
                                    {themeName}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-8 font-medium text-gray-600">
                        {['Inicio', 'Sobre Nosotros', 'Productos', 'Contacto'].map(item => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(' ', '-')}`}
                                className="transition duration-200 hover:opacity-80"
                                onMouseEnter={(e) => e.currentTarget.style.color = themeColors.primary}
                                onMouseLeave={(e) => e.currentTarget.style.color = ''}
                            >
                                {item}
                            </a>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-2xl text-gray-600">☰</button>
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition text-gray-700"
                        >
                            🛒
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white"
                                    style={{ backgroundColor: themeColors.secondary }}>
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 flex flex-col gap-4 shadow-lg">
                        {['Inicio', 'Sobre Nosotros', 'Productos', 'Contacto'].map(item => (
                            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} onClick={() => setMobileMenuOpen(false)} className="text-gray-600 font-medium">{item}</a>
                        ))}
                    </div>
                )}
            </header>

            {/* 2. BANNER / HERO */}
            <section id="inicio" className="relative h-[50vh] min-h-[400px] max-h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {config?.bannerImage ? (
                        <img src={optimizeImage(config.bannerImage)} className="w-full h-full object-cover" alt="Banner" />
                    ) : (
                        <div className="w-full h-full"
                            style={{ background: `linear-gradient(to right, ${themeColors.primary}, ${themeColors.secondary})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">{config?.storeName || 'Bienvenidos'}</h1>
                    <p className="text-xl md:text-2xl font-light opacity-90 mb-8">La mejor selección de productos para ti</p>
                    <a href="#productos" className="inline-block bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:transform hover:scale-105 transition duration-300">
                        Ver Colección
                    </a>
                </div>
            </section>

            {/* 3. 3D CAROUSEL SECTION */}
            {carouselItems.length > 0 && (
                <section className="relative bg-white pt-20 pb-32 overflow-hidden">
                    <div className="container mx-auto px-4 mb-16 text-center">
                        <span className="font-bold tracking-wider uppercase text-sm" style={{ color: themeColors.primary }}>Destacados</span>
                        <h2 className="text-4xl font-bold text-gray-900 mt-2">Ofertas Flash</h2>
                    </div>

                    {/* Carousel Container - reserved height for 3D extrusion */}
                    <div className="relative h-[380px] w-full flex justify-center perspective-container" style={{ perspective: '1200px' }}>

                        <button
                            onClick={() => rotateCarousel('left')}
                            className="absolute left-4 md:left-20 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white shadow-2xl hover:shadow-xl text-gray-800 flex items-center justify-center text-2xl transition-all duration-200 cursor-pointer hover:scale-110"
                        >
                            ❮
                        </button>

                        <div
                            ref={spinnerRef}
                            className="relative w-[180px] h-[260px] transform-style-3d transition-transform duration-300 ease-out" // Transición suave añadida
                            style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-8deg)' }}
                            onMouseEnter={() => isHovering.current = true}
                            onMouseLeave={() => isHovering.current = false}
                        >
                            {carouselItems.map((p, i) => {
                                const angle = i * 30; // 12 items * 30 = 360
                                return (
                                    <div
                                        key={`${p.id}-${i}`}
                                        className="absolute top-0 left-0 w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-3xl"
                                        style={{
                                            transform: `rotateY(${angle}deg) translateZ(380px)`, // Radius aumentado para mejor visibilidad
                                            backfaceVisibility: 'hidden',
                                            WebkitBackfaceVisibility: 'hidden'
                                        }}
                                    >
                                        <div className="h-[160px] overflow-hidden bg-gray-100 relative group">
                                            <img src={optimizeImage(p.image) || 'https://via.placeholder.com/220'} className="w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                            {p.discount > 0 && (
                                                <span className="absolute top-2 right-2 text-white text-xs font-bold px-2 py-1 rounded shadow-sm"
                                                    style={{ backgroundColor: themeColors.secondary }}>
                                                    -{p.discount}%
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-between text-center">
                                            <div>
                                                <h3 className="font-bold text-gray-800 text-sm truncate mb-1">{p.name}</h3>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="font-bold" style={{ color: themeColors.primary }}>{formatPrice(p.price * (1 - p.discount / 100))}</span>
                                                    {p.discount > 0 && <span className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3 text-xs font-bold">
                                                <button onClick={() => openModal(p)} className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition">Ver</button>
                                                <button
                                                    onClick={() => addToCart(p)}
                                                    className="flex-1 py-2 text-white rounded-lg transition hover:opacity-90"
                                                    style={{ backgroundColor: themeColors.primary }}
                                                >
                                                    Agregar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => rotateCarousel('right')}
                            className="absolute right-4 md:right-20 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-white shadow-2xl hover:shadow-xl text-gray-800 flex items-center justify-center text-2xl transition-all duration-200 cursor-pointer hover:scale-110"
                        >
                            ❯
                        </button>
                    </div>

                    {/* Thumbnails Navigation (Nuevo) */}
                    <div className="flex justify-center mt-8 gap-2 flex-wrap max-w-4xl mx-auto">
                        {carouselItems.slice(0, 6).map((item, idx) => (
                            <button
                                key={`thumb-${idx}`}
                                onClick={() => {
                                    const anglePerItem = 360 / carouselItems.length;
                                    rotationRef.current = -idx * anglePerItem;
                                    setCurrentCarouselIndex(idx);
                                }}
                                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    currentCarouselIndex === idx ? 'border-blue-500 ring-2 ring-blue-200 scale-110' : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <img src={optimizeImage(item.image)} className="w-full h-full object-cover" alt={item.name} />
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* 4. PRODUCTS GRID */}
            <section id="productos" className="py-16 md:py-24 bg-gray-100 relative z-20">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestra Colección</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Explora nuestro catálogo completo con las mejores ofertas y la más alta calidad.</p>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="max-w-md mx-auto mb-10 relative">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-4 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-lg"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            🔍
                        </button>
                    </div>

                    {/* CATEGORY FILTERS */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-6 py-2 rounded-full font-medium transition duration-200 ${selectedCategory === 'all'
                                    ? 'text-white shadow-lg transform scale-105'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                style={selectedCategory === 'all' ? { backgroundColor: themeColors.primary } : {}}
                            >
                                Todos
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id || cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-6 py-2 rounded-full font-medium transition duration-200 ${selectedCategory === cat.name
                                        ? 'text-white shadow-lg transform scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    style={selectedCategory === cat.name ? { backgroundColor: themeColors.primary } : {}}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Conditional Product Grid Rendering */}
                    {(() => {
                        switch (layoutVariant) {
                            case 1:
                            case 2:
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                        {filteredProducts.map(p => (
                                            <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group border border-gray-100">
                                                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-gray-100">
                                                    <img src={optimizeImage(p.image) || 'https://via.placeholder.com/400'} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                                    {p.discount > 0 && (
                                                        <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                                            style={{ backgroundColor: themeColors.secondary }}>
                                                            Oferta
                                                        </div>
                                                    )}
                                                    {/* Quick Add Overlay */}
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                                        <button onClick={() => addToCart(p)} className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                                            Añadir Rapido
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="text-sm text-gray-400 mb-1 uppercase tracking-wider font-semibold">{p.brand || 'General'}</div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{p.name}</h3>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="text-xl font-bold" style={{ color: themeColors.primary }}>{formatPrice(p.price * (1 - (p.discount || 0) / 100))}</span>
                                                        {p.discount > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(p.price)}</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => openModal(p)}
                                                        className="w-full py-3 rounded-xl border-2 font-bold transition hover:text-white"
                                                        style={{
                                                            borderColor: themeColors.primary,
                                                            color: themeColors.primary
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = themeColors.primary;
                                                            e.currentTarget.style.color = 'white';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                            e.currentTarget.style.color = themeColors.primary;
                                                        }}
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            case 3:
                            case 4:
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {filteredProducts.map(p => (
                                            <div key={p.id} className="flex flex-col md:flex-row bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden">
                                                <div className="relative w-full md:w-1/3 h-48 md:h-auto overflow-hidden bg-gray-100">
                                                    <img src={optimizeImage(p.image) || 'https://via.placeholder.com/400'} className="w-full h-full object-cover transition duration-700 hover:scale-105" />
                                                    {p.discount > 0 && (
                                                        <div className="absolute top-3 left-3 text-white px-2 py-1 rounded-full text-xs font-bold uppercase"
                                                            style={{ backgroundColor: themeColors.secondary }}>
                                                            -{p.discount}%
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 p-6 flex flex-col justify-between">
                                                    <div>
                                                        <div className="text-sm text-gray-400 mb-1 uppercase tracking-wider font-semibold">{p.brand || 'General'}</div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{p.name}</h3>
                                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{p.description || 'Sin descripción disponible.'}</p>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="text-2xl font-bold" style={{ color: themeColors.primary }}>{formatPrice(p.price * (1 - (p.discount || 0) / 100))}</span>
                                                            {p.discount > 0 && <span className="text-base text-gray-400 line-through">{formatPrice(p.price)}</span>}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => openModal(p)}
                                                            className="flex-1 py-3 rounded-xl border-2 font-bold transition hover:text-white"
                                                            style={{
                                                                borderColor: themeColors.primary,
                                                                color: themeColors.primary
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = themeColors.primary;
                                                                e.currentTarget.style.color = 'white';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                                e.currentTarget.style.color = themeColors.primary;
                                                            }}
                                                        >
                                                            Ver
                                                        </button>
                                                        <button
                                                            onClick={() => addToCart(p)}
                                                            className="flex-1 py-3 rounded-xl font-bold text-white transition hover:opacity-90"
                                                            style={{ backgroundColor: themeColors.primary }}
                                                        >
                                                            Añadir
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            default:
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                                        {filteredProducts.map(p => (
                                            <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden group border border-gray-100">
                                                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden bg-gray-100">
                                                    <img src={optimizeImage(p.image) || 'https://via.placeholder.com/400'} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
                                                    {p.discount > 0 && (
                                                        <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                                            style={{ backgroundColor: themeColors.secondary }}>
                                                            Oferta
                                                        </div>
                                                    )}
                                                    {/* Quick Add Overlay */}
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                                                        <button onClick={() => addToCart(p)} className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                                            Añadir Rapido
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="text-sm text-gray-400 mb-1 uppercase tracking-wider font-semibold">{p.brand || 'General'}</div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{p.name}</h3>
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <span className="text-xl font-bold" style={{ color: themeColors.primary }}>{formatPrice(p.price * (1 - (p.discount || 0) / 100))}</span>
                                                        {p.discount > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(p.price)}</span>}
                                                    </div>
                                                    <button
                                                        onClick={() => openModal(p)}
                                                        className="w-full py-3 rounded-xl border-2 font-bold transition hover:text-white"
                                                        style={{
                                                            borderColor: themeColors.primary,
                                                            color: themeColors.primary
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = themeColors.primary;
                                                            e.currentTarget.style.color = 'white';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = 'transparent';
                                                            e.currentTarget.style.color = themeColors.primary;
                                                        }}
                                                    >
                                                        Ver Detalles
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                        );
                    case 7:
                                case 8:
                                    return (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                            {/* Product card layout: Image left, name/price/button right */}
                                            {filteredProducts.map((product) => (
                                                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                                                    <div className="w-1/3 h-auto overflow-hidden relative">
                                                        <img src={optimizeImage(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                                        {product.discount > 0 && (
                                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{product.discount}%</span>
                                                        )}
                                                    </div>
                                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{product.name}</h3>
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="font-bold text-xl" style={{ color: themeColors.primary }}>{formatPrice(product.price * (1 - product.discount / 100))}</span>
                                                                {product.discount > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => addToCart(product)}
                                                            className="mt-auto p-2 rounded-full text-white transition duration-300 hover:opacity-90 self-start"
                                                            style={{ backgroundColor: themeColors.secondary }}
                                                            aria-label="Add to cart"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.5 14 6.35 14H15a1 1 0 000-2H6.35c-.334 0-.6-.266-.6-.598l.002-.01.89-.89L11.4 7H15a1 1 0 100-2H7.071L6.22 1.556 5.825 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" /></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                case 9:
                                case 10:
                                    return (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                                            {/* Product card layout: Image top, left-aligned name/description/price, full-width button */}
                                            {filteredProducts.map((product) => (
                                                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                                                    <div className="h-56 w-full overflow-hidden relative">
                                                        <img src={optimizeImage(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                                        {product.discount > 0 && (
                                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{product.discount}%</span>
                                                        )}
                                                    </div>
                                                    <div className="p-5 flex-1 flex flex-col">
                                                        <h3 className="font-bold text-gray-800 text-lg mb-1">{product.name}</h3>
                                                        <p className="text-gray-500 text-sm mb-3 flex-1">{product.description?.substring(0, 70)}...</p>
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="font-bold text-xl" style={{ color: themeColors.primary }}>{formatPrice(product.price * (1 - product.discount / 100))}</span>
                                                            {product.discount > 0 && <span className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</span>}
                                                        </div>
                                                        <button
                                                            onClick={() => addToCart(product)}
                                                            className="w-full py-3 rounded-xl text-white font-bold transition duration-300 hover:opacity-90"
                                                            style={{ backgroundColor: themeColors.secondary }}
                                                        >
                                                            Añadir al Carrito
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                }
            })()}
                </div>
            </section>

            {/* 6. ABOUT US SECTION */}
            {config?.aboutText && (
                <section id="sobre-nosotros" className="py-16 md:py-24 bg-white relative">
                    <div className="container mx-auto px-6 max-w-4xl text-center">
                        <span className="font-bold tracking-wider uppercase text-sm mb-2 block" style={{ color: themeColors.primary }}>Nuestra Historia</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Sobre Nosotros</h2>
                        <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed whitespace-pre-line">
                            {config.aboutText}
                        </div>
                    </div>
                </section>
            )}

            {/* 7. CONTACT SECTION */}
            <section id="contacto" className="py-16 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Contáctanos</h2>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {config?.contactEmail && (
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <span className="text-4xl mb-4 block">📧</span>
                                <h3 className="font-bold text-lg mb-2">Email</h3>
                                <a href={`mailto:${config.contactEmail}`} className="text-gray-600 hover:text-blue-600">{config.contactEmail}</a>
                            </div>
                        )}
                        {config?.contactPhone && (
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <span className="text-4xl mb-4 block">📱</span>
                                <h3 className="font-bold text-lg mb-2">Teléfono / WhatsApp</h3>
                                <a href={`https://wa.me/${config.contactPhone.replace(/\D/g, '')}`} target="_blank" className="text-gray-600 hover:text-green-600">{config.contactPhone}</a>
                            </div>
                        )}
                    </div>

                    {config?.contactText && (
                        <div className="prose prose-lg mx-auto text-gray-600 mb-8 whitespace-pre-line">
                            {config.contactText}
                        </div>
                    )}

                    {config?.socialLinks && Object.values(config.socialLinks).some(v => v) && (
                        <div className="flex justify-center gap-6 mt-8">
                            {config.socialLinks.facebook && (
                                <a href={config.socialLinks.facebook} target="_blank" className="bg-blue-600 text-white p-3 rounded-full hover:opacity-90 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                            )}
                            {config.socialLinks.instagram && (
                                <a href={config.socialLinks.instagram} target="_blank" className="bg-pink-600 text-white p-3 rounded-full hover:opacity-90 transition">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.204-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.689-.072 4.948-.072zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* SHIPPING POLICIES SECTION */}
            {config?.shippingPoliciesText && (
                <section id="politicas-envio" className="py-16 md:py-24 bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-12">
                            <span className="font-bold tracking-wider uppercase text-sm mb-2 block" style={{ color: themeColors.primary }}>Envíos</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Políticas de Envío</h2>
                        </div>
                        <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed whitespace-pre-line bg-white p-8 rounded-xl shadow-sm">
                            {config.shippingPoliciesText}
                        </div>
                    </div>
                </section>
            )}

            {/* RETURN POLICIES SECTION */}
            {config?.returnPoliciesText && (
                <section id="politicas-devolucion" className="py-16 md:py-24 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-12">
                            <span className="font-bold tracking-wider uppercase text-sm mb-2 block" style={{ color: themeColors.primary }}>Devoluciones</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Políticas de Devolución</h2>
                        </div>
                        <div className="prose prose-lg mx-auto text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 p-8 rounded-xl shadow-sm">
                            {config.returnPoliciesText}
                        </div>
                    </div>
                </section>
            )}

            {/* TERMS AND CONDITIONS SECTION */}
            {config?.termsText && (
                <section id="terminos-condiciones" className="py-16 md:py-24 bg-gray-900 text-white">
                    <div className="container mx-auto px-6 max-w-4xl">
                        <div className="text-center mb-12">
                            <span className="font-bold tracking-wider uppercase text-sm mb-2 block" style={{ color: themeColors.primary }}>Legal</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Términos y Condiciones</h2>
                        </div>
                        <div className="prose prose-lg prose-invert mx-auto text-gray-300 leading-relaxed whitespace-pre-line bg-black/20 p-8 rounded-xl shadow-sm">
                            {config.termsText}
                        </div>
                    </div>
                </section>
            )}

            {/* 8. POLICIES */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-8 mb-8" id="politicas">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">{config?.storeName || 'Mi Tienda'}</h3>
                            <p className="text-sm opacity-80 max-w-sm">
                                {config?.footerText || 'Tu tienda de confianza con los mejores productos y ofertas.'}
                            </p>
                        </div>
                        <div>
                                <h3 className="text-white font-bold text-lg mb-4">Políticas</h3>
                                {config?.policiesText && (
                                    <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed mb-4">
                                        {config.policiesText}
                                    </p>
                                )}
                                {config?.shippingPoliciesText && (
                                    <div className="mt-4">
                                        <h4 className="text-gray-300 font-bold text-md mb-2">Políticas de Envío</h4>
                                        <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed">
                                            {config.shippingPoliciesText}
                                        </p>
                                    </div>
                                )}
                                {config?.returnPoliciesText && (
                                    <div className="mt-4">
                                        <h4 className="text-gray-300 font-bold text-md mb-2">Políticas de Devolución</h4>
                                        <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed">
                                            {config.returnPoliciesText}
                                        </p>
                                    </div>
                                )}
                                {config?.termsText && (
                                    <div className="mt-4">
                                        <h4 className="text-gray-300 font-bold text-md mb-2">Términos y Condiciones</h4>
                                        <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed">
                                            {config.termsText}
                                        </p>
                                    </div>
                                )}
                            </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        &copy; {new Date().getFullYear()} {config?.storeName}. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
            {cartOpen && (
                <div className="fixed inset-0 z-[100]">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)}></div>
                    <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Tu Cesta ({cartCount})</h2>
                            <button onClick={() => setCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="text-center py-20 text-gray-400">
                                    <div className="text-6xl mb-4">🛍️</div>
                                    <p>Tu carrito está vacío.</p>
                                </div>
                            ) : cartItems.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={optimizeImage(item.image)} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 line-clamp-2">{item.name}</h4>
                                        <div className="text-sm text-gray-500 mt-1">{formatPrice(item.price)} x {item.quantity}</div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button onClick={() => updateQty(idx, -1)} className="px-3 py-1 hover:bg-gray-50 text-gray-600">-</button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQty(idx, 1)} className="px-3 py-1 hover:bg-gray-50 text-gray-600">+</button>
                                            </div>
                                            <button onClick={() => removeItem(idx)} className="text-xs text-red-500 hover:text-red-700 font-medium ml-auto">Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="text-2xl font-bold text-gray-900">{formatPrice(cartTotal)}</span>
                                </div>
                                <button
                                    onClick={sendWhatsApp}
                                    className="w-full py-4 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 hover:opacity-90"
                                    style={{ backgroundColor: '#25D366' }} // WhatsApp color always green
                                >
                                    <span>Completar Pedido (WhatsApp)</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* PRODUCT MODAL */}
            {modalOpen && selectedProduct && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
                        <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white rounded-full p-2 text-gray-600 transition">✕</button>

                        {/* Image Gallery Side */}
                        <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[300px]">
                            <img src={optimizeImage(selectedProduct.image)} className="w-full h-full object-cover" />
                            {/* Simple Gallery Preview if extra images existed (mockup for now as DB usually has single image, but requested) */}
                            {selectedProduct.images && selectedProduct.images.length > 0 && (
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
                                    {[selectedProduct.image, ...selectedProduct.images].map((img: string, idx: number) => (
                                        <img key={idx} src={optimizeImage(img)} className="w-16 h-16 rounded-lg border-2 border-white object-cover cursor-pointer hover:border-blue-500 transition"
                                            onClick={(e) => (e.currentTarget.parentElement?.previousElementSibling as HTMLImageElement).src = optimizeImage(img)} // Simple JS implementation for switching
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Side */}
                        <div className="w-full md:w-1/2 p-8 flex flex-col">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h2>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl font-bold" style={{ color: themeColors.primary }}>
                                    {formatPrice(selectedProduct.price * (1 - (selectedProduct.discount || 0) / 100))}
                                </span>
                                {selectedProduct.discount > 0 && (
                                    <span className="text-gray-400 line-through text-lg">{formatPrice(selectedProduct.price)}</span>
                                )}
                                {selectedProduct.discount > 0 && (
                                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">-{selectedProduct.discount}%</span>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8 flex-1">
                                {selectedProduct.description || 'Sin descripción disponible para este producto.'}
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => { addToCart(selectedProduct); setModalOpen(false); }}
                                        className="flex-1 py-4 text-white font-bold rounded-xl shadow-lg transition hover:opacity-90 transform active:scale-95"
                                        style={{ backgroundColor: themeColors.primary }}
                                    >
                                        Añadir al Carrito
                                    </button>
                                </div>
                                <p className="text-xs text-center text-gray-400">Garantía de calidad • Envío seguro</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
