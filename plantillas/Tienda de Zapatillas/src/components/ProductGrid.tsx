import { useState } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { ProductCard, Product } from './ProductCard';
import { formatCurrency } from './utils/currency';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product, size: number) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000000]); // COP range
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);

  const brands = [...new Set(products.map(p => p.brand))];
  const allSizes = [...new Set(products.flatMap(p => p.sizes))].sort((a, b) => a - b);

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  const handleSizeChange = (size: number, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    }
  };

  const filteredProducts = products.filter(product => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    if (selectedSizes.length > 0 && !product.sizes.some(size => selectedSizes.includes(size))) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-4">Precio</h3>
        <div className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000000}
            min={0}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-medium mb-4">Marca</h3>
        <div className="space-y-3">
          {brands.map(brand => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={brand}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
              />
              <Label htmlFor={brand} className="text-sm">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-medium mb-4">Talla</h3>
        <div className="grid grid-cols-4 gap-2">
          {allSizes.map(size => (
            <div key={size} className="flex items-center space-x-1">
              <Checkbox
                id={`size-${size}`}
                checked={selectedSizes.includes(size)}
                onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
              />
              <Label htmlFor={`size-${size}`} className="text-sm">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold">Nuestros Productos</h2>
          <p className="text-gray-600 mt-2">
            {sortedProducts.length} producto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Destacados</SelectItem>
              <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="name">Nombre A-Z</SelectItem>
              <SelectItem value="rating">Mejor Valorados</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter */}
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white border rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <SlidersHorizontal className="h-5 w-5" />
              <h3 className="font-medium">Filtros</h3>
            </div>
            <FilterContent />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No se encontraron productos con los filtros seleccionados.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedSizes([]);
                  setPriceRange([0, 1000000]);
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}