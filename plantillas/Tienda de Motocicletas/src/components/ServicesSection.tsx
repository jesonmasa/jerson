import { Card, CardContent } from './ui/card'
import { Wrench, Shield, Clock, Users, Award, MapPin } from 'lucide-react'
import { ImageWithFallback } from './figma/ImageWithFallback'

export default function ServicesSection() {
  const services = [
    {
      icon: Wrench,
      title: "Mantenimiento Preventivo",
      description: "Servicio completo de mantenimiento para prolongar la vida útil de tu motocicleta",
      features: ["Cambio de aceite", "Revisión de frenos", "Ajuste de cadena", "Diagnóstico completo"]
    },
    {
      icon: Shield,
      title: "Reparaciones Especializadas",
      description: "Reparamos todo tipo de averías con repuestos originales Honda",
      features: ["Motor", "Transmisión", "Sistema eléctrico", "Carrocería"]
    },
    {
      icon: Clock,
      title: "Servicio Express",
      description: "Atención rápida para servicios básicos en menos de 2 horas",
      features: ["Cambio de aceite", "Revisión básica", "Inflado de llantas", "Limpieza"]
    },
    {
      icon: Award,
      title: "Garantía Extendida",
      description: "Protege tu inversión con nuestros planes de garantía extendida",
      features: ["1-3 años", "Cobertura total", "Asistencia en carretera", "Repuestos incluidos"]
    }
  ]

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Servicios <span className="text-red-600">Especializados</span>
              </h2>
              <p className="text-lg text-gray-600">
                Contamos con el mejor equipo de técnicos certificados por Honda para brindarte un servicio de excelencia.
              </p>
            </div>

            <div className="grid gap-6">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <Card key={index} className="border-l-4 border-l-red-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-red-100 p-3 rounded-lg">
                          <Icon className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-bold text-gray-900">{service.title}</h3>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3">
                            {service.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center text-sm text-gray-500">
                                <div className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Users className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">5 Técnicos</div>
                  <div className="text-sm text-gray-600">Certificados Honda</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Zona Centro</div>
                  <div className="text-sm text-gray-600">Rioja - San Martín</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1623221013483-1f3cbeffdcec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwcmVwYWlyJTIwc2VydmljZXxlbnwxfHx8fDE3NTYzMjQ5ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Servicio técnico especializado"
              className="w-full h-96 object-cover rounded-2xl shadow-2xl"
            />
            
            {/* Overlay stats */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="font-bold text-red-600">24h</div>
                    <div className="text-xs text-gray-600">Respuesta</div>
                  </div>
                  <div>
                    <div className="font-bold text-red-600">98%</div>
                    <div className="text-xs text-gray-600">Satisfacción</div>
                  </div>
                  <div>
                    <div className="font-bold text-red-600">15+</div>
                    <div className="text-xs text-gray-600">Años</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}