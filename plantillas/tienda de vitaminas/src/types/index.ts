export interface Medicamento {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  descricao: string;
  imagem: string;
  prescricaoObrigatoria: boolean;
  fabricante: string;
  principioAtivo: string;
}

export interface ItemCarrinho {
  medicamento: Medicamento;
  quantidade: number;
}

export interface Pedido {
  id: string;
  data: Date;
  cliente: string;
  itens: ItemCarrinho[];
  total: number;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
}

export interface VendaMetrica {
  totalVendas: number;
  totalPedidos: number;
  ticketMedio: number;
  crescimento: number;
}