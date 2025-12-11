/**
 * Rutas del Marketplace Global
 * Agrega productos de todas las tiendas
 */

import express from 'express';
import { aggregation } from '../database/db.js';

const router = express.Router();

// Get all marketplace products (Public)
router.get('/products', async (req, res) => {
    try {
        const products = await aggregation.getAllMarketplaceProducts();

        // Soporte básico de filtros (opcional para v1)
        const { category, search } = req.query;
        let filtered = products;

        if (category) {
            filtered = filtered.filter(p => p.category === category);
        }

        if (search) {
            const term = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term) ||
                p.storeName.toLowerCase().includes(term)
            );
        }

        res.json(filtered);
    } catch (error) {
        console.error('Error fetching marketplace products:', error);
        res.status(500).json({ error: 'Error interno del marketplace' });
    }
});

// Flash Deals (Highest Offer Per Store)
router.get('/deals', async (req, res) => {
    try {
        const deals = await aggregation.getFlashDeals();
        res.json(deals);
    } catch (error) {
        console.error('Error fetching flash deals:', error);
        res.status(500).json({ error: 'Error obteniendo ofertas relámpago' });
    }
});

// Get all stores directly (for Store Viewer)
router.get('/stores', async (req, res) => {
    try {
        const stores = await aggregation.getAllStores();
        res.json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ error: 'Error interno obteniendo tiendas' });
    }
});

export default router;
