import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Menu, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">S</span>
          </div>
          <span className="font-bold text-xl">SuppleFit</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#produtos" className="hover:text-primary transition-colors">
            Produtos
          </a>
          <a href="#categorias" className="hover:text-primary transition-colors">
            Categorias
          </a>
          <a href="#sobre" className="hover:text-primary transition-colors">
            Sobre
          </a>
          <a href="#contato" className="hover:text-primary transition-colors">
            Contato
          </a>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center gap-2 max-w-sm w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar suplementos..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5 lg:hidden" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 mt-8">
                <a href="#produtos" className="hover:text-primary transition-colors">
                  Produtos
                </a>
                <a href="#categorias" className="hover:text-primary transition-colors">
                  Categorias
                </a>
                <a href="#sobre" className="hover:text-primary transition-colors">
                  Sobre
                </a>
                <a href="#contato" className="hover:text-primary transition-colors">
                  Contato
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}