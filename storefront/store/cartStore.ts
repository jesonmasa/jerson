import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    productId: string
    name: string
    price: number
    quantity: number
    image?: string
    size?: string
    color?: string
    variant?: {
        size?: string
        color?: string
    }
}

interface CartStore {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const existingItem = get().items.find(
                    (i) => i.id === item.id ||
                        (i.productId === item.productId &&
                            JSON.stringify(i.variant) === JSON.stringify(item.variant))
                )

                if (existingItem) {
                    set({
                        items: get().items.map((i) =>
                            i.id === existingItem.id
                                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                                : i
                        ),
                    })
                } else {
                    set({
                        items: [
                            ...get().items,
                            {
                                ...item,
                                id: item.id || `${item.productId}-${Date.now()}`,
                                quantity: item.quantity || 1,
                            },
                        ],
                    })
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) })
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id)
                    return
                }

                set({
                    items: get().items.map((item) =>
                        item.id === id ? { ...item, quantity } : item
                    ),
                })
            },

            clearCart: () => {
                set({ items: [] })
            },

            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                )
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },
        }),
        {
            name: 'cart-storage',
        }
    )
)
