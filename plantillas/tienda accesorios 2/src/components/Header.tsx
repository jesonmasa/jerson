import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "./ui/button";

interface HeaderProps {
  onCartClick: () => void;
  cartItemsCount: number;
}

export function Header({ onCartClick, cartItemsCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground">T</span>
            </div>
            <h1 className="hidden sm:block">TechShop</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4 hidden md:flex items-center gap-2 rounded-lg bg-input-background px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar accesorios..."
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
