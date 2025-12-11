import { ShoppingCart, User, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import logoImage from "figma:asset/99bcd8d472f3d7aa2d86c13f77a711f03a777d6f.png";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
  onDeliveryClick: () => void;
  isLoggedIn: boolean;
  userName?: string;
}

export function Header({
  cartItemsCount,
  onCartClick,
  onAuthClick,
  onDeliveryClick,
  isLoggedIn,
  userName,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center">
            <img
              src={logoImage}
              alt="Tiendas Urbanos Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-[18px]">Tiendas Urbanos</h1>
            <p className="text-[11px] text-muted-foreground">
              Moda Femenina Online
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDeliveryClick}
            className="gap-2"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Mis Pedidos</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onAuthClick}
            className="gap-2"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isLoggedIn ? userName : "Ingresar"}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onCartClick}
            className="relative gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {cartItemsCount}
              </Badge>
            )}
            <span className="hidden sm:inline">Carrito</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}