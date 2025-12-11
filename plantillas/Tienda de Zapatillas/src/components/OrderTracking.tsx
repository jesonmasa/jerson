import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig = {
  pendiente: {
    label: 'Pendiente',
    color: 'bg-yellow-500',
    icon: Clock,
    description: 'Tu pedido está siendo procesado'
  },
  confirmado: {
    label: 'Confirmado',
    color: 'bg-blue-500',
    icon: CheckCircle,
    description: 'Pedido confirmado y en preparación'
  },
  preparando: {
    label: 'Preparando',
    color: 'bg-orange-500',
    icon: Package,
    description: 'Estamos preparando tu pedido'
  },
  enviado: {
    label: 'Enviado',
    color: 'bg-purple-500',
    icon: Truck,
    description: 'Tu pedido está en camino'
  },
  en_transito: {
    label: 'En Tránsito',
    color: 'bg-indigo-500',
    icon: Truck,
    description: 'En ruta hacia tu dirección'
  },
  entregado: {
    label: 'Entregado',
    color: 'bg-green-500',
    icon: CheckCircle,
    description: 'Pedido entregado exitosamente'
  }
};

export function OrderTracking({ isOpen, onClose }: OrderTrackingProps) {
  const { user, orders } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);

  const handleSearch = () => {
    // In a real app, this would make an API call
    const order = orders.find(o => o.trackingNumber === trackingNumber);
    setSearchedOrder(order || null);
    
    if (!order) {
      // Mock tracking for demo purposes
      if (trackingNumber.startsWith('SNK-')) {
        setSearchedOrder({
          id: 'DEMO',
          trackingNumber,
          status: 'en_transito',
          items: [{ name: 'Producto de ejemplo', brand: 'Demo', quantity: 1 }],
          total: 250000,
          estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
          shippingAddress: 'Dirección de entrega',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        });
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getStatusSteps = (currentStatus: string) => {
    const statusOrder = ['confirmado', 'preparando', 'enviado', 'en_transito', 'entregado'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    return statusOrder.map((status, index) => ({
      ...statusConfig[status],
      status,
      isCompleted: index <= currentIndex,
      isCurrent: index === currentIndex,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Seguimiento de Pedidos</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar por número de seguimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="Ej: SNK-2024-001"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Orders */}
          {user && orders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Mis Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSearchedOrder(order)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Pedido #{order.id}</p>
                          <p className="text-sm text-gray-500">
                            Tracking: {order.trackingNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={statusConfig[order.status].color}>
                            {statusConfig[order.status].label}
                          </Badge>
                          <p className="text-sm font-medium mt-1">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Details */}
          {searchedOrder && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Detalles del Pedido</span>
                  <Badge className={statusConfig[searchedOrder.status].color}>
                    {statusConfig[searchedOrder.status].label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Información del Pedido</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Número:</span> {searchedOrder.id}</p>
                      <p><span className="text-gray-500">Tracking:</span> {searchedOrder.trackingNumber}</p>
                      <p><span className="text-gray-500">Fecha:</span> {formatDate(searchedOrder.createdAt)}</p>
                      <p><span className="text-gray-500">Total:</span> {formatPrice(searchedOrder.total)}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Entrega</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-500">Dirección:</span></p>
                      <p>{searchedOrder.shippingAddress}</p>
                      <p><span className="text-gray-500">Entrega estimada:</span></p>
                      <p>{formatDate(searchedOrder.estimatedDelivery)}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking Progress */}
                <div>
                  <h4 className="font-medium mb-4">Estado del Envío</h4>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-6">
                      {getStatusSteps(searchedOrder.status).map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div key={step.status} className="relative flex items-start space-x-4">
                            <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                              step.isCompleted 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : step.isCurrent
                                ? 'bg-blue-500 border-blue-500 text-white'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1 pt-2">
                              <p className={`font-medium ${step.isCompleted || step.isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.label}
                              </p>
                              <p className={`text-sm ${step.isCompleted || step.isCurrent ? 'text-gray-600' : 'text-gray-400'}`}>
                                {step.description}
                              </p>
                              {step.isCurrent && (
                                <p className="text-xs text-blue-600 mt-1">Estado actual</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="font-medium mb-4">Productos</h4>
                  <div className="space-y-3">
                    {searchedOrder.items.map((item, index) => (
                      <div key={index} className="flex space-x-3 p-3 border rounded-lg">
                        {item.image && (
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h5 className="font-medium">{item.name}</h5>
                          <p className="text-sm text-gray-500">{item.brand}</p>
                          {item.size && (
                            <p className="text-sm text-gray-500">Talla: {item.size}</p>
                          )}
                          <p className="text-sm">Cantidad: {item.quantity}</p>
                        </div>
                        {item.price && (
                          <div className="text-right">
                            <p className="font-medium">{formatPrice(item.price)}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {searchedOrder === null && trackingNumber && (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No se encontró ningún pedido con el número de seguimiento: {trackingNumber}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Verifica que el número esté correcto
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}