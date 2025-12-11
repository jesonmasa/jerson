import { Product } from "../types/product";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Star, ShoppingCart, Package } from "lucide-react";

interface ProductDetailDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductDetailDialog({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-400">• {product.category}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package className="w-4 h-4" />
              <span>{product.stock} unidades disponibles</span>
            </div>
            
            <p className="text-gray-700">{product.description}</p>
            
            <div className="mt-auto">
              <div className="text-3xl text-blue-600 mb-4">
                ${product.price}
              </div>
              
              <Button
                className="w-full"
                size="lg"
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
