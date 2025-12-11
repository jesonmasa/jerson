import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface FilterSidebarProps {
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}

const brands = ['LUXE', 'ELÉGANCE', 'AZURE', 'PRESTIGE', 'BLOOM', 'FRESH', 'SERENITY'];
const categories = ['Eau de Parfum', 'Eau de Toilette', 'Parfum'];

export function FilterSidebar({
  selectedBrands,
  onBrandChange,
  priceRange,
  onPriceRangeChange,
  selectedCategories,
  onCategoryChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3>Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      {/* Brand Filter */}
      <div className="mb-8">
        <h4 className="mb-4">Brand</h4>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => onBrandChange(brand)}
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h4 className="mb-4">Category</h4>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => onCategoryChange(category)}
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="mb-4">Price Range</h4>
        <div className="space-y-4">
          <Slider
            min={0}
            max={250}
            step={10}
            value={priceRange}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
