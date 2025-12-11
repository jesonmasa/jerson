'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { getProducts } from '@/lib/api'
import { Product } from '@/types/product'
import { Filter, Search } from 'lucide-react'

function ProductsContent() {
    const searchParams = useSearchParams()
    const category = searchParams.get('category')

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        loadProducts()
    }, [category])

    const loadProducts = async () => {
        try {
            setLoading(true)
            const data = await getProducts({ category: category || undefined })
            setProducts(data)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="container-custom py-12">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                    {category ? (
                        <>
                            <span className="capitalize">{category}</span> Products
                        </>
                    ) : (
                        'All Products'
                    )}
                </h1>
                <p className="text-xl text-secondary-600">
                    Discover our curated collection of premium products
                </p>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl shadow-soft p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-secondary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                    </div>
                    <button className="btn btn-secondary">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="card p-0 overflow-hidden">
                            <div className="aspect-square bg-secondary-200 skeleton" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-secondary-200 rounded skeleton" />
                                <div className="h-6 bg-secondary-200 rounded skeleton" />
                                <div className="h-4 bg-secondary-200 rounded w-2/3 skeleton" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-display font-bold mb-2">
                        No products found
                    </h3>
                    <p className="text-secondary-600">
                        Try adjusting your search or filters
                    </p>
                </div>
            )}
        </div>
    )
}

export default function ProductsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-secondary-50">
                <Suspense fallback={
                    <div className="container-custom py-12">
                        <div className="text-center">Loading...</div>
                    </div>
                }>
                    <ProductsContent />
                </Suspense>
            </main>

            <Footer />
        </div>
    )
}
