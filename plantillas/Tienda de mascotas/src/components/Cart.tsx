import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./ProductCard";

export interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito de Compras ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl text-gray-900 mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-600 mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <Button
              className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8"
              onClick={onClose}
            >
              Explorar Productos
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-gray-900 mb-1 line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                      <p className="text-pink-600">
                        S/ {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                        onClick={() => onRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "¡Gratis!" : `S/ ${shipping.toLocaleString()}`}
                  </span>
                </div>
                {subtotal < 50000 && (
                  <p className="text-sm text-pink-600">
                    Agrega S/ {(50000 - subtotal).toLocaleString()} más para envío gratis
                  </p>
                )}
                <div className="flex justify-between text-xl pt-2 border-t">
                  <span>Total</span>
                  <span className="text-pink-600">
                    S/ {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 rounded-full">
                Proceder al Pago
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-pink-600 text-pink-600 hover:bg-pink-50 rounded-full"
                onClick={onClose}
              >
                Continuar Comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}