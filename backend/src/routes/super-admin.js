/**
 * Rutas de Super Admin
 * Solo accesible por usuarios con rol super_admin
 */

import express from 'express';
import { platform, tenant, aggregation } from '../database/db.js';
import { authenticate, superAdminOnly } from '../middleware/auth.js';

const router = express.Router();

// Aplicar autenticación y verificación de super admin a todas las rutas
router.use(authenticate);
router.use(superAdminOnly);

// ============================================
// DASHBOARD GLOBAL
// ============================================
router.get('/dashboard', async (req, res) => {
    try {
        const stats = await aggregation.getGlobalStats();
        const platformStats = await platform.getPlatformStats();

        res.json({
            overview: {
                totalTenants: stats.totalTenants,
                activeSubscriptions: stats.activeSubscriptions,
                totalProducts: stats.totalProducts,
                totalOrders: stats.totalOrders,
                totalRevenue: stats.totalRevenue,
                monthlyRecurringRevenue: stats.monthlyRecurringRevenue
            },
            platform: platformStats,
            topProducts: stats.topProducts,
            productsByCategory: stats.productsByCategory
        });

    } catch (error) {
        console.error('Super admin dashboard error:', error);
        res.status(500).json({ error: 'Error al obtener dashboard' });
    }
});

// ============================================
// LISTA DE USUARIOS/TENANTS
// ============================================
router.get('/users', async (req, res) => {
    try {
        const users = await platform.getAllUsers();
        const subscriptions = await platform.getAllSubscriptions();

        // Enriquecer usuarios con info de suscripción
        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const subscription = subscriptions.find(s => s.userId === user.id);

            let storeStats = null;
            if (user.tenantId) {
                try {
                    const products = await tenant.readCollection(user.tenantId, 'products');
                    const orders = await tenant.readCollection(user.tenantId, 'orders');
                    const analytics = await tenant.readCollection(user.tenantId, 'analytics');
                    const config = await tenant.getConfig(user.tenantId);

                    storeStats = {
                        storeName: config?.storeName || 'Tienda sin nombre',
                        themeId: config?.themeId || 'default',
                        productCount: products?.length || 0,
                        orderCount: orders?.length || 0,
                        totalSales: analytics?.total_sales || 0
                    };
                } catch (tenantError) {
                    console.error(`Error cargando datos del tenant ${user.tenantId}:`, tenantError.message);
                    // Continuar sin datos de tienda si hay error
                }
            }

            return {
                ...user,
                subscription: subscription ? {
                    planName: subscription.planName,
                    status: subscription.status,
                    priceMonthly: subscription.priceMonthly
                } : null,
                store: storeStats
            };
        }));

        res.json({ users: enrichedUsers });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Error al obtener usuarios', details: error.message });
    }
});

// ============================================
// DETALLE DE UN USUARIO/TENANT
// ============================================
router.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await platform.findUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const subscription = await platform.getSubscription(userId);

        let storeData = null;
        if (user.tenantId) {
            try {
                const products = await tenant.readCollection(user.tenantId, 'products');
                const orders = await tenant.readCollection(user.tenantId, 'orders');
                const categories = await tenant.readCollection(user.tenantId, 'categories');
                const analytics = await tenant.readCollection(user.tenantId, 'analytics');
                const config = await tenant.getConfig(user.tenantId);

                storeData = {
                    config,
                    analytics,
                    counts: {
                        products: products.length,
                        orders: orders.length,
                        categories: categories.length
                    },
                    recentOrders: orders.slice(-5).reverse(),
                    topProducts: analytics.products_sold?.slice(0, 5) || []
                };
            } catch {
                // Tenant puede no existir
            }
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tenantId: user.tenantId,
                role: user.role,
                emailVerified: user.emailVerified,
                createdAt: user.createdAt
            },
            subscription,
            store: storeData
        });

    } catch (error) {
        console.error('Get user detail error:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// ============================================
// MODIFICAR USUARIO
// ============================================
router.patch('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, emailVerified } = req.body;

        const updates = {};
        if (role !== undefined) updates.role = role;
        if (emailVerified !== undefined) updates.emailVerified = emailVerified;

        const user = await platform.updateUser(userId, updates);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json({ success: true, user });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// ============================================
// SUSCRIPCIONES
// ============================================
router.get('/subscriptions', async (req, res) => {
    try {
        const subscriptions = await platform.getAllSubscriptions();
        res.json({ subscriptions });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener suscripciones' });
    }
});

router.patch('/subscriptions/:subscriptionId', async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        const { status, planId, planName, currentPeriodEnd } = req.body;

        const updates = {};
        if (status) updates.status = status;
        if (planId) updates.planId = planId;
        if (planName) updates.planName = planName;
        if (currentPeriodEnd) updates.currentPeriodEnd = currentPeriodEnd;

        const subscription = await platform.updateSubscription(subscriptionId, updates);

        if (!subscription) {
            return res.status(404).json({ error: 'Suscripción no encontrada' });
        }

        res.json({ success: true, subscription });

    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar suscripción' });
    }
});

// ============================================
// ANALYTICS GLOBALES
// ============================================
router.get('/analytics', async (req, res) => {
    try {
        const stats = await aggregation.getGlobalStats();

        // Calcular tendencias
        const categoryRanking = Object.entries(stats.productsByCategory)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);

        res.json({
            totalProducts: stats.totalProducts,
            totalOrders: stats.totalOrders,
            totalRevenue: stats.totalRevenue,
            monthlyRecurringRevenue: stats.monthlyRecurringRevenue,
            topProducts: stats.topProducts,
            categoryRanking,
            averageRevenuePerTenant: stats.totalRevenue / Math.max(stats.totalTenants, 1)
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener analytics' });
    }
});

// ============================================
// INGRESOS
// ============================================
router.get('/revenue', async (req, res) => {
    try {
        const subscriptions = await platform.getAllSubscriptions();
        const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

        const revenueByPlan = {};
        for (const sub of activeSubscriptions) {
            const planName = sub.planName || 'Desconocido';
            if (!revenueByPlan[planName]) {
                revenueByPlan[planName] = { count: 0, revenue: 0 };
            }
            revenueByPlan[planName].count++;
            revenueByPlan[planName].revenue += sub.priceMonthly || 0;
        }

        const totalMRR = activeSubscriptions.reduce((acc, s) => acc + (s.priceMonthly || 0), 0);

        res.json({
            totalMRR,
            activeSubscriptions: activeSubscriptions.length,
            revenueByPlan,
            projectedAnnual: totalMRR * 12
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener ingresos' });
    }
});

// ============================================
// CREAR SUPER ADMIN (Solo para setup inicial)
// ============================================
router.post('/create-admin', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const user = await platform.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await platform.updateUser(user.id, { role: 'super_admin' });

        res.json({ success: true, message: `${email} ahora es Super Admin` });

    } catch (error) {
        res.status(500).json({ error: 'Error al crear admin' });
    }
});

// ============================================
// GENERAR TOKEN PARA ACCEDER AL PANEL DE USUARIO (Super Admin)
// ============================================
router.post('/generate-user-token/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Verificar que el usuario existe
        const user = await platform.findUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Importar y usar la función generateToken
        const authModule = await import('../middleware/auth.js');
        const token = authModule.generateToken(user);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tenantId: user.tenantId,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Generate user token error:', error);
        res.status(500).json({ error: 'Error al generar token de usuario' });
    }
});

export default router;
