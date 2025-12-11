import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    id: number;
    name: string;
    brand: string;
    price: number;
    size: number;
    quantity: number;
    image: string;
  }[];
  total: number;
  status: 'pendiente' | 'confirmado' | 'preparando' | 'enviado' | 'en_transito' | 'entregado';
  trackingNumber: string;
  createdAt: Date;
  estimatedDelivery: Date;
  shippingAddress: string;
}

interface AuthContextType {
  user: User | null;
  orders: Order[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  addOrder: (order: Omit<Order, 'id' | 'userId' | 'createdAt' | 'trackingNumber'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users data
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: '123456',
    phone: '+57 300 123 4567',
    address: 'Calle 123 #45-67, Bogotá, Colombia',
    createdAt: new Date('2024-01-15'),
  },
];

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    items: [
      {
        id: 1,
        name: 'Air Max Classic Running',
        brand: 'Nike',
        price: 598350,
        size: 42,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1719523677291-a395426c1a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBzbmVha2Vyc3xlbnwxfHx8fDE3NTkwODg4MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      }
    ],
    total: 598350,
    status: 'en_transito',
    trackingNumber: 'SNK-2024-001',
    createdAt: new Date('2024-09-25'),
    estimatedDelivery: new Date('2024-10-02'),
    shippingAddress: 'Calle 123 #45-67, Bogotá, Colombia',
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      name,
      email,
      password,
      phone,
      createdAt: new Date(),
    };

    mockUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'userId' | 'createdAt' | 'trackingNumber'>) => {
    if (!user) return;

    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      userId: user.id,
      trackingNumber: `SNK-2024-${String(orders.length + 1).padStart(3, '0')}`,
      createdAt: new Date(),
    };

    setOrders(prev => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const value = {
    user,
    orders: user ? orders.filter(order => order.userId === user.id) : [],
    login,
    register,
    logout,
    addOrder,
    updateOrderStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}