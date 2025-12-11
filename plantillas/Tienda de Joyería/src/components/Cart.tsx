import { X, Minus, Plus, Trash2, MessageCircle } from 'lucide-react';
import { Product } from '../types/product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleWhatsAppCheckout = () => {
    const phoneNumber = '51971728905';
    let message = '¡Hola! Me gustaría realizar un pedido:\n\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.product.name}\n`;
      message += `   Cantidad: ${item.quantity}\n`;
      message += `   Precio: S/ ${(item.product.price * item.quantity).toFixed(2)}\n\n`;
    });
    
    message += `Total: S/ ${subtotal.toFixed(2)}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <h2>Carrito de Compras</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="text-neutral-400 mb-4">
              <svg
                className="w-24 h-24 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="mb-2">Tu carrito está vacío</h3>
            <p className="text-neutral-600 mb-6">
              Agrega productos para comenzar tu compra
            </p>
            <button
              onClick={onClose}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 bg-neutral-50 rounded-lg p-4"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-1 line-clamp-2">
                        {item.product.name}
                      </h3>
                      <p className="text-amber-600 mb-2">
                        S/ {item.product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 hover:bg-neutral-200 rounded transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 hover:bg-neutral-200 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRemove(item.product.id)}
                          className="ml-auto p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
                <span>Total</span>
                <span className="text-amber-600">S/ {subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Realizar pedido por WhatsApp</span>
              </button>
              <p className="text-xs text-center text-neutral-500">
                Serás redirigido a WhatsApp para confirmar tu pedido
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
