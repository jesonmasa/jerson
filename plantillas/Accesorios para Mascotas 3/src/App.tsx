import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProductGrid } from "./components/ProductGrid";
import { Footer } from "./components/Footer";
import { Cart, CartItem } from "./components/Cart";
import { Product } from "./components/ProductCard";
import { toast } from "sonner@2.0.3";

// Mock data para productos
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Collar Premium de Cuero para Perro",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1667716705760-233650f8f3fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBjb2xsYXIlMjBhY2Nlc3Nvcnl8ZW58MXx8fHwxNzU1NDczNDYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "perro",
    rating: 4.8,
    isOnSale: true,
  },
  {
    id: "2",
    name: "Pelota Interactiva para Gato",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1619043544743-b72f69e2a077?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjB0b3klMjBiYWxsfGVufDF8fHx8MTc1NTQ3MzQ2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "gato",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Comedero Antideslizante Doble",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1734654901149-02a9a5f7993b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBmb29kJTIwYm93bHxlbnwxfHx8fDE3NTUzOTk4NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "perro",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Correa Extensible con LED",
    price: 34.99,
    originalPrice: 44.99,
    image: "https://images.unsplash.com/photo-1716614206844-ed55e7a6ffc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBsZWFzaCUyMHdhbGtpbmd8ZW58MXx8fHwxNzU1NDczNDYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "perro",
    rating: 4.9,
    isOnSale: true,
  },
  {
    id: "5",
    name: "Cama Suave para Gatos",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1614433296379-b6b597a46756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBiZWQlMjBzbGVlcGluZ3xlbnwxfHx8fDE3NTU0NzM0NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "gato",
    rating: 4.5,
  },
  {
    id: "6",
    name: "Transportín de Viaje Seguro",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608060375223-c5ab552bc9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBjYXJyaWVyJTIwYmFnfGVufDF8fHx8MTc1NTQ3MzQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "gato",
    rating: 4.8,
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    toast.success(`${product.name} añadido al carrito`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    toast.success("Producto eliminado del carrito");
  };

  const handleClearCart = () => {
    setCartItems([]);
    toast.success("Carrito vaciado");
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast.success("Eliminado de favoritos");
      } else {
        newFavorites.add(productId);
        toast.success("Añadido a favoritos");
      }
      return newFavorites;
    });
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItemCount}
        onCartOpen={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero />
        <ProductGrid 
          products={mockProducts}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
        />
      </main>
      
      <Footer />
      
      <Cart
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}