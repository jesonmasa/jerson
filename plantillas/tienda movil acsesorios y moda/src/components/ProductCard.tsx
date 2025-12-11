import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  onFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function ProductCard({
  id,
  image,
  name,
  brand,
  price,
  originalPrice,
  discount,
  onFavorite,
  onClick,
}: ProductCardProps) {
  return (
    <Card
      className="overflow-hidden border-0 shadow-none cursor-pointer group"
      onClick={() => onClick?.(id)}
    >
      <div className="relative aspect-[3/4] bg-muted overflow-hidden mb-3">
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount && (
          <Badge className="absolute top-3 left-3 bg-destructive">
            -{discount}%
          </Badge>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.(id);
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">{brand}</p>
        <p className="text-sm line-clamp-1">{name}</p>
        <div className="flex items-center gap-2">
          <p className="font-medium">${price.toFixed(2)}</p>
          {originalPrice && (
            <p className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
