/**
 * Shipments Route
 * Gestión de envíos con conteo regresivo
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { sanitizeText, isValidId } from '../security/validation.js';
import { encrypt, decrypt } from '../security/encryption.js';
import { sendPendingDeliveryNotification } from '../services/email.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const SHIPMENTS_FILE = path.join(__dirname, '../../data/shipments.json');
const ORDERS_FILE = path.join(__dirname, '../../data/orders.json');
const PRODUCTS_FILE = path.join(__dirname, '../../data/products.json');

/**
 * Asegurar que existe el archivo de envíos
 */
async function ensureDataFile() {
    try {
        await fs.access(SHIPMENTS_FILE);
    } catch {
        await fs.mkdir(path.dirname(SHIPMENTS_FILE), { recursive: true });
        const empty = await encrypt([]);
        await fs.writeFile(SHIPMENTS_FILE, empty);
    }
}

/**
 * Helper para leer datos encriptados
 */
async function readData(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const decrypted = await decrypt(content);
        return typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;
    } catch {
        return [];
    }
}

/**
 * Helper para guardar datos encriptados
 */
async function writeData(filePath, data) {
    const encrypted = await encrypt(data);
    await fs.writeFile(filePath, encrypted);
}

const readShipments = async () => {
    await ensureDataFile();
    return readData(SHIPMENTS_FILE);
};

const writeShipments = async (data) => writeData(SHIPMENTS_FILE, data);
const readOrders = async () => readData(ORDERS_FILE);
const writeOrders = async (data) => writeData(ORDERS_FILE, data);
const readProducts = async () => readData(PRODUCTS_FILE);
const writeProducts = async (data) => writeData(PRODUCTS_FILE, data);

/**
 * Genera un ID único para envío
 */
function generateShipmentId() {
    return `ship_${Date.now().toString(36)}`;
}

/**
 * Calcula el conteo regresivo
 */
function calculateCountdown(shipment) {
    if (!shipment.shippedAt) return null;

    const shippedDate = new Date(shipment.shippedAt);
    const today = new Date();
    const diffTime = today - shippedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const daysRemaining = shipment.estimatedDays - diffDays;

    let countdownStatus;
    let countdownText;

    if (shipment.status === 'delivered') {
        countdownStatus = 'delivered';
        countdownText = '✅ Entregado';
    } else if (shipment.status === 'not_delivered') {
        countdownStatus = 'not_delivered';
        countdownText = '❌ No entregado';
    } else if (daysRemaining > 1) {
        countdownStatus = 'on_track';
        countdownText = `${daysRemaining} días restantes`;
    } else if (daysRemaining === 1) {
        countdownStatus = 'soon';
        countdownText = '1 día restante';
    } else if (daysRemaining === 0) {
        countdownStatus = 'today';
        countdownText = '📅 Entrega hoy';
    } else {
        countdownStatus = 'overdue';
        countdownText = `⚠️ PENDIENTE (${Math.abs(daysRemaining)} días de retraso)`;
    }

    return {
        daysElapsed: diffDays,
        daysRemaining,
        status: countdownStatus,
        text: countdownText
    };
}

/**
 * GET /api/shipments
 * Lista todos los envíos con conteo regresivo
 */
router.get('/', async (req, res) => {
    try {
        const shipments = await readShipments();
        const orders = await readOrders();

        // Enriquecer con datos del pedido y conteo regresivo
        const enriched = shipments.map(shipment => {
            const order = orders.find(o => o.id === shipment.orderId);
            return {
                ...shipment,
                order: order ? {
                    id: order.id,
                    customer: order.customer,
                    address: order.address,
                    phone: order.phone,
                    total: order.total,
                    items: order.items_details
                } : null,
                countdown: calculateCountdown(shipment)
            };
        });

        // Ordenar por fecha de envío (más reciente primero)
        enriched.sort((a, b) => new Date(b.shippedAt || 0) - new Date(a.shippedAt || 0));

        res.json(enriched);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

/**
 * GET /api/shipments/:id
 * Obtener un envío específico
 */
router.get('/:id', async (req, res) => {
    try {
        const shipments = await readShipments();
        const shipment = shipments.find(s => s.id === req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }

        const orders = await readOrders();
        const order = orders.find(o => o.id === shipment.orderId);

        res.json({
            ...shipment,
            order,
            countdown: calculateCountdown(shipment)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

/**
 * POST /api/shipments
 * Crear nuevo envío (marcar pedido como enviado)
 */
router.post('/', async (req, res) => {
    try {
        const { orderId, estimatedDays = 3 } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: 'orderId es requerido' });
        }

        // Verificar que el pedido existe
        const orders = await readOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        // Verificar que no existe ya un envío para este pedido
        const shipments = await readShipments();
        if (shipments.some(s => s.orderId === orderId)) {
            return res.status(400).json({ error: 'Ya existe un envío para este pedido' });
        }

        // Crear envío
        const newShipment = {
            id: generateShipmentId(),
            orderId,
            status: 'in_transit',
            shippedAt: new Date().toISOString(),
            estimatedDays: Math.max(1, Math.min(30, parseInt(estimatedDays) || 3)),
            deliveredAt: null,
            notDeliveredReason: null,
            notificationSent: false
        };

        shipments.push(newShipment);
        await writeShipments(shipments);

        // Actualizar estado del pedido
        orders[orderIndex].status = 'shipped';
        orders[orderIndex].updated_at = new Date().toISOString();
        await writeOrders(orders);

        console.log(`📦 Envío creado: ${newShipment.id} para pedido ${orderId}`);

        res.status(201).json({
            ...newShipment,
            countdown: calculateCountdown(newShipment)
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

/**
 * PATCH /api/shipments/:id/delivered
 * Marcar como entregado
 */
router.patch('/:id/delivered', async (req, res) => {
    try {
        const shipments = await readShipments();
        const index = shipments.findIndex(s => s.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }

        const shipment = shipments[index];

        // Actualizar envío
        shipments[index] = {
            ...shipment,
            status: 'delivered',
            deliveredAt: new Date().toISOString()
        };
        await writeShipments(shipments);

        // Actualizar pedido
        const orders = await readOrders();
        const orderIndex = orders.findIndex(o => o.id === shipment.orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'delivered';
            orders[orderIndex].updated_at = new Date().toISOString();
            await writeOrders(orders);

            // Reducir stock de los productos
            const order = orders[orderIndex];
            if (order.items_details && order.items_details.length > 0) {
                const products = await readProducts();
                let stockUpdated = false;

                for (const item of order.items_details) {
                    const productIndex = products.findIndex(p =>
                        p.id === item.productId || p.name === item.name
                    );

                    if (productIndex !== -1) {
                        const newStock = Math.max(0, (products[productIndex].stock || 0) - (item.quantity || 1));
                        products[productIndex].stock = newStock;
                        products[productIndex].updatedAt = new Date().toISOString();
                        stockUpdated = true;
                        console.log(`📉 Stock actualizado: ${products[productIndex].name} = ${newStock}`);
                    }
                }

                if (stockUpdated) {
                    await writeProducts(products);
                }
            }
        }

        console.log(`✅ Envío marcado como entregado: ${req.params.id}`);

        res.json({
            ...shipments[index],
            countdown: calculateCountdown(shipments[index])
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

/**
 * PATCH /api/shipments/:id/not-delivered
 * Marcar como no entregado
 */
router.patch('/:id/not-delivered', async (req, res) => {
    try {
        const { reason } = req.body;

        const shipments = await readShipments();
        const index = shipments.findIndex(s => s.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }

        const shipment = shipments[index];

        // Actualizar envío (stock NO se reduce)
        shipments[index] = {
            ...shipment,
            status: 'not_delivered',
            notDeliveredReason: sanitizeText(reason || 'Sin especificar'),
            notDeliveredAt: new Date().toISOString()
        };
        await writeShipments(shipments);

        // Actualizar pedido para revisión
        const orders = await readOrders();
        const orderIndex = orders.findIndex(o => o.id === shipment.orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'not_delivered';
            orders[orderIndex].updated_at = new Date().toISOString();
            await writeOrders(orders);
        }

        console.log(`❌ Envío marcado como no entregado: ${req.params.id}`);

        res.json({
            ...shipments[index],
            countdown: calculateCountdown(shipments[index])
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

/**
 * POST /api/shipments/check-pending
 * Verificar envíos pendientes y enviar notificaciones
 */
router.post('/check-pending', async (req, res) => {
    try {
        const shipments = await readShipments();
        const orders = await readOrders();
        const notificationsSent = [];

        for (let i = 0; i < shipments.length; i++) {
            const shipment = shipments[i];

            // Solo envíos en tránsito sin notificación previa
            if (shipment.status !== 'in_transit' || shipment.notificationSent) {
                continue;
            }

            const countdown = calculateCountdown(shipment);

            // Si está vencido, enviar notificación
            if (countdown && countdown.status === 'overdue') {
                const order = orders.find(o => o.id === shipment.orderId);

                if (order) {
                    try {
                        await sendPendingDeliveryNotification(shipment, order);
                        shipments[i].notificationSent = true;
                        shipments[i].notificationSentAt = new Date().toISOString();
                        notificationsSent.push({
                            shipmentId: shipment.id,
                            orderId: order.id
                        });
                        console.log(`📧 Notificación enviada para envío: ${shipment.id}`);
                    } catch (emailError) {
                        console.error('Error enviando notificación:', emailError);
                    }
                }
            }
        }

        if (notificationsSent.length > 0) {
            await writeShipments(shipments);
        }

        res.json({
            checked: shipments.length,
            notificationsSent: notificationsSent.length,
            details: notificationsSent
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

/**
 * GET /api/shipments/stats
 * Estadísticas de envíos
 */
router.get('/stats/summary', async (req, res) => {
    try {
        const shipments = await readShipments();

        const stats = {
            total: shipments.length,
            pending: shipments.filter(s => s.status === 'pending').length,
            inTransit: shipments.filter(s => s.status === 'in_transit').length,
            delivered: shipments.filter(s => s.status === 'delivered').length,
            notDelivered: shipments.filter(s => s.status === 'not_delivered').length,
            overdue: 0
        };

        // Contar envíos vencidos
        shipments.forEach(s => {
            if (s.status === 'in_transit') {
                const countdown = calculateCountdown(s);
                if (countdown && countdown.status === 'overdue') {
                    stats.overdue++;
                }
            }
        });

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
