import { ImageWithFallback } from "./figma/ImageWithFallback";

const categories = [
  {
    id: 1,
    name: "Vestidos de Fiesta",
    description: "Elegancia para ocasiones especiales",
    image: "https://images.unsplash.com/photo-1687756520306-ecad3c92fc46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NrdGFpbCUyMGRyZXNzJTIwZm9ybWFsJTIwd2VhcnxlbnwxfHx8fDE3NTYxNDc1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "120+ estilos"
  },
  {
    id: 2,
    name: "Accesorios",
    description: "Complementa tu look perfecto",
    image: "https://images.unsplash.com/photo-1619964758112-2465322ca3ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBhY2Nlc3NvcmllcyUyMGpld2Vscnl8ZW58MXx8fHwxNzU2MTQ3NTE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "80+ piezas"
  },
  {
    id: 3,
    name: "Zapatos Elegantes",
    description: "El toque final para tu outfit",
    image: "https://images.unsplash.com/photo-1553808373-b2c5b7ddb117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwaGVlbHMlMjBlbGVnYW50JTIwc2hvZXN8ZW58MXx8fHwxNzU2MTQ3NTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "60+ modelos"
  }
];

export function Categories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Nuestras Categorías
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para lucir espectacular en cualquier evento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                <div className="relative h-80">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-200 mb-2">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {category.count}
                      </span>
                      <span className="text-sm font-medium group-hover:translate-x-2 transition-transform duration-300">
                        Ver más →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}