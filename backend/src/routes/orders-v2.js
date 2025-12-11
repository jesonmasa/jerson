/**
 * Rutas de Órdenes Multi-Tenant
 */

import express from 'express';
import { tenant } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all orders del tenant actual
router.get('/', authenticate, async (req, res) => {
    try {
        const orders = await tenant.findAll(req.tenantId, 'orders');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get single order
router.get('/:id', authenticate, async (req, res) => {
    try {
        const order = await tenant.findById(req.tenantId, 'orders', req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Create order (desde storefront - público pero asociado a tenant)
router.post('/store/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const { customer, items, total, shippingAddress, paymentMethod } = req.body;

        if (!customer || !items || items.length === 0) {
            return res.status(400).json({ error: 'Datos de orden incompletos' });
        }

        const exists = await tenant.exists(tenantId);
        if (!exists) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }

        const order = await tenant.insert(tenantId, 'orders', {
            orderNumber: `ORD-${Date.now()}`,
            customer,
            items,
            total: total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shippingAddress,
            paymentMethod: paymentMethod || 'pending',
            status: 'pending', // pending, confirmed, shipped, delivered, cancelled
            paymentStatus: 'pending'
        });

        // Registrar venta en analytics
        await tenant.recordSale(tenantId, {
            total: order.total,
            items: order.items
        });

        console.log(`🛒 [${tenantId}] Nueva orden: ${order.orderNumber}`);
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Update order status
router.patch('/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }

        const order = await tenant.findById(req.tenantId, 'orders', req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const updated = await tenant.update(req.tenantId, 'orders', req.params.id, {
            status,
            [`${status}At`]: new Date().toISOString()
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Update payment status
router.patch('/:id/payment', authenticate, async (req, res) => {
    try {
        const { paymentStatus, paymentMethod, paymentDetails } = req.body;

        const order = await tenant.findById(req.tenantId, 'orders', req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const updated = await tenant.update(req.tenantId, 'orders', req.params.id, {
            paymentStatus,
            paymentMethod,
            paymentDetails,
            paidAt: paymentStatus === 'paid' ? new Date().toISOString() : null
        });

        // Si el estado de pago cambia a 'paid', registrar la venta en analytics
        if (paymentStatus === 'paid' && updated.paymentStatus === 'paid' && order.paymentStatus !== 'paid') {
            await tenant.recordSale(req.tenantId, {
                total: updated.total,
                items: updated.items
            });
            console.log(`💰 [${req.tenantId}] Venta registrada para orden ${updated.orderNumber}`);
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Delete order
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const order = await tenant.findById(req.tenantId, 'orders', req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        await tenant.delete(req.tenantId, 'orders', req.params.id);
        res.json({ message: 'Orden eliminada', order });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get order stats
router.get('/stats/summary', authenticate, async (req, res) => {
    try {
        const orders = await tenant.findAll(req.tenantId, 'orders');
        const analytics = await tenant.getAnalytics(req.tenantId);

        const stats = {
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            completedOrders: orders.filter(o => o.status === 'delivered').length,
            totalRevenue: analytics.total_sales || 0,
            averageOrderValue: orders.length > 0
                ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length
                : 0
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
