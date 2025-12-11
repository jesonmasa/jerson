import { Smartphone, Settings, ShieldCheck } from 'lucide-react';

export function Services() {
  const services = [
    {
      icon: Smartphone,
      title: 'Venta de celulares',
      description: 'Compra los últimos modelos del mercado'
    },
    {
      icon: Settings,
      title: 'Reparación de celulares',
      description: 'Solucionamos todo lo de problemas'
    },
    {
      icon: ShieldCheck,
      title: 'Garantía',
      description: 'Todos los celulares incluyen garantía'
    }
  ];

  return (
    <section id="servicios" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl text-center mb-16">
          Nuestros servicios
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center">
                <service.icon className="w-10 h-10 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="text-xl">
                {service.title}
              </h3>
              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
