/**
 * Rutas de Upload de Imágenes - Integración con Cloudinary
 * Usa módulo nativo sin dependencias npm externas
 */

import express from 'express';
import { uploadImage, deleteImage, getTransformedUrl, getConfig } from '../services/cloudinary.js';
import { analyzeImage } from '../services/groq.js';
import { tenant } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/upload
 * Sube una imagen a Cloudinary Y LA GUARDA EN LA GALERÍA
 * Body: { image: "base64string", folder?: "folder_name", public_id?: "image_name", width?, height?, crop?, source?: "builder|product|manual" }
 */
router.post('/', authenticate, async (req, res) => {
    try {
        const { image, folder, public_id, width, height, crop, quality, format, source } = req.body;

        if (!image) {
            return res.status(400).json({
                error: 'Se requiere una imagen en formato base64',
                code: 'MISSING_IMAGE_DATA'
            });
        }

        // Opciones de subida
        const uploadOptions = {
            folder: folder || `tenant_${req.tenantId}/uploads`,
            public_id,
            format: format || 'webp', // Asegurar formato WebP
            quality: quality || 'auto'
        };

        // Agregar transformaciones si existen
        if (width) uploadOptions.width = width;
        if (height) uploadOptions.height = height;
        if (crop) uploadOptions.crop = crop;

        console.log(`💾 [${req.tenantId}] Subiendo imagen desde: ${source || 'unknown'}...`);

        // Subir a Cloudinary
        const result = await uploadImage(image, uploadOptions);

        // 🎯 GUARDAR EN LA GALERÍA (sin importar de dónde venga)
        try {
            const gallery = await tenant.readCollection(req.tenantId, 'gallery');

            const imageData = {
                id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                url: result.url,
                fileName: public_id || `upload_${Date.now()}`,
                publicId: result.public_id,
                size: Buffer.byteLength(image.split(',')[1] || image, 'base64'), // Tamaño aproximado
                width: result.width,
                height: result.height,
                uploadedAt: new Date().toISOString(),
                source: source || 'manual', // builder, product, manual, gallery
                folder: folder || 'general'
            };

            gallery.push(imageData);
            await tenant.writeCollection(req.tenantId, 'gallery', gallery);

            console.log(`✅ Imagen guardada en galería: ${imageData.fileName}`);
        } catch (galleryError) {
            console.warn(`⚠️ No se pudo guardar en galería (imagen aún disponible en Cloudinary):`, galleryError.message);
        }

        res.json({
            success: true,
            message: 'Imagen subida correctamente',
            data: result
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            error: 'Error al subir la imagen',
            details: error.message,
            code: 'UPLOAD_ERROR'
        });
    }
});

/**
 * DELETE /api/upload/:publicId
 * Elimina una imagen de Cloudinary
 */
router.delete('/:publicId(*)', async (req, res) => {
    try {
        const { publicId } = req.params;

        if (!publicId) {
            return res.status(400).json({
                error: 'Se requiere el public_id de la imagen'
            });
        }

        const result = await deleteImage(publicId);

        res.json({
            success: result.success,
            message: result.success ? 'Imagen eliminada' : 'No se pudo eliminar la imagen'
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            error: 'Error al eliminar la imagen',
            details: error.message
        });
    }
});

/**
 * GET /api/upload/transform
 * Genera URL con transformaciones
 * Query: ?public_id=xxx&width=300&height=300&crop=fill
 */
router.get('/transform', (req, res) => {
    try {
        const { public_id, width, height, crop, quality, format } = req.query;

        if (!public_id) {
            return res.status(400).json({
                error: 'Se requiere el public_id de la imagen'
            });
        }

        const url = getTransformedUrl(public_id, {
            width: width ? parseInt(width) : undefined,
            height: height ? parseInt(height) : undefined,
            crop,
            quality,
            format
        });

        res.json({ url });
    } catch (error) {
        console.error('Error generating URL:', error);
        res.status(500).json({
            error: 'Error al generar URL',
            details: error.message
        });
    }
});

/**
 * GET /api/upload/config
 * Verifica la configuración de Cloudinary
 */
router.get('/config', (req, res) => {
    const config = getConfig();
    res.json({
        cloudinary_configured: config.configured,
        cloud_name: config.cloud_name
    });
});

/**
 * POST /api/upload/test-ai
 * Endpoint de prueba para verificar comunicación con Groq (Llama Vision)
 * Body: { imageUrl: "https://..." }
 */
router.post('/test-ai', async (req, res) => {
    try {
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({
                error: 'Se requiere imageUrl para analizar'
            });
        }

        console.log('🧠 Probando comunicación con Groq Llama Vision...');
        console.log('🖼️ Imagen a analizar:', imageUrl);

        const startTime = Date.now();
        const analysis = await analyzeImage(imageUrl);
        const duration = Date.now() - startTime;

        if (analysis) {
            console.log(`✅ Groq respondió exitosamente en ${duration}ms`);
            res.json({
                success: true,
                message: '✅ Comunicación con Groq exitosa',
                responseTime: `${duration}ms`,
                data: analysis,
                model: 'llama-3.2-90b-vision-preview'
            });
        } else {
            console.log('❌ Groq no devolvió resultados');
            res.json({
                success: false,
                message: '❌ Groq no devolvió resultados (puede ser un problema con la imagen o el modelo)',
                responseTime: `${duration}ms`
            });
        }
    } catch (error) {
        console.error('❌ Error en comunicación con Groq:', error);
        res.status(500).json({
            success: false,
            error: 'Error al comunicarse con Groq',
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

export default router;
