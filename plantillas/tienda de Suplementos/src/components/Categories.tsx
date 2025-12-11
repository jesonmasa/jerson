import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Zap, Heart, Shield, Dumbbell } from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Proteínas",
    description: "Whey, Caseína, Albumina",
    icon: Dumbbell,
    image: "https://images.unsplash.com/photo-1693996045346-d0a9b9470909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwc3VwcGxlbWVudHMlMjBwcm90ZWluJTIwcG93ZGVyfGVufDF8fHx8MTc1NTQzNjAxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "120+ produtos",
  },
  {
    id: "2",
    name: "Pré-Treino",
    description: "Energy, Focus, Pump",
    icon: Zap,
    image: "https://images.unsplash.com/photo-1649068618811-9f3547ef98fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwZXF1aXBtZW50fGVufDF8fHx8MTc1NTMxMjM0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "45+ produtos",
  },
  {
    id: "3",
    name: "Creatina",
    description: "Monohidratada, HCL, Alcalina",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1693996047008-1b6210099be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbnV0cml0aW9uJTIwYm90dGxlc3xlbnwxfHx8fDE3NTU0MzYwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "25+ produtos",
  },
  {
    id: "4",
    name: "Vitaminas",
    description: "Multivitamínicos, Ômega 3",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1693996047008-1b6210099be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbnV0cml0aW9uJTIwYm90dGxlc3xlbnwxfHx8fDE3NTU0MzYwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: "80+ produtos",
  },
];

export function Categories() {
  return (
    <section id="categorias" className="py-16 lg:py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Explore por Categoria
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Encontre exatamente o que você precisa para seus objetivos específicos na academia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative h-32 overflow-hidden">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}