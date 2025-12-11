import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatPrice } from "../utils/formatPrice";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface ShoppingCartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export function ShoppingCartSheet({
  open,
  onOpenChange,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: ShoppingCartSheetProps) {
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.discount
      ? item.price * (1 - item.discount / 100)
      : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const shipping = subtotal > 50000 ? 0 : 5000;
  const total = subtotal + shipping;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {items.length === 0
              ? "Tu carrito está vacío"
              : `${items.length} producto${items.length !== 1 ? "s" : ""} en tu carrito`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-muted-foreground">
                No hay productos en tu carrito
              </p>
              <p className="text-[14px] text-muted-foreground">
                ¡Comienza a agregar tus favoritos!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const itemPrice = item.discount
                  ? item.price * (1 - item.discount / 100)
                  : item.price;

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h4 className="text-[14px] line-clamp-2">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="mt-1 text-[14px] text-primary">
                        {formatPrice(itemPrice)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-[14px]">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2 py-4">
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted-foreground">Envío</span>
                <span>{shipping === 0 ? "¡Gratis!" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[12px] text-muted-foreground">
                  Envío gratis en compras mayores a $50.000 CLP
                </p>
              )}
              <Separator />
              <div className="flex justify-between">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            <SheetFooter>
              <Button onClick={onCheckout} className="w-full">
                Proceder al Pago
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}