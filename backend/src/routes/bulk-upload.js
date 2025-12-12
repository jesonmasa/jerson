/**
 * Bulk Upload Route - FINAL & ROBUST with TIMEOUTS
 * Carga masiva de productos mediante archivo ZIP
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import os from 'os'; // Importante para Vercel
import { fileURLToPath } from 'url';
import { processZipBuffer, validateZipBuffer } from '../services/zip-processor.js';
import { uploadImage } from '../services/cloudinary.js';
import { encrypt, decrypt } from '../security/encryption.js';
import { extractColorFromName, extractCategoryFromName, groupImagesByProduct, generateGroupingSummary } from '../services/smart-grouper.js';
import { ensureCategoryExists } from './categories.js';
import { tenant } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const UPLOAD_TIMEOUT_MS = 60000; // 60 segundos por imagen máximo

// Store para trabajo de carga en progreso
const uploadJobs = new Map();

/**
 * Ejecuta tareas con límite de concurrencia (Ventana Deslizante)
 * Más eficiente que lotes estrictos
 */
async function limitConcurrency(items, limit, fn) {
    const results = [];
    const executing = [];
    for (const item of items) {
        const p = Promise.resolve().then(() => fn(item));
        results.push(p);
        const e = p.then(() => executing.splice(executing.indexOf(e), 1));
        executing.push(e);
        if (executing.length >= limit) {
            await Promise.race(executing);
        }
    }
    return Promise.all(results);
}

/**
 * Genera un ID único para producto
 */
function generateProductId() {
    return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Wrapper para subir imagen con timeout
 * Evita que una subida colgada bloquee todo el proceso
 */
async function uploadImageWithTimeout(imageBuffer, options) {
    return Promise.race([
        uploadImage(imageBuffer, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tiempo de espera agotado (60s)')), UPLOAD_TIMEOUT_MS)
        )
    ]);
}

/**
 * POST /api/bulk-upload/multipart
 */
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            // Vercel y AWS Lambda solo permiten escritura en /tmp
            const tempDir = os.tmpdir();
            cb(null, tempDir);
        },
        filename: function (req, file, cb) {
            cb(null, `upload_${Date.now()}_${file.originalname}`);
        }
    }),
    limits: { fileSize: 100 * 1024 * 1024 }
});

router.post('/multipart', authenticate, upload.single('file'), async (req, res) => {
    const jobId = `job_${Date.now()}`;
    let filePath = null;

    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });

        filePath = req.file.path;
        console.log(`📥 [Upload] Recibido archivo: ${filePath} (${req.file.size} bytes)`);

        const fileBuffer = await fs.readFile(filePath);
        console.log(`DATA READ: Buffer size ${fileBuffer.length}`);

        // Validar buffer antes de borrar
        const validation = validateZipBuffer(fileBuffer);
        if (!validation.valid) {
            console.error(`❌ Validación ZIP falló: ${validation.error}`);
            await fs.unlink(filePath).catch(() => { });
            return res.status(400).json({ error: validation.error });
        }

        // NO borramos el archivo aquí inmediatamente, porque processZipFile podría usarlo si optimizamos
        // Pero nuestra implementación actual de `processZipBuffer` escribe su propio temp file, 
        // así que es seguro borrarlo si usamos `processZipBuffer`.
        // Sin embargo, para eficiencia, sería mejor pasar filePath directo a `processZipFile` si pudiéramos.
        // Por ahora mantenemos la lógica de buffer para no romper la firma de processBulkUpload.
        await fs.unlink(filePath).catch(console.error);

        const categoryOverride = req.body.category || null;
        const smartGrouping = req.body.smartGrouping === 'true';

        // Iniciar job
        uploadJobs.set(jobId, {
            status: 'processing',
            tenantId: req.tenantId, // Guardar tenantId en el job
            progress: 0,
            total: 0,
            processed: 0,
            errors: [],
            products: [],
            startedAt: new Date().toISOString()
        });

        res.status(202).json({
            message: 'Procesamiento iniciado',
            jobId,
            statusUrl: `/api/bulk-upload/status/${jobId}`
        });

        // Procesar en background con el buffer leído
        // Pasamos req.tenantId para asegurar que se guarde en el tenant correcto
        processBulkUpload(jobId, fileBuffer, categoryOverride, smartGrouping, req.tenantId);

    } catch (error) {
        console.error('Error en bulk upload multipart:', error);
        if (filePath) await fs.unlink(filePath).catch(console.error);
        res.status(500).json({ error: 'Error procesando el archivo: ' + error.message });
    }
});

/**
 * LÓGICA PRINCIPAL - SERIAL Y ROBUSTA
 */


async function processBulkUpload(jobId, zipBuffer, categoryOverride = null, smartGrouping = false, tenantId) {
    const job = uploadJobs.get(jobId);

    try {
        // 1. EXTRAER
        console.log(`📦 [Job ${jobId}] Extrayendo ZIP para tenant ${tenantId}...`);

        let result;
        try {
            result = await processZipBuffer(zipBuffer);
        } catch (zipError) {
            console.error(`❌ [Job ${jobId}] Error extrayendo ZIP:`, zipError);
            job.status = 'error';
            job.error = `Error procesando ZIP: ${zipError.message}`;
            return;
        }

        job.total = result.totalImages;
        console.log(`📦 [Job ${jobId}] Imágenes encontradas: ${result.totalImages}. Smart Mode: ${smartGrouping}`);

        // 2. AGRUPAR EN MEMORIA
        const existingProducts = await tenant.findAll(tenantId, 'products');
        const productGroups = new Map();

        for (const item of result.products) {
            let category, model, color;
            const rawFileName = path.basename(item.image.fileName);
            const cleanName = rawFileName.replace(/\.[^/.]+$/, ""); // Sin extensión

            if (smartGrouping) {
                const extracted = extractColorFromName(cleanName);
                model = extracted.baseName;
                color = extracted.color || 'Unico';

                if (item.category && item.category !== 'Sin Categoría') {
                    category = item.category;
                } else {
                    const displayName = model.replace(/[-_]/g, ' ');
                    category = extractCategoryFromName(displayName);
                }

                // console.log(`🎨 [Smart] ${cleanName} → ${model} | ${color} | ${category}`);
            } else {
                category = item.category !== 'Sin Categoría' ? item.category : 'General';
                model = cleanName;
                color = 'Unico';
            }

            if (categoryOverride) category = categoryOverride;

            const groupKey = smartGrouping
                ? `${category}-${model}`.toUpperCase().replace(/\s+/g, '_')
                : `${category}-${model}-${Math.random()}`;

            if (!productGroups.has(groupKey)) {
                productGroups.set(groupKey, {
                    category,
                    model,
                    variants: []
                });
            }

            productGroups.get(groupKey).variants.push({
                imageBuffer: item.image.base64,
                fileName: item.name,
                color,
                cleanName
            });
        }

        console.log(`🧩 [Job ${jobId}] Grupos creados: ${productGroups.size}`);

        // 2.5 CREAR CATEGORÍAS AUTOMÁTICAMENTE
        const uniqueCategories = new Set();
        for (const group of productGroups.values()) {
            if (group.category && group.category !== 'Sin Categoría' && group.category !== 'General') {
                uniqueCategories.add(group.category);
            }
        }

        if (uniqueCategories.size > 0) {
            console.log(`📁 [Job ${jobId}] Verificando auto-categorización para ${uniqueCategories.size} categorías...`);
            let currentCategories = await tenant.findAll(tenantId, 'categories');
            let categoriesCreated = 0;

            for (const categoryName of uniqueCategories) {
                if (!currentCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase())) {
                    console.log(`✨ [Job ${jobId}] Creando nueva categoría automática: ${categoryName}`);
                    await tenant.insert(tenantId, 'categories', {
                        name: categoryName,
                        slug: categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    });
                    categoriesCreated++;
                }
            }

            // Recargar categorías para tener las IDs y nombres correctos (si hubo creaciones)
            if (categoriesCreated > 0) {
                currentCategories = await tenant.findAll(tenantId, 'categories');
            }

            // Normalizar nombres de categorías en los grupos para coincidir EXACTAMENTE con la BD
            // Esto evita duplicados visuales como "Zapatillas" vs "zapatillas"
            const categoryMap = new Map();
            currentCategories.forEach(c => categoryMap.set(c.name.toLowerCase(), c.name));

            for (const group of productGroups.values()) {
                if (group.category && group.category !== 'Sin Categoría' && group.category !== 'General') {
                    const officialName = categoryMap.get(group.category.toLowerCase());
                    if (officialName) {
                        group.category = officialName;
                    }
                }
            }
        }

        // 3. PREPARAR COLA DE SUBIDA (FLATTEN)
        console.log(`☁️ [Job ${jobId}] Iniciando subida PARALELA a Cloudinary de ${job.total} imágenes...`);

        const uploadQueue = [];
        let processedImages = 0;

        // Aplanar tareas para procesar en paralelo
        for (const group of productGroups.values()) {
            const folderName = `${tenantId}/products`;

            for (let idx = 0; idx < group.variants.length; idx++) {
                const variant = group.variants[idx];
                const safeCategory = group.category.replace(/[^a-zA-Z0-9]/g, '_');
                const safeModel = group.model.replace(/[^a-zA-Z0-9]/g, '_');
                const safeColor = variant.color.replace(/[^a-zA-Z0-9]/g, '_');
                const publicId = `${folderName}/${safeCategory}/${safeModel}/${safeColor}_${idx + 1}_${Date.now()}`;

                uploadQueue.push({
                    group, // Referencia al grupo para actualizar resultados después o asociar
                    variant, // Referencia variante
                    publicId,
                    folderName
                });
            }
        }

        // 3. SUBIR IMÁGENES A CLOUDINARY (Optimizado: Concurrencia Limitada)
        // "5 en 5 un poco más rápido" -> Ventana deslizante en vez de lotes estáticos
        const CONCURRENCY_LIMIT = 5;


        console.log(`☁️ [Job ${jobId}] Iniciando subida optimizada (Máx ${CONCURRENCY_LIMIT} simultáneos)...`);

        await limitConcurrency(uploadQueue, CONCURRENCY_LIMIT, async (task) => {
            const { variant, publicId, folderName } = task;
            try {
                // SUBIDA CON TIMEOUT
                const cloudinaryResult = await uploadImageWithTimeout(variant.imageBuffer, {
                    public_id: publicId,
                    folder: folderName,
                    quality: 'auto',
                    transformation: 'c_limit,w_1000'
                });

                variant.finalUrl = cloudinaryResult?.url || variant.imageBuffer;
            } catch (err) {
                console.error(`❌ [Job ${jobId}] Error subiendo ${variant.fileName}:`, err.message);
                job.errors.push({ fileName: variant.fileName, error: err.message });
                variant.finalUrl = variant.imageBuffer;
            } finally {
                processedImages++;
                job.processed = processedImages;
                job.progress = Math.round((job.processed / job.total) * 100);
            }
        });

        // 4. CONSTRUIR PRODUCTOS Y GUARDAR
        const newProducts = [];
        console.log(`💾 [Job ${jobId}] Subida finalizada. Guardando productos en base de datos...`);
        job.status = 'saving'; // Estado intermedio para informar al frontend

        for (const group of productGroups.values()) {
            const productImages = [];
            const colorImageMap = {};

            // Recolectar URLs de las variantes ya procesadas
            for (const variant of group.variants) {
                if (variant.finalUrl) {
                    productImages.push(variant.finalUrl);
                    if (variant.color && variant.color !== 'Unico') {
                        colorImageMap[variant.color] = variant.finalUrl;
                    }
                }
            }

            if (productImages.length > 0) {
                const newProduct = {
                    name: group.model.replace(/[-_]/g, ' '),
                    subtitle: '',
                    price: null,
                    description: '',
                    image: productImages[0], // Primera como principal
                    images: productImages, // Todas
                    category: group.category,
                    stock: 1,
                    sizes: [],
                    colors: Object.keys(colorImageMap),
                    colorImages: colorImageMap,
                    status: 'draft',
                };

                const inserted = await tenant.insert(tenantId, 'products', newProduct);
                newProducts.push(inserted);
                job.products.push({ id: inserted.id, name: inserted.name });
            }
        }

        console.log(`✅ [Job ${jobId}] Proceso completado. ${newProducts.length} productos creados.`);

        job.status = 'completed';
        job.completedAt = new Date().toISOString();

    } catch (error) {
        console.error(`🔥 [Job ${jobId}] Error Fatal:`, error);
        job.status = 'error';
        job.error = error.message;
    }
}

// Routes
router.get('/status/:jobId', authenticate, (req, res) => {
    const job = uploadJobs.get(req.params.jobId);
    if (!job) return res.status(404).json({ error: 'Job no encontrado' });

    // Seguridad básica: asegurar que el job pertenece al tenant (o al menos que no vea jobs de otros si guardamos tenantId)
    if (job.tenantId && job.tenantId !== req.tenantId) {
        return res.status(403).json({ error: 'Acceso denegado al job' });
    }

    res.json({ jobId: req.params.jobId, ...job });
});

router.post('/preview', upload.single('file'), async (req, res) => {
    let filePath = null;
    try {
        if (!req.file) return res.status(400).json({ error: 'No se recibió ningún archivo' });

        filePath = req.file.path;
        console.log(`🔍 [Preview] File Path: ${filePath}`);

        const fileBuffer = await fs.readFile(filePath);

        const validation = validateZipBuffer(fileBuffer);
        if (!validation.valid) {
            await fs.unlink(filePath).catch(console.error);
            return res.status(400).json({ error: validation.error });
        }

        // Extraer imágenes del ZIP (usando el buffer leído del disco)
        const result = await processZipBuffer(fileBuffer);

        // Ya no necesitamos el archivo en disco
        await fs.unlink(filePath).catch(console.error);

        // Preparar datos para el smart-grouper
        const images = result.products.map(item => ({
            fileName: item.image.fileName,
            category: item.category,
            name: item.name
        }));

        // Agrupar usando smart-grouper
        const groups = groupImagesByProduct(images);
        // Nota: Preview no guarda nada, así que no necesitamos tenantId aquí, es solo lógica de agrupación
        const summary = generateGroupingSummary(groups);

        res.json({
            success: true,
            totalImages: result.totalImages,
            totalProducts: summary.length,
            groups: summary
        });

    } catch (error) {
        console.error('Error en preview:', error);
        if (filePath) await fs.unlink(filePath).catch(console.error);
        res.status(500).json({ error: error.message || 'Error analizando el archivo' });
    }
});

export default router;
