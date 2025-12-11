import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ItemCarrinho } from '../types';

interface CartProps {
  itens: ItemCarrinho[];
  onUpdateQuantity: (medicamentoId: string, quantidade: number) => void;
  onRemoveItem: (medicamentoId: string) => void;
  onFinalizePurchase: () => void;
}

export function Cart({ itens, onUpdateQuantity, onRemoveItem, onFinalizePurchase }: CartProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const total = itens.reduce((sum, item) => sum + (item.medicamento.preco * item.quantidade), 0);

  if (itens.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Carrinho vazio</h3>
          <p className="text-muted-foreground">Adicione medicamentos ao seu carrinho</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Carrinho ({itens.length} {itens.length === 1 ? 'item' : 'itens'})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {itens.map((item) => (
          <div key={item.medicamento.id} className="space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.medicamento.nome}</h4>
                <p className="text-xs text-muted-foreground">{item.medicamento.categoria}</p>
                <p className="text-sm font-semibold">{formatPrice(item.medicamento.preco)}</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => onRemoveItem(item.medicamento.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.medicamento.id, item.quantidade - 1)}
                  disabled={item.quantidade <= 1}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="w-8 text-center">{item.quantidade}</span>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.medicamento.id, item.quantidade + 1)}
                  disabled={item.quantidade >= item.medicamento.estoque}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              
              <span className="font-semibold">
                {formatPrice(item.medicamento.preco * item.quantidade)}
              </span>
            </div>
            
            <Separator />
          </div>
        ))}
        
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold text-primary">{formatPrice(total)}</span>
          </div>
          
          <Button 
            className="w-full" 
            onClick={onFinalizePurchase}
            disabled={itens.length === 0}
          >
            Finalizar Compra
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}