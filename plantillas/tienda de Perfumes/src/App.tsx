import { useState } from 'react';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { FilterSidebar } from './components/FilterSidebar';
import { Button } from './components/ui/button';
import { ShoppingCart, Search, User, Heart, Filter } from 'lucide-react';
import { Input } from './components/ui/input';
import { CartProvider, useCart, Product } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';
import { allProducts, getProductsByCategory } from './data/products';

type PageCategory = 'all' | 'new-arrivals' | 'women' | 'men' | 'unisex' | 'sale';

function AppContent() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 250]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageCategory>('all');
  
  const { getCartCount } = useCart();

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setPriceRange([0, 250]);
  };

  const handleNavigate = (page: PageCategory) => {
    setCurrentPage(page);
    handleResetFilters();
    setShowFilters(false);
  };

  // Get products based on current page
  const categoryProducts = currentPage === 'all' ? allProducts : getProductsByCategory(currentPage);

  // Filter products
  let filteredProducts = categoryProducts.filter(product => {
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesBrand && matchesCategory && matchesPrice;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  }

  const getPageTitle = () => {
    switch (currentPage) {
      case 'new-arrivals':
        return 'New Arrivals';
      case 'women':
        return "Women's Fragrances";
      case 'men':
        return "Men's Colognes";
      case 'unisex':
        return 'Unisex Fragrances';
      case 'sale':
        return 'Sale Items';
      default:
        return 'Featured Collection';
    }
  };

  const getPageDescription = () => {
    switch (currentPage) {
      case 'new-arrivals':
        return 'Discover our latest additions';
      case 'women':
        return 'Elegant and feminine scents';
      case 'men':
        return 'Bold and sophisticated fragrances';
      case 'unisex':
        return 'Gender-neutral perfumes for everyone';
      case 'sale':
        return 'Limited time special pricing';
      default:
        return 'Explore our curated collection of luxury perfumes';
    }
  };

  if (selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('all')}>
              <h1 className="text-2xl">PARFUMERIE</h1>
            </div>
            
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  type="search" 
                  placeholder="Search perfumes..." 
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8b1538] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-8 h-12">
            <button 
              onClick={() => handleNavigate('new-arrivals')}
              className={`text-sm transition-colors ${
                currentPage === 'new-arrivals' 
                  ? 'text-[#8b1538]' 
                  : 'hover:text-[#8b1538]'
              }`}
            >
              New Arrivals
            </button>
            <button 
              onClick={() => handleNavigate('women')}
              className={`text-sm transition-colors ${
                currentPage === 'women' 
                  ? 'text-[#8b1538]' 
                  : 'hover:text-[#8b1538]'
              }`}
            >
              Women
            </button>
            <button 
              onClick={() => handleNavigate('men')}
              className={`text-sm transition-colors ${
                currentPage === 'men' 
                  ? 'text-[#8b1538]' 
                  : 'hover:text-[#8b1538]'
              }`}
            >
              Men
            </button>
            <button 
              onClick={() => handleNavigate('unisex')}
              className={`text-sm transition-colors ${
                currentPage === 'unisex' 
                  ? 'text-[#8b1538]' 
                  : 'hover:text-[#8b1538]'
              }`}
            >
              Unisex
            </button>
            <button 
              onClick={() => handleNavigate('sale')}
              className={`text-sm transition-colors ${
                currentPage === 'sale' 
                  ? 'text-[#8b1538]' 
                  : 'hover:text-[#8b1538]'
              }`}
            >
              Sale
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#f5dc84] to-[#fef9e7] py-16 border-b border-[#8b1538]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl mb-4 text-[#8b1538]">{getPageTitle()}</h2>
          <p className="text-[#2c1810] mb-8">{getPageDescription()}</p>
        </div>
      </section>

      {/* Products Section with Filters */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl mb-2">{getPageTitle()}</h2>
            <p className="text-gray-600">{filteredProducts.length} {filteredProducts.length === 1 ? 'fragrance' : 'fragrances'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <select 
              className="border rounded-lg px-4 py-2 bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <FilterSidebar
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">No products found matching your filters.</p>
                <Button onClick={handleResetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onViewDetails={setSelectedProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#8b1538] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="mb-4">PARFUMERIE</h3>
              <p className="text-white/70 text-sm">Your destination for luxury fragrances</p>
            </div>
            <div>
              <h4 className="mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>
                  <button onClick={() => handleNavigate('new-arrivals')} className="hover:text-white">
                    New Arrivals
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('sale')} className="hover:text-white">
                    Sale
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('all')} className="hover:text-white">
                    All Products
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Instagram</a></li>
                <li><a href="#" className="hover:text-white">Facebook</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2025 Parfumerie. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
