import { ProductCard } from "./ProductCard";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    name: "Whey Protein Isolado Premium - Chocolate",
    price: 89.90,
    originalPrice: 119.90,
    image: "https://images.unsplash.com/photo-1693996045346-d0a9b9470909?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwc3VwcGxlbWVudHMlMjBwcm90ZWluJTIwcG93ZGVyfGVufDF8fHx8MTc1NTQzNjAxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.8,
    reviewCount: 1234,
    category: "Proteínas",
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Creatina Monohidratada 300g - Pura",
    price: 45.90,
    originalPrice: 59.90,
    image: "https://images.unsplash.com/photo-1693996047008-1b6210099be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbnV0cml0aW9uJTIwYm90dGxlc3xlbnwxfHx8fDE3NTU0MzYwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.9,
    reviewCount: 867,
    category: "Creatina",
    isNew: true,
  },
  {
    id: "3",
    name: "BCAA 2:1:1 - 120 Cápsulas",
    price: 32.90,
    originalPrice: 42.90,
    image: "https://images.unsplash.com/photo-1693996047008-1b6210099be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbnV0cml0aW9uJTIwYm90dGxlc3xlbnwxfHx8fDE3NTU0MzYwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.7,
    reviewCount: 543,
    category: "Aminoácidos",
  },
  {
    id: "4",
    name: "Multivitamínico Completo - 60 Cápsulas",
    price: 28.90,
    image: "https://images.unsplash.com/photo-1693996047008-1b6210099be1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwbnV0cml0aW9uJTIwYm90dGxlc3xlbnwxfHx8fDE3NTU0MzYwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4.6,
    reviewCount: 321,
    category: "Vitaminas",
    isBestSeller: true,
  },
];

export function FeaturedProducts() {
  return (
    <section id="produtos" className="py-16 lg:py-24">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Produtos em Destaque
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Os suplementos mais vendidos e bem avaliados pelos nossos clientes para maximizar seus resultados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="gap-2">
            Ver Todos os Produtos
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}