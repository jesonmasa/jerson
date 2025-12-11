import { TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Chart } from './ui/chart';
import { vendaMetricas } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const chartData = [
  { mes: 'Jan', vendas: 45000 },
  { mes: 'Fev', vendas: 52000 },
  { mes: 'Mar', vendas: 48000 },
  { mes: 'Abr', vendas: 61000 },
  { mes: 'Mai', vendas: 55000 },
  { mes: 'Jun', vendas: 67000 },
];

export function Dashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Vendas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(vendaMetricas.totalVendas)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+{vendaMetricas.crescimento}%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Total de Pedidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(vendaMetricas.totalPedidos)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Ticket Médio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(vendaMetricas.ticketMedio)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Clientes Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Vendas */}
      <Card>
        <CardHeader>
          <CardTitle>Vendas Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}