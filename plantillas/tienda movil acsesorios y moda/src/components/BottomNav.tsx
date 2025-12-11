import { Home, Search, ShoppingCart, Bell, User } from "lucide-react";

interface BottomNavProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  cartCount?: number;
}

export function BottomNav({ activeScreen, onNavigate, cartCount = 0 }: BottomNavProps) {
  const navItems = [
    { id: "home", icon: Home, label: "Inicio" },
    { id: "search", icon: Search, label: "Explorar" },
    { id: "cart", icon: ShoppingCart, label: "Carrito" },
    { id: "notifications", icon: Bell, label: "Alertas" },
    { id: "profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-md mx-auto flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 min-w-[60px] relative"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                {item.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span
                className={`text-xs ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
