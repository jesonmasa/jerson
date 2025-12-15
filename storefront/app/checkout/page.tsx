'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { createOrder } from '@/lib/api'
import { CreditCard, Lock } from 'lucide-react'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        // Removed sensitive card fields
    })

    useEffect(() => {
        setMounted(true)
    }, [])

    const total = getTotalPrice()
    const shipping = total > 50 ? 0 : 10
    const finalTotal = total + shipping

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createOrder({
                items: items.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: finalTotal,
                shippingAddress: {
                    name: formData.name,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                },
                customerEmail: formData.email,
            })

            clearCart()
            router.push('/order-success')
        } catch (error) {
            console.error('Error creating order:', error)
            alert('There was an error processing your order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    if (!mounted) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container-custom py-12 text-center">
                    <div className="text-2xl">Loading...</div>
                </main>
                <Footer />
            </div>
        )
    }

    if (items.length === 0) {
        router.push('/cart')
        return null
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-secondary-50">
                <div className="container-custom py-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
                        Checkout
                    </h1>

                    <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
                        {/* Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Information */}
                            <div className="card">
                                <h2 className="text-2xl font-display font-bold mb-6">
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="card">
                                <h2 className="text-2xl font-display font-bold mb-6">
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                            placeholder="123 Main St"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                className="input"
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Postal Code
                                            </label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleChange}
                                                required
                                                className="input"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Country
                                        </label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                            className="input"
                                            placeholder="United States"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method - PCI Compliance Fix */}
                            <div className="card">
                                <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6" />
                                    Método de Pago
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                                        <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                                            <Lock className="w-4 h-4" />
                                            Pago Seguro y Coordinado
                                        </div>
                                        <p className="text-secondary-700 text-sm">
                                            Para garantizar tu seguridad, completaremos el pago una vez confirmado el pedido.
                                            Un asesor se pondrá en contacto contigo para coordinar el método que prefieras (Transferencia, Yape/Plin, o Contraentrega).
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <label className="flex items-center gap-3 p-3 border border-secondary-200 rounded-lg cursor-pointer hover:bg-secondary-50 transition-colors">
                                            <input type="radio" name="paymentMethod" defaultChecked className="w-4 h-4 text-primary-600" />
                                            <span className="font-medium">Coordinar Pago (WhatsApp / Contraentrega)</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="card sticky top-24">
                                <h2 className="text-2xl font-display font-bold mb-6">
                                    Order Summary
                                </h2>

                                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span className="text-secondary-700">
                                                {item.name} × {item.quantity}
                                            </span>
                                            <span className="font-semibold">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 border-t border-secondary-200 pt-4 mb-6">
                                    <div className="flex justify-between text-secondary-700">
                                        <span>Subtotal</span>
                                        <span className="font-semibold">{formatPrice(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-secondary-700">
                                        <span>Shipping</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? 'Free' : formatPrice(shipping)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-secondary-200">
                                        <span>Total</span>
                                        <span className="text-primary-600">
                                            {formatPrice(finalTotal)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
