import express from 'express';
import { tenant, platform } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// ============================================
// DATOS DEL DASHBOARD (Multi-Tenant)
// ============================================
router.get('/', authenticate, async (req, res) => {
    try {
        // Obtenemos analytics usando el método optimizado del servicio
        // Esto lee del archivo analytics.json del tenant específico
        const analytics = await tenant.getAnalytics(req.tenantId);

        // También obtenemos conteos en tiempo real para mayor precisión
        const products = await tenant.findAll(req.tenantId, 'products');
        const orders = await tenant.findAll(req.tenantId, 'orders');

        // Calcular ventas totales reales (status != cancelled)
        const realTotalSales = orders
            .filter(o => o.status !== 'cancelled' && o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

        // Órdenes activas (pendientes o procesando)
        const activeOrders = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;

        // Actividad reciente (últimas 5 órdenes)
        const recentActivity = orders
            .sort((a, b) => new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at))
            .slice(0, 5)
            .map(o => ({
                id: o.id,
                type: 'order',
                title: `Nueva orden #${o.orderNumber || o.id.substring(0, 6)}`,
                time: new Date(o.createdAt || o.created_at).toLocaleDateString(),
                amount: `+$${o.total}`,
                color: 'green',
                icon: '🛍️'
            }));

        // Distribución por estado
        const ordersByStatus = {
            completed: orders.filter(o => o.status === 'delivered').length,
            processing: orders.filter(o => o.status === 'processing').length,
            pending: orders.filter(o => o.status === 'pending').length,
            cancelled: orders.filter(o => o.status === 'cancelled').length,
        };

        res.json({
            totalSales: realTotalSales, // Usamos el cálculo real
            activeOrders,
            totalProducts: products.length,
            conversionRate: orders.length > 0 ? ((ordersByStatus.completed / orders.length) * 100).toFixed(2) + '%' : '0%',
            recentActivity,
            ordersByStatus
        });

    } catch (error) {
        console.error('Error getting tenant stats:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// ============================================
// DATOS DEL SUPER ADMIN (Globales)
// ============================================
router.get('/super-admin', authenticate, async (req, res) => {
    try {
        if (req.user.role !== 'super_admin') {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        // Obtener estadísticas globales de la plataforma
        const globalStats = await platform.getGlobalStats();

        res.json(globalStats);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
