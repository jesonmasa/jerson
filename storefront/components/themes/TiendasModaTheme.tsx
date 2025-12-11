import { useState } from "react";

const Header = ({ config, mobileMenuOpen, setMobileMenuOpen }: any) => (
    <header className="fixed w-full z-50 bg-black/90 text-white backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold tracking-widest uppercase">{config?.storeName || "MODA URBANA"}</div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
                <a href="#" className="hover:text-gray-300">Inicio</a>
                <a href="#sobre-nosotros" className="hover:text-gray-300">Sobre Nosotros</a>
                <a href="#" className="hover:text-gray-300">Colección</a>
                <a href="#contacto" className="hover:text-gray-300">Contacto</a>
                <a href="/politicas" className="hover:text-gray-300">Políticas y Privacidad</a>
            </nav>
            <div className="flex items-center space-x-4">
                {/* Botón hamburguesa para móvil */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
                    aria-label="Menú"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {mobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
                <button>🔍</button>
                <button>🛍️</button>
            </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/20 bg-black/95">
                <nav className="flex flex-col py-4 px-6 gap-3">
                    <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:bg-white/10 px-4 py-2 rounded-lg transition">Inicio</a>
                    <a href="#sobre-nosotros" onClick={() => setMobileMenuOpen(false)} className="hover:bg-white/10 px-4 py-2 rounded-lg transition">Sobre Nosotros</a>
                    <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:bg-white/10 px-4 py-2 rounded-lg transition">Colección</a>
                    <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="hover:bg-white/10 px-4 py-2 rounded-lg transition">Contacto</a>
                    <a href="/politicas" className="hover:bg-white/10 px-4 py-2 rounded-lg transition">Políticas y Privacidad</a>
                </nav>
            </div>
        )}
    </header>
);

const Hero = () => (
    <div className="relative h-[50vh] min-h-[400px] max-h-[600px] flex items-center justify-center bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920"
                className="w-full h-full object-cover opacity-50"
                alt="Fashion Hero"
            />
        </div>
        <div className="relative z-10 text-center space-y-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase">Nueva Temporada</h1>
            <p className="text-xl md:text-2xl font-light tracking-wide">Redefine tu estilo hoy</p>
            <button className="bg-white text-black px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-200 transition">
                Ver Colección
            </button>
        </div>
    </div>
);

const ProductCard = ({ product }: any) => (
    <div className="group cursor-pointer">
        <div className="relative overflow-hidden aspect-[3/4] mb-4">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <button className="bg-white text-black px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition">
                    Añadir
                </button>
            </div>
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wide">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">${product.price}</p>
    </div>
);

export default function TiendasModaTheme({ config }: { config: any }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const products = [
        { id: 1, name: "Chaqueta Oversize", price: 89.99, image: "https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?auto=format&fit=crop&w=800" },
        { id: 2, name: "Vestido Negro Basic", price: 49.99, image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800" },
        { id: 3, name: "Denim Jacket", price: 79.99, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800" },
        { id: 4, name: "Botines Cuero", price: 129.99, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800" },
    ];

    return (
        <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-white text-black font-mono">
            <Header config={config} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <main>
                <Hero />
                <section id="sobre-nosotros" className="py-16 px-4 sm:px-6 container max-w-7xl mx-auto text-center border-b border-gray-100">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Sobre Nosotros</h2>
                    <p className="max-w-2xl mx-auto text-gray-600 font-light">
                        Redefiniendo la moda urbana con calidad y estilo. Nuestra pasión es traerte las últimas tendencias
                        directamente a tu guardarropa.
                    </p>
                </section>
                <section className="py-16 px-4 sm:px-6 container max-w-7xl mx-auto">
                    <h2 className="text-3xl font-black uppercase tracking-widest text-center mb-16">Tendencias</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </section>
            </main>
            <footer id="contacto" className="bg-black text-white py-12 text-center text-xs uppercase tracking-widest">
                © 2024 {config?.storeName || "TIENDAS MODA"}. All rights reserved.
                <div className="mt-4 opacity-70">
                    <p>{config?.contactEmail}</p>
                    <p>{config?.contactPhone}</p>
                </div>
            </footer>
        </div>
    );
}
