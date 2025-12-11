import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateOrder, sanitizeText, isValidId } from '../security/validation.js';

import { encrypt, decrypt } from '../security/encryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../../data/orders.json');

// Asegurar archivo
async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
        // Initialize with encrypted empty array
        const empty = await encrypt([]);
        await fs.writeFile(DATA_FILE, empty);
    }
}

const readOrders = async () => {
    try {
        await ensureDataFile();
        const content = await fs.readFile(DATA_FILE, 'utf-8');
        const data = await decrypt(content);
        return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (error) {
        console.error('Error reading orders:', error);
        return [];
    }
};

const writeOrders = async (orders) => {
    const encrypted = await encrypt(orders);
    await fs.writeFile(DATA_FILE, encrypted);
};

// Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await readOrders();
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

        const orders = await readOrders();
        const order = orders.find(o => o.id === req.params.id);
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

        const orders = await readOrders();

        // Generar ID seguro
        const lastId = orders.length > 0 ? parseInt(orders[0].id.replace('#', '')) : 1000;
        const newId = `#${lastId + 1}`;

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
            payment: 'WhatsApp',
            shipping: 'Standard',
            created_at: new Date().toISOString(),
            age: sanitizeText(String(req.body.age || '')),
            gender: sanitizeText(String(req.body.gender || ''))
        };

        orders.unshift(newOrder);
        await writeOrders(orders);

        console.log(`🛒 Nueva orden: ${newId}`);
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

        const orders = await readOrders();
        const index = orders.findIndex(o => o.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }

        orders[index].status = status;
        orders[index].updated_at = new Date().toISOString();
        await writeOrders(orders);

        res.json(orders[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
