/**
 * Cloudinary Integration Module (Native - Sin NPM)
 * Utiliza la API REST de Cloudinary directamente con Node.js nativo
 */

import https from 'https';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Configuración de Cloudinary (cargar de variables de entorno)
const CLOUDINARY_CONFIG = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

// Verificar que la configuración esté presente
if (!CLOUDINARY_CONFIG.cloud_name || !CLOUDINARY_CONFIG.api_key || !CLOUDINARY_CONFIG.api_secret) {
    console.warn('⚠️ Cloudinary configuration is incomplete. Image uploads will not work until CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set.');
} else {
    console.log('✅ Cloudinary configured securely from environment variables');
}

/**
 * Genera la firma para autenticación de Cloudinary
 * @param {Object} params - Parámetros a firmar
 * @returns {string} - Firma SHA1
 */
function generateSignature(params) {
    // Ordenar las claves alfabéticamente para consistencia en la firma
    const sortedKeys = Object.keys(params).sort();
    const stringToSign = sortedKeys
        .map(key => `${key}=${params[key]}`)
        .join('&');

    console.log('📝 String to sign:', stringToSign); // Log para depuración
    console.log('🔐 API Secret:', CLOUDINARY_CONFIG.api_secret); // Log para depuración

    // Calcular la firma manualmente para comparar
    const manualSignature = crypto
        .createHash('sha1')
        .update(stringToSign + CLOUDINARY_CONFIG.api_secret)
        .digest('hex');

    return manualSignature;
}

/**
 * Sube una imagen a Cloudinary usando Multipart/Form-Data nativo
 * Esto es necesario para subir archivos grandes (>1MB) sin romper el buffer de Node.js
 * Soporta parámetros de optimización.
 * @param {string} base64Data - Imagen en formato base64
 * @param {Object} options - Opciones de subida
 * @returns {Promise<Object>} - Respuesta de Cloudinary
 */
export async function uploadImage(base64Data, options = {}) {
    return new Promise((resolve, reject) => {
        const timestamp = Math.floor(Date.now() / 1000);
        const folder = options.folder || 'mascotitas';
        const publicId = options.public_id || `img_${Date.now()}`;

        console.log(`Cloudinary Config:`, { cloud_name: CLOUDINARY_CONFIG.cloud_name, api_key: '***' });
        console.log(`☁️ Cloudinary: Iniciando subida Multipart de ${publicId}...`);

        // Limpiar base64 header si existe para obtener el buffer limpio
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const fileBuffer = Buffer.from(cleanBase64, 'base64');

        // Configurar parámetros base
        const params = {
            folder,
            public_id: publicId,
            timestamp
        };

        // Agregar parámetros de transformación si existen
        if (options.width) params.width = options.width;
        if (options.height) params.height = options.height;
        if (options.crop) params.crop = options.crop;
        if (options.quality) params.quality = options.quality;
        // Aplicar formato WebP durante la subida, no solo en la URL
        if (options.format) params.format = options.format;

        // Efectos especiales de Cloudinary AI
        if (options.effect) params.effect = options.effect; // upscale, etc.
        if (options.background_removal) params.background_removal = options.background_removal;

        console.log('☁️ Parámetros de subida:', params);

        // Generar firma con todos los parámetros
        const signature = generateSignature(params);

        // Agregar api_key y signature para el body
        const fields = {
            ...params,
            api_key: CLOUDINARY_CONFIG.api_key,
            signature: signature
        };

        // El boundary separa las partes del multipart
        const boundary = '----CloudinaryBoundary' + Date.now().toString(16);
        const crlf = '\r\n';

        // Construir Header del Multipart (campos de texto)
        let header = '';
        for (const [key, value] of Object.entries(fields)) {
            header += `--${boundary}${crlf}`;
            header += `Content-Disposition: form-data; name="${key}"${crlf}${crlf}`;
            header += `${value}${crlf}`;
        }

        // Header de la parte del Archivo
        header += `--${boundary}${crlf}`;
        header += `Content-Disposition: form-data; name="file"; filename="image.jpg"${crlf}`;
        header += `Content-Type: application/octet-stream${crlf}${crlf}`;

        // Footer del Multipart
        const footer = `${crlf}--${boundary}--${crlf}`;

        // Calcular longitud total
        const postDataLength = Buffer.byteLength(header) + fileBuffer.length + Buffer.byteLength(footer);

        console.log(`☁️ Enviando ${postDataLength} bytes (${(postDataLength / 1024 / 1024).toFixed(2)} MB) a Cloudinary...`);

        const requestOptions = {
            hostname: 'api.cloudinary.com',
            port: 443,
            path: `/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`,
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': postDataLength
            }
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';

            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.error) {
                        console.error(`❌ Cloudinary API Error for ${publicId}:`, JSON.stringify(result.error));
                        reject(new Error(`Cloudinary Error: ${result.error.message}`));
                    } else {
                        console.log(`✅ Subida completada: ${result.secure_url} (${(result.bytes / 1024).toFixed(1)} KB)`);
                        resolve({
                            success: true,
                            public_id: result.public_id,
                            url: getImageUrl(result.public_id, {
                                format: options.format || 'webp',
                                quality: options.quality || 'auto',
                                width: options.width,
                                height: options.height,
                                crop: options.crop
                            }),
                            original_url: result.secure_url,
                            width: result.width,
                            height: result.height,
                            format: result.format || 'webp', // Cloudinary might return jpg if no conversion happened on upload, but we force webp in url
                            bytes: result.bytes
                        });
                    }
                } catch (e) {
                    // Si falla el parse JSON, intentamos mostrar qué devolvió (puede ser HTML de error 404/500)
                    console.error(`❌ Parse Error (Status: ${res.statusCode}): ${data.substring(0, 500)}`);
                    reject(new Error(`Respuesta inválida de Cloudinary (HTTP ${res.statusCode}): ${data.substring(0, 100)}...`));
                }
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Network Error: ${e.message}`);
            reject(e);
        });

        // IMPORTANTE: Escribir en orden: Header -> Buffer -> Footer
        req.write(header);
        req.write(fileBuffer);
        req.write(footer);
        req.end();
    });
}

/**
 * Sube un archivo desde el sistema de archivos
 * @param {string} filePath - Ruta del archivo
 * @param {Object} options - Opciones de subida
 * @returns {Promise<Object>} - Respuesta de Cloudinary
 */
export async function uploadFile(filePath, options = {}) {
    const data = await fs.readFile(filePath);
    const base64 = data.toString('base64');
    return uploadImage(base64, options);
}

/**
 * Elimina una imagen de Cloudinary
 * @param {string} publicId - ID público de la imagen
 * @returns {Promise<Object>} - Resultado de eliminación
 */
export async function deleteImage(publicId) {
    return new Promise((resolve, reject) => {
        const timestamp = Math.floor(Date.now() / 1000);

        const paramsToSign = {
            public_id: publicId,
            timestamp
        };

        const signature = generateSignature(paramsToSign);

        const formData = {
            public_id: publicId,
            timestamp,
            signature,
            api_key: CLOUDINARY_CONFIG.api_key
        };

        const postData = JSON.stringify(formData);

        const requestOptions = {
            hostname: 'api.cloudinary.com',
            port: 443,
            path: `/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/destroy`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

/**
 * Genera una URL transformada
 * @param {string} publicId - ID público de la imagen
 * @param {Object} options - Opciones de transformación (width, height, crop)
 * @returns {string} - URL transformada
 */
export function getImageUrl(publicId, options = {}) {
    const transformations = [];

    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    // Default optimizations if not provided
    const quality = options.quality || 'auto';
    const format = options.format || 'webp';

    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transformString = transformations.length > 0 ? transformations.join(',') : '';

    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload/${transformString ? transformString + '/' : ''}${publicId}`;
}

// Alias para compatibilidad con upload.js
export const getTransformedUrl = getImageUrl;

export function getConfig() {
    return {
        configured: !!(CLOUDINARY_CONFIG.cloud_name && CLOUDINARY_CONFIG.api_key && CLOUDINARY_CONFIG.api_secret),
        cloud_name: CLOUDINARY_CONFIG.cloud_name
    };
}

export default {
    uploadImage,
    uploadFile,
    deleteImage,
    getImageUrl,
    getTransformedUrl,
    getConfig
};
