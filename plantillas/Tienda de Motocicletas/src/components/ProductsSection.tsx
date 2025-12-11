import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Star, Eye, ShoppingCart } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

export default function ProductsSection() {
  const motorcycles = [
    {
      id: 1,
      name: "Honda CB 190R",
      price: "S/ 12,990",
      originalPrice: "S/ 13,500",
      image: "https://images.unsplash.com/photo-1756045429447-209dde3c28f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBob25kYSUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTYzMjQ5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8,
      discount: "-4%",
      features: ["190cc", "16 HP", "ABS"]
    },
    {
      id: 2,
      name: "Honda XR 150L",
      price: "S/ 9,800",
      originalPrice: "",
      image: "https://images.unsplash.com/photo-1756045429447-209dde3c28f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBob25kYSUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTYzMjQ5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.6,
      discount: "",
      features: ["150cc", "12 HP", "Off-road"]
    },
    {
      id: 3,
      name: "Honda Wave 110S",
      price: "S/ 6,200",
      originalPrice: "",
      image: "https://images.unsplash.com/photo-1756045429447-209dde3c28f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBob25kYSUyMG1vdG9yY3ljbGUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTYzMjQ5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.7,
      discount: "",
      features: ["110cc", "8.7 HP", "Económica"]
    }
  ]

  const accessories = [
    {
      id: 1,
      name: "Casco Honda Original",
      price: "S/ 280",
      image: "https://images.unsplash.com/photo-1569932353341-b518d82f8a54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2VhciUyMGFjY2Vzc29yaWVzJTIwaGVsbWV0fGVufDF8fHx8MTc1NjMyNDk4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.9
    },
    {
      id: 2,
      name: "Repuestos Originales",
      price: "Desde S/ 25",
      image: "https://images.unsplash.com/photo-1632496497047-706290273235?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcGFydHMlMjBlbmdpbmV8ZW58MXx8fHwxNzU2MzI0OTg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rating: 4.8
    }
  ]

  return (
    <section id="motocicletas" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Nuestros Productos <span className="text-red-600">Destacados</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de motocicletas Honda y accesorios de la más alta calidad
          </p>
        </div>

        {/* Motorcycles */}
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Motocicletas Honda</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {motorcycles.map((motorcycle) => (
                <Card key={motorcycle.id} className="group hover:shadow-xl transition-shadow duration-300 border-0 shadow-md overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback
                      src={motorcycle.image}
                      alt={motorcycle.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {motorcycle.discount && (
                      <Badge className="absolute top-3 left-3 bg-red-600 text-white">
                        {motorcycle.discount}
                      </Badge>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">{motorcycle.name}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">{motorcycle.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {motorcycle.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-red-600">{motorcycle.price}</span>
                        {motorcycle.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">{motorcycle.originalPrice}</span>
                        )}
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Cotizar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div id="accesorios">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Accesorios y Repuestos</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {accessories.map((accessory) => (
                <Card key={accessory.id} className="group hover:shadow-xl transition-shadow duration-300 border-0 shadow-md overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback
                      src={accessory.image}
                      alt={accessory.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{accessory.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600 ml-1">{accessory.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-600">{accessory.price}</span>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                        Ver más
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            Ver Todo el Catálogo
          </Button>
        </div>
      </div>
    </section>
  )
}