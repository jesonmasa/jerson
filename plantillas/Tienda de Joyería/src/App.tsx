import { useState } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { ProductModal } from './components/ProductModal';
import { Product } from './types/product';
import peruNecklace from 'figma:asset/10f1638995634712c8b8811b632185dd086a8ef7.png';
import chainBracelet from 'figma:asset/a012d922013e42dabe7b42203965777308f636ae.png';

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<Array<{ product: Product; quantity: number }>>([]);

  const products: Product[] = [
    {
      id: 1,
      name: 'Dije de Perú',
      category: 'Collares',
      price: 89.99,
      image: peruNecklace,
      description: 'Elegante dije de Perú en oro de 18k. Diseño exclusivo que representa el orgullo peruano.',
      inStock: true,
    },
    {
      id: 2,
      name: 'Pulsera Cadena Dorada',
      category: 'Pulseras',
      price: 69.99,
      image: chainBracelet,
      description: 'Pulsera de cadena gruesa en oro, estilo moderno y sofisticado.',
      inStock: true,
    },
    {
      id: 3,
      name: 'Anillo Elegante Oro',
      category: 'Anillos',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1666287289204-3d6e636dd539?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzY0Mjk1MTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Anillo de oro con diseño minimalista y elegante, perfecto para cualquier ocasión.',
      inStock: true,
    },
    {
      id: 4,
      name: 'Aretes Dorados Premium',
      category: 'Aretes',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1758995115555-766abbd9a491?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwZWFycmluZ3MlMjBqZXdlbHJ5fGVufDF8fHx8MTc2NDMzOTU1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Aretes de oro con acabado pulido, diseño contemporáneo que realza tu belleza natural.',
      inStock: true,
    },
    {
      id: 5,
      name: 'Collar Cadena Dorada',
      category: 'Collares',
      price: 159.99,
      image: 'https://images.unsplash.com/photo-1611012756377-05e2e4269fa3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwbmVja2xhY2UlMjBqZXdlbHJ5fGVufDF8fHx8MTc2NDIzODk2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Collar de cadena delicada en oro, perfecto para uso diario o eventos especiales.',
      inStock: true,
    },
    {
      id: 6,
      name: 'Pulsera Oro Elegante',
      category: 'Pulseras',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGJyYWNlbGV0JTIwZ29sZHxlbnwxfHx8fDE3NjQzNDYyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Pulsera de oro con diseño sofisticado, ideal para complementar cualquier look.',
      inStock: true,
    },
    {
      id: 7,
      name: 'Anillo con Diamante',
      category: 'Anillos',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1629201688905-697730d24490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZyUyMGpld2Vscnl8ZW58MXx8fHwxNzY0MzAzMDM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Anillo de compromiso con diamante central, símbolo de amor eterno.',
      inStock: true,
    },
    {
      id: 8,
      name: 'Dije Elegante Dorado',
      category: 'Collares',
      price: 94.99,
      image: 'https://images.unsplash.com/photo-1763256614647-14abbc578252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50JTIwbmVja2xhY2UlMjBnb2xkfGVufDF8fHx8MTc2NDM0NjI3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      description: 'Dije de oro con diseño único, perfecto para expresar tu estilo personal.',
      inStock: true,
    },
  ];

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header 
        cartItemCount={totalItems} 
        onCartClick={() => setCartOpen(true)} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4">Colección de Joyería</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Descubre nuestra exclusiva selección de joyas de oro, diseñadas para realzar tu elegancia natural
          </p>
        </div>
        
        <ProductGrid 
          products={products} 
          onProductClick={setSelectedProduct}
          onAddToCart={addToCart}
        />
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
    </div>
  );
}
