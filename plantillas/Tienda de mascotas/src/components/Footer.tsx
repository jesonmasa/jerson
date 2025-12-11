import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="text-3xl">🐾</div>
              <h3 className="text-2xl text-white">Mascotitas</h3>
            </div>
            <p className="mb-4 text-gray-400">
              Tu tienda de confianza para todo lo que tu mascota necesita. Calidad, amor y cuidado en cada producto.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-600 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-600 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-600 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Productos</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Servicios</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white mb-4">Atención al Cliente</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-pink-400 transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Política de Envíos</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-white mb-4">Contacto</h4>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-pink-400" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-pink-400" />
                <span>hola@mascotitas.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-pink-400 mt-1" />
                <span>Calle 123 #45-67<br />Bogotá, Colombia</span>
              </li>
            </ul>

            <div>
              <h4 className="text-white mb-2">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-3">
                Recibe ofertas exclusivas
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="Tu email"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-full"
                />
                <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2025 Mascotitas. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-pink-400 transition-colors">
              Métodos de Pago
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              Seguridad
            </a>
            <a href="#" className="hover:text-pink-400 transition-colors">
              Ayuda
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
