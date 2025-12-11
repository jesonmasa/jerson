import { ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  specs: string;
}

export function Products() {
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: "NOTE 50S 5G",
      price: 120000,
      image:
        "data:image/webp;base64,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",
      specs:
        "Capacidad de almacenamiento: 256 GB  Tamaño de la pantalla: 6.7 pulgadas",
    },
    {
      id: 2,
      name: "INFINIX GT 30 Pro",
      price: 1500000,
      image:
        "https://www.gizmochina.com/wp-content/uploads/2024/05/Infinix-GT-20-Pro-5G-1024x652.webp",
      specs: "256GB, Phantom Black",
    },
    {
      id: 3,
      name: "INFINIX HOT 60 Pro+",
      price: 2000000,
      image:
        "https://zeropar.com/wp-content/uploads/2025/08/infinix-hot-60-pro-plus-plata-titanio.webp",
      specs: "256GB, Obsidian",
    },
    {
      id: 4,
      name: "Pocc  F7 Ultra",
      price: 3460000,
      image:
        "https://i02.appmifile.com/mi-com-product/fly-birds/poco-f7-ultra/PC/705a27ca864053389f86eb033b19e000.jpg?f=webp",
      specs: "256GB, Amarillo",
    },
    {
      id: 5,
      name: "Samsung Galaxy A54",
      price: 449,
      image:
        "https://images.unsplash.com/photo-1691449808001-bb8c157f0094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwcGhvbmV8ZW58MXx8fHwxNzYyMzU2OTkzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      specs: "256GB, Awesome Lime",
    },
    {
      id: 6,
      name: "Xiaomi 13 Pro",
      price: 799,
      image:
        "https://images.unsplash.com/photo-1741061963569-9d0ef54d10d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzYyMzUxNDEyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      specs: "256GB, Ceramic Black",
    },
  ];

  return (
    <section
      id="celulares"
      className="py-16 md:py-24 bg-gray-50"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl text-center mb-4">
          Celulares disponibles
        </h2>
        <p className="text-center text-gray-600 mb-12 text-xl">
          Los últimos modelos con garantía incluida
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600">
                    {product.specs}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-3xl text-blue-600">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl mb-4">Producto agregado</h3>
            <p className="text-gray-600 mb-6">
              {selectedProduct.name} ha sido agregado a tu
              carrito.
            </p>
            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        </div>
      )}
    </section>
  );
}