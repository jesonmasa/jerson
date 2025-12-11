import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/5 to-primary/10 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full">
              <p className="text-sm text-primary">Nuevos productos cada semana</p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl">
              Accesorios Tech para tu Día a Día
            </h1>
            <p className="text-muted-foreground text-lg">
              Descubre nuestra selección de accesorios tecnológicos de alta calidad. 
              Desde auriculares hasta cargadores, tenemos todo lo que necesitas.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">Explorar Productos</Button>
              <Button size="lg" variant="outline">Ver Ofertas</Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1678852524356-08188528aed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0c3xlbnwxfHx8fDE3NjAwNDA2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Tech accessories"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
