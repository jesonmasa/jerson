import { Menu, X, Phone, MapPin } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>+51 942 123 456</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>Jr 2 de mayo, Rioja - San Martín, Perú</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>Horario: Lun-Sáb 8:00 AM - 6:00 PM</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-red-600">IKER HONDA</h1>
            <span className="ml-2 text-sm text-gray-600">Motocicletas & Accesorios</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-red-600 transition-colors">Inicio</a>
            <a href="#motocicletas" className="text-gray-700 hover:text-red-600 transition-colors">Motocicletas</a>
            <a href="#accesorios" className="text-gray-700 hover:text-red-600 transition-colors">Accesorios</a>
            <a href="#servicios" className="text-gray-700 hover:text-red-600 transition-colors">Servicios</a>
            <a href="#nosotros" className="text-gray-700 hover:text-red-600 transition-colors">Nosotros</a>
            <a href="#contacto" className="text-gray-700 hover:text-red-600 transition-colors">Contacto</a>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Cotizar Ahora
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <a href="#inicio" className="text-gray-700 hover:text-red-600 transition-colors">Inicio</a>
              <a href="#motocicletas" className="text-gray-700 hover:text-red-600 transition-colors">Motocicletas</a>
              <a href="#accesorios" className="text-gray-700 hover:text-red-600 transition-colors">Accesorios</a>
              <a href="#servicios" className="text-gray-700 hover:text-red-600 transition-colors">Servicios</a>
              <a href="#nosotros" className="text-gray-700 hover:text-red-600 transition-colors">Nosotros</a>
              <a href="#contacto" className="text-gray-700 hover:text-red-600 transition-colors">Contacto</a>
              <Button className="bg-red-600 hover:bg-red-700 text-white w-full">
                Cotizar Ahora
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}