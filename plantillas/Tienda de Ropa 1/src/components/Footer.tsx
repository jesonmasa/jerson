import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">
            Suscríbete y obtén 15% de descuento
          </h3>
          <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
            Recibe las últimas tendencias, ofertas exclusivas y noticias de moda directamente en tu email
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Tu email aquí..."
              className="bg-white text-gray-900 border-0 flex-1"
            />
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8">
              Suscribirse
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Elegancia
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Tu destino para la moda más elegante y sofisticada en Perú. Creamos momentos inolvidables a través del estilo.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 cursor-pointer transition-colors">
                <span className="text-sm">f</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 cursor-pointer transition-colors">
                <span className="text-sm">ig</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 cursor-pointer transition-colors">
                <span className="text-sm">tw</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Enlaces Rápidos</h4>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Sobre Nosotras
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Catálogo
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Guía de Tallas
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Cuidado de Prendas
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Testimonios
              </a>
            </div>
          </div>

          {/* Customer service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Atención al Cliente</h4>
            <div className="space-y-3">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Centro de Ayuda
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Política de Devoluciones
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Envíos y Entregas
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Métodos de Pago
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                Contáctanos
              </a>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Av. Larco 1234, Miraflores, Lima</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-pink-500" />
                <span className="text-sm">+51 1 234 5678</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-pink-500" />
                <span className="text-sm">hola@elegancia.pe</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Clock className="h-5 w-5 text-pink-500" />
                <span className="text-sm">Lun - Sáb: 10:00 - 20:00</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © 2024 Elegancia Perú. Todos los derechos reservados.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Términos y Condiciones
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Política de Privacidad
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}