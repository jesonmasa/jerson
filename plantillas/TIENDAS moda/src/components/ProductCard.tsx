import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { formatPrice } from "../utils/formatPrice";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const finalPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {product.discount && (
          <Badge className="absolute right-2 top-2 bg-destructive">
            -{product.discount}%
          </Badge>
        )}
        {!product.inStock && (
          <Badge className="absolute left-2 top-2 bg-muted text-muted-foreground">
            Agotado
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <p className="text-[12px] text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 text-[16px] line-clamp-2">{product.name}</h3>
        <div className="mt-2 flex items-center gap-2">
          {product.discount ? (
            <>
              <span className="text-[18px] text-primary">{formatPrice(finalPrice)}</span>
              <span className="text-[14px] text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="text-[18px] text-primary">{formatPrice(product.price)}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="w-full gap-2"
          variant={product.inStock ? "default" : "secondary"}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.inStock ? "Agregar al Carrito" : "Sin Stock"}
        </Button>
      </CardFooter>
    </Card>
  );
}