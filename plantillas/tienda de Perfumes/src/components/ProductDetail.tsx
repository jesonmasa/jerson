import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, ShoppingCart, Heart, Star } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              <div>
                <Badge className="mb-3">{product.category}</Badge>
                <p className="text-gray-500 mb-2">{product.brand}</p>
                <h1 className="text-4xl mb-4">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(124 reviews)</span>
                </div>
                <p className="text-gray-700 mb-6">{product.description}</p>
                <div className="text-3xl mb-6">${product.price.toFixed(2)}</div>
              </div>

              {/* Notes Section */}
              <div className="space-y-4 border-t border-b py-6">
                <h3 className="mb-3">Fragrance Notes</h3>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Top Notes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.notes.top.map((note, index) => (
                      <Badge key={index} variant="outline">{note}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Middle Notes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.notes.middle.map((note, index) => (
                      <Badge key={index} variant="outline">{note}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Base Notes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.notes.base.map((note, index) => (
                      <Badge key={index} variant="outline">{note}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Size and Quantity */}
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2">Size</h4>
                  <p className="text-gray-600">{product.size}</p>
                </div>

                <div>
                  <h4 className="mb-2">Quantity</h4>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Free shipping on orders over $100</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>✓</span>
                  <span>30-day return policy</span>
                </p>
                <p className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Authentic products guaranteed</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
