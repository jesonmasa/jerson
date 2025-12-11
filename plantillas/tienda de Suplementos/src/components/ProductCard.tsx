import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Star, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  category,
  isNew,
  isBestSeller,
}: ProductCardProps) {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {isNew && (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              Novo
            </Badge>
          )}
          {isBestSeller && (
            <Badge variant="default" className="bg-orange-500 hover:bg-orange-600">
              Mais Vendido
            </Badge>
          )}
          {discount > 0 && (
            <Badge variant="destructive">
              -{discount}%
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">{category}</div>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({reviewCount})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">R$ {price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                R$ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2">
          <ShoppingCart className="h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}