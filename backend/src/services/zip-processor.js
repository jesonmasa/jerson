/**
 * ZIP Processor Service (Universal/Serverless Version)
 * Procesa archivos ZIP para carga masiva de productos
 * Usa 'adm-zip' para compatibilidad total (Windows/Linux/Vercel)
 */

import AdmZip from 'adm-zip';
import path from 'path';

// Constantes
const MAX_IMAGES = 100;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB por imagen
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Obtiene el mime type basado en la extensión
 */
function getMimeType(ext) {
    const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp'
    };
    return types[ext.toLowerCase()] || 'image/jpeg';
}

/**
 * Transforma el nombre del archivo en nombre de producto
 */
export function fileNameToProductName(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    let name = baseName.replace(/[-_]/g, ' ');
    name = name.replace(/\b\w/g, char => char.toUpperCase());
    name = name.replace(/\s+/g, ' ').trim();
    return name;
}

/**
 * Extrae la categoría del path del archivo relativo
 */
export function extractCategoryFromPath(relativePath) {
    const normalizedPath = relativePath.replace(/\\/g, '/');
    const parts = normalizedPath.split('/').filter(p => p.length > 0);

    if (parts.length > 1) {
        return parts[0];
    }
    return 'Sin Categoría';
}

/**
 * Procesa un archivo ZIP desde la ruta de archivo (adm-zip es síncrono para archivos locales)
 * Para serverless, es mejor usar processZipBuffer si es posible, pero mantenemos esta firma.
 */
export async function processZipFile(filePath) {
    console.log(`📦 Procesando ZIP con adm-zip: ${filePath}`);

    return new Promise((resolve, reject) => {
        try {
            const zip = new AdmZip(filePath);
            const zipEntries = zip.getEntries(); // Array de objetos ZipEntry

            console.log(`📂 Archivos encontrados (entradas ZIP): ${zipEntries.length}`);

            const products = [];

            for (const entry of zipEntries) {
                // Ignorar directorios y archivos basura
                if (entry.isDirectory || entry.entryName.includes('__MACOSX') || entry.entryName.includes('.DS_Store')) {
                    continue;
                }

                const ext = path.extname(entry.name).toLowerCase();
                if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

                // Chequeo de tamaño antes de descomprimir en memoria
                if (entry.header.size > MAX_FILE_SIZE) {
                    console.warn(`⚠️ Imagen muy grande ignorada: ${entry.name}`);
                    continue;
                }

                try {
                    // Leer buffer de la imagen
                    const fileBuffer = entry.getData();
                    const base64 = fileBuffer.toString('base64');
                    const mimeType = getMimeType(ext);

                    // El "entryName" incluye la ruta dentro del zip
                    const relativePath = entry.entryName;

                    products.push({
                        name: fileNameToProductName(entry.name),
                        category: extractCategoryFromPath(relativePath),
                        image: {
                            base64: `data:${mimeType};base64,${base64}`,
                            fileName: entry.name,
                            size: entry.header.size,
                            mimeType: mimeType
                        }
                    });

                    if (products.length >= MAX_IMAGES) break;

                } catch (err) {
                    console.error(`❌ Error procesando entrada ${entry.name}:`, err.message);
                }
            }

            if (products.length === 0) {
                return reject(new Error('No se encontraron imágenes válidas en el ZIP.'));
            }

            console.log(`✅ Imágenes procesadas exitosamente: ${products.length}`);

            resolve({
                success: true,
                totalImages: products.length,
                products
            });

        } catch (error) {
            console.error('❌ Error descomprimiendo ZIP:', error);
            reject(new Error(`Error al leer ZIP: ${error.message}`));
        }
    });
}

/**
 * Procesa un buffer de ZIP directamente en memoria (Ideal para serverless)
 */
export async function processZipBuffer(zipBuffer) {
    console.log(`📦 Procesando Bufffer ZIP en memoria...`);

    return new Promise((resolve, reject) => {
        try {
            const zip = new AdmZip(zipBuffer);
            const zipEntries = zip.getEntries();
            const products = [];

            for (const entry of zipEntries) {
                if (entry.isDirectory || entry.entryName.includes('__MACOSX') || entry.entryName.includes('.DS_Store')) continue;

                const ext = path.extname(entry.name).toLowerCase();
                if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

                if (entry.header.size > MAX_FILE_SIZE) continue;

                const fileBuffer = entry.getData();
                const base64 = fileBuffer.toString('base64');
                const mimeType = getMimeType(ext);

                products.push({
                    name: fileNameToProductName(entry.name),
                    category: extractCategoryFromPath(entry.entryName),
                    image: {
                        base64: `data:${mimeType};base64,${base64}`,
                        fileName: entry.name,
                        size: entry.header.size,
                        mimeType: mimeType
                    }
                });

                if (products.length >= MAX_IMAGES) break;
            }

            if (products.length === 0) {
                return reject(new Error('No se encontraron imágenes válidas.'));
            }

            resolve({
                success: true,
                totalImages: products.length,
                products
            });

        } catch (error) {
            reject(new Error(`Error al procesar buffer ZIP: ${error.message}`));
        }
    });
}

/**
 * Valida un archivo ZIP (Básica por header)
 */
export function validateZipBuffer(buffer) {
    // PK header check
    if (buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
        return { valid: false, error: 'El archivo no es un ZIP válido (Firma PK faltante)' };
    }
    return { valid: true };
}

export default {
    processZipBuffer,
    processZipFile,
    fileNameToProductName,
    extractCategoryFromPath,
    validateZipBuffer,
    MAX_IMAGES
};
