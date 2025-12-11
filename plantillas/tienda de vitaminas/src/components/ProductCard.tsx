import { Plus, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Medicamento } from '../types';

interface ProductCardProps {
  medicamento: Medicamento;
  onAddToCart: (medicamento: Medicamento) => void;
}

export function ProductCard({ medicamento, onAddToCart }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-lg">
      <CardContent className="p-4 flex-1">
        <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
          <ImageWithFallback
            src={medicamento.imagem}
            alt={medicamento.nome}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-tight">{medicamento.nome}</h3>
            {medicamento.prescricaoObrigatoria && (
              <Badge variant="outline" className="text-xs">
                Receita
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{medicamento.categoria}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{medicamento.descricao}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary">
              {formatPrice(medicamento.preco)}
            </span>
            <span className="text-sm text-muted-foreground">
              Est: {medicamento.estoque}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => onAddToCart(medicamento)}
          disabled={medicamento.estoque === 0}
          className="w-full gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          {medicamento.estoque === 0 ? 'Sem Estoque' : 'Adicionar'}
        </Button>
      </CardFooter>
    </Card>
  );
}