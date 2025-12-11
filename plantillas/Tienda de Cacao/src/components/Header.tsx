import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-amber-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Cacao Peruano</h1>
              <p className="text-xs text-amber-200">Tradición y Sabor</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="hover:text-amber-200 transition-colors">
              Inicio
            </a>
            <a href="#productos" className="hover:text-amber-200 transition-colors">
              Productos
            </a>
            <a href="#nosotros" className="hover:text-amber-200 transition-colors">
              Nosotros
            </a>
            <a href="#contacto" className="hover:text-amber-200 transition-colors">
              Contacto
            </a>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-amber-800">
              <ShoppingCart className="w-6 h-6" />
              <span className="sr-only">Carrito</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-amber-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-amber-800 py-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#inicio" 
                className="hover:text-amber-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </a>
              <a 
                href="#productos" 
                className="hover:text-amber-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Productos
              </a>
              <a 
                href="#nosotros" 
                className="hover:text-amber-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </a>
              <a 
                href="#contacto" 
                className="hover:text-amber-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}