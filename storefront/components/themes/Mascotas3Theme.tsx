import { useState } from "react";
// import { Header } from "./components/Header";
// import { Hero } from "./components/Hero";
// import { ProductGrid } from "./components/ProductGrid";
// import { Footer } from "./components/Footer";
// import { Cart, CartItem } from "./components/Cart";
// import { Product } from "./components/ProductCard";
// import { toast } from "sonner"; // Assuming sonner is available or we need to add it

// Temporary mock components for migration until we copy the full folder structure
const Header = ({ cartItemCount, onCartOpen, mobileMenuOpen, setMobileMenuOpen }: any) => (
    <header className="sticky top-0 z-50 p-4 bg-white shadow-md">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">Mascotas 3</h1>

            <nav className="hidden md:flex gap-6">
                <a href="#" className="hover:text-primary-600 transition">Inicio</a>
                <a href="#sobre-nosotros" className="hover:text-primary-600 transition">Sobre Nosotros</a>
                <a href="#productos" className="hover:text-primary-600 transition">Productos</a>
                <a href="#contacto" className="hover:text-primary-600 transition">Contacto</a>
                <a href="/politicas" className="hover:text-primary-600 transition">Políticas y Privacidad</a>
            </nav>

            <div className="flex items-center gap-2">
                {/* Botón hamburguesa para móvil */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
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

                <button onClick={onCartOpen} className="bg-primary-500 text-white px-4 py-2 rounded-full">
                    🛒 {cartItemCount}
                </button>
            </div>
        </div>

        {/* Menú móvil desplegable */}
        {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 mt-4">
                <nav className="flex flex-col py-4 gap-3">
                    <a href="#" onClick={() => setMobileMenuOpen(false)} className="hover:bg-gray-100 px-4 py-2 rounded-lg transition">Inicio</a>
                    <a href="#sobre-nosotros" onClick={() => setMobileMenuOpen(false)} className="hover:bg-gray-100 px-4 py-2 rounded-lg transition">Sobre Nosotros</a>
                    <a href="#productos" onClick={() => setMobileMenuOpen(false)} className="hover:bg-gray-100 px-4 py-2 rounded-lg transition">Productos</a>
                    <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="hover:bg-gray-100 px-4 py-2 rounded-lg transition">Contacto</a>
                    <a href="/politicas" className="hover:bg-gray-100 px-4 py-2 rounded-lg transition">Políticas y Privacidad</a>
                </nav>
            </div>
        )}
    </header>
);

const Hero = () => (
    <div className="bg-gray-100 py-12 px-4 sm:px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Accesorios Premium para tu Mascota</h2>
        <p className="text-xl text-gray-600">Lo mejor para tu mejor amigo</p>
    </div>
);

const ProductGrid = ({ products, onAddToCart }: any) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 sm:p-8 max-w-7xl mx-auto">
        {products.map((p: any) => (
            <div key={p.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition">
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="font-bold text-lg">{p.name}</h3>
                <p className="text-primary-600 font-bold">${p.price}</p>
                <button
                    onClick={() => onAddToCart(p)}
                    className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                >
                    Añadir al Carrito
                </button>
            </div>
        ))}
    </div>
);

const Footer = () => (
    <footer id="contacto" className="bg-gray-800 text-white p-8 text-center mt-12">
        <p>© 2024 Accesorios para Mascotas 3. Todos los derechos reservados.</p>
    </footer>
);

export default function Mascotas3Theme({ config }: { config: any }) {
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Mock Data adapted from original template
    const mockProducts = [
        {
            id: "1",
            name: "Collar Premium de Cuero",
            price: 29.99,
            image: "https://images.unsplash.com/photo-1667716705760-233650f8f3fe?auto=format&fit=crop&w=800",
        },
        {
            id: "2",
            name: "Pelota Interactiva",
            price: 15.99,
            image: "https://images.unsplash.com/photo-1619043544743-b72f69e2a077?auto=format&fit=crop&w=800",
        },
        {
            id: "3",
            name: "Comedero Doble",
            price: 24.99,
            image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800", // Fixed placeholder
        }
    ];

    const handleAddToCart = (product: any) => {
        setCartItems(prev => [...prev, product]);
        // toast.success(`${product.name} añadido`);
    };

    return (
        <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-gray-50 font-sans">
            <Header cartItemCount={cartItems.length} onCartOpen={() => setIsCartOpen(true)} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
            <main>
                <Hero />
                <section id="sobre-nosotros" className="py-12 bg-white text-center">
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6">
                        <h2 className="text-3xl font-bold mb-4 text-primary-600">Sobre Nosotros</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Dedicados al cuidado y felicidad de tus mascotas. Ofrecemos accesorios de calidad premium seleccionados con amor.
                        </p>
                    </div>
                </section>
                <ProductGrid products={mockProducts} onAddToCart={handleAddToCart} />
            </main>
            <Footer />

            {/* Basic Cart Modal Placeholder */}
            {isCartOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end">
                    <div className="bg-white w-96 p-6 h-full overflow-y-auto">
                        <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-bold">Carrito</h2>
                            <button onClick={() => setIsCartOpen(false)}>✕</button>
                        </div>
                        {cartItems.map((item, i) => (
                            <div key={i} className="flex justify-between border-b py-2">
                                <span>{item.name}</span>
                                <span>${item.price}</span>
                            </div>
                        ))}
                        <div className="mt-4 pt-4 border-t font-bold text-xl">
                            Total: ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
