import { Product } from "../components/ProductCard";

export const products: Product[] = [
  // Teléfonos
  {
    id: "phone-1",
    name: "iPhone 15 Pro Max 256GB",
    price: 650000,
    originalPrice: 720000,
    image: "https://images.unsplash.com/photo-1705037282052-f6b776980f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjAxNSUyMHBybyUyMG1heCUyMHNtYXJ0cGhvbmV8ZW58MXx8fHwxNzU3MzUwMjE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "phones",
    rating: 4.8,
    reviews: 324,
    inStock: true,
    isNew: true,
    isOnSale: true
  },
  {
    id: "phone-2",
    name: "Samsung Galaxy S24 Ultra 512GB",
    price: 580000,
    image: "https://images.unsplash.com/photo-1705530292519-ec81f2ace70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwZ2FsYXh5JTIwczI0JTIwdWx0cmF8ZW58MXx8fHwxNzU3MzUwMjE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "phones",
    rating: 4.7,
    reviews: 256,
    inStock: true,
    isNew: true
  },
  {
    id: "phone-3",
    name: "Google Pixel 8 Pro 128GB",
    price: 420000,
    originalPrice: 480000,
    image: "https://images.unsplash.com/photo-1657731739178-18018dc42854?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb29nbGUlMjBwaXhlbCUyMDglMjBwcm8lMjBwaG9uZXxlbnwxfHx8fDE3NTczNTAyMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "phones",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    isOnSale: true
  },
  {
    id: "phone-4",
    name: "Xiaomi 14 Pro 256GB",
    price: 320000,
    image: "https://images.unsplash.com/photo-1656834897728-0075f44d3976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4aWFvbWklMjBzbWFydHBob25lJTIwYW5kcm9pZCUyMHBob25lfGVufDF8fHx8MTc1NzM1MDIyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "phones",
    rating: 4.5,
    reviews: 142,
    inStock: false
  },

  // Consolas
  {
    id: "console-1",
    name: "PlayStation 5 Standard Edition",
    price: 320000,
    image: "https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb25zb2xlJTIwcGxheXN0YXRpb258ZW58MXx8fHwxNzU3MjkxMzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "consoles",
    rating: 4.9,
    reviews: 567,
    inStock: true,
    isNew: false
  },
  {
    id: "console-2",
    name: "Xbox Series X 1TB",
    price: 280000,
    originalPrice: 320000,
    image: "https://images.unsplash.com/photo-1607853827120-6847830b38b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx4Ym94JTIwc2VyaWVzJTIweCUyMGNvbnNvbGV8ZW58MXx8fHwxNzU3MzUwMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "consoles",
    rating: 4.8,
    reviews: 423,
    inStock: true,
    isOnSale: true
  },
  {
    id: "console-3",
    name: "Nintendo Switch OLED",
    price: 195000,
    image: "https://images.unsplash.com/photo-1707620304878-b7d6873207f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaW50ZW5kbyUyMHN3aXRjaCUyMG9sZWQlMjBjb25zb2xlfGVufDF8fHx8MTc1NzM1MDIwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "consoles",
    rating: 4.7,
    reviews: 289,
    inStock: true
  },
  {
    id: "console-4",
    name: "Steam Deck 512GB",
    price: 380000,
    image: "https://images.unsplash.com/photo-1653757398818-5016ba6d2594?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGVhbSUyMGRlY2slMjBoYW5kaGVsZCUyMGdhbWluZ3xlbnwxfHx8fDE3NTczNTAyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "consoles",
    rating: 4.6,
    reviews: 156,
    inStock: true,
    isNew: true
  },

  // Tablets
  {
    id: "tablet-1",
    name: "iPad Pro 12.9\" M2 256GB",
    price: 620000,
    image: "https://images.unsplash.com/photo-1638273266965-843b01e02a5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGFkJTIwcHJvJTIwbTIlMjB0YWJsZXR8ZW58MXx8fHwxNzU3MzUwMjI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "tablets",
    rating: 4.8,
    reviews: 234,
    inStock: true,
    isNew: true
  },
  {
    id: "tablet-2",
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 580000,
    originalPrice: 650000,
    image: "https://images.unsplash.com/photo-1620288650621-9efad6b22946?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1zdW5nJTIwZ2FsYXh5JTIwdGFiJTIwdWx0cmF8ZW58MXx8fHwxNzU3MzUwMjMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "tablets",
    rating: 4.7,
    reviews: 187,
    inStock: true,
    isOnSale: true
  },
  {
    id: "tablet-3",
    name: "iPad Air 10.9\" 128GB",
    price: 385000,
    image: "https://images.unsplash.com/photo-1661340272675-f6829791246e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGFkJTIwYWlyJTIwMTAuOSUyMHRhYmxldHxlbnwxfHx8fDE3NTczNTAyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "tablets",
    rating: 4.6,
    reviews: 312,
    inStock: true
  },

  // Audífonos
  {
    id: "headphones-1",
    name: "AirPods Pro 2da Generación",
    price: 125000,
    originalPrice: 140000,
    image: "https://images.unsplash.com/photo-1583305727488-61f82c7eae4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb255JTIwd2gtMTAwMHhtNSUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU3MzUwMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "headphones",
    rating: 4.8,
    reviews: 445,
    inStock: true,
    isOnSale: true
  },
  {
    id: "headphones-2",
    name: "Sony WH-1000XM5",
    price: 195000,
    image: "https://images.unsplash.com/photo-1583305727488-61f82c7eae4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb255JTIwd2gtMTAwMHhtNSUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzU3MzUwMjQwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "headphones",
    rating: 4.9,
    reviews: 523,
    inStock: true,
    isNew: true
  },
  {
    id: "headphones-3",
    name: "Bose QuietComfort Earbuds",
    price: 165000,
    originalPrice: 185000,
    image: "https://images.unsplash.com/photo-1623318993015-4bb0490764bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3NlJTIwcXVpZXRjb21mb3J0JTIwZWFyYnVkc3xlbnwxfHx8fDE3NTczNTAyNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "headphones",
    rating: 4.7,
    reviews: 289,
    inStock: true,
    isOnSale: true
  },
  {
    id: "headphones-4",
    name: "JBL Tune 760NC",
    price: 45000,
    image: "https://images.unsplash.com/photo-1637780852590-8ab27248ec41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYmwlMjBoZWFkcGhvbmVzJTIwd2lyZWxlc3N8ZW58MXx8fHwxNzU3MzUwMjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "headphones",
    rating: 4.4,
    reviews: 167,
    inStock: true
  },

  // Accesorios
  {
    id: "accessory-1",
    name: "Cargador Inalámbrico MagSafe",
    price: 35000,
    image: "https://images.unsplash.com/photo-1603674554159-b62f6febbce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdzYWZlJTIwd2lyZWxlc3MlMjBjaGFyZ2VyfGVufDF8fHx8MTc1NzM1MDI2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "accessories",
    rating: 4.5,
    reviews: 234,
    inStock: true
  },
  {
    id: "accessory-2",
    name: "Funda iPhone 15 Pro con MagSafe",
    price: 18000,
    originalPrice: 22000,
    image: "https://images.unsplash.com/photo-1706972612625-d5be9a7aadd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpcGhvbmUlMjBjYXNlJTIwbWFnc2FmZSUyMGNvdmVyfGVufDF8fHx8MTc1NzM1MDI1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "accessories",
    rating: 4.3,
    reviews: 145,
    inStock: true,
    isOnSale: true
  },
  {
    id: "accessory-3",
    name: "Power Bank 20000mAh USB-C",
    price: 28000,
    image: "https://images.unsplash.com/photo-1702347807611-2552e3308ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMGJhbmslMjAyMDAwMG1haCUyMHBvcnRhYmxlfGVufDF8fHx8MTc1NzM1MDI1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "accessories",
    rating: 4.6,
    reviews: 298,
    inStock: true
  },
  {
    id: "accessory-4",
    name: "Soporte Ajustable para Tablet",
    price: 15000,
    image: "https://images.unsplash.com/photo-1610664840481-10b7b43c9283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBzdGFuZCUyMGFkanVzdGFibGV8ZW58MXx8fHwxNzU3MzUwMjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "accessories",
    rating: 4.4,
    reviews: 89,
    inStock: false
  },
  {
    id: "accessory-5",
    name: "Cable USB-C a Lightning 2m",
    price: 12000,
    originalPrice: 15000,
    image: "https://images.unsplash.com/photo-1583288264462-01f05e6b5548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2ItYyUyMGxpZ2h0bmluZyUyMGNhYmxlfGVufDF8fHx8MTc1NzM1MDI0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "accessories",
    rating: 4.2,
    reviews: 67,
    inStock: true,
    isOnSale: true
  }
];