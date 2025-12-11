import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Elegancia 
                <span className="block bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  para cada
                </span>
                ocasión especial
              </h2>
              <p className="text-xl text-gray-600 max-w-lg">
                Descubre nuestra exclusiva colección de vestidos y accesorios para tus momentos más importantes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-8 py-3 text-lg"
              >
                Ver Colección
              </Button>
              <Button 
                variant="outline" 
                className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-3 text-lg"
              >
                Nuevos Arrivals
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Diseños únicos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-gray-600">Clientas felices</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">5★</div>
                <div className="text-gray-600">Calificación</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1705174962279-714cdbdd9a30?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwcGFydHklMjBkcmVzcyUyMHdvbWVuJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTYxNDc1MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Vestido elegante para fiesta"
                className="w-full h-[600px] object-cover"
              />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">%</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">20% OFF</div>
                  <div className="text-gray-600 text-sm">En tu primera compra</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}