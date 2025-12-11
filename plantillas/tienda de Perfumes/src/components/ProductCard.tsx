import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';
import { toast } from 'sonner@2.0.3';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative"
      onClick={() => onViewDetails(product)}
    >
      {(product.isNew || product.onSale) && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="bg-[#8b1538] hover:bg-[#8b1538]">NEW</Badge>
          )}
          {product.onSale && (
            <Badge className="bg-[#f5dc84] text-[#2c1810] hover:bg-[#f5dc84]">SALE</Badge>
          )}
        </div>
      )}
      <CardContent className="p-0">
        <div className="aspect-square overflow-hidden bg-gray-50">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
          <h3 className="mb-1">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{product.category}</p>
          <div className="flex items-center gap-2">
            {product.onSale && product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-2xl">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}