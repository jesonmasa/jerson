import { ShoppingCart, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary">Agotado</Badge>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <Badge variant="outline" className="mb-2 text-xs">
            {product.category}
          </Badge>
          <h3 className="line-clamp-2">{product.name}</h3>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < product.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-muted text-muted"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating}.0)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          
          <Button
            size="icon"
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
