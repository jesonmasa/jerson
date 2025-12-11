import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../../data/pages.json');
const MAX_CONTENT_SIZE = 2 * 1024 * 1024; // 2MB

// ============================================
// SANITIZACIÓN XSS NATIVA (Sin librerías)
// ============================================
const sanitizeHtml = (html) => {
    if (!html || typeof html !== 'string') return '';

    // Eliminar scripts
    let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Eliminar eventos de JavaScript inline
    clean = clean.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    clean = clean.replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '');

    // Eliminar javascript: en href y src
    clean = clean.replace(/javascript\s*:/gi, '');

    // Eliminar iframes maliciosos (solo permitir dominios conocidos)
    clean = clean.replace(/<iframe(?![^>]*(?:youtube|vimeo|google))[^>]*>/gi, '');

    // Eliminar data: URLs que pueden contener código
    clean = clean.replace(/data\s*:\s*text\/html/gi, '');

    // Eliminar expresiones CSS maliciosas
    clean = clean.replace(/expression\s*\(/gi, '');
    clean = clean.replace(/url\s*\(\s*["']?\s*javascript/gi, '');

    return clean;
};

// Validar ID de página
const isValidPageId = (id) => /^[a-zA-Z0-9_-]+$/.test(id);

// Asegurar archivo de datos
async function ensureDataFile() {
    try {
        await fs.access(DATA_FILE);
        const content = await fs.readFile(DATA_FILE, 'utf8');
        try {
            JSON.parse(content);
        } catch {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            await fs.rename(DATA_FILE, `${DATA_FILE}.backup.${timestamp}`);
            await fs.writeFile(DATA_FILE, JSON.stringify({ main: { html: '', css: '' } }));
        }
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
            await fs.writeFile(DATA_FILE, JSON.stringify({ main: { html: '', css: '' } }));
        }
    }
}

// GET /api/pages/:id
router.get('/:id', async (req, res) => {
    try {
        const pageId = req.params.id;
        if (!isValidPageId(pageId)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        await ensureDataFile();
        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        const page = data[pageId];

        if (!page) {
            return res.status(404).json({ message: 'Página no encontrada' });
        }

        res.json(page);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

// POST /api/pages/:id
router.post('/:id', async (req, res) => {
    try {
        const pageId = req.params.id;
        if (!isValidPageId(pageId)) {
            return res.status(400).json({ message: 'ID inválido' });
        }

        const { html, css } = req.body;

        // Validar tamaño
        const size = (html?.length || 0) + (css?.length || 0);
        if (size > MAX_CONTENT_SIZE) {
            return res.status(413).json({ message: 'Contenido muy grande (max 2MB)' });
        }

        await ensureDataFile();

        // Sanitizar contenido
        const sanitizedHtml = sanitizeHtml(html);
        const sanitizedCss = css?.replace(/<script|javascript:/gi, '') || '';

        const data = JSON.parse(await fs.readFile(DATA_FILE, 'utf8'));
        data[pageId] = {
            html: sanitizedHtml,
            css: sanitizedCss,
            updatedAt: new Date().toISOString()
        };

        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        console.log(`📄 Página '${pageId}' guardada`);
        res.json({ message: 'Guardado exitosamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error interno' });
    }
});

export default router;
