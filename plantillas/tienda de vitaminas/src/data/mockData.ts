import { Medicamento, Pedido, VendaMetrica } from '../types';

export const medicamentos: Medicamento[] = [
  {
    id: '1',
    nome: 'Paracetamol 500mg',
    categoria: 'Analgésicos',
    preco: 12.50,
    estoque: 150,
    descricao: 'Analgésico e antitérmico para dores leves a moderadas',
    imagem: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
    prescricaoObrigatoria: false,
    fabricante: 'Medley',
    principioAtivo: 'Paracetamol'
  },
  {
    id: '2',
    nome: 'Dipirona Sódica 500mg',
    categoria: 'Analgésicos',
    preco: 8.90,
    estoque: 200,
    descricao: 'Analgésico e antitérmico de ação rápida',
    imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop',
    prescricaoObrigatoria: false,
    fabricante: 'EMS',
    principioAtivo: 'Dipirona Sódica'
  },
  {
    id: '3',
    nome: 'Losartana 50mg',
    categoria: 'Cardiovasculares',
    preco: 25.30,
    estoque: 80,
    descricao: 'Anti-hipertensivo para controle da pressão arterial',
    imagem: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop',
    prescricaoObrigatoria: true,
    fabricante: 'Eurofarma',
    principioAtivo: 'Losartana Potássica'
  },
  {
    id: '4',
    nome: 'Omeprazol 20mg',
    categoria: 'Gastroenterológicos',
    preco: 18.75,
    estoque: 120,
    descricao: 'Inibidor da bomba de prótons para úlceras e refluxo',
    imagem: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca3?w=300&h=300&fit=crop',
    prescricaoObrigatoria: false,
    fabricante: 'Teuto',
    principioAtivo: 'Omeprazol'
  },
  {
    id: '5',
    nome: 'Amoxicilina 500mg',
    categoria: 'Antibióticos',
    preco: 32.90,
    estoque: 60,
    descricao: 'Antibiótico de amplo espectro para infecções bacterianas',
    imagem: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop',
    prescricaoObrigatoria: true,
    fabricante: 'Neo Química',
    principioAtivo: 'Amoxicilina'
  },
  {
    id: '6',
    nome: 'Vitamina D3 2000UI',
    categoria: 'Vitaminas',
    preco: 45.60,
    estoque: 90,
    descricao: 'Suplemento vitamínico para fortalecimento ósseo',
    imagem: 'https://images.unsplash.com/photo-1606166894144-af02b69e5f84?w=300&h=300&fit=crop',
    prescricaoObrigatoria: false,
    fabricante: 'Vitafor',
    principioAtivo: 'Colecalciferol'
  },
  {
    id: '7',
    nome: 'Metformina 850mg',
    categoria: 'Endócrinos',
    preco: 28.40,
    estoque: 70,
    descricao: 'Antidiabético oral para controle da glicemia',
    imagem: 'https://images.unsplash.com/photo-1550572017-edd951aa8ca3?w=300&h=300&fit=crop',
    prescricaoObrigatoria: true,
    fabricante: 'Glenmark',
    principioAtivo: 'Cloridrato de Metformina'
  },
  {
    id: '8',
    nome: 'Loratadina 10mg',
    categoria: 'Anti-histamínicos',
    preco: 15.20,
    estoque: 110,
    descricao: 'Antialérgico para rinite e urticária',
    imagem: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop',
    prescricaoObrigatoria: false,
    fabricante: 'Eurofarma',
    principioAtivo: 'Loratadina'
  }
];

export const categorias = [
  'Todas',
  'Analgésicos',
  'Cardiovasculares',
  'Gastroenterológicos',
  'Antibióticos',
  'Vitaminas',
  'Endócrinos',
  'Anti-histamínicos'
];

export const pedidosMock: Pedido[] = [
  {
    id: 'PED001',
    data: new Date('2024-01-15'),
    cliente: 'Maria Silva',
    itens: [
      { medicamento: medicamentos[0], quantidade: 2 },
      { medicamento: medicamentos[1], quantidade: 1 }
    ],
    total: 33.90,
    status: 'entregue'
  },
  {
    id: 'PED002',
    data: new Date('2024-01-16'),
    cliente: 'João Santos',
    itens: [
      { medicamento: medicamentos[2], quantidade: 1 }
    ],
    total: 25.30,
    status: 'enviado'
  }
];

export const vendaMetricas: VendaMetrica = {
  totalVendas: 45650.80,
  totalPedidos: 324,
  ticketMedio: 140.90,
  crescimento: 12.5
};