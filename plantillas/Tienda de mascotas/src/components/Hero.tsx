import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block">
              <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full">
                🎁 Ofertas especiales de temporada
              </span>
            </div>
            
            <h2 className="text-5xl md:text-6xl text-gray-900">
              Todo lo que tu{" "}
              <span className="text-pink-600">mascota</span>{" "}
              necesita
            </h2>
            
            <p className="text-xl text-gray-600">
              Encuentra los mejores productos, alimentos y accesorios para el cuidado y felicidad de tus compañeros peludos.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6 rounded-full">
                Explorar Productos
              </Button>
              <Button variant="outline" className="border-2 border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-6 rounded-full">
                Ver Ofertas
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl text-pink-600">500+</div>
                <p className="text-gray-600">Productos</p>
              </div>
              <div>
                <div className="text-3xl text-pink-600">50k+</div>
                <p className="text-gray-600">Clientes Felices</p>
              </div>
              <div>
                <div className="text-3xl text-pink-600">4.9★</div>
                <p className="text-gray-600">Calificación</p>
              </div>
            </div>
          </div>

          {/* Right Content - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1747045200613-0dc76be6ded0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNzUwMzgwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Perro adorable"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p>Perros</p>
                  </div>
                </div>
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1652567954502-6c6877f94b9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWJiaXQlMjBidW5ueSUyMHBldHxlbnwxfHx8fDE3NjI3Nzk2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Conejo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p>Conejos</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1702914954859-f037fc75b760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyNzY3NDczfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Gato adorable"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p>Gatos</p>
                  </div>
                </div>
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1722718916429-42ede3fc166e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBiaXJkJTIwY29sb3JmdWx8ZW58MXx8fHwxNzYyNzg1NDU4fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Pájaro colorido"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <p>Aves</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-full shadow-lg transform rotate-12">
              <p className="text-sm">-30% OFF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🐾</div>
      <div className="absolute bottom-20 right-20 text-4xl opacity-20 animate-bounce" style={{ animationDelay: '1s' }}>❤️</div>
    </section>
  );
}
