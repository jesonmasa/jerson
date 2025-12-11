import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";

interface CategoryCardProps {
  title: string;
  description: string;
  image: string;
  icon: string;
  productsCount: number;
}

export function CategoryCard({ title, description, image, icon, productsCount }: CategoryCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Icon Badge */}
        <div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg">
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-2xl text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{productsCount} productos</span>
          <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6">
            Ver más
          </Button>
        </div>
      </div>
    </div>
  );
}
