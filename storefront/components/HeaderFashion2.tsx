'use client'

import Link from 'next/link'
import { ShoppingCart, Search, Menu, User, Heart, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'

export default function HeaderFashion2() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const { items } = useCartStore()
    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-secondary-900/95 backdrop-blur-md py-2 shadow-lg' : 'bg-secondary-900 py-4'
            }`}>
            <div className="container-custom">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group z-50">
                        <div className="w-10 h-10 bg-white text-secondary-900 flex items-center justify-center font-black text-xl tracking-tighter transform -skew-x-12 group-hover:skew-x-0 transition-transform">
                            M
                        </div>
                        <span className="text-2xl font-display font-bold text-white tracking-wide">
                            MODA<span className="text-primary-500">X</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10">
                        {[
                            { name: 'Inicio', href: '/' },
                            { name: 'Sobre Nosotros', href: '/about' },
                            { name: 'Productos', href: '/products' },
                            { name: 'Políticas y Privacidad', href: '/politicas' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-secondary-300 hover:text-white font-medium text-sm uppercase tracking-widest transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-6">
                        <button className="text-secondary-300 hover:text-white transition-colors hidden md:block">
                            <Search className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-4 border-l border-secondary-700 pl-6">
                            <Link href="/account" className="text-secondary-300 hover:text-white transition-colors hidden md:block">
                                <User className="w-5 h-5" />
                            </Link>

                            <Link href="/cart" className="relative text-secondary-300 hover:text-white transition-colors group">
                                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs font-bold flex items-center justify-center rounded-none transform rotate-45">
                                        <span className="transform -rotate-45">{cartItemsCount}</span>
                                    </span>
                                )}
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden text-white z-50"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Full Screen Mobile Menu */}
            <div className={`fixed inset-0 bg-secondary-900 z-40 transition-transform duration-500 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col items-center justify-center h-full gap-8">
                    {[
                        { name: 'Inicio', href: '/' },
                        { name: 'Sobre Nosotros', href: '/about' },
                        { name: 'Productos', href: '/products' },
                        { name: 'Políticas', href: '/politicas' },
                        { name: 'Mi Cuenta', href: '/account' },
                        { name: 'Favoritos', href: '/wishlist' }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-3xl font-display font-bold text-white hover:text-primary-500 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}
