import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { CheckCircle, Star, Trophy, Heart } from 'lucide-react'

export default function AboutSection() {
  const values = [
    {
      icon: Trophy,
      title: "Excelencia",
      description: "Comprometidos con la calidad en cada producto y servicio"
    },
    {
      icon: Heart,
      title: "Pasión",
      description: "Amamos las motocicletas tanto como nuestros clientes"
    },
    {
      icon: CheckCircle,
      title: "Confianza",
      description: "15 años construyendo relaciones duraderas"
    },
    {
      icon: Star,
      title: "Calidad",
      description: "Solo trabajamos con productos originales Honda"
    }
  ]

  const achievements = [
    { number: "15+", label: "Años en el mercado" },
    { number: "500+", label: "Clientes satisfechos" },
    { number: "1000+", label: "Motocicletas vendidas" },
    { number: "95%", label: "Clientes que regresan" }
  ]

  return (
    <section id="nosotros" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Sobre <span className="text-red-600">Iker Honda</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Desde 2009, hemos sido la tienda de motocicletas Honda de confianza en Rioja - San Martín, 
            brindando productos de calidad y servicio excepcional a toda la región.
          </p>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Nuestra Historia</h3>
            <div className="space-y-4 text-gray-600">
              <p>
                Iker Honda nació del sueño de brindar a los peruanos acceso a motocicletas Honda 
                de calidad y un servicio técnico excepcional. Ubicados en el corazón de Rioja, 
                en Jr 2 de mayo, hemos crecido junto con nuestra comunidad.
              </p>
              <p>
                Como distribuidor oficial Honda, nos enorgullecemos de ofrecer no solo las mejores 
                motocicletas, sino también repuestos originales, accesorios de calidad y un servicio 
                técnico especializado que garantiza la satisfacción de nuestros clientes.
              </p>
              <p>
                Nuestro equipo de técnicos certificados y personal de ventas está comprometido con 
                ayudarte a encontrar la motocicleta perfecta para tus necesidades y mantenerla en 
                óptimas condiciones.
              </p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Conoce Nuestro Equipo
            </Button>
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 space-y-4">
                    <div className="bg-red-100 p-3 rounded-full w-fit mx-auto">
                      <Icon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nuestros Logros</h3>
            <p className="text-gray-600">Números que hablan de nuestro compromiso</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{achievement.number}</div>
                <div className="text-sm text-gray-600">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="mt-16 text-center bg-red-600 text-white rounded-2xl p-12">
          <h3 className="text-2xl font-bold mb-4">Nuestra Misión</h3>
          <p className="text-lg leading-relaxed max-w-3xl mx-auto">
            "Ser la empresa líder en venta de motocicletas Honda y servicios especializados en la región, 
            proporcionando productos de calidad, servicio excepcional y construyendo relaciones duraderas 
            con nuestros clientes basadas en la confianza y satisfacción."
          </p>
        </div>
      </div>
    </section>
  )
}