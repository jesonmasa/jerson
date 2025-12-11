import { ImageWithFallback } from './figma/ImageWithFallback';
import { Check } from 'lucide-react';

export function RepairServices() {
  const repairs = [
    { name: 'Cambio de pantalla', price: 'Desde $50' },
    { name: 'Cambio de batería', price: 'Desde $30' },
    { name: 'Reparación de puerto de carga', price: 'Desde $40' },
    { name: 'Reparación de botones', price: 'Desde $25' },
    { name: 'Limpieza por agua', price: 'Desde $60' },
    { name: 'Actualización de software', price: 'Desde $20' }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl mb-6">
              Servicios de reparación
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Reparamos cualquier problema de tu celular con técnicos certificados y repuestos originales
            </p>
            
            <div className="space-y-4">
              {repairs.map((repair, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-lg">{repair.name}</span>
                  </div>
                  <span className="text-blue-600">{repair.price}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1735875530804-d661ca2001da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG9uZSUyMHJlcGFpciUyMHRvb2xzfGVufDF8fHx8MTc2MjM1NzAzNXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Reparación de celulares"
              className="w-full max-w-lg rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
