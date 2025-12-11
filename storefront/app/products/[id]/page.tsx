'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getProduct } from '@/lib/api'
import { Product } from '@/types/product'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Heart, Check, Truck, Shield, RotateCcw } from 'lucide-react'

export default function ProductDetailPage() {
    const params = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState<string>('')
    const addItem = useCartStore((state) => state.addItem)

    useEffect(() => {
        loadProduct()
    }, [params.id])

    const loadProduct = async () => {
        try {
            setLoading(true)
            const data = await getProduct(params.id as string)
            setProduct(data)
        } catch (error) {
            console.error('Error loading product:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product) return

        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[selectedImage] || product.images[0],
            quantity,
            size: selectedSize,
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container-custom py-12">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="aspect-square bg-secondary-200 rounded-xl skeleton" />
                            <div className="grid grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-secondary-200 rounded-lg skeleton" />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-8 bg-secondary-200 rounded skeleton" />
                            <div className="h-12 bg-secondary-200 rounded skeleton" />
                            <div className="h-24 bg-secondary-200 rounded skeleton" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container-custom py-12 text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-3xl font-display font-bold mb-2">Product not found</h1>
                    <p className="text-secondary-600">The product you're looking for doesn't exist.</p>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-white">
                <div className="container-custom py-12">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Images */}
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary-100">
                                {product.images && product.images.length > 0 ? (
                                    <Image
                                        src={product.images[selectedImage]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary-100 to-secondary-200">
                                        <span className="text-8xl">📦</span>
                                    </div>
                                )}
                            </div>

                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-primary-600 shadow-glow'
                                                : 'border-transparent hover:border-secondary-300'
                                                }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.name} ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Color Variants */}
                            {product.colors && product.colors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium mb-3">Colores Disponibles</h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {product.colors.map((color, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    // If color has an image, try to find it in images array or set it directly
                                                    // For now, we assume the color image might be separate or we just want to show it
                                                    // But the requirement says "show product with images of other colors below"
                                                    // We can just use the color image as a thumbnail
                                                }}
                                                className="group relative"
                                            >
                                                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-600 transition-all">
                                                    <Image
                                                        src={color.image}
                                                        alt={color.name}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <span className="text-xs text-center block mt-1 font-medium">{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <p className="text-sm text-secondary-500 mb-2 uppercase tracking-wider">
                                {product.category}
                            </p>
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-4 mb-6">
                                <span className="text-4xl font-bold text-primary-600">
                                    {formatPrice(product.price)}
                                </span>
                                {product.inStock ? (
                                    <span className="flex items-center gap-2 text-green-600 font-medium">
                                        <Check className="w-5 h-5" />
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="text-secondary-500 font-medium">
                                        Out of Stock
                                    </span>
                                )}
                            </div>

                            <p className="text-lg text-secondary-700 mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Sizes */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium">Talla</label>
                                        <button className="text-sm text-primary-600 hover:underline">
                                            Guía de tallas
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`min-w-[3rem] h-12 px-4 rounded-lg border-2 font-medium transition-all ${selectedSize === size
                                                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                        : 'border-secondary-200 hover:border-secondary-300 text-secondary-700'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Quantity</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-secondary-300 hover:border-primary-600 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold w-12 text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-lg border-2 border-secondary-300 hover:border-primary-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 mb-8">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock || (product.sizes && product.sizes.length > 0 && !selectedSize)}
                                    className="btn btn-primary flex-1 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                                <button className="btn btn-outline">
                                    <Heart className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="space-y-4 border-t border-secondary-200 pt-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Free Shipping</h4>
                                        <p className="text-sm text-secondary-600">
                                            On orders over $50
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <RotateCcw className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Easy Returns</h4>
                                        <p className="text-sm text-secondary-600">
                                            30-day return policy
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        <Shield className="w-5 h-5 text-primary-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">Secure Payment</h4>
                                        <p className="text-sm text-secondary-600">
                                            100% secure transactions
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
