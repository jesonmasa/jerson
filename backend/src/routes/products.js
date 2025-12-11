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
// RUTAS MISTAS (Públicas para storefront / Privadas para admin)
// ============================================

// Get products (Maneja ambos casos: Storefront público y Admin privado)
router.get('/', optionalAuth, async (req, res) => {
    try {
        // Caso 1: Petición desde Storefront (público)
        // Se espera ?tenantId=xyz o que el middleware optionalAuth haya detectado algo
        if (req.query.tenantId) {
            const exists = await tenant.exists(req.query.tenantId);
            if (!exists) return res.status(404).json({ error: 'Tienda no encontrada' });

            const products = await tenant.findAll(req.query.tenantId, 'products');
            const published = products.filter(p => p.status === 'published');
            return res.json(published);
        }

        // Caso 2: Petición desde Admin (privado, requiere token)
        if (req.user && req.tenantId) {
            const products = await tenant.findAll(req.tenantId, 'products');
            return res.json(products);
        }

        // Caso 3: Sin autenticación ni tenantId explícito
        return res.status(401).json({ error: 'No autorizado o falta tenantId' });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get single product
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        let targetTenantId = req.tenantId;

        // Si es público, permitir tenantId por query
        if (!targetTenantId && req.query.tenantId) {
            targetTenantId = req.query.tenantId;
        }

        if (!targetTenantId) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        const product = await tenant.findById(targetTenantId, 'products', req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// ============================================
// RUTAS PROTEGIDAS (Solo Admin/Owner)
// ============================================

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

        const updated = await tenant.update(req.tenantId, 'products', req.params.id, {
            ...validation.data,
            image: sanitizeText(req.body.image || existing.image || ''),
            subtitle: sanitizeText((req.body.subtitle || existing.subtitle || '').substring(0, 300)),
            sizes: Array.isArray(req.body.sizes) ? req.body.sizes.map(s => sanitizeText(String(s))) : existing.sizes,
            colors: Array.isArray(req.body.colors) ? req.body.colors.map(c => sanitizeText(String(c))) : existing.colors
        });

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
