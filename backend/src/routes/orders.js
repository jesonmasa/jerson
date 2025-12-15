import express from 'express';
import { tenant } from '../database/db.js';
import { validateOrder, sanitizeText, isValidId } from '../security/validation.js';

const router = express.Router();
const DEFAULT_TENANT = 'default';

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await tenant.findAll(DEFAULT_TENANT, 'orders');
        // Sort by created_at desc
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        res.json(orders);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id.replace('#', ''))) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const order = await tenant.findById(DEFAULT_TENANT, 'orders', req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Create order
router.post('/', async (req, res) => {
    try {
        // Validar datos
        const validation = validateOrder(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors.join(', ') });
        }

        const newId = `#ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Calcular total validado
        const total = validation.data.items.reduce(
            (sum, item) => sum + (item.price * item.quantity), 0
        );

        const newOrder = {
            id: newId,
            customer: validation.data.customer_name,
            email: validation.data.customer_email || '',
            phone: validation.data.customer_phone || '',
            address: validation.data.shipping_address?.address || '',
            items_count: validation.data.items.length,
            items_details: validation.data.items,
            total: Math.round(total * 100) / 100,
            status: 'pending',
            payment: 'WhatsApp', // Default manual payment
            shipping: 'Standard',
            created_at: new Date().toISOString(),
            age: sanitizeText(String(req.body.age || '')),
            gender: sanitizeText(String(req.body.gender || ''))
        };

        await tenant.insert(DEFAULT_TENANT, 'orders', newOrder);

        console.log(`🛒 Nueva orden (DB): ${newId}`);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
    try {
        if (!isValidId(req.params.id.replace('#', ''))) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const status = sanitizeText(req.body.status);

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Estado inválido' });
        }

        const order = await tenant.findById(DEFAULT_TENANT, 'orders', req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        const updated = await tenant.update(DEFAULT_TENANT, 'orders', req.params.id, {
            status,
            updated_at: new Date().toISOString()
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
