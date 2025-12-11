/**
 * Gallery Routes - API para gestión de galería de imágenes
 * MULTI-TENANT: Cada usuario tiene su propia galería
 */

import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import path from 'path';
import { uploadImage, deleteImage } from '../services/cloudinary.js';
import { analyzeImage } from '../services/groq.js';
import { tenant } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Configuración de Multer para subida de archivos
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB max
});

// Extensiones de imagen permitidas
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * GET /api/gallery - Obtener galería del tenant actual
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const images = await tenant.readCollection(req.tenantId, 'gallery');
        // Ordenar por fecha de subida (más recientes primero)
        images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        res.json(images);
    } catch (error) {
        console.error('Error loading gallery:', error);
        res.status(500).json({ error: 'Error loading gallery' });
    }
});

/**
 * POST /api/gallery/upload - Subir ZIP de imágenes
 */
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No se ha subido ningún archivo',
                code: 'NO_FILE_UPLOADED'
            });
        }

        const zipBuffer = req.file.buffer;
        const zip = new AdmZip(zipBuffer);
        const entries = zip.getEntries();

        // 1. Parsear Opciones de Magic Tool
        const { magicMode, resize, upscale, removeBg } = req.body;
        const isMagic = magicMode === 'true';

        // 2. Validar Limites
        const MAX_FILES = isMagic ? 10 : 50; // Limitar a 50 imágenes máximo para evitar problemas de rendimiento
        const imageEntries = entries.filter(e =>
            !e.isDirectory &&
            ALLOWED_EXTENSIONS.includes(path.extname(e.entryName).toLowerCase()) &&
            !e.entryName.includes('__MACOSX') &&
            !path.basename(e.entryName).startsWith('.')
        );

        console.log(`📦 [${req.tenantId}] ZIP: ${imageEntries.length} imágenes encontradas. Modo Mágico: ${isMagic ? 'ACTIVADO' : 'DESACTIVADO'}`);

        if (imageEntries.length > MAX_FILES) {
            return res.status(400).json({
                error: `Has superado el límite de ${MAX_FILES} imágenes para el modo ${isMagic ? 'Edición Mágica' : 'Estándar'}.`,
                maxLimit: MAX_FILES,
                currentCount: imageEntries.length
            });
        }

        // 3. Construir Transformaciones Cloudinary
        const uploadOptions = {
            public_id: null, // Se establecerá después
            folder: `tenant_${req.tenantId}/gallery`
        };

        if (isMagic) {
            // Upscale con IA
            if (upscale === 'true') {
                uploadOptions.effect = 'upscale';
            }

            // Background Removal
            if (removeBg === 'true') {
                uploadOptions.background_removal = 'cloudinary_ai';
            }

            // Resize (aplicar crop y dimensiones)
            if (resize === '800x800') {
                uploadOptions.width = 800;
                uploadOptions.height = 800;
                uploadOptions.crop = 'fill';
            } else if (resize === '1080x1080') {
                uploadOptions.width = 1080;
                uploadOptions.height = 1080;
                uploadOptions.crop = 'fill';
            }

            // Siempre optimizar calidad y formato
            uploadOptions.quality = 'auto';
            uploadOptions.format = 'webp';

            console.log(`✨ Opciones de transformación:`, uploadOptions);
        } else {
            // Para modo estándar, también aplicar formato WebP
            uploadOptions.quality = 'auto';
            uploadOptions.format = 'webp';
        }

        const gallery = await tenant.readCollection(req.tenantId, 'gallery');
        const uploadedImages = [];
        let skipped = 0;

        // Usar imageEntries filtrados
        for (const entry of imageEntries) {
            const fileName = path.basename(entry.entryName);
            const ext = path.extname(fileName).toLowerCase();

            try {
                const data = entry.getData();
                if (data.length === 0) continue;

                // Convertir a base64
                const base64 = `data:image/${ext.replace('.', '')};base64,${data.toString('base64')}`;

                // Generar ID único
                const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                let cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
                let aiData = {};
                let aiAnalysis = null;

                // 🧠 Análisis IA ANTES de subir (para renombrar archivo)
                if (isMagic && req.body.aiAnalyze === 'true') {
                    console.log(`🧠 [${req.tenantId}] Pre-analizando imagen con Groq para nombrado inteligente...`);
                    try {
                        // Analizar desde base64 temporal
                        aiAnalysis = await analyzeImage(base64);
                        if (aiAnalysis && aiAnalysis.seoFileName) {
                            // Usar el nombre sugerido por la IA
                            cleanName = aiAnalysis.seoFileName;
                            console.log(`✨ Renombrando archivo: ${fileName} → ${cleanName}`);
                        }
                    } catch (err) {
                        console.warn(`⚠️ Error en pre-análisis IA (usando nombre original): ${err.message}`);
                    }
                }

                const publicId = `tenant_${req.tenantId}/gallery/${cleanName}_${Date.now()}`;

                console.log(`☁️ Subiendo${isMagic ? ' con MAGIA ✨' : ''}: ${fileName} como ${cleanName}...`);

                // Establecer public_id en las opciones
                uploadOptions.public_id = publicId;

                // Subir a Cloudinary con transformaciones aplicadas
                const result = await uploadImage(base64, uploadOptions);

                if (result && result.url) {
                    // Guardar datos de IA si existen
                    if (aiAnalysis) {
                        aiData = {
                            aiTags: aiAnalysis.category,
                            aiName: aiAnalysis.productName,
                            aiDescription: aiAnalysis.description,
                            aiAlt: aiAnalysis.altText,
                            aiAttributes: aiAnalysis.attributes,
                            aiSeoFilename: aiAnalysis.seoFileName
                        };
                    }

                    const imageData = {
                        id: imageId,
                        url: result.url,
                        fileName: fileName,
                        publicId: result.public_id,
                        size: data.length,
                        width: result.width,
                        height: result.height,
                        uploadedAt: new Date().toISOString(),
                        source: 'gallery', // Origen: galería ZIP
                        folder: `tenant_${req.tenantId}/gallery`,
                        ...aiData // Mezclar datos de IA
                    };

                    gallery.push(imageData);
                    uploadedImages.push(imageData);
                    console.log(`✅ Subido: ${result.url}`);
                }

            } catch (err) {
                console.error(`❌ Error subiendo ${fileName}:`, err.message);
            }
        }

        // Guardar galería del tenant
        await tenant.writeCollection(req.tenantId, 'gallery', gallery);

        console.log(`📸 [${req.tenantId}] Galería: ${uploadedImages.length} imágenes subidas, ${skipped} ignoradas`);

        res.json({
            success: true,
            uploaded: uploadedImages.length,
            skipped: skipped,
            images: uploadedImages
        });

    } catch (error) {
        console.error('Error uploading to gallery:', error);
        res.status(500).json({
            error: 'Error al procesar el archivo ZIP',
            details: error.message,
            code: 'ZIP_PROCESSING_ERROR'
        });
    }
});

/**
 * DELETE /api/gallery/:id - Eliminar imagen de la galería
 */
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const gallery = await tenant.readCollection(req.tenantId, 'gallery');
        const imageIndex = gallery.findIndex(img => img.id === req.params.id);

        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const image = gallery[imageIndex];

        // Intentar eliminar de Cloudinary
        if (image.publicId) {
            try {
                await deleteImage(image.publicId);
                console.log(`🗑️ Eliminado de Cloudinary: ${image.publicId}`);
            } catch (err) {
                console.error('Error deleting from Cloudinary:', err.message);
            }
        }

        // Eliminar de la galería del tenant
        gallery.splice(imageIndex, 1);
        await tenant.writeCollection(req.tenantId, 'gallery', gallery);

        res.json({ success: true, message: 'Image deleted' });

    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            error: 'Error al eliminar la imagen',
            details: error.message,
            code: 'IMAGE_DELETE_ERROR'
        });
    }
});

/**
 * DELETE /api/gallery - Eliminar todas las imágenes del tenant
 */
router.delete('/', authenticate, async (req, res) => {
    try {
        const gallery = await tenant.readCollection(req.tenantId, 'gallery');

        // Eliminar de Cloudinary
        for (const image of gallery) {
            if (image.publicId) {
                try {
                    await deleteImage(image.publicId);
                } catch (err) {
                    console.error('Error deleting from Cloudinary:', err.message);
                }
            }
        }

        // Limpiar galería del tenant
        await tenant.writeCollection(req.tenantId, 'gallery', []);

        res.json({ success: true, message: 'Gallery cleared' });

    } catch (error) {
        console.error('Error clearing gallery:', error);
        res.status(500).json({
            error: 'Error al limpiar la galería',
            details: error.message,
            code: 'GALLERY_CLEAR_ERROR'
        });
    }
});

export default router;
