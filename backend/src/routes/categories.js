import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { encrypt, decrypt } from '../security/encryption.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const DATA_FILE = path.join(__dirname, '../../data/categories.json');

// Helper para leer categorías (soporta JSON plano y encriptado)
async function readCategories() {
    try {
        const content = await fs.readFile(DATA_FILE, 'utf-8');

        // Si el contenido es JSON plano, parsearlo directamente
        if (content.trim().startsWith('[') || content.trim().startsWith('{')) {
            try {
                return JSON.parse(content);
            } catch {
                // Si falla el parse, intentar desencriptar
            }
        }

        // Intentar desencriptar
        const decrypted = await decrypt(content);
        return typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading categories:', error);
        return [];
    }
}

// Helper para guardar categorías (JSON plano para compatibilidad con VS Code)
async function writeCategories(categories) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2));
    } catch (error) {
        // Ensure directory exists if write fails
        if (error.code === 'ENOENT') {
            await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
            await fs.writeFile(DATA_FILE, JSON.stringify(categories, null, 2));
        } else {
            throw error;
        }
    }
}

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await readCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error reading categories:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create category
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const categories = await readCategories();

        const newId = categories.length > 0
            ? Math.max(...categories.map(c => parseInt(c.id) || 0)) + 1
            : 1;

        const newCategory = {
            id: newId.toString(),
            name
        };

        categories.push(newCategory);
        await writeCategories(categories);

        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    try {
        const categories = await readCategories();
        const initialLength = categories.length;
        const newCategories = categories.filter(c => c.id !== req.params.id);

        if (newCategories.length === initialLength) {
            return res.status(404).json({ error: 'Category not found' });
        }

        await writeCategories(newCategories);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * Crea una categoría si no existe (para uso interno)
 * @param {string} name - Nombre de la categoría
 * @returns {Promise<Object>} - La categoría (existente o nueva)
 */
export async function ensureCategoryExists(name) {
    if (!name || name === 'Sin Categoría') return null;

    const categories = await readCategories();

    // Buscar si ya existe (case insensitive)
    const existing = categories.find(c =>
        c.name.toLowerCase() === name.toLowerCase()
    );

    if (existing) {
        return existing;
    }

    // Crear nueva categoría
    const newId = categories.length > 0
        ? Math.max(...categories.map(c => parseInt(c.id) || 0)) + 1
        : 1;

    const newCategory = {
        id: newId.toString(),
        name: name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() // Capitalizar
    };

    categories.push(newCategory);
    await writeCategories(categories);

    console.log(`📁 Categoría creada automáticamente: ${newCategory.name}`);
    return newCategory;
}

// Exportar funciones helper para uso externo
export { readCategories, writeCategories };

export default router;

