import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { MapPin, Phone, Clock, Mail, MessageCircle } from 'lucide-react'

export default function ContactSection() {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Dirección",
      content: "Jr 2 de mayo, Rioja - San Martín, Perú",
      action: "Ver en Google Maps"
    },
    {
      icon: Phone,
      title: "Teléfono",
      content: "+51 942 123 456",
      action: "Llamar ahora"
    },
    {
      icon: Clock,
      title: "Horarios",
      content: "Lun-Sáb: 8:00 AM - 6:00 PM\nDom: 9:00 AM - 2:00 PM",
      action: ""
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@ikerhonda.com",
      action: "Enviar email"
    }
  ]

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-red-600">Contáctanos</span> Hoy
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Visítanos, llámanos o escríbenos para cualquier consulta sobre nuestros productos y servicios.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Información de Contacto</h3>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <Card key={index} className="border-l-4 border-l-red-600 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-red-100 p-3 rounded-lg">
                            <Icon className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2">{info.title}</h4>
                            <p className="text-gray-600 whitespace-pre-line mb-3">{info.content}</p>
                            {info.action && (
                              <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                                {info.action}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Envíanos un Mensaje</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Nombre *
                      </label>
                      <Input placeholder="Tu nombre" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Apellido *
                      </label>
                      <Input placeholder="Tu apellido" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Email *
                    </label>
                    <Input type="email" placeholder="tu@email.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Teléfono
                    </label>
                    <Input placeholder="+51 123 456 789" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Asunto *
                    </label>
                    <Input placeholder="¿En qué podemos ayudarte?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mensaje *
                    </label>
                    <Textarea 
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                      rows={4}
                    />
                  </div>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Enviar Mensaje
                  </Button>
                </form>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  * Campos obligatorios. Responderemos en menos de 24 horas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Nuestra Ubicación</h3>
          <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <MapPin className="h-12 w-12 mx-auto mb-4" />
              <p className="font-medium">Jr 2 de mayo, Rioja - San Martín, Perú</p>
              <p className="text-sm">Mapa interactivo próximamente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}