import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  isNew?: boolean;
  isPopular?: boolean;
}

export function ProductCard({
  name,
  description,
  price,
  originalPrice,
  image,
  rating,
  isNew,
  isPopular
}: ProductCardProps) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      <CardHeader className="p-0 relative">
        <div className="aspect-square rounded-t-lg overflow-hidden">
          <ImageWithFallback
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-green-500 text-white">
              Nuevo
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-amber-500 text-white">
              Popular
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{rating}</span>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="text-lg text-amber-900 group-hover:text-amber-700 transition-colors">
            {name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xl text-amber-800">
              S/ {price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                S/ {originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          className="w-full bg-amber-800 hover:bg-amber-900 text-white gap-2"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Agregar al Carrito
        </Button>
      </CardFooter>
    </Card>
  );
}