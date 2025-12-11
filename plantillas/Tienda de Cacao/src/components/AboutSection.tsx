import { ImageWithFallback } from './figma/ImageWithFallback';
import { Leaf, Award, Heart, Truck } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="nosotros" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl text-amber-900 mb-6">
                Tradición y Calidad desde el Corazón del Perú
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Somos una empresa familiar dedicada a la producción y comercialización de cacao peruano 
                de la más alta calidad. Trabajamos directamente con agricultores locales de las regiones 
                de Cusco, San Martín y Amazonas, garantizando prácticas sostenibles y comercio justo.
              </p>
              <p className="text-gray-600">
                Nuestro cacao es cultivado en los valles sagrados del Perú, donde las condiciones climáticas 
                y la rica biodiversidad crean granos únicos con sabores complejos y aromáticos que han sido 
                reconocidos internacionalmente.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-amber-800 mb-1">100% Orgánico</h3>
                  <p className="text-sm text-gray-600">Cultivado sin pesticidas ni químicos artificiales</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-amber-800 mb-1">Certificado</h3>
                  <p className="text-sm text-gray-600">Reconocido por su calidad internacional</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-amber-800 mb-1">Comercio Justo</h3>
                  <p className="text-sm text-gray-600">Apoyo directo a comunidades agrícolas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-amber-800 mb-1">Envío Nacional</h3>
                  <p className="text-sm text-gray-600">Delivery a todo el Perú</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1714102367897-4a19259feb75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHBsYW50YXRpb24lMjBwZXJ1fGVufDF8fHx8MTc1NTQwMDY2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Plantación de cacao en Perú"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Stats overlay */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl text-amber-800">500+</div>
                  <p className="text-xs text-gray-600">Familias</p>
                </div>
                <div className="w-px h-12 bg-gray-200"></div>
                <div className="text-center">
                  <div className="text-2xl text-amber-800">15</div>
                  <p className="text-xs text-gray-600">Años</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}