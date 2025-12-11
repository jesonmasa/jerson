import { Product } from '../contexts/CartContext';

export const allProducts: Product[] = [
  // Featured/All Products
  {
    id: 1,
    name: 'Midnight Noir',
    brand: 'LUXE',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1643797519086-cc9a821fbcfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBlcmZ1bWUlMjBsdXh1cnl8ZW58MXx8fHwxNzYzOTU2ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'A mysterious and captivating fragrance that embodies elegance and sophistication. Perfect for evening wear and special occasions.',
    notes: {
      top: ['Bergamot', 'Black Pepper', 'Pink Pepper'],
      middle: ['Jasmine', 'Rose', 'Violet'],
      base: ['Patchouli', 'Vanilla', 'Musk']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'unisex',
    isNew: false,
    onSale: false
  },
  {
    id: 2,
    name: 'Velvet Rose',
    brand: 'ELÉGANCE',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1618137585731-4c33c287d2dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwcGVyZnVtZSUyMGJvdHRsZXxlbnwxfHx8fDE3NjM5NTY4MjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'An elegant floral fragrance with velvety rose petals and warm amber undertones. A timeless classic for the modern woman.',
    notes: {
      top: ['Mandarin', 'Peach', 'Lychee'],
      middle: ['Turkish Rose', 'Peony', 'Magnolia'],
      base: ['Amber', 'Cedar', 'White Musk']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'women',
    isNew: false,
    onSale: false
  },
  {
    id: 3,
    name: 'Ocean Breeze',
    brand: 'AZURE',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1642286316199-fdf22df37968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwb2NlYW4lMjBwZXJmdW1lfGVufDF8fHx8MTc2Mzk1NjgyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Toilette',
    description: 'Fresh and invigorating aquatic fragrance that captures the essence of the sea. Ideal for daily wear and warm weather.',
    notes: {
      top: ['Sea Salt', 'Grapefruit', 'Mint'],
      middle: ['Water Lily', 'Marine Notes', 'Lavender'],
      base: ['Driftwood', 'Ambergris', 'Moss']
    },
    size: '75ml / 2.5 fl oz',
    gender: 'men',
    isNew: false,
    onSale: true,
    originalPrice: 129.99
  },
  {
    id: 4,
    name: 'Golden Amber',
    brand: 'PRESTIGE',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1638901549491-26b7dd3dba23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWJlciUyMGdvbGQlMjBwZXJmdW1lfGVufDF8fHx8MTc2Mzk1NjgyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Parfum',
    description: 'A luxurious oriental fragrance with rich amber and exotic spices. Sophisticated and bold, perfect for making a statement.',
    notes: {
      top: ['Saffron', 'Cardamom', 'Cinnamon'],
      middle: ['Amber', 'Incense', 'Myrrh'],
      base: ['Sandalwood', 'Oud', 'Leather']
    },
    size: '50ml / 1.7 fl oz',
    gender: 'unisex',
    isNew: true,
    onSale: false
  },
  {
    id: 5,
    name: 'Cherry Blossom',
    brand: 'BLOOM',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1600795871209-6c48b1e0e898?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBwaW5rJTIwcGVyZnVtZXxlbnwxfHx8fDE3NjM5NTY4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Delicate and romantic fragrance inspired by Japanese cherry blossoms. Light, feminine, and perfect for spring.',
    notes: {
      top: ['Cherry Blossom', 'Pear', 'Raspberry'],
      middle: ['Mimosa', 'White Rose', 'Freesia'],
      base: ['Sandalwood', 'Tonka Bean', 'Soft Musk']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'women',
    isNew: true,
    onSale: false
  },
  {
    id: 6,
    name: 'Mystic Oud',
    brand: 'LUXE',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1642698215110-87817f1fbe0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdWQlMjB3b29kJTIwcGVyZnVtZXxlbnwxfHx8fDE3NjM5NTY4MjR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Parfum',
    description: 'An enigmatic and powerful fragrance featuring precious oud wood. Deep, mysterious, and utterly luxurious.',
    notes: {
      top: ['Rose', 'Saffron', 'Black Currant'],
      middle: ['Oud Wood', 'Agarwood', 'Patchouli'],
      base: ['Vetiver', 'Amber', 'Cashmere Wood']
    },
    size: '50ml / 1.7 fl oz',
    gender: 'unisex',
    isNew: true,
    onSale: false
  },
  {
    id: 7,
    name: 'Citrus Burst',
    brand: 'FRESH',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1743431632226-876f4bc54afe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXRydXMlMjB5ZWxsb3clMjBwZXJmdW1lfGVufDF8fHx8MTc2Mzk1NjgyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Toilette',
    description: 'Vibrant and energizing citrus fragrance that awakens the senses. Fresh, clean, and perfect for everyday wear.',
    notes: {
      top: ['Lemon', 'Orange', 'Yuzu'],
      middle: ['Neroli', 'Green Tea', 'Basil'],
      base: ['Vetiver', 'White Cedar', 'Musk']
    },
    size: '75ml / 2.5 fl oz',
    gender: 'unisex',
    isNew: false,
    onSale: true,
    originalPrice: 119.99
  },
  {
    id: 8,
    name: 'Lavender Dreams',
    brand: 'SERENITY',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1630527586722-8a6c8fa96994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXZlbmRlciUyMHB1cnBsZSUyMHBlcmZ1bWV8ZW58MXx8fHwxNzYzOTU2ODI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Calming and soothing lavender fragrance with herbal nuances. Relaxing and elegant, perfect for any occasion.',
    notes: {
      top: ['Lavender', 'Bergamot', 'Clary Sage'],
      middle: ['Violet', 'Geranium', 'Rosemary'],
      base: ['Vanilla', 'Tonka Bean', 'Coumarin']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'women',
    isNew: false,
    onSale: false
  },
  {
    id: 9,
    name: 'Vanilla Essence',
    brand: 'ELÉGANCE',
    price: 139.99,
    image: 'https://images.unsplash.com/photo-1602182479896-be4936b34c0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YW5pbGxhJTIwcGVyZnVtZSUyMGJvdHRsZXxlbnwxfHx8fDE3NjM5NDQ0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Warm and sensual vanilla-based fragrance with gourmand notes. Sweet, comforting, and irresistibly captivating.',
    notes: {
      top: ['Almond', 'Coffee', 'Bergamot'],
      middle: ['Vanilla Orchid', 'Jasmine', 'Orange Blossom'],
      base: ['Madagascar Vanilla', 'Praline', 'Sandalwood']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'women',
    isNew: false,
    onSale: false
  },
  {
    id: 10,
    name: 'Sandalwood Spice',
    brand: 'PRESTIGE',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1631445475551-ca1baf7d4f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kYWx3b29kJTIwYnJvd24lMjBwZXJmdW1lfGVufDF8fHx8MTc2Mzk1NjgyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Parfum',
    description: 'Exotic and sophisticated blend of creamy sandalwood and warm spices. Rich, woody, and deeply alluring.',
    notes: {
      top: ['Nutmeg', 'Cardamom', 'Pink Pepper'],
      middle: ['Sandalwood', 'Cedarwood', 'Iris'],
      base: ['Amber', 'Musk', 'Patchouli']
    },
    size: '50ml / 1.7 fl oz',
    gender: 'men',
    isNew: false,
    onSale: false
  },
  // Additional Women's Perfumes
  {
    id: 11,
    name: 'Silk Petals',
    brand: 'ELÉGANCE',
    price: 134.99,
    image: 'https://images.unsplash.com/photo-1759793499819-bf60128a54b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHBlcmZ1bWUlMjBlbGVnYW50fGVufDF8fHx8MTc2Mzk1Njk5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Luxurious floral bouquet with silk-like softness. Elegant and timeless for the sophisticated woman.',
    notes: {
      top: ['White Peach', 'Red Berries', 'Bergamot'],
      middle: ['Jasmine', 'Lily of the Valley', 'Iris'],
      base: ['Cashmere Wood', 'Vanilla', 'Musk']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'women',
    isNew: true,
    onSale: false
  },
  {
    id: 12,
    name: 'Moonlight Garden',
    brand: 'BLOOM',
    price: 124.99,
    image: 'https://images.unsplash.com/photo-1630527944112-4cd7a3c11a55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1pbmluZSUyMHBlcmZ1bWUlMjBib3R0bGV8ZW58MXx8fHwxNzYzOTU2OTk0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Enchanting white floral scent inspired by moonlit gardens. Romantic and mysterious.',
    notes: {
      top: ['Night Blooming Jasmine', 'Gardenia', 'Green Notes'],
      middle: ['Tuberose', 'Orange Blossom', 'Ylang-Ylang'],
      base: ['Sandalwood', 'White Musk', 'Amber']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'women',
    isNew: false,
    onSale: true,
    originalPrice: 154.99
  },
  // Additional Men's Colognes
  {
    id: 13,
    name: 'Urban Legend',
    brand: 'AZURE',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1758871992965-836e1fb0f9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjb2xvZ25lJTIwYm90dGxlfGVufDF8fHx8MTc2MzkzMzk1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Toilette',
    description: 'Modern masculine fragrance with fresh and woody notes. Bold and confident for the urban gentleman.',
    notes: {
      top: ['Grapefruit', 'Marine Notes', 'Mint'],
      middle: ['Ginger', 'Nutmeg', 'Jasmine'],
      base: ['Cedarwood', 'Patchouli', 'Amberwood']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'men',
    isNew: true,
    onSale: false
  },
  {
    id: 14,
    name: 'Leather & Tobacco',
    brand: 'PRESTIGE',
    price: 169.99,
    image: 'https://images.unsplash.com/photo-1581458873222-1f98ef85bb8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNjdWxpbmUlMjBjb2xvZ25lfGVufDF8fHx8MTc2Mzk1Njk5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Rich and sophisticated blend of leather and tobacco. Distinguished and timeless.',
    notes: {
      top: ['Tobacco Leaf', 'Whiskey', 'Spices'],
      middle: ['Leather', 'Cinnamon', 'Fruity Notes'],
      base: ['Vanilla', 'Tonka Bean', 'Cacao']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'men',
    isNew: false,
    onSale: false
  },
  {
    id: 15,
    name: 'Cedar Noir',
    brand: 'LUXE',
    price: 144.99,
    image: 'https://images.unsplash.com/photo-1642286316199-fdf22df37968?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwb2NlYW4lMjBwZXJmdW1lfGVufDF8fHx8MTc2Mzk1NjgyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Deep woody fragrance with dark cedar and vetiver. Strong and mysterious.',
    notes: {
      top: ['Black Pepper', 'Cardamom', 'Grapefruit'],
      middle: ['Cedar', 'Vetiver', 'Cypress'],
      base: ['Leather', 'Oakmoss', 'Musk']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'men',
    isNew: false,
    onSale: true,
    originalPrice: 174.99
  },
  // Additional Unisex Fragrances
  {
    id: 16,
    name: 'White Sage',
    brand: 'SERENITY',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1718833858193-b89cd20ec6c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmlzZXglMjBmcmFncmFuY2UlMjBtaW5pbWFsfGVufDF8fHx8MTc2Mzk1Njk5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Clean and meditative fragrance with white sage and aromatic woods. Gender-neutral and grounding.',
    notes: {
      top: ['White Sage', 'Eucalyptus', 'Lavender'],
      middle: ['Cedar', 'Cypress', 'Pine'],
      base: ['Vetiver', 'Patchouli', 'Moss']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'unisex',
    isNew: true,
    onSale: false
  },
  {
    id: 17,
    name: 'Amber Noir',
    brand: 'LUXE',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1761865544944-2c8da85c869e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBwZXJmdW1lJTIwZGVzaWdufGVufDF8fHx8MTc2Mzk1Njk5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Parfum',
    description: 'Dark and alluring amber-based fragrance. Rich and complex for any gender.',
    notes: {
      top: ['Bergamot', 'Pink Pepper', 'Cardamom'],
      middle: ['Amber', 'Incense', 'Labdanum'],
      base: ['Oud', 'Patchouli', 'Vanilla']
    },
    size: '50ml / 1.7 fl oz',
    gender: 'unisex',
    isNew: false,
    onSale: false
  },
  // Additional New Arrivals
  {
    id: 18,
    name: 'Crystal Rain',
    brand: 'FRESH',
    price: 114.99,
    image: 'https://images.unsplash.com/photo-1638295916768-459f6cf440bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBwZXJmdW1lJTIwYm90dGxlfGVufDF8fHx8MTc2Mzk1Njk5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Toilette',
    description: 'Fresh aquatic fragrance capturing the essence of rain. Clean and refreshing.',
    notes: {
      top: ['Water Notes', 'Cucumber', 'Green Tea'],
      middle: ['Lotus', 'Bamboo', 'White Flowers'],
      base: ['Musk', 'Cedarwood', 'Amber']
    },
    size: '75ml / 2.5 fl oz',
    gender: 'unisex',
    isNew: true,
    onSale: false
  },
  // Additional Sale Items
  {
    id: 19,
    name: 'Rose Royale',
    brand: 'BLOOM',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1763633924253-3c92ce0ba7cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwc2FsZXxlbnwxfHx8fDE3NjM5NTY5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Parfum',
    description: 'Royal rose fragrance with a touch of honey. Limited time special price.',
    notes: {
      top: ['Rose Petals', 'Honey', 'Peach'],
      middle: ['Damask Rose', 'Geranium', 'Violet'],
      base: ['Amber', 'Vanilla', 'Musk']
    },
    size: '100ml / 3.4 fl oz',
    gender: 'women',
    isNew: false,
    onSale: true,
    originalPrice: 139.99
  },
  {
    id: 20,
    name: 'Midnight Forest',
    brand: 'AZURE',
    price: 94.99,
    image: 'https://images.unsplash.com/photo-1631445475551-ca1baf7d4f16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kYWx3b29kJTIwYnJvd24lMjBwZXJmdW1lfGVufDF8fHx8MTc2Mzk1NjgyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Eau de Toilette',
    description: 'Dark forest fragrance with pine and earth notes. Special sale pricing.',
    notes: {
      top: ['Pine', 'Juniper', 'Black Pepper'],
      middle: ['Cedar', 'Fir', 'Cypress'],
      base: ['Vetiver', 'Oakmoss', 'Leather']
    },
    size: '75ml / 2.5 fl oz',
    gender: 'men',
    isNew: false,
    onSale: true,
    originalPrice: 124.99
  }
];

export const getProductsByCategory = (category: string) => {
  switch (category) {
    case 'new-arrivals':
      return allProducts.filter(p => p.isNew);
    case 'women':
      return allProducts.filter(p => p.gender === 'women');
    case 'men':
      return allProducts.filter(p => p.gender === 'men');
    case 'unisex':
      return allProducts.filter(p => p.gender === 'unisex');
    case 'sale':
      return allProducts.filter(p => p.onSale);
    default:
      return allProducts;
  }
};
