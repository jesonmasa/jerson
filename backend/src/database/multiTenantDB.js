/**
 * Multi-Tenant Database Module
 * Gestiona datos aislados por tenant y datos globales de la plataforma
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'; // Needed for super admin init

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rutas base
const DATA_DIR = join(__dirname, '..', '..', 'data');
const GLOBAL_DIR = join(DATA_DIR, 'global');
const TENANTS_DIR = join(DATA_DIR, 'tenants');
const PLATFORM_FILE = join(GLOBAL_DIR, 'platform.json');

// Estructura inicial para datos globales
const initPlatformData = {
    users: [],
    subscriptions: [],
    verification_codes: [],
    platform_stats: {
        total_tenants: 0,
        active_subscriptions: 0,
        monthly_revenue: 0
    }
};

// Estructura inicial para cada tenant
const initTenantData = {
    products: [],
    categories: [],
    orders: [],
    customers: [],
    pages: [],
    gallery: [],
    shipments: [],
    config: {
        storeName: 'Mi Tienda',
        themeId: 'tienda-mascotas',
        logoUrl: '',
        bannerImage: '',
        contactPhone: '',
        contactEmail: '',
        address: '',
        socialLinks: {}
    },
    analytics: {
        total_sales: 0,
        total_orders: 0,
        products_sold: [],
        monthly_revenue: []
    }
};

// ============================================
// UTILIDADES DE ARCHIVOS
// ============================================

async function ensureDir(dirPath) {
    try {
        await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    }
}

async function readJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') return null;
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

async function writeJSON(filePath, data) {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// ============================================
// GESTIÓN DE PLATAFORMA (DATOS GLOBALES)
// ============================================

export const platform = {
    // Inicializar estructura de directorios
    async init() {
        await ensureDir(GLOBAL_DIR);
        await ensureDir(TENANTS_DIR);

        const exists = await readJSON(PLATFORM_FILE);
        if (!exists) {
            await writeJSON(PLATFORM_FILE, initPlatformData);
            console.log('✅ Platform database initialized');
        }

        // AUTO-INIT SUPER ADMIN (Solo en desarrollo)
        console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
        console.log('🔍 Platform file path:', PLATFORM_FILE);
        
        const platformData = await this.read();
        console.log('🔍 Current users count:', platformData.users.length);
        
        // Solo crear super admin si no existen usuarios y estamos en desarrollo
        if (platformData.users.length === 0 && process.env.NODE_ENV === 'development') {
            const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@constructor.test';
            const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD || 'constructor123';
            
            console.log('👑 Creando Super Admin para desarrollo...');
            const hashedPassword = await bcrypt.hash(superAdminPassword, 12);
            const tenantId = uuidv4();

            const superAdmin = {
                id: uuidv4(),
                tenantId: tenantId,
                email: superAdminEmail,
                password: hashedPassword,
                name: 'Super Admin',
                role: 'super_admin',
                emailVerified: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            platformData.users.push(superAdmin);
            await this.write(platformData);

            // Crear tenant para el super admin
            await tenant.create(tenantId, {
                storeName: "Super Admin Store",
                ownerEmail: superAdminEmail
            });

            console.log(`✨ Super Admin creado: ${superAdminEmail} / ${superAdminPassword}`);
        } else {
            console.log('⏭️  Skipping super admin creation. Users exist or not in development mode.');
        }
    },

    // Leer datos de plataforma
    async read() {
        const data = await readJSON(PLATFORM_FILE);
        return data || initPlatformData;
    },

    // Escribir datos de plataforma
    async write(data) {
        return await writeJSON(PLATFORM_FILE, data);
    },

    // ========== USUARIOS ==========
    async findUserByEmail(email) {
        const data = await this.read();
        return data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },

    async findUserById(id) {
        const data = await this.read();
        return data.users.find(u => u.id === id);
    },

    async createUser(userData) {
        const data = await this.read();
        const id = uuidv4();
        const tenantId = uuidv4();

        const newUser = {
            id,
            tenantId,
            email: userData.email.toLowerCase(),
            password: userData.password, // Ya hasheado
            name: userData.name,
            role: userData.role || 'owner', // owner, super_admin
            emailVerified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.users.push(newUser);
        data.platform_stats.total_tenants++;
        await this.write(data);

        // Crear carpeta del tenant
        await tenant.create(tenantId, {
            storeName: userData.name + "'s Store",
            ownerEmail: userData.email
        });

        return newUser;
    },

    async updateUser(id, updates) {
        const data = await this.read();
        const index = data.users.findIndex(u => u.id === id);
        if (index === -1) return null;

        data.users[index] = {
            ...data.users[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        await this.write(data);
        return data.users[index];
    },

    async getAllUsers() {
        const data = await this.read();
        return data.users.map(u => ({
            id: u.id,
            tenantId: u.tenantId,
            email: u.email,
            name: u.name,
            role: u.role,
            emailVerified: u.emailVerified,
            createdAt: u.createdAt
        }));
    },

    // ========== CÓDIGOS DE VERIFICACIÓN ==========
    async createVerificationCode(email) {
        const data = await this.read();
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 min

        // Eliminar códigos anteriores del mismo email
        data.verification_codes = data.verification_codes.filter(
            v => v.email !== email.toLowerCase()
        );

        data.verification_codes.push({
            email: email.toLowerCase(),
            code,
            expiresAt,
            createdAt: new Date().toISOString()
        });

        await this.write(data);
        return code;
    },

    async verifyCode(email, code) {
        const data = await this.read();
        const record = data.verification_codes.find(
            v => v.email === email.toLowerCase() && v.code === code
        );

        if (!record) return { valid: false, error: 'Código inválido' };
        if (new Date(record.expiresAt) < new Date()) {
            return { valid: false, error: 'Código expirado' };
        }

        // Eliminar código usado
        data.verification_codes = data.verification_codes.filter(
            v => v.email !== email.toLowerCase()
        );
        await this.write(data);

        return { valid: true };
    },

    // ========== SUSCRIPCIONES ==========
    async createSubscription(userId, planData) {
        const data = await this.read();
        const subscription = {
            id: uuidv4(),
            userId,
            planId: planData.planId,
            planName: planData.planName,
            priceMonthly: planData.priceMonthly,
            stripeCustomerId: planData.stripeCustomerId || null,
            stripeSubscriptionId: planData.stripeSubscriptionId || null,
            status: 'active', // active, canceled, past_due, trialing
            currentPeriodStart: new Date().toISOString(),
            currentPeriodEnd: planData.currentPeriodEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date().toISOString()
        };

        data.subscriptions.push(subscription);
        data.platform_stats.active_subscriptions++;
        data.platform_stats.monthly_revenue += planData.priceMonthly;
        await this.write(data);

        return subscription;
    },

    async getSubscription(userId) {
        const data = await this.read();
        return data.subscriptions.find(s => s.userId === userId && s.status === 'active');
    },

    async updateSubscription(subscriptionId, updates) {
        const data = await this.read();
        const index = data.subscriptions.findIndex(s => s.id === subscriptionId);
        if (index === -1) return null;

        data.subscriptions[index] = { ...data.subscriptions[index], ...updates };
        await this.write(data);
        return data.subscriptions[index];
    },

    async getAllSubscriptions() {
        const data = await this.read();
        return data.subscriptions;
    },

    async getPlatformStats() {
        const data = await this.read();
        return {
            ...data.platform_stats,
            total_users: data.users.length,
            verified_users: data.users.filter(u => u.emailVerified).length
        };
    }
};

// ============================================
// GESTIÓN DE TENANTS (DATOS AISLADOS)
// ============================================

export const tenant = {
    getPath(tenantId) {
        return join(TENANTS_DIR, `tenant_${tenantId}`);
    },

    getFilePath(tenantId, collection) {
        return join(this.getPath(tenantId), `${collection}.json`);
    },

    // Crear nuevo tenant
    async create(tenantId, initialConfig = {}) {
        const tenantPath = this.getPath(tenantId);
        await ensureDir(tenantPath);

        const tenantData = {
            ...initTenantData,
            config: {
                ...initTenantData.config,
                ...initialConfig
            }
        };

        // Crear archivos individuales para cada colección
        for (const [key, value] of Object.entries(tenantData)) {
            await writeJSON(join(tenantPath, `${key}.json`), value);
        }

        console.log(`✅ Tenant ${tenantId} created`);
        return true;
    },

    // Verificar si tenant existe
    async exists(tenantId) {
        try {
            await fs.access(this.getPath(tenantId));
            return true;
        } catch {
            return false;
        }
    },

    // Leer colección de un tenant
    async readCollection(tenantId, collection) {
        const filePath = this.getFilePath(tenantId, collection);
        const data = await readJSON(filePath);
        return data || (collection === 'config' ? initTenantData.config : []);
    },

    // Escribir colección de un tenant
    async writeCollection(tenantId, collection, data) {
        const filePath = this.getFilePath(tenantId, collection);
        return await writeJSON(filePath, data);
    },

    // ========== CRUD GENÉRICO PARA COLECCIONES ==========
    async findAll(tenantId, collection) {
        return await this.readCollection(tenantId, collection);
    },

    async findById(tenantId, collection, id) {
        const items = await this.readCollection(tenantId, collection);
        return items.find(item => item.id === id);
    },

    async findOne(tenantId, collection, condition) {
        const items = await this.readCollection(tenantId, collection);
        return items.find(item => {
            return Object.keys(condition).every(key => item[key] === condition[key]);
        });
    },

    async insert(tenantId, collection, item) {
        const items = await this.readCollection(tenantId, collection);
        const newItem = {
            id: uuidv4(),
            ...item,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        items.push(newItem);
        await this.writeCollection(tenantId, collection, items);
        return newItem;
    },

    async update(tenantId, collection, id, updates) {
        const items = await this.readCollection(tenantId, collection);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return null;

        items[index] = {
            ...items[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        await this.writeCollection(tenantId, collection, items);
        return items[index];
    },

    async delete(tenantId, collection, id) {
        const items = await this.readCollection(tenantId, collection);
        const index = items.findIndex(item => item.id === id);
        if (index === -1) return false;

        items.splice(index, 1);
        await this.writeCollection(tenantId, collection, items);
        return true;
    },

    // ========== CONFIG ==========
    async getConfig(tenantId) {
        return await this.readCollection(tenantId, 'config');
    },

    async updateConfig(tenantId, updates) {
        const config = await this.getConfig(tenantId);
        const newConfig = { ...config, ...updates };
        await this.writeCollection(tenantId, 'config', newConfig);
        return newConfig;
    },

    // ========== ANALYTICS ==========
    async getAnalytics(tenantId) {
        return await this.readCollection(tenantId, 'analytics');
    },

    async updateAnalytics(tenantId, updates) {
        const analytics = await this.getAnalytics(tenantId);
        const newAnalytics = { ...analytics, ...updates };
        await this.writeCollection(tenantId, 'analytics', newAnalytics);
        return newAnalytics;
    },

    async recordSale(tenantId, orderData) {
        const analytics = await this.getAnalytics(tenantId);
        analytics.total_sales += orderData.total;
        analytics.total_orders += 1;

        // Registrar productos vendidos
        for (const item of orderData.items || []) {
            const existing = analytics.products_sold.find(p => p.productId === item.productId);
            if (existing) {
                existing.quantity += item.quantity;
                existing.revenue += item.price * item.quantity;
            } else {
                analytics.products_sold.push({
                    productId: item.productId,
                    productName: item.name,
                    quantity: item.quantity,
                    revenue: item.price * item.quantity
                });
            }
        }

        await this.writeCollection(tenantId, 'analytics', analytics);
        return analytics;
    }
};

// ============================================
// AGREGACIÓN PARA SUPER ADMIN
// ============================================

export const aggregation = {
    // Obtener estadísticas globales de todos los tenants
    async getGlobalStats() {
        const platformData = await platform.read();
        const users = platformData.users;

        let totalProducts = 0;
        let totalOrders = 0;
        let totalRevenue = 0;
        const productsByCategory = {};
        const topProducts = [];

        for (const user of users) {
            if (!user.tenantId) continue;

            try {
                const products = await tenant.readCollection(user.tenantId, 'products');
                const orders = await tenant.readCollection(user.tenantId, 'orders');
                const analytics = await tenant.readCollection(user.tenantId, 'analytics');

                totalProducts += products.length;
                totalOrders += orders.length;
                totalRevenue += analytics.total_sales || 0;

                // Agrupar por categoría
                for (const product of products) {
                    const cat = product.category || 'Sin categoría';
                    productsByCategory[cat] = (productsByCategory[cat] || 0) + 1;
                }

                // Productos más vendidos
                for (const sold of analytics.products_sold || []) {
                    topProducts.push({
                        ...sold,
                        tenantId: user.tenantId,
                        storeName: user.name
                    });
                }
            } catch (error) {
                // Tenant puede no existir aún
            }
        }

        // Top 10 productos más vendidos
        topProducts.sort((a, b) => b.quantity - a.quantity);

        return {
            totalTenants: users.length,
            activeSubscriptions: platformData.subscriptions.filter(s => s.status === 'active').length,
            totalProducts,
            totalOrders,
            totalRevenue,
            productsByCategory,
            topProducts: topProducts.slice(0, 10),
            monthlyRecurringRevenue: platformData.platform_stats.monthly_revenue
        };
    },

    // Obtener tendencias para mostrar a los tenants
    async getTrendsForTenant(tenantId) {
        const globalStats = await this.getGlobalStats();

        return {
            topSellingCategories: Object.entries(globalStats.productsByCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, count]) => ({ category, count })),
            trendingProducts: globalStats.topProducts.slice(0, 5).map(p => ({
                name: p.productName,
                sales: p.quantity
            })),
            platformAvgRevenue: globalStats.totalRevenue / Math.max(globalStats.totalTenants, 1)
        };
    },

    // NUEVO: Obtener TODOS los productos de todos los tenants para el Marketplace
    async getAllMarketplaceProducts() {
        const platformData = await platform.read();
        const users = platformData.users;
        const allProducts = [];

        for (const user of users) {
            if (!user.tenantId) continue;

            try {
                // Verificar si existe el tenant
                if (!await tenant.exists(user.tenantId)) continue;

                // Obtener configuración para el nombre de la tienda
                const config = await tenant.getConfig(user.tenantId);
                const storeName = config.storeName || user.name + "'s Store";

                // Obtener productos
                const products = await tenant.readCollection(user.tenantId, 'products');

                // Filtrar solo publicados y enriquecer con datos del tenant
                const published = products
                    .filter(p => p.status === 'published')
                    .map(p => ({
                        ...p,
                        tenantId: user.tenantId,
                        storeName: storeName,
                        storeUrl: `/store/${user.tenantId}` // Helper para el frontend
                    }));

                allProducts.push(...published);
            } catch (error) {
                console.warn(`Error reading tenant ${user.tenantId} for marketplace:`, error.message);
            }
        }

        // Ordenar aleatoriamente o por más recientes (opcional)
        return allProducts.sort(() => Math.random() - 0.5);
    },

    // NUEVO: Obtener TODAS las tiendas (Tenants)
    async getAllStores() {
        const platformData = await platform.read();
        const users = platformData.users;
        const stores = [];

        for (const user of users) {
            if (!user.tenantId) continue;

            try {
                if (!await tenant.exists(user.tenantId)) continue;
                const config = await tenant.getConfig(user.tenantId);

                // FILTER: Only show published stores
                if (!config.isPublished && config.isPublished !== undefined) continue;

                const products = await tenant.readCollection(user.tenantId, 'products'); // Para contar productos

                stores.push({
                    id: user.tenantId,
                    name: config.storeName || user.name + "'s Store",
                    url: `/store/${user.tenantId}`,
                    logo: config.logoUrl,
                    productCount: products.length
                });
            } catch (error) { 
                console.warn(`⚠️ Error procesando tienda ${user.tenantId}:`, error.message);
                // Continuar con otras tiendas
            }
        }
        return stores;
    },

    // NUEVO: Obtener la MEJOR oferta de CADA tienda (Flash Deals)
    async getFlashDeals() {
        const platformData = await platform.read();
        const users = platformData.users;
        const flashDeals = [];

        for (const user of users) {
            if (!user.tenantId) continue;

            try {
                // Verificar si existe el tenant
                if (!await tenant.exists(user.tenantId)) continue;

                const config = await tenant.getConfig(user.tenantId);
                const storeName = config.storeName || user.name + "'s Store";

                // Obtener productos
                const products = await tenant.readCollection(user.tenantId, 'products');

                // Filtrar publicados y con descuento
                const discounted = products
                    .filter(p => p.status === 'published' && p.discount && p.discount > 0)
                    .sort((a, b) => b.discount - a.discount); // Ordenar por mayor descuento

                // Tomar el mejor (el primero)
                if (discounted.length > 0) {
                    const bestDeal = discounted[0];
                    flashDeals.push({
                        ...bestDeal,
                        tenantId: user.tenantId,
                        storeName: storeName,
                        storeUrl: `/store/${user.tenantId}`
                    });
                }
            } catch (error) {
                console.warn(`Error getting flash deal for tenant ${user.tenantId}:`, error.message);
            }
        }

        // Ordenar las ofertas por el mayor descuento globalmente
        return flashDeals.sort((a, b) => b.discount - a.discount);
    }
};

// Inicializar al importar
platform.init().catch(console.error);

export default { platform, tenant, aggregation };
