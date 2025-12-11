import { Gamepad2, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

export function Footer() {
  const footerLinks = {
    company: {
      title: 'Empresa',
      links: [
        { name: 'Sobre Nosotros', href: '#' },
        { name: 'Nuestra Historia', href: '#' },
        { name: 'Carreras', href: '#' },
        { name: 'Prensa', href: '#' },
      ],
    },
    support: {
      title: 'Soporte',
      links: [
        { name: 'Centro de Ayuda', href: '#' },
        { name: 'Contacto', href: '#' },
        { name: 'Garantías', href: '#' },
        { name: 'Devoluciones', href: '#' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Términos de Servicio', href: '#' },
        { name: 'Política de Privacidad', href: '#' },
        { name: 'Cookies', href: '#' },
        { name: 'Accesibilidad', href: '#' },
      ],
    },
  };

  return (
    <footer className="bg-secondary/20 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">GameStore</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu tienda de confianza para las mejores consolas de videojuegos. 
              Más de 10 años ofreciendo entretenimiento de calidad.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Madrid, España</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+34 900 123 456</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@gamestore.es</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h3 className="font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <div className="max-w-md">
            <h3 className="font-semibold mb-2">Suscríbete a nuestro newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Recibe las últimas noticias y ofertas exclusivas
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Tu email"
                type="email"
                className="flex-1"
              />
              <Button>Suscribirse</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2024 GameStore. Todos los derechos reservados.
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Síguenos:</span>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}