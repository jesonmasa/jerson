import { ShoppingCart, Heart, User, Search, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            🎉 Envío gratis en compras mayores a S/ 50.000
          </p>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <a href="#" className="hover:text-pink-600 transition-colors">
              Ayuda
            </a>
            <a href="#" className="hover:text-pink-600 transition-colors">
              Contáctanos
            </a>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-3xl">🐾</div>
            <h1 className="text-2xl text-pink-600">Mascotitas</h1>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Busca alimento, juguetes, accesorios..."
                className="pl-10 pr-4 w-full rounded-full border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-pink-50 hover:text-pink-600">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex rounded-full hover:bg-pink-50 hover:text-pink-600">
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-full hover:bg-pink-50 hover:text-pink-600"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-600 text-white">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <a href="#productos" className="py-2 hover:text-pink-600 transition-colors">
                    Productos
                  </a>
                  <a href="#categorias" className="py-2 hover:text-pink-600 transition-colors">
                    Categorías
                  </a>
                  <a href="#servicios" className="py-2 hover:text-pink-600 transition-colors">
                    Servicios
                  </a>
                  <a href="#ofertas" className="py-2 hover:text-pink-600 transition-colors">
                    Ofertas
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden lg:flex items-center gap-8 pb-4">
          <a href="#productos" className="text-gray-700 hover:text-pink-600 transition-colors">
            Productos
          </a>
          <a href="#categorias" className="text-gray-700 hover:text-pink-600 transition-colors">
            Categorías
          </a>
          <a href="#servicios" className="text-gray-700 hover:text-pink-600 transition-colors">
            Servicios
          </a>
          <a href="#ofertas" className="text-gray-700 hover:text-pink-600 transition-colors">
            Ofertas
          </a>
          <a href="#blog" className="text-gray-700 hover:text-pink-600 transition-colors">
            Blog
          </a>
        </nav>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden pb-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              className="pl-10 pr-4 w-full rounded-full border-gray-300"
            />
          </div>
        </div>
      </div>
    </header>
  );
}