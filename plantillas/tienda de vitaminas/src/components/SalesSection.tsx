import { useState } from 'react';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Pedido } from '../types';
import { pedidosMock } from '../data/mockData';

const statusMap = {
  pendente: { label: 'Pendente', icon: Clock, variant: 'secondary' as const },
  processando: { label: 'Processando', icon: Package, variant: 'default' as const },
  enviado: { label: 'Enviado', icon: Truck, variant: 'outline' as const },
  entregue: { label: 'Entregue', icon: CheckCircle, variant: 'secondary' as const },
  cancelado: { label: 'Cancelado', icon: XCircle, variant: 'destructive' as const },
};

export function SalesSection() {
  const [pedidos] = useState<Pedido[]>(pedidosMock);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Gerenciar Vendas</h2>
        <Button>Novo Pedido</Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processando</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Enviados</p>
                <p className="text-2xl font-bold">15</p>
              </div>
              <Truck className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entregues</p>
                <p className="text-2xl font-bold">127</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => {
                const statusInfo = statusMap[pedido.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.id}</TableCell>
                    <TableCell>{pedido.cliente}</TableCell>
                    <TableCell>{formatDate(pedido.data)}</TableCell>
                    <TableCell>
                      <Badge variant={statusInfo.variant} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(pedido.total)}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPedido(pedido)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Pedido {pedido.id}</DialogTitle>
                          </DialogHeader>
                          {selectedPedido && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">Cliente</h4>
                                  <p className="text-muted-foreground">{selectedPedido.cliente}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Data do Pedido</h4>
                                  <p className="text-muted-foreground">{formatDate(selectedPedido.data)}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Itens do Pedido</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Produto</TableHead>
                                      <TableHead>Quantidade</TableHead>
                                      <TableHead>Preço Unit.</TableHead>
                                      <TableHead>Total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedPedido.itens.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.medicamento.nome}</TableCell>
                                        <TableCell>{item.quantidade}</TableCell>
                                        <TableCell>{formatCurrency(item.medicamento.preco)}</TableCell>
                                        <TableCell>{formatCurrency(item.medicamento.preco * item.quantidade)}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              
                              <div className="flex justify-between items-center pt-4 border-t">
                                <span className="text-lg font-semibold">Total do Pedido:</span>
                                <span className="text-lg font-bold">{formatCurrency(selectedPedido.total)}</span>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}