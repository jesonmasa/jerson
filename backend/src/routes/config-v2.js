/**
 * Rutas de Configuración de Tienda Multi-Tenant
 */

import express from 'express';
import { tenant } from '../database/db.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get config de un tenant específico (público para storefront)
router.get('/store/:tenantId', async (req, res) => {
    try {
        const { tenantId } = req.params;
        const exists = await tenant.exists(tenantId);

        if (!exists) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }

        const config = await tenant.readCollection(tenantId, 'config');
        res.json(config);
    } catch (error) {
        console.error('Error getting store config:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get config del tenant actual
router.get('/', authenticate, async (req, res) => {
    console.log('📥 GET /api/v2/config - tenantId:', req.tenantId);
    try {
        const config = await tenant.readCollection(req.tenantId, 'config');
        console.log('✅ Config loaded:', JSON.stringify(config).substring(0, 100));
        res.json(config);
    } catch (error) {
        console.error('❌ Error getting config:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Update config
router.put('/', authenticate, async (req, res) => {
    try {
        const currentConfig = await tenant.readCollection(req.tenantId, 'config');

        const allowedFields = [
            'storeName', 'themeId', 'logoUrl', 'bannerImage',
            'contactPhone', 'contactEmail', 'address', 'whatsapp',
            'socialLinks', 'colors', 'metadata', 'seoTitle', 'seoDescription',
            'footerText', 'aboutText', 'contactText', 'policiesText',
            'shippingPoliciesText', 'returnPoliciesText', 'termsText',
            'isPublished' // Added isPublished
        ];

        const updatedConfig = { ...currentConfig };

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updatedConfig[field] = req.body[field];
            }
        }

        await tenant.writeCollection(req.tenantId, 'config', updatedConfig);
        res.json(updatedConfig);
    } catch (error) {
        console.error('Error updating config:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Update theme
router.patch('/theme', authenticate, async (req, res) => {
    try {
        const { themeId } = req.body;

        if (!themeId) {
            return res.status(400).json({ error: 'themeId requerido' });
        }

        const currentConfig = await tenant.readCollection(req.tenantId, 'config');
        // Al publicar un tema, también publicamos la tienda automáticamente
        const updatedConfig = { ...currentConfig, themeId, isPublished: true };

        await tenant.writeCollection(req.tenantId, 'config', updatedConfig);
        res.json(updatedConfig);
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

// Get tenant analytics
router.get('/analytics', authenticate, async (req, res) => {
    try {
        const analytics = await tenant.readCollection(req.tenantId, 'analytics');
        res.json(analytics || { visits: 0, sales: 0, revenue: 0 });
    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({ error: 'Error interno' });
    }
});

export default router;
