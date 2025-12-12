import axios from 'axios'

// Use relative path so Next.js rewrites can handle the proxying to backend
const API_URL = '';

console.log('🔌 API_URL initialized: Relative /api (Proxied via next.config.js)');

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Products
export const getProducts = async (params?: {
    category?: string
    search?: string
    page?: number
    limit?: number
}) => {
    const response = await api.get('/products', { params })
    return response.data
}

export const getProduct = async (id: string) => {
    const response = await api.get(`/products/${id}`)
    return response.data
}

// Orders
export const createOrder = async (orderData: any) => {
    const response = await api.post('/orders', orderData)
    return response.data
}

export const getOrders = async () => {
    const response = await api.get('/orders')
    return response.data
}

// Auth
export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
}

export const register = async (userData: {
    email: string
    password: string
    name: string
}) => {
    const response = await api.post('/auth/register', userData)
    return response.data
}

// MARKETPLACE & MULTI-TENANT
export const getMarketplaceProducts = async (params?: { category?: string, search?: string }) => {
    const response = await api.get('/marketplace/products', { params })
    return response.data
}

export const getMarketplaceStores = async () => {
    const response = await api.get('/marketplace/stores')
    return response.data
}

export const getFlashDeals = async () => {
    const response = await api.get('/marketplace/deals')
    return response.data
}

export const getStoreConfig = async (storeId: string) => {
    const response = await api.get(`/v2/config/store/${storeId}`)
    return response.data
}

export const getStoreProducts = async (storeId: string) => {
    const response = await api.get(`/v2/products/store/${storeId}`)
    return response.data
}

export const getStoreCategories = async (storeId: string) => {
    const response = await api.get(`/v2/categories/store/${storeId}`)
    return response.data
}
