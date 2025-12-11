import { Package, ShoppingCart, BarChart3, Settings, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from './ui/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'vendas', label: 'Vendas', icon: ShoppingCart },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-card border-r h-[calc(100vh-81px)] p-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-2',
                activeSection === item.id && 'bg-primary text-primary-foreground'
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}