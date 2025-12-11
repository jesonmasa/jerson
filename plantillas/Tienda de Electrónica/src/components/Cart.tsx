import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./ProductCard";

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  children: React.ReactNode;
}

export function Cart({ 
  isOpen, 
  onOpenChange, 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  children 
}: CartProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2500; // Envío gratis sobre ₡50,000
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            Carrito de compras ({items.reduce((sum, item) => sum + item.quantity, 0)} artículos)
          </SheetTitle>
          <SheetDescription>
            Revisa y modifica los productos en tu carrito antes de proceder al pago
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tu carrito está vacío
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex space-x-3 border-b pb-4">
                  <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm line-clamp-2">{item.name}</h4>
                    <p className="text-sm">{formatPrice(item.price)}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Summary */}
          {items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span>
                    {shipping === 0 ? (
                      <Badge variant="secondary" className="text-xs">Gratis</Badge>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {subtotal > 0 && subtotal < 50000 && (
                  <p className="text-xs text-muted-foreground">
                    Agrega {formatPrice(50000 - subtotal)} más para envío gratis
                  </p>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Proceder al pago
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}