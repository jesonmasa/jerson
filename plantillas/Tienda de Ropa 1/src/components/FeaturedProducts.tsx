import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Heart, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const products = [
  {
    id: 1,
    name: "Vestido Sirena Elegante",
    price: 450,
    originalPrice: 550,
    image: "https://images.unsplash.com/photo-1682183948920-16d882bd786d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVuaW5nJTIwZ293biUyMGZvcm1hbCUyMGRyZXNzfGVufDF8fHx8MTc1NjE0NzUyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    reviews: 24,
    isNew: false,
    isBestseller: true
  },
  {
    id: 2,
    name: "Vestido Cocktail Rosa",
    price: 320,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1517472292914-9570a594783b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0eSUyMGRyZXNzJTIwY29sbGVjdGlvbiUyMGZhc2hpb258ZW58MXx8fHwxNzU2MTQ3NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    reviews: 18,
    isNew: true,
    isBestseller: false
  },
  {
    id: 3,
    name: "Vestido Negro Clásico",
    price: 380,
    originalPrice: 480,
    image: "https://images.unsplash.com/photo-1705174962279-714cdbdd9a30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcGFydHklMjBkcmVzcyUyMHdvbWVuJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTYxNDc1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    reviews: 32,
    isNew: false,
    isBestseller: false
  },
  {
    id: 4,
    name: "Vestido Azul Marino",
    price: 420,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1687756520306-ecad3c92fc46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyZXNzJTIwZm9ybWFsJTIwd2VhcnxlbnwxfHx8fDE3NTYxNDc1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    reviews: 15,
    isNew: true,
    isBestseller: true
  }
];

export function FeaturedProducts() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Productos Destacados
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Los vestidos más populares de nuestra colección
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
              <div className="relative overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <Badge className="bg-green-600 text-white">Nuevo</Badge>
                  )}
                  {product.isBestseller && (
                    <Badge className="bg-yellow-600 text-white">Bestseller</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge className="bg-red-600 text-white">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                {/* Wishlist button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-red-500"
                >
                  <Heart className="h-4 w-4" />
                </Button>

                {/* Quick actions overlay */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                    Vista Rápida
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    S/ {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      S/ {product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Add to cart button */}
                <Button className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white">
                  Agregar al Carrito
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-3"
          >
            Ver Todos los Productos
          </Button>
        </div>
      </div>
    </section>
  );
}