import { Button } from './ui/button'
import { ArrowRight, Shield, Wrench, Trophy } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

export default function HeroSection() {
  return (
    <section id="inicio" className="bg-gradient-to-br from-red-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Tu Tienda de 
                <span className="text-red-600"> Motocicletas Honda</span> de Confianza
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                En Iker Honda encontrarás las mejores motocicletas Honda, accesorios de calidad y servicio técnico especializado en Rioja - San Martín, Perú.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Trophy className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Motos Originales Honda</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Garantía Oficial</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Wrench className="h-5 w-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Servicio Técnico</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Ver Motocicletas
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Contactar Ahora
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">15+</div>
                <div className="text-sm text-gray-600">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">500+</div>
                <div className="text-sm text-gray-600">Clientes Satisfechos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">24/7</div>
                <div className="text-sm text-gray-600">Soporte Técnico</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1756045429447-209dde3c28f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBob25kYSUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTYzMjQ5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Motocicleta Honda en showroom"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="text-center">
                <div className="text-red-600 font-bold">HONDA</div>
                <div className="text-xs text-gray-600">Distribuidor Oficial</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}