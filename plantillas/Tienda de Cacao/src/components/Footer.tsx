import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-amber-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">C</span>
              </div>
              <div>
                <h3 className="text-lg">Cacao Peruano</h3>
                <p className="text-xs text-amber-200">Tradición y Sabor</p>
              </div>
            </div>
            <p className="text-sm text-amber-100">
              El mejor cacao tostado del Perú, cultivado con amor y tradición 
              en los valles sagrados de nuestro país.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <button className="w-8 h-8 bg-amber-800 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-amber-800 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 bg-amber-800 hover:bg-amber-700 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4 text-amber-200">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#inicio" className="hover:text-amber-200 transition-colors">Inicio</a></li>
              <li><a href="#productos" className="hover:text-amber-200 transition-colors">Productos</a></li>
              <li><a href="#nosotros" className="hover:text-amber-200 transition-colors">Nosotros</a></li>
              <li><a href="#contacto" className="hover:text-amber-200 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg mb-4 text-amber-200">Productos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-amber-200 transition-colors">Cacao Tostado</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Cacao en Polvo</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Nibs de Cacao</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Pasta de Cacao</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg mb-4 text-amber-200">Contacto</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Av. El Sol 123, Cusco, Perú</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>+51 984 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>info@cacaoperuano.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-amber-800 flex flex-col md:flex-row justify-between items-center text-sm text-amber-200">
          <p>&copy; 2024 Cacao Peruano. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </div>
    </footer>
  );
}