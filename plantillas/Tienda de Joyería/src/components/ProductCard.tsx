import { ShoppingCart, ZoomIn } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onClick={onClick}
        />
        <button
          onClick={onClick}
          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg">
              Agotado
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="mb-2">
          <span className="text-xs text-amber-600 uppercase tracking-wider">
            {product.category}
          </span>
        </div>
        <h3 className="mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-amber-600">S/ {product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm">Agregar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
