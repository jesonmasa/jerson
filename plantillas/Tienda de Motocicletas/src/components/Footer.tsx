import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: "Inicio", href: "#inicio" },
    { name: "Motocicletas", href: "#motocicletas" },
    { name: "Accesorios", href: "#accesorios" },
    { name: "Servicios", href: "#servicios" },
    { name: "Nosotros", href: "#nosotros" },
    { name: "Contacto", href: "#contacto" }
  ]

  const services = [
    "Venta de Motocicletas Honda",
    "Repuestos Originales",
    "Servicio Técnico",
    "Mantenimiento Preventivo",
    "Garantía Extendida",
    "Financiamiento"
  ]

  const motorcycles = [
    "Honda CB 190R",
    "Honda XR 150L",
    "Honda Wave 110S",
    "Honda CG 150",
    "Honda XR 190L",
    "Honda CB 125F"
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-red-500 mb-2">IKER HONDA</h3>
              <p className="text-gray-400 text-sm">
                Tu distribuidor oficial Honda de confianza en Rioja - San Martín. 
                Más de 15 años brindando calidad y excelencia.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                Jr 2 de mayo, Rioja - San Martín, Perú
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                +51 942 123 456
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Mail className="h-4 w-4 mr-2 text-red-500" />
                info@ikerhonda.com
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-2 text-red-500" />
                Lun-Sáb: 8:00 AM - 6:00 PM
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-sm font-medium mb-3">Síguenos</p>
              <div className="flex space-x-3">
                <Button size="icon" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-red-500">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-red-500">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="border-gray-700 text-gray-400 hover:text-white hover:border-red-500">
                  <Youtube className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-400 hover:text-red-500 text-sm transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-6">Nuestros Servicios</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Motorcycles */}
          <div>
            <h4 className="font-bold mb-6">Modelos Disponibles</h4>
            <ul className="space-y-3">
              {motorcycles.map((motorcycle, index) => (
                <li key={index} className="text-gray-400 text-sm">
                  {motorcycle}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Bottom Footer */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            © {currentYear} Iker Honda. Todos los derechos reservados.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-red-500 transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-red-500 transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-red-500 transition-colors">Garantías</a>
          </div>
        </div>
      </div>

      {/* Honda Official Badge */}
      <div className="bg-red-600 py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white text-sm font-medium">
            🏍️ Distribuidor Oficial Honda | Repuestos y Servicio Garantizado
          </p>
        </div>
      </div>
    </footer>
  )
}