import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Product } from "./ProductCard";
import { useState } from "react";
import { Check } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: number) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(0);

  if (!product) return null;

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize);
      onClose();
      setSelectedSize(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <ImageWithFallback 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <Badge className="absolute top-4 left-4 bg-blue-500">Nuevo</Badge>
            )}
            {product.discount && (
              <Badge className="absolute top-4 right-4 bg-red-500">-{product.discount}%</Badge>
            )}
          </div>

          <div className="flex flex-col">
            <div>
              <p className="text-gray-600">{product.category}</p>
              <h2 className="text-3xl mt-2">{product.name}</h2>
              
              <div className="flex items-center gap-3 mt-4">
                <span className="text-3xl">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor === index ? 'border-black' : 'border-gray-200'
                    } relative`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === index && (
                      <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-3">Talla</h3>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(size)}
                    className="h-12"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleAddToCart}
                disabled={!selectedSize}
              >
                Agregar al Carrito
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Agregar a Favoritos
              </Button>
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <h4 className="mb-2">Descripción</h4>
                <p className="text-sm text-gray-600">
                  Calzado de alta calidad diseñado para brindarte el máximo confort y estilo. 
                  Fabricado con materiales premium y tecnología de última generación.
                </p>
              </div>

              <div>
                <h4 className="mb-2">Características</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Material exterior: Cuero/Sintético de alta calidad</li>
                  <li>• Suela: Caucho antideslizante</li>
                  <li>• Plantilla: Acolchada para máximo confort</li>
                  <li>• Envío gratis en pedidos superiores a $50</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
