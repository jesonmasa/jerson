import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[500px] py-12">
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Todo lo que tu 
                <span className="text-primary"> mascota </span>
                necesita
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Descubre nuestra amplia selección de accesorios premium para perros y gatos. 
                Calidad, comodidad y diversión garantizadas.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                Ver productos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Ofertas especiales
              </Button>
            </div>
            
            <div className="flex items-center space-x-8 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">15k+</p>
                <p className="text-sm text-muted-foreground">Clientes felices</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">4.8</p>
                <p className="text-sm text-muted-foreground">★ Valoración</p>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative z-10">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1573435567032-ff5982925350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMGNhdCUyMHRvZ2V0aGVyJTIwcGV0c3xlbnwxfHx8fDE3NTU0NzM1MjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Mascotas felices"
                className="w-full h-auto max-w-lg mx-auto rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full opacity-70 animate-pulse" />
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-purple-300 rounded-full opacity-70 animate-pulse delay-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}