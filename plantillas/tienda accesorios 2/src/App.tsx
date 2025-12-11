import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { CategoryFilter } from "./components/CategoryFilter";
import { ProductCard, Product } from "./components/ProductCard";
import { CartSheet, CartItem } from "./components/CartSheet";
import { Footer } from "./components/Footer";

// Mock products data
const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Auriculares Inalámbricos Pro",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYwMTQ0MzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    rating: 5,
    inStock: true,
  },
  {
    id: 2,
    name: "Cargador Rápido 65W USB-C",
    price: 34.99,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1731616103600-3fe7ccdc5a59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGNoYXJnZXJ8ZW58MXx8fHwxNzYwMTQ0MzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Cargadores",
    rating: 4,
    inStock: true,
  },
  {
    id: 3,
    name: "Cable USB-C Premium 2m",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1572721546624-05bf65ad7679?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2IlMjBjYWJsZXxlbnwxfHx8fDE3NjAxNDQzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Cables",
    rating: 5,
    inStock: true,
  },
  {
    id: 4,
    name: "Funda Protectora iPhone Premium",
    price: 24.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1535157412991-2ef801c1748b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMGNhc2V8ZW58MXx8fHwxNzYwMTQ0MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Fundas",
    rating: 4,
    inStock: true,
  },
  {
    id: 5,
    name: "Soporte Ajustable para Teléfono",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1553556135-009e5858adce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMHN0YW5kfGVufDF8fHx8MTc2MDE0NDMzOXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Soportes",
    rating: 5,
    inStock: true,
  },
  {
    id: 6,
    name: "Hub USB-C 7 en 1",
    price: 54.99,
    originalPrice: 74.99,
    image: "https://images.unsplash.com/photo-1742783637429-2452a4caee8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NjAwODY3MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Adaptadores",
    rating: 5,
    inStock: true,
  },
  {
    id: 7,
    name: "Mouse Inalámbrico Ergonómico",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1678852524356-08188528aed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0c3xlbnwxfHx8fDE3NjAwNDA2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Audio",
    rating: 4,
    inStock: false,
  },
  {
    id: 8,
    name: "Power Bank 20000mAh",
    price: 44.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1678852524356-08188528aed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYwMDczNzY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Cargadores",
    rating: 5,
    inStock: true,
  },
];

const CATEGORIES = ["Todos", "Audio", "Cargadores", "Cables", "Fundas", "Soportes", "Adaptadores"];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts =
    selectedCategory === "Todos"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartClick={() => setIsCartOpen(true)} cartItemsCount={cartItemsCount} />
      
      <main className="flex-1">
        <Hero />
        
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="mb-2">Nuestros Productos</h2>
            <p className="text-muted-foreground">
              Explora nuestra colección de accesorios tecnológicos
            </p>
          </div>

          <CategoryFilter
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
