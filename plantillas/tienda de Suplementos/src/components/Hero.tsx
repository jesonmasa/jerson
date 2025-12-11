import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Star } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background to-muted/30">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>Mais de 10.000 clientes satisfeitos</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Maximize seus{" "}
                <span className="text-primary">resultados</span>{" "}
                na academia
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Suplementos premium de alta qualidade para potencializar seu treino e acelerar seus ganhos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Ver Produtos
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg">
                Saiba Mais
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8 border-t">
              <div>
                <div className="text-2xl font-bold">10k+</div>
                <div className="text-sm text-muted-foreground">Clientes</div>
              </div>
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Produtos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 p-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1734188341701-5a0b7575efbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNjdWxhciUyMGF0aGxldGUlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NTU0MzYwMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Atleta treinando"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-background rounded-2xl p-4 shadow-lg border">
              <div className="text-sm font-medium">Entrega</div>
              <div className="text-xs text-muted-foreground">24-48h</div>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-background rounded-2xl p-4 shadow-lg border">
              <div className="text-sm font-medium">Frete Grátis</div>
              <div className="text-xs text-muted-foreground">Pedidos +R$ 200</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}