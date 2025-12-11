import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-background to-secondary/20 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Las Mejores{' '}
              <span className="text-primary">Consolas</span>{' '}
              de Videojuegos
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Descubre la última generación de consolas de videojuegos. 
              PlayStation, Xbox, Nintendo Switch y consolas retro. 
              Los mejores precios y envío gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                Ver Catálogo
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Ofertas Especiales
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Envío Gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Garantía 2 años</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1665592512676-840f7b669aeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMGNvbnNvbGV8ZW58MXx8fHwxNzU1NDQzMDYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Gaming Setup"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 -bottom-4 -left-4 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl -z-10"></div>
            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <div className="text-2xl font-bold text-primary">-30%</div>
              <div className="text-sm text-muted-foreground">Descuento</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}