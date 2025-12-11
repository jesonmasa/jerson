import { Button } from "./ui/button";
import { Smartphone, Gamepad2, Tablet, Headphones, Cable } from "lucide-react";

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", name: "Todos", icon: null },
  { id: "phones", name: "Teléfonos", icon: Smartphone },
  { id: "consoles", name: "Consolas", icon: Gamepad2 },
  { id: "tablets", name: "Tablets", icon: Tablet },
  { id: "headphones", name: "Audífonos", icon: Headphones },
  { id: "accessories", name: "Accesorios", icon: Cable },
];

export function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 py-4 overflow-x-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                onClick={() => onCategoryChange(category.id)}
                className="flex items-center space-x-2 whitespace-nowrap"
              >
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{category.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}