import { ShoppingCart, Menu, Heart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface HeaderProps {
  cartItemCount: number;
  onCartOpen: () => void;
}

export function Header({ cartItemCount, onCartOpen }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">PetStore</h1>
            <p className="text-xs text-muted-foreground">Accesorios para mascotas</p>
          </div>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Perros</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Gatos</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Juguetes</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Comida</a>
            <a href="#" className="text-foreground hover:text-primary transition-colors">Ofertas</a>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Heart className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <User className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={onCartOpen}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}