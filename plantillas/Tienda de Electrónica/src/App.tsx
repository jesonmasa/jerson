import { useState } from "react";
import { Header } from "./components/Header";
import { CategoryNav } from "./components/CategoryNav";
import { Banner } from "./components/Banner";
import { ProductGrid } from "./components/ProductGrid";
import { Cart, CartItem } from "./components/Cart";
import { Product } from "./components/ProductCard";
import { products } from "./data/products";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter products based on active category
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  // Calculate total cart items
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        toast.success(`Cantidad actualizada: ${product.name}`, {
          description: `Cantidad: ${existingItem.quantity + 1}`
        });
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast.success(`Agregado al carrito: ${product.name}`, {
          description: "Producto añadido exitosamente"
        });
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
      toast.success(`Removido del carrito: ${item.name}`);
    }
    
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <CategoryNav
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      
      <main>
        {activeCategory === "all" && <Banner />}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h2 className="text-2xl mb-2">
              {activeCategory === "all" 
                ? "Todos los productos" 
                : getCategoryTitle(activeCategory)}
            </h2>
            <p className="text-muted-foreground">
              {filteredProducts.length} productos encontrados
            </p>
          </div>
          
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
          />
        </div>
      </main>

      <Cart
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
      >
        <div />
      </Cart>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4">TechStore CR</h3>
              <p className="text-sm text-muted-foreground">
                Tu tienda de confianza para la mejor tecnología en Costa Rica.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Categorías</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Teléfonos</li>
                <li>Consolas</li>
                <li>Tablets</li>
                <li>Audífonos</li>
                <li>Accesorios</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Ayuda</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Contacto</li>
                <li>Envíos</li>
                <li>Devoluciones</li>
                <li>Garantía</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Información</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Sobre nosotros</li>
                <li>Términos y condiciones</li>
                <li>Política de privacidad</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 TechStore CR. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

function getCategoryTitle(category: string): string {
  const titles: Record<string, string> = {
    phones: "Teléfonos",
    consoles: "Consolas de videojuegos",
    tablets: "Tablets",
    headphones: "Audífonos",
    accessories: "Accesorios"
  };
  return titles[category] || "Productos";
}