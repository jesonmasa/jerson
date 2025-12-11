import { useState } from "react";
import { Card } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Separator } from "./components/ui/separator";
import { ProductCard } from "./components/ProductCard";
import { BottomNav } from "./components/BottomNav";
import { CategoryIcon } from "./components/CategoryIcon";
import { NotificationItem } from "./components/NotificationItem";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { 
  Search, 
  ChevronLeft, 
  Tag, 
  CreditCard, 
  Truck,
  Shirt,
  ShoppingBag,
  Watch,
  Glasses,
  TrendingUp,
  Sparkles
} from "lucide-react";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [promoCode, setPromoCode] = useState("");
  const [shippingOption, setShippingOption] = useState("express");

  const products = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1706765779494-2705542ebe74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTUxOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Chaqueta Térmica de Invierno",
      brand: "NorthStyle",
      price: 89.99,
      originalPrice: 149.99,
      discount: 40,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1731403798951-72ef4996dd41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzd2VhdGVyJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5NTkyNTc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Suéter Casual Oversize",
      brand: "UrbanWear",
      price: 45.99,
      originalPrice: 65.99,
      discount: 30,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1578693082747-50c396cacd81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZWFucyUyMGRlbmltJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk1MjYwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Jeans Slim Fit Azul",
      brand: "DenimCo",
      price: 59.99,
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1758702701300-372126112cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk1MjYwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Sneakers Deportivos Blancos",
      brand: "SportFlex",
      price: 79.99,
      originalPrice: 99.99,
      discount: 20,
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1611025504703-8c143abe6996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2F0JTIwd2ludGVyJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTk1OTI1ODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Abrigo Largo de Lana",
      brand: "ElegantWear",
      price: 129.99,
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1542219550-b1b13a6a29eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0c2hpcnQlMjBjbG90aGluZyUyMG1pbmltYWx8ZW58MXx8fHwxNzU5NTkyNTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      name: "Camiseta Básica Premium",
      brand: "Essentials",
      price: 24.99,
    },
  ];

  const cartItems = [
    {
      id: "1",
      image: products[0].image,
      name: "Chaqueta Térmica de Invierno",
      brand: "NorthStyle",
      size: "M",
      quantity: 1,
      price: 89.99,
    },
    {
      id: "2",
      image: products[1].image,
      name: "Suéter Casual Oversize",
      brand: "UrbanWear",
      size: "L",
      quantity: 2,
      price: 45.99,
    },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shippingCost = shippingOption === "express" ? 15 : 0;
  const total = subtotal + tax + shippingCost;

  // Home Screen
  const renderHomeScreen = () => (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-background sticky top-0 z-40 border-b border-border">
        <div className="px-6 py-4">
          <h1 className="mb-4">OutfitGo</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ropa, marcas..."
              className="pl-10 bg-muted border-0"
              onClick={() => setCurrentScreen("search")}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="px-6">
        {/* Winter Sale Banner */}
        <Card className="mt-6 overflow-hidden border-0 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="p-6">
            <Badge className="bg-white text-blue-800 mb-3">Oferta Especial</Badge>
            <h2 className="text-white mb-2">Ofertas de Invierno</h2>
            <p className="text-blue-100 mb-4">Hasta 40% de descuento en ropa de invierno</p>
            <Button variant="secondary" size="sm">
              Ver Colección
            </Button>
          </div>
        </Card>

        {/* Categories */}
        <div className="mt-8">
          <h3 className="mb-4">Categorías</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6">
            <CategoryIcon icon={Shirt} label="Chamarras" />
            <CategoryIcon icon={ShoppingBag} label="Botas" />
            <CategoryIcon icon={Watch} label="Accesorios" />
            <CategoryIcon icon={Glasses} label="Lentes" />
            <CategoryIcon icon={TrendingUp} label="Tendencias" />
          </div>
        </div>

        {/* New Arrivals */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3>Novedades de Temporada</h3>
            </div>
            <Button variant="ghost" size="sm">Ver todo</Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Checkout Screen
  const renderCheckoutScreen = () => (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-background sticky top-0 z-40 border-b border-border">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => setCurrentScreen("home")}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2>Resumen de Compra</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Cart Items */}
        <Card className="p-4">
          <h3 className="mb-4">Productos</h3>
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{item.brand}</p>
                    <p className="mb-1">{item.name}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Talla: {item.size}</span>
                      <span>Cant: {item.quantity}</span>
                    </div>
                  </div>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                {index < cartItems.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Shipping */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-5 h-5 text-primary" />
            <h3>Envío</h3>
          </div>
          <p className="text-sm">
            Calle Principal 123, Apt 4B
            <br />
            Madrid, 28001
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 p-0 h-auto"
            onClick={() => setCurrentScreen("shipping")}
          >
            Cambiar dirección
          </Button>
        </Card>

        {/* Delivery */}
        <Card className="p-4">
          <h3 className="mb-3">Entrega</h3>
          <div className="flex items-center justify-between">
            <div>
              <p>Servicio {shippingOption === "express" ? "Express" : "Normal"}</p>
              <p className="text-sm text-muted-foreground">
                {shippingOption === "express" ? "30 min - 1 hora" : "2 - 4 horas"}
              </p>
            </div>
            <p>{shippingOption === "express" ? "$15.00" : "Gratis"}</p>
          </div>
        </Card>

        {/* Payment */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <h3>Pago</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
              VISA
            </div>
            <div>
              <p>•••• •••• •••• 4532</p>
              <p className="text-sm text-muted-foreground">Exp: 12/26</p>
            </div>
          </div>
        </Card>

        {/* Promo Code */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-5 h-5 text-primary" />
            <h3>Código Promocional</h3>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa código"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="bg-muted border-0"
            />
            <Button variant="outline">Aplicar</Button>
          </div>
        </Card>

        {/* Summary */}
        <Card className="p-4">
          <h3 className="mb-4">Resumen</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Impuestos (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Envío</span>
              <span>{shippingCost === 0 ? "Gratis" : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Button className="w-full" size="lg">
          Realizar Pago
        </Button>
      </div>
    </div>
  );

  // Search/Explore Screen
  const renderSearchScreen = () => (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-background sticky top-0 z-40 border-b border-border">
        <div className="px-6 py-4">
          <h1 className="mb-4">Explorar</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ropa, marcas..."
              className="pl-10 bg-muted border-0"
            />
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Popular Categories */}
        <div>
          <h3 className="mb-4">Categorías Populares</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="overflow-hidden border-0 shadow-sm cursor-pointer group">
              <div className="relative h-40 bg-gradient-to-br from-blue-500 to-blue-700">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1706765779494-2705542ebe74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc1OTUxOTQyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ropa de Invierno"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <p className="text-white">Ropa de Invierno</p>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden border-0 shadow-sm cursor-pointer group">
              <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-900">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1660486044177-45cd45bb5e99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMGZhc2hpb24lMjBzdHJlZXR3ZWFyfGVufDF8fHx8MTc1OTYwMjA0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Estilo Urbano"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <p className="text-white">Estilo Urbano</p>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden border-0 shadow-sm cursor-pointer group">
              <div className="relative h-40 bg-gradient-to-br from-green-600 to-green-800">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1645207803533-e2cfe1382f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHN3ZWFyJTIwYXRobGV0aWMlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTk2MDIwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ropa Deportiva"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <p className="text-white">Ropa Deportiva</p>
                </div>
              </div>
            </Card>
            <Card className="overflow-hidden border-0 shadow-sm cursor-pointer group">
              <div className="relative h-40 bg-gradient-to-br from-purple-600 to-purple-800">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1617229378071-daa5eeff0db7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBtaW5pbWFsfGVufDF8fHx8MTc1OTU4Mzc2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Accesorios"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 transition-opacity"
                />
                <div className="absolute inset-0 flex items-end p-4">
                  <p className="text-white">Accesorios</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Trending Now */}
        <div>
          <h3 className="mb-4">Tendencias del Momento</h3>
          <div className="flex flex-wrap gap-2">
            {["#ModaInvierno2025", "#EstiloMinimalista", "#UrbanWear", "#OutfitDelDía", 
             "#TendenciasSostenibles", "#Vintage", "#Streetwear"].map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Exclusive Collaboration Banner */}
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-pink-600 to-purple-700 text-white">
          <div className="p-6">
            <Badge className="bg-white text-purple-800 mb-3">Exclusivo</Badge>
            <h2 className="text-white mb-2">Colaboración Exclusiva</h2>
            <p className="text-purple-100 mb-4">
              Descubre la nueva colección diseñada por artistas emergentes
            </p>
            <Button variant="secondary" size="sm">
              Explorar Ahora
            </Button>
          </div>
        </Card>

        {/* Recently Searched */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>Búsquedas Recientes</h3>
            <Button variant="ghost" size="sm">Limpiar</Button>
          </div>
          <div className="space-y-3">
            {["Chaquetas de cuero", "Botas de invierno", "Jeans negros"].map((search) => (
              <div
                key={search}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{search}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Notifications Screen
  const renderNotificationsScreen = () => (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-background sticky top-0 z-40 border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1>Notificaciones</h1>
          <Button variant="ghost" size="sm">
            Marcar todas como leídas
          </Button>
        </div>
      </div>

      <div>
        <NotificationItem
          type="order"
          title="Pedido Enviado"
          description="Tu pedido #GO-456 ha sido enviado y está en camino."
          time="Hace 2 horas"
          unread
        />
        <NotificationItem
          type="offer"
          title="¡Oferta Relámpago!"
          description="¡Solo 48h! -50% adicional en la sección de suéteres."
          time="Hace 5 horas"
          unread
        />
        <NotificationItem
          type="wishlist"
          title="Producto Disponible"
          description="El artículo que te gusta (Chaqueta de Mezclilla) ha vuelto a estar en stock."
          time="Hace 1 día"
        />
        <NotificationItem
          type="order"
          title="Pedido Entregado"
          description="Tu pedido #GO-432 ha sido entregado exitosamente."
          time="Hace 2 días"
        />
        <NotificationItem
          type="offer"
          title="Nueva Colección"
          description="Descubre nuestra nueva colección de primavera con diseños exclusivos."
          time="Hace 3 días"
        />
        <NotificationItem
          type="wishlist"
          title="Bajada de Precio"
          description="El precio de Sneakers Blancos ha bajado un 20%."
          time="Hace 4 días"
        />
        <NotificationItem
          type="order"
          title="Confirmación de Pedido"
          description="Tu pedido #GO-456 ha sido confirmado y está siendo preparado."
          time="Hace 1 semana"
        />
      </div>
    </div>
  );

  // Shipping Screen
  const renderShippingScreen = () => (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-background sticky top-0 z-40 border-b border-border">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => setCurrentScreen("cart")}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2>Dirección de Entrega</h2>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Shipping Address Form */}
        <Card className="p-4">
          <h3 className="mb-4">Dirección</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Calle y Número</Label>
              <Input
                id="street"
                placeholder="Ej: Calle Principal 123"
                defaultValue="Calle Principal 123"
                className="bg-muted border-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Apartamento / Piso (Opcional)</Label>
              <Input
                id="apartment"
                placeholder="Ej: Apt 4B"
                defaultValue="Apt 4B"
                className="bg-muted border-0"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="Madrid"
                  defaultValue="Madrid"
                  className="bg-muted border-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal">Código Postal</Label>
                <Input
                  id="postal"
                  placeholder="28001"
                  defaultValue="28001"
                  className="bg-muted border-0"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Shipping Options */}
        <Card className="p-4">
          <h3 className="mb-4">Opciones de Envío</h3>
          <RadioGroup value={shippingOption} onValueChange={setShippingOption}>
            <div className="space-y-3">
              <label
                htmlFor="express"
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  shippingOption === "express"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="express" id="express" />
                  <div>
                    <p>Servicio Express</p>
                    <p className="text-sm text-muted-foreground">
                      Estimación: 30 min - 1 hora
                    </p>
                  </div>
                </div>
                <p>$15.00</p>
              </label>

              <label
                htmlFor="normal"
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  shippingOption === "normal"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="normal" id="normal" />
                  <div>
                    <p>Servicio Normal</p>
                    <p className="text-sm text-muted-foreground">
                      Estimación: 2 - 4 horas
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Gratis</Badge>
              </label>
            </div>
          </RadioGroup>
        </Card>

        <Button
          className="w-full"
          size="lg"
          onClick={() => setCurrentScreen("cart")}
        >
          Confirmar Dirección
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {currentScreen === "home" && renderHomeScreen()}
      {currentScreen === "search" && renderSearchScreen()}
      {currentScreen === "cart" && renderCheckoutScreen()}
      {currentScreen === "notifications" && renderNotificationsScreen()}
      {currentScreen === "shipping" && renderShippingScreen()}
      {currentScreen === "profile" && (
        <div className="pb-24 px-6 py-6">
          <h1 className="mb-4">Perfil</h1>
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl">
                JD
              </div>
              <div>
                <h2>Juan Díaz</h2>
                <p className="text-sm text-muted-foreground">juan.diaz@email.com</p>
              </div>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Mis Pedidos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Lista de Deseos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Direcciones Guardadas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Métodos de Pago
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Configuración
              </Button>
            </div>
          </Card>
        </div>
      )}

      <BottomNav
        activeScreen={currentScreen}
        onNavigate={setCurrentScreen}
        cartCount={cartItems.length}
      />
    </div>
  );
}
