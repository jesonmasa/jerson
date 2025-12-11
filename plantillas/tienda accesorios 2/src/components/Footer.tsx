import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground">T</span>
              </div>
              <h3>TechShop</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu tienda de confianza para accesorios tecnológicos de calidad.
            </p>
            <div className="flex gap-3">
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4">Tienda</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Todos los Productos</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Nuevos Arrivals</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Ofertas</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Best Sellers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Envíos</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Suscríbete para recibir ofertas exclusivas
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 rounded-lg bg-background border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 TechShop. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
