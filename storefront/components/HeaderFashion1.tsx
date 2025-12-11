'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function HeaderFashion1() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { items } = useCartStore()
    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-secondary-100 shadow-sm">
            <div className="container-custom py-4">
                {/* Top Bar with Actions */}
                <div className="flex items-center justify-between md:justify-end mb-4 md:mb-0">
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-secondary-50 rounded-full transition-colors"
                        >
                            <Menu className="w-6 h-6 text-secondary-900" />
                        </button>
                    </div>

                    {/* Logo (Centered on Mobile, Left on Desktop for this layout? No, let's center it for "Vogue" style) */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none md:flex-1 md:text-center">
                        <Link href="/" className="inline-block group">
                            <h1 className="text-3xl md:text-4xl font-display font-black tracking-tighter text-secondary-900 uppercase group-hover:text-primary-600 transition-colors">
                                VOGUE<span className="text-primary-600">.</span>
                            </h1>
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:flex-1 md:justify-end">
                        <button className="p-2 hover:bg-secondary-50 rounded-full transition-colors hidden md:block">
                            <Search className="w-5 h-5 text-secondary-600" />
                        </button>
                        <Link href="/wishlist" className="p-2 hover:bg-secondary-50 rounded-full transition-colors hidden md:block">
                            <Heart className="w-5 h-5 text-secondary-600" />
                        </Link>
                        <Link href="/account" className="p-2 hover:bg-secondary-50 rounded-full transition-colors hidden md:block">
                            <User className="w-5 h-5 text-secondary-600" />
                        </Link>
                        <Link href="/cart" className="relative p-2 hover:bg-secondary-50 rounded-full transition-colors">
                            <ShoppingCart className="w-5 h-5 text-secondary-600" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Desktop Navigation (Centered below logo) */}
                <nav className="hidden md:flex items-center justify-center gap-12 py-2 border-t border-secondary-100 mt-4">
                    <Link href="/" className="text-sm font-bold tracking-widest uppercase text-secondary-900 hover:text-primary-600 transition-colors">
                        Inicio
                    </Link>
                    <Link href="/about" className="text-sm font-bold tracking-widest uppercase text-secondary-900 hover:text-primary-600 transition-colors">
                        Sobre Nosotros
                    </Link>
                    <Link href="/products" className="text-sm font-bold tracking-widest uppercase text-secondary-900 hover:text-primary-600 transition-colors">
                        Productos
                    </Link>
                    <Link href="/politicas" className="text-sm font-bold tracking-widest uppercase text-secondary-900 hover:text-primary-600 transition-colors">
                        Políticas y Privacidad
                    </Link>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-secondary-100 animate-slide-down">
                        <nav className="flex flex-col gap-4 text-center">
                            <Link href="/" className="text-lg font-medium text-secondary-900">Inicio</Link>
                            <Link href="/about" className="text-lg font-medium text-secondary-900">Sobre Nosotros</Link>
                            <Link href="/products" className="text-lg font-medium text-secondary-900">Productos</Link>
                            <Link href="/politicas" className="text-lg font-medium text-secondary-900">Políticas y Privacidad</Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
