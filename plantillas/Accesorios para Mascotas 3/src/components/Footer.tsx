import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-primary">PetStore</h3>
              <p className="text-sm text-muted-foreground">
                Accesorios para mascotas
              </p>
            </div>
            <p className="text-muted-foreground">
              Tu tienda de confianza para todo lo que tu mascota necesita. 
              Calidad, cariño y los mejores precios.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Productos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Ofertas</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Atención al cliente</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Política de envíos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Devoluciones</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Garantía</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Soporte</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Newsletter</h4>
            <p className="text-muted-foreground text-sm">
              Suscríbete para recibir ofertas exclusivas y novedades.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Tu email" 
                className="flex-1"
              />
              <Button>
                <Mail className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2 pt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+34 900 123 456</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@petstore.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Madrid, España</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-muted-foreground text-sm">
            © 2024 PetStore. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Términos de servicio
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Política de privacidad
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}