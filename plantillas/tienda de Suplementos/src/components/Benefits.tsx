import { Card, CardContent } from "./ui/card";
import { Truck, Shield, Award, HeartHandshake, Clock, Star } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis",
    description: "Entregas gratuitas para pedidos acima de R$ 200 em todo o Brasil",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    icon: Shield,
    title: "Produtos Originais",
    description: "100% dos nossos produtos são originais e certificados pelos fabricantes",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    icon: Award,
    title: "Melhor Qualidade",
    description: "Trabalhamos apenas com as melhores marcas e fornecedores do mercado",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  {
    icon: HeartHandshake,
    title: "Suporte Especializado",
    description: "Nossa equipe de nutricionistas está pronta para te ajudar",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    icon: Clock,
    title: "Entrega Rápida",
    description: "Processamos e enviamos seu pedido em até 24 horas úteis",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    icon: Star,
    title: "Satisfação Garantida",
    description: "30 dias para devolução e troca sem complicações",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
];

export function Benefits() {
  return (
    <section id="sobre" className="py-16 lg:py-24">
      <div className="container px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold">
            Por que Escolher a SuppleFit?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Somos mais que uma loja de suplementos. Somos seu parceiro na jornada fitness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${benefit.bgColor}`}>
                      <Icon className={`h-6 w-6 ${benefit.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-primary rounded-2xl p-8 lg:p-12 text-primary-foreground">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">10k+</div>
              <div className="text-sm opacity-90">Clientes Ativos</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Produtos</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">98%</div>
              <div className="text-sm opacity-90">Satisfação</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">5 anos</div>
              <div className="text-sm opacity-90">No Mercado</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}