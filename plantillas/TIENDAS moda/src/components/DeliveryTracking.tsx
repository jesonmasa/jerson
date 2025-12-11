import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { formatPrice } from "../utils/formatPrice";

export interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  items: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface DeliveryTrackingProps {
  orders: Order[];
}

const statusLabels = {
  pending: "Pendiente",
  processing: "En Proceso",
  shipped: "Enviado",
  delivered: "Entregado",
};

const statusIcons = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
};

const statusProgress = {
  pending: 25,
  processing: 50,
  shipped: 75,
  delivered: 100,
};

const statusColors = {
  pending: "bg-muted text-muted-foreground",
  processing: "bg-accent text-accent-foreground",
  shipped: "bg-primary text-primary-foreground",
  delivered: "bg-secondary text-secondary-foreground",
};

export function DeliveryTracking({ orders }: DeliveryTrackingProps) {
  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3>No tienes pedidos aún</h3>
          <p className="text-[14px] text-muted-foreground mt-2">
            Tus pedidos aparecerán aquí una vez que realices una compra
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const StatusIcon = statusIcons[order.status];
        const statusLabel = statusLabels[order.status];
        const progress = statusProgress[order.status];
        const statusColor = statusColors[order.status];

        return (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-[16px]">Pedido #{order.id}</CardTitle>
                  <p className="text-[14px] text-muted-foreground mt-1">
                    {order.date}
                  </p>
                </div>
                <Badge className={statusColor}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {statusLabel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[14px]">
                  <span className="text-muted-foreground">Progreso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-[14px]">
                <div>
                  <p className="text-muted-foreground">Artículos</p>
                  <p>{order.items} producto{order.items !== 1 ? "s" : ""}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-primary">{formatPrice(order.total)}</p>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="rounded-md bg-muted p-3 text-[14px]">
                  <p className="text-muted-foreground">Número de Seguimiento</p>
                  <p className="mt-1">{order.trackingNumber}</p>
                </div>
              )}

              {order.estimatedDelivery && order.status !== "delivered" && (
                <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Entrega estimada: {order.estimatedDelivery}</span>
                </div>
              )}

              {order.status === "delivered" && (
                <div className="flex items-center gap-2 text-[14px] text-secondary">
                  <CheckCircle className="h-4 w-4" />
                  <span>Pedido entregado exitosamente</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}