/**
 * Rutas de Categorías Multi-Tenant
 */

import express from 'express';
import { tenant } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';
import { sanitizeText } from '../security/validation.js';

const router = express.Router();

// Get all categories (público para storefront)
router.get('/store/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const exists = await tenant.exists(tenantId);

        if (!exists) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }

        const categories = await tenant.findAll(tenantId, 'categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get all categories del tenant actual
router.get('/', authenticate, async (req, res) => {
    try {
        const categories = await tenant.findAll(req.tenantId, 'categories');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Create category
router.post('/', authenticate, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Nombre requerido' });
        }

        const category = await tenant.insert(req.tenantId, 'categories', {
            name: sanitizeText(name),
            description: sanitizeText(description || ''),
            image: sanitizeText(image || ''),
            slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Update category
router.put('/:id', authenticate, async (req, res) => {
    try {
        const { name, description, image } = req.body;

        const existing = await tenant.findById(req.tenantId, 'categories', req.params.id);
        if (!existing) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        const updated = await tenant.update(req.tenantId, 'categories', req.params.id, {
            name: sanitizeText(name || existing.name),
            description: sanitizeText(description ?? existing.description),
            image: sanitizeText(image || existing.image)
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

// Delete category
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const category = await tenant.findById(req.tenantId, 'categories', req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }

        await tenant.delete(req.tenantId, 'categories', req.params.id);
        res.json({ message: 'Categoría eliminada', category });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
