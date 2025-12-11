import { useState } from "react";
import { Header } from "./components/Header";
import { ProductCard, Product } from "./components/ProductCard";
import { ShoppingCart, CartItem } from "./components/ShoppingCart";
import { ProductModal } from "./components/ProductModal";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Zapatillas Running Pro",
    price: 129.99,
    originalPrice: 159.99,
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYwMTc1NDk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Deportivo",
    isNew: true,
    discount: 20,
    colors: ["#FF6B6B", "#000000", "#FFFFFF"],
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: 2,
    name: "Botas de Cuero Clásicas",
    price: 189.99,
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYm9vdHN8ZW58MXx8fHwxNzYwMTQ0MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Hombre",
    colors: ["#8B4513", "#000000"],
    sizes: [39, 40, 41, 42, 43, 44],
  },
  {
    id: 3,
    name: "Sneakers Urbanas",
    price: 99.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1759542890353-35f5568c1c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGNhc3VhbHxlbnwxfHx8fDE3NjAyMDY1MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Casual",
    discount: 15,
    colors: ["#FFFFFF", "#000000", "#4A90E2"],
    sizes: [36, 37, 38, 39, 40, 41, 42],
  },
  {
    id: 4,
    name: "Tacones Elegantes",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1605733513549-de9b150bd70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGhlZWxzfGVufDF8fHx8MTc2MDE0NDQwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Mujer",
    isNew: true,
    colors: ["#000000", "#C41E3A", "#FFD700"],
    sizes: [35, 36, 37, 38, 39, 40],
  },
  {
    id: 5,
    name: "Zapatillas Deportivas",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzaG9lc3xlbnwxfHx8fDE3NjAyMDY1MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Deportivo",
    colors: ["#FF6B35", "#004E89", "#FFFFFF"],
    sizes: [38, 39, 40, 41, 42, 43, 44],
  },
  {
    id: 6,
    name: "Sandalias de Verano",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1744789759290-1ca5fc539bc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBzYW5kYWxzfGVufDF8fHx8MTc2MDExODA3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Casual",
    discount: 20,
    colors: ["#F4A460", "#FFFFFF", "#000000"],
    sizes: [36, 37, 38, 39, 40, 41],
  },
  {
    id: 7,
    name: "Zapatillas Running Elite",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXN8ZW58MXx8fHwxNzYwMTc1NDk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Deportivo",
    isNew: true,
    colors: ["#00FF00", "#000000"],
    sizes: [39, 40, 41, 42, 43, 44, 45],
  },
  {
    id: 8,
    name: "Botines Chelsea",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1605812860427-4024433a70fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYm9vdHN8ZW58MXx8fHwxNzYwMTQ0MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Hombre",
    colors: ["#654321", "#000000"],
    sizes: [40, 41, 42, 43, 44],
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const handleAddToCart = (product: Product, size?: number) => {
    const existingItem = cartItems.find(
      item => item.id === product.id && item.size === (size || product.sizes[0])
    );

    if (existingItem) {
      setCartItems(
        cartItems.map(item =>
          item.id === existingItem.id && item.size === existingItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          size: size || product.sizes[0],
        },
      ]);
    }
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(
      cartItems.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const filteredProducts = selectedCategory === "Todos" 
    ? PRODUCTS 
    : PRODUCTS.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header 
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onCartClick={() => setIsCartOpen(true)}
      />

      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="bg-white text-blue-600 mb-4">Nueva Colección 2025</Badge>
          <h2 className="text-5xl mb-4">Encuentra tu Estilo Perfecto</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubre nuestra exclusiva colección de calzado con diseños modernos y comodidad incomparable
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Explorar Colección
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Ver Ofertas
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl mb-2">Nuestra Colección</h2>
            <p className="text-gray-600">
              {filteredProducts.length} productos disponibles
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              <TabsTrigger value="Todos">Todos</TabsTrigger>
              <TabsTrigger value="Hombre">Hombre</TabsTrigger>
              <TabsTrigger value="Mujer">Mujer</TabsTrigger>
              <TabsTrigger value="Deportivo">Deportivo</TabsTrigger>
              <TabsTrigger value="Casual">Casual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onProductClick={setSelectedProduct}
            />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En compras superiores a $50</p>
            </div>
            <div>
              <div className="text-4xl mb-4">↩️</div>
              <h3 className="text-xl mb-2">Devolución Fácil</h3>
              <p className="text-gray-600">30 días para devoluciones</p>
            </div>
            <div>
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl mb-2">Garantía de Calidad</h3>
              <p className="text-gray-600">Productos 100% originales</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl mb-4">StepStyle</h3>
              <p className="text-gray-400">
                Tu tienda de confianza para el mejor calzado
              </p>
            </div>
            <div>
              <h4 className="mb-4">Comprar</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Hombre</a></li>
                <li><a href="#" className="hover:text-white">Mujer</a></li>
                <li><a href="#" className="hover:text-white">Niños</a></li>
                <li><a href="#" className="hover:text-white">Deportivo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Ayuda</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Contacto</a></li>
                <li><a href="#" className="hover:text-white">Envíos</a></li>
                <li><a href="#" className="hover:text-white">Devoluciones</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Recibe nuestras últimas ofertas
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="flex-1 px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                />
                <Button>Suscribir</Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 StepStyle. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
