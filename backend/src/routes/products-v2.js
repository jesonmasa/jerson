/**
 * Rutas de Productos Multi-Tenant
 * Cada usuario solo ve y gestiona sus propios productos
 */

import express from 'express';
import { tenant } from '../database/db.js';
import { authenticate, optionalAuth, requireSubscription } from '../middleware/auth.js';
import { validateProduct, sanitizeText, isValidId } from '../security/validation.js';

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (para storefront)
// ============================================

// Get products de un tenant específico (para storefront público)
router.get('/store/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const exists = await tenant.exists(tenantId);

        if (!exists) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }

        const products = await tenant.findAll(tenantId, 'products');
        // Solo devolver productos publicados
        const published = products.filter(p => p.status === 'published');

        res.json(published);
    } catch (error) {
        console.error('Error getting store products:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// Get all products del tenant actual
router.get('/', authenticate, async (req, res) => {
    try {
        const products = await tenant.findAll(req.tenantId, 'products');
        res.json(products);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get single product
router.get('/:id', authenticate, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const product = await tenant.findById(req.tenantId, 'products', req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Create product (requiere suscripción)
router.post('/', authenticate, requireSubscription, async (req, res) => {
    try {
        const validation = validateProduct(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors.join(', ') });
        }

        // Verificar límite de productos según plan
        const products = await tenant.findAll(req.tenantId, 'products');
        const planLimits = {
            basic: 50,
            pro: 500,
            enterprise: -1 // ilimitado
        };
        const limit = planLimits[req.subscription?.planId] || 50;

        if (limit !== -1 && products.length >= limit) {
            return res.status(403).json({
                error: `Has alcanzado el límite de ${limit} productos de tu plan`,
                code: 'PRODUCT_LIMIT_REACHED'
            });
        }

        const newProduct = await tenant.insert(req.tenantId, 'products', {
            name: validation.data.name,
            price: validation.data.price || null,
            description: validation.data.description || '',
            image: sanitizeText(req.body.image || ''),
            category: validation.data.category,
            stock: validation.data.stock || 0,
            subtitle: sanitizeText((req.body.subtitle || '').substring(0, 300)),
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes.map(s => sanitizeText(String(s))) : [],
            colors: Array.isArray(req.body.colors) ? req.body.colors.map(c => sanitizeText(String(c))) : [],
            colorImages: req.body.colorImages || {},
            variantDiscounts: req.body.variantDiscounts || {},
            status: req.body.status || 'published'
        });

        console.log(`📦 [${req.tenantId}] Producto creado: ${newProduct.name}`);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Update product
router.put('/:id', authenticate, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const validation = validateProduct(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ error: validation.errors.join(', ') });
        }

        const existing = await tenant.findById(req.tenantId, 'products', req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const updateData = {
            ...validation.data,
            image: sanitizeText(req.body.image || existing.image || ''),
            subtitle: sanitizeText((req.body.subtitle || existing.subtitle || '').substring(0, 300)),
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes.map(s => sanitizeText(String(s))) : existing.sizes,
            colors: Array.isArray(req.body.colors) ? req.body.colors.map(c => sanitizeText(String(c))) : existing.colors,
            colorImages: req.body.colorImages || existing.colorImages || {}, // Persistir mapa de imágenes
            variantDiscounts: req.body.variantDiscounts || existing.variantDiscounts || {} // Persistir descuentos
        };

        console.log(`[DEBUG] Updating product ${req.params.id}. Status in body: ${req.body.status}. Cleaned status: ${validation.data.status}. Final update data status: ${updateData.status}`);

        const updated = await tenant.update(req.tenantId, 'products', req.params.id, updateData);

        res.json(updated);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Delete product
router.delete('/:id', authenticate, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const product = await tenant.findById(req.tenantId, 'products', req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await tenant.delete(req.tenantId, 'products', req.params.id);

        console.log(`🗑️ [${req.tenantId}] Producto eliminado: ${product.name}`);
        res.json({ message: 'Eliminado', product });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Publish product
router.patch('/:id/publish', authenticate, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const product = await tenant.findById(req.tenantId, 'products', req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const updated = await tenant.update(req.tenantId, 'products', req.params.id, {
            status: 'published'
        });

        console.log(`✅ [${req.tenantId}] Producto publicado: ${updated.name}`);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Draft product
router.patch('/:id/draft', authenticate, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        const product = await tenant.findById(req.tenantId, 'products', req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const updated = await tenant.update(req.tenantId, 'products', req.params.id, {
            status: 'draft'
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Bulk publish
router.post('/bulk-publish', authenticate, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Se requiere un array de IDs' });
        }

        let updated = 0;
        for (const id of ids) {
            const result = await tenant.update(req.tenantId, 'products', id, { status: 'published' });
            if (result) updated++;
        }

        res.json({ message: `${updated} productos publicados`, updated });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Bulk delete
router.post('/bulk-delete', authenticate, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Se requiere un array de IDs' });
        }

        let deleted = 0;
        for (const id of ids) {
            const result = await tenant.delete(req.tenantId, 'products', id);
            if (result) deleted++;
        }

        res.json({ message: `${deleted} productos eliminados`, deleted });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
