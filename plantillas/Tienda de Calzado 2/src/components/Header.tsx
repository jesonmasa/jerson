import { ShoppingCart, Search, Menu, User, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

export function Header({ cartCount, onCartClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-8">
            <h1 className="text-2xl">StepStyle</h1>
            <nav className="hidden md:flex gap-6">
              <a href="#" className="hover:underline">Hombre</a>
              <a href="#" className="hover:underline">Mujer</a>
              <a href="#" className="hover:underline">Niños</a>
              <a href="#" className="hover:underline">Deportivo</a>
              <a href="#" className="hover:underline">Ofertas</a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-[200px]">
              <Search className="h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Buscar calzado..." 
                className="bg-transparent border-none outline-none text-sm flex-1"
              />
            </div>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
