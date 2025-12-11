import { useState } from 'react';
import { ShoppingCart, Menu, X, Search, User, Package, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from './AuthContext';
import { AuthDialog } from './AuthDialog';
import { OrderTracking } from './OrderTracking';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', href: '#' },
    { name: 'Hombre', href: '#' },
    { name: 'Mujer', href: '#' },
    { name: 'Niños', href: '#' },
    { name: 'Ofertas', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Zapatillas J Y R</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Buscar zapatillas..."
                    className="w-64"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-24 truncate">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsTrackingOpen(true)}>
                    <Package className="h-4 w-4 mr-2" />
                    Seguir Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthOpen(true)}
                className="hidden md:flex"
              >
                <User className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Input placeholder="Buscar zapatillas..." />
                    <Button size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-lg py-2 hover:text-primary transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    {user ? (
                      <div className="space-y-2">
                        <p className="font-medium">{user.name}</p>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setIsTrackingOpen(true)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Seguir Pedidos
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setIsAuthOpen(true)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Iniciar Sesión
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Auth Dialog */}
      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Order Tracking Dialog */}
      <OrderTracking
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />
    </header>
  );
}