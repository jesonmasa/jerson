import { Product } from "../types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Auriculares Premium",
    description: "Auriculares inalámbricos con cancelación de ruido activa y 30 horas de batería",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1713618651165-a3cf7f85506c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBoZWFkcGhvbmVzfGVufDF8fHx8MTc2MzM4ODUwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Audio",
    rating: 4.8,
    stock: 45
  },
  {
    id: "2",
    name: "AirPods Pro",
    description: "Auriculares inalámbricos con sonido espacial y modo transparencia",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHN8ZW58MXx8fHwxNzYzNDA3NzkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Audio",
    rating: 4.7,
    stock: 62
  },
  {
    id: "3",
    name: "SmartWatch Elite",
    description: "Reloj inteligente con GPS, monitor de salud y resistencia al agua",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNofGVufDF8fHx8MTc2MzM0MDQwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Wearables",
    rating: 4.6,
    stock: 28
  },
  {
    id: "4",
    name: "Laptop Pro 15",
    description: "Portátil de alto rendimiento con procesador i7 y 16GB RAM",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjMzMzg4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Computadoras",
    rating: 4.9,
    stock: 15
  },
  {
    id: "5",
    name: "Cámara Digital 4K",
    description: "Cámara profesional con grabación 4K y estabilización de imagen",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3NjMzNzM0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Fotografía",
    rating: 4.8,
    stock: 22
  },
  {
    id: "6",
    name: "Smartphone X Pro",
    description: "Teléfono inteligente con pantalla OLED y cámara de 108MP",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1741061963569-9d0ef54d10d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlfGVufDF8fHx8MTc2MzM1MTgyMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Móviles",
    rating: 4.7,
    stock: 38
  }
];

export const categories = ["Todos", "Audio", "Wearables", "Computadoras", "Fotografía", "Móviles"];
