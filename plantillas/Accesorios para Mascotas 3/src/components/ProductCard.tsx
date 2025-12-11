import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'perro' | 'gato';
  rating: number;
  isOnSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export function ProductCard({ 
  product, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite = false 
}: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <ImageWithFallback 
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {product.isOnSale && (
            <Badge className="absolute top-2 left-2 bg-destructive">
              Oferta
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-2 right-2 p-2 hover:bg-white/80 ${
              isFavorite ? 'text-red-500' : 'text-gray-500'
            }`}
            onClick={() => onToggleFavorite?.(product.id)}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-foreground mb-1 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2 capitalize">
            Para {product.category}s
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground">
                €{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  €{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-muted-foreground ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Añadir al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}