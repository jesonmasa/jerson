import { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  sizes: number[];
  colors: string[];
  isNew?: boolean;
  isOnSale?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize);
      setSelectedSize(null);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.isNew && (
              <Badge className="bg-green-500 hover:bg-green-600">Nuevo</Badge>
            )}
            {product.isOnSale && (
              <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>
            )}
          </div>

          {/* Heart Icon */}
          <Button
            variant="ghost"
            size="sm"
            className={`absolute top-3 right-3 rounded-full ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            } hover:text-red-500`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="p-4">
          {/* Brand and Name */}
          <div className="mb-2">
            <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</p>
            <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl font-bold text-gray-900">€{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                €{product.originalPrice}
              </span>
            )}
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">Talla:</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 text-sm border rounded ${
                    selectedSize === size
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full"
          >
            {selectedSize ? 'Añadir al Carrito' : 'Selecciona una talla'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}