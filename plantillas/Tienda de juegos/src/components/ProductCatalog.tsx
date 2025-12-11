import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingCart, Star } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
}

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
}

const products: Product[] = [
  {
    id: '1',
    name: 'PlayStation 5',
    brand: 'Sony',
    price: 499.99,
    originalPrice: 549.99,
    image: 'https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4Ym94JTIwZ2FtaW5nJTIwY29uc29sZXxlbnwxfHx8fDE3NTU0NDMwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
    reviews: 2547,
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Xbox Series X',
    brand: 'Microsoft',
    price: 459.99,
    image: 'https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4Ym94JTIwZ2FtaW5nJTIwY29uc29sZXxlbnwxfHx8fDE3NTU0NDMwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    reviews: 1823,
    inStock: true,
  },
  {
    id: '3',
    name: 'Nintendo Switch OLED',
    brand: 'Nintendo',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaW50ZW5kbyUyMHN3aXRjaCUyMGNvbnNvbGV8ZW58MXx8fHwxNzU1MzU4MDE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.6,
    reviews: 3241,
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Xbox Series S',
    brand: 'Microsoft',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4Ym94JTIwZ2FtaW5nJTIwY29uc29sZXxlbnwxfHx8fDE3NTU0NDMwNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.5,
    reviews: 1456,
    inStock: true,
  },
  {
    id: '5',
    name: 'Nintendo Switch Lite',
    brand: 'Nintendo',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaW50ZW5kbyUyMHN3aXRjaCUyMGNvbnNvbGV8ZW58MXx8fHwxNzU1MzU4MDE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.4,
    reviews: 892,
    inStock: true,
  },
  {
    id: '6',
    name: 'Steam Deck',
    brand: 'Valve',
    price: 399.99,
    originalPrice: 449.99,
    image: 'https://images.unsplash.com/photo-1665592512676-840f7b669aeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGNvbnNvbGV8ZW58MXx8fHwxNzU1NDQzMDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.3,
    reviews: 567,
    inStock: false,
  },
  {
    id: '7',
    name: 'PlayStation 4 Pro',
    brand: 'Sony',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwcGxheXN0YXRpb258ZW58MXx8fHwxNzU1NDM2MjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.2,
    reviews: 4523,
    inStock: true,
  },
  {
    id: '8',
    name: 'Nintendo 64 Classic',
    brand: 'Nintendo',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1744472649709-22a4eedb172a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWluZyUyMGNvbnNvbGV8ZW58MXx8fHwxNzU1MzM0NTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.0,
    reviews: 234,
    inStock: true,
    featured: true,
  },
];

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand)))];

  const handleFilterChange = (brand: string) => {
    setSelectedBrand(brand);
    filterAndSort(brand, sortBy);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    filterAndSort(selectedBrand, sort);
  };

  const filterAndSort = (brand: string, sort: string) => {
    let filtered = brand === 'all' ? products : products.filter(p => p.brand === brand);
    
    switch (sort) {
      case 'price-low':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
        filtered = filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
        });
        break;
    }
    
    setFilteredProducts(filtered);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Catálogo de Consolas</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora nuestra amplia selección de consolas de videojuegos de las mejores marcas
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between">
          <div className="flex gap-4">
            <Select value={selectedBrand} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por marca" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand === 'all' ? 'Todas las marcas' : brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="rating">Mejor Valorados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  {product.featured && (
                    <Badge className="absolute top-2 left-2">Destacado</Badge>
                  )}
                  {product.originalPrice && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <Badge variant="secondary">Agotado</Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                  
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full"
                  onClick={() => onAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.inStock ? 'Añadir al Carrito' : 'Agotado'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}