import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-secondary-900 text-white">
            <div className="container-custom section-padding">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-glow">
                                <span className="text-white font-bold text-xl">C</span>
                            </div>
                            <span className="text-2xl font-display font-bold">
                                Constructor
                            </span>
                        </Link>
                        <p className="text-secondary-400 mb-6">
                            Your destination for premium fashion, beauty, and personal care products.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-lg bg-secondary-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-secondary-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-secondary-800 hover:bg-primary-600 flex items-center justify-center transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="font-display font-bold text-lg mb-4">Shop</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products" className="text-secondary-400 hover:text-white transition-colors">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=fashion" className="text-secondary-400 hover:text-white transition-colors">
                                    Fashion
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=beauty" className="text-secondary-400 hover:text-white transition-colors">
                                    Beauty
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=accessories" className="text-secondary-400 hover:text-white transition-colors">
                                    Accessories
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-display font-bold text-lg mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/help" className="text-secondary-400 hover:text-white transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-secondary-400 hover:text-white transition-colors">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-secondary-400 hover:text-white transition-colors">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-secondary-400 hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-display font-bold text-lg mb-4">Stay Updated</h3>
                        <p className="text-secondary-400 mb-4">
                            Subscribe to get special offers and updates.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 rounded-lg bg-secondary-800 border border-secondary-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                            />
                            <button type="submit" className="btn btn-primary">
                                <Mail className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-secondary-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-secondary-400 text-sm">
                        © {new Date().getFullYear()} Constructor. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy" className="text-secondary-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="text-secondary-400 hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
