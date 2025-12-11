'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { items } = useCartStore()
    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-secondary-200 shadow-sm">
            <div className="container-custom">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text">
                            Constructor
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
                            Inicio
                        </Link>
                        <Link href="/about" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
                            Sobre Nosotros
                        </Link>
                        <Link href="/products" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
                            Productos
                        </Link>
                        <Link href="#contacto" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
                            Contacto
                        </Link>
                        <Link href="/politicas" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
                            Políticas y Privacidad
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors hidden md:block">
                            <Search className="w-5 h-5 text-secondary-700" />
                        </button>

                        <button className="p-2 hover:bg-secondary-100 rounded-lg transition-colors hidden md:block">
                            <Heart className="w-5 h-5 text-secondary-700" />
                        </button>

                        <Link href="/account" className="p-2 hover:bg-secondary-100 rounded-lg transition-colors hidden md:block">
                            <User className="w-5 h-5 text-secondary-700" />
                        </Link>

                        <Link href="/cart" className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors">
                            <ShoppingCart className="w-5 h-5 text-secondary-700" />
                            {cartItemsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                                    {cartItemsCount}
                                </span>
                            )}
                        </Link>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors md:hidden"
                        >
                            <Menu className="w-6 h-6 text-secondary-700" />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-secondary-200 animate-slide-down">
                        <nav className="flex flex-col gap-4">
                            <Link href="/">
                                Inicio
                            </Link>
                            <Link href="/about">
                                Sobre Nosotros
                            </Link>
                            <Link href="/products">
                                Productos
                            </Link>
                            <Link href="#contacto">
                                Contacto
                            </Link>
                            <Link href="/politicas">
                                Políticas y Privacidad
                            </Link>
                            <div className="border-t border-secondary-200 pt-4 flex gap-4">
                                <Link href="/account" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
                                    Account
                                </Link>
                                <Link href="/wishlist" className="text-secondary-700 hover:text-primary-600 font-medium transition-colors">
                                    Wishlist
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}
