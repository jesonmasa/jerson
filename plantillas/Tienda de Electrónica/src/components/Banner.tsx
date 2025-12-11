import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function Banner() {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            Oferta Especial
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            La mejor tecnología de Costa Rica
          </h2>
          <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Encuentra los últimos teléfonos, consolas, tablets y accesorios con los mejores precios del mercado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Ver ofertas especiales
            </Button>
            <p className="text-sm text-primary-foreground/80">
              ✨ Envío gratis en compras sobre ₡50,000
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}