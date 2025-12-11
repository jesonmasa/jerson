import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingBag, Search, Menu, Heart, User } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="border-b border-gray-100 py-2">
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-600">Envíos gratis en compras mayores a S/200</p>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Síguenos:</span>
              <div className="flex gap-2">
                <span className="text-gray-600 hover:text-pink-600 cursor-pointer">Instagram</span>
                <span className="text-gray-600 hover:text-pink-600 cursor-pointer">Facebook</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Elegancia
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Inicio</a>
            <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Vestidos</a>
            <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Accesorios</a>
            <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Zapatos</a>
            <a href="#" className="text-gray-700 hover:text-pink-600 transition-colors">Ofertas</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-pink-600">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-pink-600">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-pink-600">
              <User className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-pink-600">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              <Badge className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                3
              </Badge>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}