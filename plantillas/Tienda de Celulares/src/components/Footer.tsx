import { Smartphone, Settings, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Smartphone className="w-8 h-8 text-blue-500" strokeWidth={2.5} />
                <Settings className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1" />
              </div>
              <span className="text-xl text-blue-500">SALVAMOVIL</span>
            </div>
            <p className="text-gray-400">
              Tu tienda de confianza para venta y reparación de celulares
            </p>
          </div>
          
          <div>
            <h4 className="mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#celulares" className="hover:text-white transition-colors">Celulares</a></li>
              <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
              <li><a href="#contacto" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Venta de celulares</li>
              <li>Reparación</li>
              <li>Garantía</li>
              <li>Accesorios</li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SALVAMOVIL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
