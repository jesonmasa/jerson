import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryCard } from "./components/CategoryCard";
import { ProductCard, Product } from "./components/ProductCard";
import { Cart, CartItem } from "./components/Cart";
import { Footer } from "./components/Footer";
import { Button } from "./components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Truck, Shield, HeadphonesIcon, Award } from "lucide-react";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Categories Data
  const categories = [
    {
      title: "Perros",
      description: "Alimentos, juguetes y accesorios para tu mejor amigo",
      image: "https://images.unsplash.com/photo-1747045200613-0dc76be6ded0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNzUwMzgwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: "🐕",
      productsCount: 156,
    },
    {
      title: "Gatos",
      description: "Todo para el cuidado y diversión de tu felino",
      image: "https://images.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNzY3NDczfDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: "🐈",
      productsCount: 142,
    },
    {
      title: "Aves",
      description: "Jaulas, alimentos y accesorios para aves",
      image: "https://images.unsplash.com/photo-1722718916429-42ede3fc166e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBiaXJkJTIwY29sb3JmdWx8ZW58MXx8fHwxNzYyNzg1NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: "🦜",
      productsCount: 78,
    },
    {
      title: "Peces",
      description: "Acuarios, alimentos y decoración acuática",
      image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhcml1bSUyMGZpc2h8ZW58MXx8fHwxNzYyODI1MTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      icon: "🐠",
      productsCount: 64,
    },
  ];

  // Products Data
  const products: Product[] = [
    {
      id: 1,
      name: "Alimento Premium para Perros Adultos 15kg",
      price: 89900,
      originalPrice: 129900,
      rating: 4.8,
      reviews: 324,
      image: "https://images.unsplash.com/photo-1598134493179-51332e56807f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBmb29kJTIwYm93bHxlbnwxfHx8fDE3NjI3ODAxNTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Alimentos para Perros",
      inStock: true,
      badge: "Más Vendido",
    },
    {
      id: 2,
      name: "Set de Juguetes Interactivos para Mascotas",
      price: 34900,
      originalPrice: 49900,
      rating: 4.9,
      reviews: 567,
      image: "https://images.unsplash.com/photo-1744608257939-1ecbd90f1320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjB0b3lzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzYyNzM5MjA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Juguetes",
      inStock: true,
      badge: "Nuevo",
    },
    {
      id: 3,
      name: "Kit Completo de Grooming Profesional",
      price: 149900,
      rating: 4.7,
      reviews: 189,
      image: "https://images.unsplash.com/photo-1760596687390-8fbc1d53d3cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBncm9vbWluZyUyMHN1cHBsaWVzfGVufDF8fHx8MTc2MjgyNTE4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Grooming",
      inStock: true,
    },
    {
      id: 4,
      name: "Cama Ortopédica de Lujo para Gatos",
      price: 79900,
      originalPrice: 99900,
      rating: 4.9,
      reviews: 412,
      image: "https://images.unsplash.com/photo-1430025120386-1e6f189a42a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBiZWQlMjBjb3p5fGVufDF8fHx8MTc2MjgyNTE5MHww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Accesorios para Gatos",
      inStock: true,
      badge: "Más Vendido",
    },
    {
      id: 5,
      name: "Collar Ajustable Premium con GPS",
      price: 129900,
      originalPrice: 179900,
      rating: 4.6,
      reviews: 234,
      image: "https://images.unsplash.com/photo-1596822316110-288c7b8f24f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBhY2Nlc3NvcmllcyUyMGNvbGxhcnxlbnwxfHx8fDE3NjI4MDA4Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Accesorios",
      inStock: true,
      badge: "Nuevo",
    },
    {
      id: 6,
      name: "Comedero Automático Inteligente",
      price: 199900,
      rating: 4.8,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1648410021732-9c9a37e8c660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzdG9yZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc2Mjc2NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Tecnología",
      inStock: true,
      badge: "Más Vendido",
    },
    {
      id: 7,
      name: "Arena para Gatos Aglomerante 10kg",
      price: 45900,
      originalPrice: 59900,
      rating: 4.7,
      reviews: 789,
      image: "https://images.unsplash.com/photo-1648410021732-9c9a37e8c660?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzdG9yZSUyMHByb2R1Y3RzfGVufDF8fHx8MTc2Mjc2NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Higiene",
      inStock: true,
    },
    {
      id: 8,
      name: "Transportadora Ergonómica para Viajes",
      price: 119900,
      rating: 4.5,
      reviews: 267,
      image: "https://images.unsplash.com/photo-1598134493179-51332e56807f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBmb29kJTIwYm93bHxlbnwxfHx8fDE3NjI3ODAxNTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      category: "Transporte",
      inStock: true,
    },
  ];

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const categoryFilters = ["Todos", "Alimentos", "Juguetes", "Accesorios", "Grooming", "Higiene"];

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
      />

      <Hero />

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="p-3 bg-pink-100 rounded-full">
                <Truck className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h4 className="text-gray-900">Envío Gratis</h4>
                <p className="text-sm text-gray-600">En compras +$50.000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h4 className="text-gray-900">Compra Segura</h4>
                <p className="text-sm text-gray-600">Pago 100% protegido</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="p-3 bg-green-100 rounded-full">
                <HeadphonesIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-gray-900">Soporte 24/7</h4>
                <p className="text-sm text-gray-600">Estamos para ayudarte</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-gray-900">Calidad Premium</h4>
                <p className="text-sm text-gray-600">Productos certificados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categorias" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">
              Categorías Populares
            </h2>
            <p className="text-xl text-gray-600">
              Encuentra todo lo que necesitas para tu mascota
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={index} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h2 className="text-4xl text-gray-900 mb-2">
                Productos Destacados
              </h2>
              <p className="text-xl text-gray-600">
                Lo mejor para tu mejor amigo
              </p>
            </div>
            <Tabs defaultValue="Todos" className="w-full md:w-auto">
              <TabsList className="bg-white">
                {categoryFilters.map((filter) => (
                  <TabsTrigger
                    key={filter}
                    value={filter}
                    onClick={() => setSelectedCategory(filter)}
                    className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                  >
                    {filter}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-pink-600 hover:bg-pink-700 text-white px-12 py-6 rounded-full">
              Ver Todos los Productos
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">
              Servicios Especiales
            </h2>
            <p className="text-xl text-gray-600">
              Cuidado profesional para tu mascota
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-4">✂️</div>
              <h3 className="text-2xl text-gray-900 mb-3">Grooming Profesional</h3>
              <p className="text-gray-600 mb-4">
                Baño, corte de pelo y uñas por expertos certificados
              </p>
              <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white rounded-full">
                Agendar Cita
              </Button>
            </div>

            <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-4">🏥</div>
              <h3 className="text-2xl text-gray-900 mb-3">Consulta Veterinaria</h3>
              <p className="text-gray-600 mb-4">
                Atención veterinaria de calidad para el bienestar de tu mascota
              </p>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-full">
                Agendar Cita
              </Button>
            </div>

            <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-4">🏨</div>
              <h3 className="text-2xl text-gray-900 mb-3">Guardería y Hotel</h3>
              <p className="text-gray-600 mb-4">
                Cuida a tu mascota cuando no puedas estar con ella
              </p>
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-full">
                Reservar
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl text-gray-900 mb-4">
              Lo que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-gray-600">
              Miles de mascotas felices y sus dueños satisfechos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                pet: "Luna (Golden Retriever)",
                text: "Increíble servicio y productos de excelente calidad. Luna ama sus nuevos juguetes y el alimento premium. ¡Totalmente recomendado!",
                rating: 5,
              },
              {
                name: "Carlos Rodríguez",
                pet: "Michi (Gato Persa)",
                text: "La mejor tienda de mascotas. El personal es super amable y conocedor. Siempre encuentro todo lo que necesito para Michi.",
                rating: 5,
              },
              {
                name: "Ana Martínez",
                pet: "Rocky (Bulldog)",
                text: "Precios justos, envío rápido y productos auténticos. Rocky está más feliz que nunca con su nueva cama ortopédica.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
