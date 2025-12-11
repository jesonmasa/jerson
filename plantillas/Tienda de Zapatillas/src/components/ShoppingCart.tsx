import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from './AuthContext';
import { toast } from 'sonner@2.0.3';
import { formatCurrency } from './utils/currency';

export interface CartItem {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  size: number;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, size: number, quantity: number) => void;
  onRemoveItem: (id: number, size: number) => void;
}

export function ShoppingCart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: ShoppingCartProps) {
  const { user, addOrder } = useAuth();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      toast.error('Debes iniciar sesión para finalizar tu compra');
      return;
    }

    if (items.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    // Create order
    const newOrder = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.image,
      })),
      total,
      status: 'confirmado' as const,
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      shippingAddress: user.address || 'Dirección por confirmar',
    };

    addOrder(newOrder);
    toast.success('¡Pedido realizado exitosamente! Revisa el seguimiento en tu perfil.');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Carrito ({totalItems})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Tu carrito está vacío</p>
                <p className="text-sm text-gray-400 mt-2">
                  Añade algunos productos para empezar
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex space-x-3">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-500 uppercase">
                              {item.brand}
                            </p>
                            <h4 className="font-medium text-sm line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500">Talla: {item.size}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id, item.size)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateQuantity(item.id, item.size, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                onUpdateQuantity(item.id, item.size, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(total)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Finalizar Compra
                  </Button>
                  <Button variant="outline" className="w-full" onClick={onClose}>
                    Seguir Comprando
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}