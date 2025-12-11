import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ProductCard } from './ProductCard';
import { Cart } from './Cart';
import { medicamentos, categorias } from '../data/mockData';
import { Medicamento, ItemCarrinho } from '../types';

interface ProductsSectionProps {
  searchTerm: string;
  cartItems: ItemCarrinho[];
  onAddToCart: (medicamento: Medicamento) => void;
  onUpdateCartQuantity: (medicamentoId: string, quantidade: number) => void;
  onRemoveFromCart: (medicamentoId: string) => void;
  onFinalizePurchase: () => void;
}

export function ProductsSection({
  searchTerm,
  cartItems,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveFromCart,
  onFinalizePurchase
}: ProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState('nome');

  const filteredProducts = medicamentos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.principioAtivo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'Todas' || produto.categoria === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'preco-asc':
        return a.preco - b.preco;
      case 'preco-desc':
        return b.preco - a.preco;
      case 'nome':
        return a.nome.localeCompare(b.nome);
      case 'categoria':
        return a.categoria.localeCompare(b.categoria);
      default:
        return 0;
    }
  });

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map(categoria => (
                <SelectItem key={categoria} value={categoria}>
                  {categoria}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Nome</SelectItem>
              <SelectItem value="categoria">Categoria</SelectItem>
              <SelectItem value="preco-asc">Preço (menor)</SelectItem>
              <SelectItem value="preco-desc">Preço (maior)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Produtos ({sortedProducts.length})
            </h2>
          </div>

          {/* Grid de Produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedProducts.map(medicamento => (
              <ProductCard
                key={medicamento.id}
                medicamento={medicamento}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum produto encontrado para "{searchTerm}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-80 sticky top-6">
        <Cart
          itens={cartItems}
          onUpdateQuantity={onUpdateCartQuantity}
          onRemoveItem={onRemoveFromCart}
          onFinalizePurchase={onFinalizePurchase}
        />
      </div>
    </div>
  );
}