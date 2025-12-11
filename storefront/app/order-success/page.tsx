import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle, Package } from 'lucide-react'

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container-custom py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                        Order Confirmed!
                    </h1>

                    <p className="text-xl text-secondary-600 mb-8">
                        Thank you for your purchase. We've received your order and will send you a confirmation email shortly.
                    </p>

                    <div className="card mb-8 text-left">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                                <Package className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="font-display font-bold text-lg mb-2">
                                    What's Next?
                                </h3>
                                <ul className="space-y-2 text-secondary-700">
                                    <li>• You'll receive an order confirmation email</li>
                                    <li>• We'll notify you when your order ships</li>
                                    <li>• Track your order in your account</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/products" className="btn btn-primary">
                            Continue Shopping
                        </Link>
                        <Link href="/account/orders" className="btn btn-outline">
                            View Orders
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
