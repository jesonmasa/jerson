import { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { CreditCard, CircleCheck } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onPaymentSuccess: () => void;
}

export function CheckoutDialog({
  isOpen,
  onClose,
  total,
  onPaymentSuccess,
}: CheckoutDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simular procesamiento de pago
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      setTimeout(() => {
        onPaymentSuccess();
        handleClose();
      }, 2500);
    }, 2000);
  };

  const handleClose = () => {
    setPaymentMethod(null);
    setPaymentComplete(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Completar Pago</DialogTitle>
        </DialogHeader>

        {paymentComplete ? (
          <div className="py-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <CircleCheck className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl mb-2 text-green-600">¡Pago Exitoso!</h3>
            <p className="text-gray-600">
              Tu pedido ha sido procesado correctamente
            </p>
            <p className="mt-4">
              Total pagado: <span className="text-blue-600">${total.toFixed(2)}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <p className="mb-4">
                  Total a pagar: <span className="text-2xl text-blue-600">${total.toFixed(2)}</span>
                </p>
              </div>

              <div className="space-y-3">
                <Label>Selecciona método de pago</Label>
                
                {/* Tarjeta de Crédito/Débito */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">Tarjeta de Crédito/Débito</div>
                    <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`w-full p-4 border-2 rounded-lg flex items-center gap-3 transition-all ${
                    paymentMethod === "paypal"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-12 h-12 bg-[#0070BA] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-gray-500">Pago rápido y seguro</div>
                  </div>
                  {paymentMethod === "paypal" && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              </div>

              {/* Formulario de tarjeta */}
              {paymentMethod === "card" && (
                <div className="space-y-3 mt-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="cardNumber">Número de tarjeta</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="expiry">Vencimiento</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={3}
                        type="password"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="name">Nombre en la tarjeta</Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>
              )}

              {/* Información de PayPal */}
              {paymentMethod === "paypal" && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600 text-center">
                    Serás redirigido a PayPal para completar el pago de forma segura
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePayment}
                className="flex-1"
                disabled={!paymentMethod || isProcessing}
              >
                {isProcessing ? "Procesando..." : "Pagar Ahora"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
