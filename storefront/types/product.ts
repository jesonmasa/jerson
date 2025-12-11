export interface Product {
    id: string
    name: string
    description: string
    price: number
    category: string
    images: string[]
    inStock: boolean
    variants?: ProductVariant[]
    sizes?: string[]
    colors?: { name: string; image: string }[]
    createdAt: string
    updatedAt: string
}

export interface ProductVariant {
    id: string
    size?: string
    color?: string
    stock: number
    priceModifier?: number
}

export interface ProductFilters {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    page?: number
    limit?: number
}
