import { useState } from "react";
import { Header } from "./components/Header";
import { ProductCard, type Product } from "./components/ProductCard";
import { ShoppingCartSheet, type CartItem } from "./components/ShoppingCartSheet";
import { AuthDialog } from "./components/AuthDialog";
import { DeliveryTracking, type Order } from "./components/DeliveryTracking";
import { ProductManagement } from "./components/ProductManagement";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Settings, Store } from "lucide-react";
import { toast, Toaster } from "sonner@2.0.3";

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Vestido Elegante de Noche",
    price: 89990,
    image: "https://images.unsplash.com/photo-1708363390847-b4af54f45273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBjbG90aGluZ3xlbnwxfHx8fDE3NjM5NjM0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Vestidos",
    inStock: true,
    discount: 20,
  },
  {
    id: "2",
    name: "Vestido Casual Minimalista",
    price: 45990,
    image: "https://images.unsplash.com/photo-1761164920960-2d776a18998c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBtb2RlbHxlbnwxfHx8fDE3NjM5MzQ0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Vestidos",
    inStock: true,
  },
  {
    id: "3",
    name: "Conjunto Casual de Verano",
    price: 52990,
    image: "https://images.unsplash.com/photo-1528701800487-ba01fea498c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjB3b21lbiUyMG91dGZpdHxlbnwxfHx8fDE3NjM4MDAxNDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Conjuntos",
    inStock: true,
    discount: 15,
  },
  {
    id: "4",
    name: "Vestido Floral de Verano",
    price: 38990,
    image: "https://images.unsplash.com/photo-1602303894456-398ce544d90b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW1tZXIlMjBkcmVzcyUyMGZhc2hpb258ZW58MXx8fHwxNzYzOTg1MTgyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Vestidos",
    inStock: true,
  },
  {
    id: "5",
    name: "Blusa Elegante de Oficina",
    price: 34990,
    image: "https://images.unsplash.com/photo-1708363390847-b4af54f45273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBjbG90aGluZ3xlbnwxfHx8fDE3NjM5NjM0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Blusas",
    inStock: false,
  },
  {
    id: "6",
    name: "Falda Midi Plisada",
    price: 42990,
    image: "https://images.unsplash.com/photo-1761164920960-2d776a18998c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBtb2RlbHxlbnwxfHx8fDE3NjM5MzQ0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Faldas",
    inStock: true,
    discount: 10,
  },
];

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "20 de noviembre, 2024",
    status: "delivered",
    items: 2,
    total: 127980,
    trackingNumber: "ES1234567890CN",
    estimatedDelivery: "22 de noviembre, 2024",
  },
  {
    id: "ORD-2024-002",
    date: "22 de noviembre, 2024",
    status: "shipped",
    items: 1,
    total: 45990,
    trackingNumber: "ES0987654321CN",
    estimatedDelivery: "28 de noviembre, 2024",
  },
  {
    id: "ORD-2024-003",
    date: "23 de noviembre, 2024",
    status: "processing",
    items: 3,
    total: 156970,
  },
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentView, setCurrentView] = useState<"store" | "orders" | "admin">("store");

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
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
          discount: product.discount,
        },
      ]);
    }

    toast.success("Producto agregado al carrito");
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast.success("Producto eliminado del carrito");
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsCartOpen(false);
      setIsAuthOpen(true);
      toast.error("Por favor inicia sesión para continuar");
      return;
    }
    toast.success("Procesando pedido...");
    setCartItems([]);
    setIsCartOpen(false);
  };

  const handleLogin = (email: string, name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUserName("");
      toast.success("Sesión cerrada");
    } else {
      setIsAuthOpen(true);
    }
  };

  const totalCartItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" richColors />
      
      <Header
        cartItemsCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={handleAuthClick}
        onDeliveryClick={() => setCurrentView("orders")}
        isLoggedIn={isLoggedIn}
        userName={userName}
      />

      <main className="container mx-auto px-4 py-8">
        {isLoggedIn && (
          <div className="mb-6 flex gap-2">
            <Button
              variant={currentView === "store" ? "default" : "outline"}
              onClick={() => setCurrentView("store")}
              className="gap-2"
            >
              <Store className="h-4 w-4" />
              Tienda
            </Button>
            <Button
              variant={currentView === "orders" ? "default" : "outline"}
              onClick={() => setCurrentView("orders")}
              className="gap-2"
            >
              Mis Pedidos
            </Button>
            <Button
              variant={currentView === "admin" ? "default" : "outline"}
              onClick={() => setCurrentView("admin")}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Gestión
            </Button>
          </div>
        )}

        {currentView === "store" && (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-[32px] mb-2">Colección de Moda Femenina</h1>
              <p className="text-muted-foreground">
                Descubre nuestra exclusiva selección de ropa importada de China
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}

        {currentView === "orders" && (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-[24px] mb-6">Seguimiento de Pedidos</h2>
            <DeliveryTracking orders={mockOrders} />
          </div>
        )}

        {currentView === "admin" && (
          <div className="max-w-6xl mx-auto">
            <ProductManagement
              products={products}
              onUpdateProducts={setProducts}
            />
          </div>
        )}
      </main>

      <footer className="mt-16 border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[14px] text-muted-foreground">
            © 2025 Tiendas Urbanos. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-[12px] text-muted-foreground">
            Moda femenina premium importada con la mejor calidad
          </p>
        </div>
      </footer>

      <ShoppingCartSheet
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <AuthDialog
        open={isAuthOpen}
        onOpenChange={setIsAuthOpen}
        onLogin={handleLogin}
      />
    </div>
  );
}