import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
  colors: string[];
  sizes: number[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onProductClick }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-0 shadow-none hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative overflow-hidden bg-gray-100 aspect-square" onClick={() => onProductClick(product)}>
        <ImageWithFallback 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-blue-500">Nuevo</Badge>
        )}
        {product.discount && (
          <Badge className="absolute top-2 right-2 bg-red-500">-{product.discount}%</Badge>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 text-sm">{product.category}</p>
        <h3 className="mt-1">{product.name}</h3>
        
        <div className="flex items-center gap-2 mt-2">
          {product.colors.map((color, index) => (
            <div 
              key={index}
              className="w-5 h-5 rounded-full border-2 border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="ml-2 text-sm text-gray-500 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>
    </Card>
  );
}
