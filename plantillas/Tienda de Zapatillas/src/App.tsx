import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ShoppingCart, CartItem } from './components/ShoppingCart';
import { Footer } from './components/Footer';
import { Product } from './components/ProductCard';
import { AuthProvider } from './components/AuthContext';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

// Mock data for products (prices in Colombian Pesos)
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Air Max Classic Running',
    brand: 'Nike',
    price: 598350, // ~130 USD
    originalPrice: 735400, // ~160 USD
    image: 'https://images.unsplash.com/photo-1719523677291-a395426c1a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NTkwODg4MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    reviews: 234,
    sizes: [38, 39, 40, 41, 42, 43, 44],
    colors: ['Negro', 'Blanco', 'Gris'],
    isOnSale: true,
  },
  {
    id: 2,
    name: 'Ultra Boost Fashion',
    brand: 'Adidas',
    price: 414250, // ~90 USD
    image: 'https://images.unsplash.com/photo-1625622176741-a21f738d0756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkxNjMwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviews: 156,
    sizes: [36, 37, 38, 39, 40, 41, 42],
    colors: ['Blanco', 'Rosa', 'Azul'],
    isNew: true,
  },
  {
    id: 3,
    name: 'Pro Sport Athletic',
    brand: 'Puma',
    price: 439550, // ~95.50 USD
    image: 'https://images.unsplash.com/photo-1687184144779-51a366352458?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMHNob2VzJTIwc3BvcnR8ZW58MXx8fHwxNzU5MTgwOTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.3,
    reviews: 89,
    sizes: [39, 40, 41, 42, 43, 44, 45],
    colors: ['Negro', 'Rojo', 'Blanco'],
  },
  {
    id: 4,
    name: 'Basketball Legend',
    brand: 'Jordan',
    price: 735400, // ~160 USD
    originalPrice: 919250, // ~200 USD
    image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwc2hvZXN8ZW58MXx8fHwxNzU5MDgzMTYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    reviews: 342,
    sizes: [40, 41, 42, 43, 44, 45, 46],
    colors: ['Negro', 'Rojo', 'Blanco'],
    isOnSale: true,
  },
  {
    id: 5,
    name: 'Casual Street Style',
    brand: 'Converse',
    price: 321950, // ~70 USD
    image: 'https://images.unsplash.com/photo-1542272606-405060e9517f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NTkxODA3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.2,
    reviews: 167,
    sizes: [36, 37, 38, 39, 40, 41, 42, 43],
    colors: ['Blanco', 'Negro', 'Azul marino'],
  },
  {
    id: 6,
    name: 'High Top Classic',
    brand: 'Vans',
    price: 367950, // ~80 USD
    image: 'https://images.unsplash.com/photo-1523978470318-3ffac5558af3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwdG9wJTIwc25lYWtlcnN8ZW58MXx8fHwxNzU5MTU0MDkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.4,
    reviews: 203,
    sizes: [37, 38, 39, 40, 41, 42, 43, 44],
    colors: ['Negro', 'Blanco', 'Checkerboard'],
    isNew: true,
  },
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    // Update page title
    document.title = 'Zapatillas J Y R - Tu Tienda de Zapatillas en Colombia';
  }, []);

  const handleAddToCart = (product: Product, size: number) => {
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.size === size
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
        size,
        quantity: 1,
      };
      setCartItems([...cartItems, newItem]);
    }

    toast.success(`${product.name} (Talla ${size}) añadido al carrito`);
  };

  const handleUpdateQuantity = (id: number, size: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(id, size);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity }
        : item
    );
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (id: number, size: number) => {
    const updatedItems = cartItems.filter(
      item => !(item.id === id && item.size === size)
    );
    setCartItems(updatedItems);
    toast.info('Producto eliminado del carrito');
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header 
          cartItemsCount={cartItemsCount}
          onCartClick={() => setIsCartOpen(true)}
        />
        
        <main>
          <Hero />
          <ProductGrid 
            products={mockProducts}
            onAddToCart={handleAddToCart}
          />
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
    </AuthProvider>
  );
}