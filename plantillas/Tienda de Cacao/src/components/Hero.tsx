import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section id="inicio" className="relative bg-gradient-to-b from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl text-amber-900 leading-tight">
                El Mejor <span className="text-amber-700">Cacao Tostado</span> del Perú
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Descubre la riqueza ancestral del cacao peruano. Granos seleccionados y tostados 
                artesanalmente para preservar todos los sabores y aromas únicos de nuestra tierra.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3"
              >
                Ver Productos
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-amber-800 text-amber-800 hover:bg-amber-50 px-8 py-3"
              >
                Nuestra Historia
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-amber-200">
              <div className="text-center">
                <div className="text-2xl text-amber-800 mb-2">100%</div>
                <p className="text-sm text-gray-600">Natural</p>
              </div>
              <div className="text-center">
                <div className="text-2xl text-amber-800 mb-2">50+</div>
                <p className="text-sm text-gray-600">Años de Tradición</p>
              </div>
              <div className="text-center">
                <div className="text-2xl text-amber-800 mb-2">✓</div>
                <p className="text-sm text-gray-600">Comercio Justo</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1619615174792-a5edcfeafdfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwY2FjYW8lMjBiZWFucyUyMGNob2NvbGF0ZXxlbnwxfHx8fDE3NTU0MDA2NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Granos de cacao tostado peruano"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-amber-600 text-white px-6 py-3 rounded-full shadow-lg">
              <span className="text-sm font-medium">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}