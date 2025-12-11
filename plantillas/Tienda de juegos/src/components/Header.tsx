import { useState } from 'react';
import { ShoppingCart, Menu, Search, User, Gamepad2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemsCount, onCartClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '#' },
    { name: 'PlayStation', href: '#' },
    { name: 'Xbox', href: '#' },
    { name: 'Nintendo', href: '#' },
    { name: 'Retro', href: '#' },
    { name: 'Ofertas', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">GameStore</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="hidden sm:flex items-center">
              {isSearchOpen ? (
                <Input
                  placeholder="Buscar consolas..."
                  className="w-64"
                  onBlur={() => setIsSearchOpen(false)}
                  autoFocus
                />
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

            {/* User Account */}
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="sm" onClick={onCartClick} className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col space-y-4 mt-8">
                  <Input placeholder="Buscar consolas..." />
                  <nav className="flex flex-col space-y-2">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </a>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}