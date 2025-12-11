'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types/product'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isLiked, setIsLiked] = useState(false)
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
        })
    }

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault()
        setIsLiked(!isLiked)
    }

    return (
        <Link href={`/products/${product.id}`} className="group">
            <div className="card card-hover overflow-hidden p-0">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-secondary-100">
                    {product.images && product.images.length > 0 ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                            <span className="text-4xl text-secondary-400">📦</span>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleLike}
                            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary-50 transition-colors"
                        >
                            <Heart
                                className={`w-5 h-5 ${isLiked ? 'fill-primary-600 text-primary-600' : 'text-secondary-700'
                                    }`}
                            />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="w-10 h-10 rounded-full bg-primary-600 text-white shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Stock Badge */}
                    {!product.inStock && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-secondary-900/90 text-white text-sm font-medium rounded-full">
                            Out of Stock
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4">
                    <p className="text-sm text-secondary-500 mb-1 capitalize">
                        {product.category}
                    </p>
                    <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-600">
                            {formatPrice(product.price)}
                        </span>
                        {product.inStock && (
                            <span className="text-sm text-green-600 font-medium">
                                In Stock
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}
