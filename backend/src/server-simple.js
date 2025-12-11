import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Products API
app.get('/api/products', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/products.json'), 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading products:', error);
        res.status(500).json({ error: error.message });
    }
});

// Pages API
app.get('/api/pages/:id', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data/pages.json'), 'utf-8');
        const pages = JSON.parse(data);
        res.json(pages[req.params.id] || { html: '', css: '' });
    } catch (error) {
        console.error('Error reading page:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pages/:id', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'data/pages.json');
        let pages = {};

        try {
            const data = await fs.readFile(filePath, 'utf-8');
            pages = JSON.parse(data);
        } catch (err) {
            // File doesn't exist, start with empty object
        }

        pages[req.params.id] = req.body;
        await fs.writeFile(filePath, JSON.stringify(pages, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving page:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Constructor API is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Constructor backend running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
