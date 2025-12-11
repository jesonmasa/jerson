import { useState } from 'react';
import { X, ShoppingCart, ZoomIn, ZoomOut } from 'lucide-react';
import { Product } from '../types/product';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
          <h2>{product.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative">
              <div className={`relative overflow-hidden rounded-xl bg-neutral-100 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-auto transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <div className="mb-6">
                <span className="text-amber-600">S/ {product.price.toFixed(2)}</span>
              </div>

              <div className="mb-6">
                <h3 className="mb-2">Descripción</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="mb-2">Características</h3>
                <ul className="space-y-2 text-neutral-600">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Material de alta calidad
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Acabado profesional
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Garantía de autenticidad
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Diseño exclusivo
                  </li>
                </ul>
              </div>

              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Agregar al carrito</span>
                </button>

                {!product.inStock && (
                  <p className="text-center text-red-600">
                    Producto agotado
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
