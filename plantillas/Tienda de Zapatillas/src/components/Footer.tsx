import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

export function Footer() {
  const footerSections = [
    {
      title: 'Comprar',
      links: [
        { name: 'Hombre', href: '#' },
        { name: 'Mujer', href: '#' },
        { name: 'Niños', href: '#' },
        { name: 'Ofertas', href: '#' },
        { name: 'Novedades', href: '#' },
      ]
    },
    {
      title: 'Ayuda',
      links: [
        { name: 'Contacto', href: '#' },
        { name: 'Envíos', href: '#' },
        { name: 'Devoluciones', href: '#' },
        { name: 'Guía de Tallas', href: '#' },
        { name: 'FAQ', href: '#' },
      ]
    },
    {
      title: 'Empresa',
      links: [
        { name: 'Sobre Nosotros', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Prensa', href: '#' },
        { name: 'Sostenibilidad', href: '#' },
        { name: 'Inversores', href: '#' },
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand and Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Zapatillas J Y R</h2>
              <p className="text-gray-400 mt-2 max-w-md">
                Tu tienda de confianza para las mejores zapatillas en Colombia. Calidad, estilo y 
                comodidad garantizados en cada compra.
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="font-semibold">Suscríbete a nuestro newsletter</h3>
              <p className="text-sm text-gray-400">
                Recibe las últimas novedades y ofertas exclusivas.
              </p>
              <div className="flex space-x-2">
                <Input
                  placeholder="Tu email"
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button>Suscribirse</Button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">info@zapatillasjyr.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Bogotá, Colombia</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-semibold text-white">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
            <span>© 2024 Zapatillas J Y R. Todos los derechos reservados.</span>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                Política de Privacidad
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Términos de Uso
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Twitter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}