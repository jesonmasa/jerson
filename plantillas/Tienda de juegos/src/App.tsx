import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog, type Product } from './components/ProductCatalog';
import { ShoppingCart, type CartItem } from './components/ShoppingCart';
import { Footer } from './components/Footer';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
      toast.success(`${product.name} cantidad actualizada en el carrito`);
    } else {
      setCartItems(items => [...items, { ...product, quantity: 1 }]);
      toast.success(`${product.name} añadido al carrito`);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(items => items.filter(item => item.id !== id));
    if (item) {
      toast.success(`${item.name} eliminado del carrito`);
    }
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero />
        <ProductCatalog onAddToCart={handleAddToCart} />
      </main>
      
      <Footer />
      
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
      
      <Toaster />
    </div>
  );
}