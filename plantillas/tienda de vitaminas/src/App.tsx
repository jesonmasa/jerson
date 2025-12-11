import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProductsSection } from './components/ProductsSection';
import { SalesSection } from './components/SalesSection';
import { Dashboard } from './components/Dashboard';
import { ItemCarrinho, Medicamento } from './types';
import { toast, Toaster } from "sonner@2.0.3";

export default function App() {
  const [activeSection, setActiveSection] = useState('produtos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<ItemCarrinho[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (medicamento: Medicamento) => {
    setCartItems(current => {
      const existingItem = current.find(item => item.medicamento.id === medicamento.id);
      
      if (existingItem) {
        if (existingItem.quantidade < medicamento.estoque) {
          toast.success(`${medicamento.nome} adicionado ao carrinho`);
          return current.map(item =>
            item.medicamento.id === medicamento.id
              ? { ...item, quantidade: item.quantidade + 1 }
              : item
          );
        } else {
          toast.error('Quantidade máxima em estoque atingida');
          return current;
        }
      } else {
        toast.success(`${medicamento.nome} adicionado ao carrinho`);
        return [...current, { medicamento, quantidade: 1 }];
      }
    });
  };

  const updateCartQuantity = (medicamentoId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(medicamentoId);
      return;
    }

    setCartItems(current =>
      current.map(item =>
        item.medicamento.id === medicamentoId
          ? { ...item, quantidade }
          : item
      )
    );
  };

  const removeFromCart = (medicamentoId: string) => {
    setCartItems(current => current.filter(item => item.medicamento.id !== medicamentoId));
    toast.success('Item removido do carrinho');
  };

  const finalizePurchase = () => {
    if (cartItems.length === 0) {
      toast.error('Carrinho vazio');
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.medicamento.preco * item.quantidade), 0);
    
    // Simular finalização da compra
    toast.success(`Compra finalizada! Total: ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(total)}`);
    
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantidade, 0);

  const renderContent = () => {
    switch (activeSection) {
      case 'produtos':
        return (
          <ProductsSection
            searchTerm={searchTerm}
            cartItems={cartItems}
            onAddToCart={addToCart}
            onUpdateCartQuantity={updateCartQuantity}
            onRemoveFromCart={removeFromCart}
            onFinalizePurchase={finalizePurchase}
          />
        );
      case 'vendas':
        return <SalesSection />;
      case 'dashboard':
        return <Dashboard />;
      case 'configuracoes':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Configurações</h2>
            <p className="text-muted-foreground">Seção em desenvolvimento...</p>
          </div>
        );
      default:
        return <ProductsSection
          searchTerm={searchTerm}
          cartItems={cartItems}
          onAddToCart={addToCart}
          onUpdateCartQuantity={updateCartQuantity}
          onRemoveFromCart={removeFromCart}
          onFinalizePurchase={finalizePurchase}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartCount={cartCount}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCartClick={() => setShowCart(!showCart)}
      />
      
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}