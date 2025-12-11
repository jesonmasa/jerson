import { ProductCard } from './ProductCard';

const products = [
  {
    id: '1',
    name: 'Cacao Tostado Premium',
    description: 'Granos de cacao tostado de la región de Cusco, con notas florales y afrutadas. Perfecto para chocolatería artesanal.',
    price: 45.00,
    originalPrice: 55.00,
    image: 'https://images.unsplash.com/photo-1619615174792-a5edcfeafdfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2FzdGVkJTIwY2FjYW8lMjBiZWFucyUyMGNob2NvbGF0ZXxlbnwxfHx8fDE3NTU0MDA2NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    isPopular: true
  },
  {
    id: '2',
    name: 'Cacao en Polvo Natural',
    description: 'Polvo de cacao 100% natural sin azúcar añadida. Ideal para bebidas calientes y repostería saludable.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1659055939237-bc2be8be2f14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBwb3dkZXIlMjBjb2NvYXxlbnwxfHx8fDE3NTU0MDA2NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.7,
    isNew: true
  },
  {
    id: '3',
    name: 'Nibs de Cacao Criollo',
    description: 'Fragmentos de cacao criollo tostado, perfectos como snack saludable o para añadir a batidos y yogurt.',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1646082192921-272df4780996?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwY2hvY29sYXRlJTIwbWFraW5nfGVufDF8fHx8MTc1NTQwMDY2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Pasta de Cacao Pura',
    description: 'Pasta de cacao 100% pura molida en piedra. Base perfecta para elaborar chocolate artesanal de alta calidad.',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1714102367897-4a19259feb75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWNhbyUyMHBsYW50YXRpb24lMjBwZXJ1fGVufDF8fHx8MTc1NTQwMDY2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    rating: 4.9,
    isPopular: true
  }
];

export function ProductsSection() {
  return (
    <section id="productos" className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl text-amber-900 mb-4">
            Nuestros Productos Destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de productos de cacao peruano de la más alta calidad, 
            procesados artesanalmente para preservar todos sus beneficios y sabores únicos.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 rounded-lg transition-colors duration-200">
            Ver Todos los Productos
          </button>
        </div>
      </div>
    </section>
  );
}