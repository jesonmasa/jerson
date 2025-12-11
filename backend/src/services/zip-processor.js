/**
 * ZIP Processor Service (Robust Windows Version)
 * Procesa archivos ZIP para carga masiva de productos
 * Usa PowerShell Expand-Archive para máxima compatibilidad en Windows
 */

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import util from 'util';



// Constantes
const MAX_IMAGES = 100;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB por imagen (aumentado)
const MAX_ZIP_SIZE = 500 * 1024 * 1024; // 500 MB por ZIP (aumentado)
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
 * Recursively get all files in a directory
 */
async function getFilesRecursively(dir) {
    const dirents = await fsp.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFilesRecursively(res) : res;
    }));
    return Array.prototype.concat(...files);
}

/**
 * Procesa un archivo ZIP usando PowerShell (Versión Stream/Spawn)
 * @param {string} filePath - Ruta absoluta del archivo ZIP
 * @returns {Promise<Object>} - Resultado del procesamiento
 */
export async function processZipFile(filePath) {
    const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'upload-'));
    console.log(`📦 Extrayendo ZIP usando PowerShell en: ${tempDir}`);

    return new Promise((resolve, reject) => {
        // Usar spawn para evitar límites de buffer de exec
        const ps = spawn('powershell', [
            '-Command',
            `Expand-Archive -LiteralPath '${filePath}' -DestinationPath '${tempDir}' -Force`
        ]);

        let stderrData = '';

        ps.stderr.on('data', (data) => {
            // Acumular solo los primeros 1KB de error para evitar logs gigantes
            if (stderrData.length < 1024) {
                stderrData += data.toString();
            }
        });

        ps.on('close', async (code) => {
            if (code !== 0) {
                console.error(`❌ PowerShell exited with code ${code}`);
                // Limpieza en caso de error
                try { await fsp.rm(tempDir, { recursive: true, force: true }); } catch (e) { }

                return reject(new Error(`Error al descomprimir (Código ${code}). ${stderrData.substring(0, 200)}...`));
            }

            try {
                // Leer todos los archivos extraídos
                const allFiles = await getFilesRecursively(tempDir);
                console.log(`📂 Archivos encontrados: ${allFiles.length}`);

                const products = [];

                for (const fullPath of allFiles) {
                    // Ignorar directorios __MACOSX ocultos
                    if (fullPath.includes('__MACOSX') || fullPath.includes('.DS_Store')) continue;

                    const ext = path.extname(fullPath).toLowerCase();
                    if (!ALLOWED_EXTENSIONS.includes(ext)) continue;

                    try {
                        const stats = await fsp.stat(fullPath);
                        if (stats.size > MAX_FILE_SIZE) {
                            console.warn(`⚠️ Imagen muy grande ignorada: ${path.basename(fullPath)}`);
                            continue;
                        }

                        // Leer imagen
                        const fileBuffer = await fsp.readFile(fullPath);
                        const base64 = fileBuffer.toString('base64');
                        const mimeType = getMimeType(ext);

                        // Calcular path relativo para categoría
                        const relativePath = path.relative(tempDir, fullPath);

                        products.push({
                            name: fileNameToProductName(path.basename(fullPath)),
                            category: extractCategoryFromPath(relativePath),
                            image: {
                                base64: `data:${mimeType};base64,${base64}`,
                                fileName: path.basename(fullPath),
                                size: stats.size,
                                mimeType: mimeType
                            }
                        });

                        if (products.length >= MAX_IMAGES) break;

                    } catch (err) {
                        console.error(`❌ Error leyendo archivo ${fullPath}:`, err.message);
                    }
                }

                // Limpieza antes de retornar
                try { await fsp.rm(tempDir, { recursive: true, force: true }); } catch (e) { }

                if (products.length === 0) {
                    // Si no hay productos, pero el ZIP era válido, retornamos error controlado
                    return reject(new Error('No se encontraron imágenes válidas en el ZIP.'));
                }

                console.log(`✅ Imágenes procesadas exitosamente: ${products.length}`);

                resolve({
                    success: true,
                    totalImages: products.length,
                    products
                });

            } catch (postProcessError) {
                try { await fsp.rm(tempDir, { recursive: true, force: true }); } catch (e) { }
                reject(postProcessError);
            }
        });

        ps.on('error', (err) => {
            // Error al iniciar el proceso
            console.error('❌ Error spawing PowerShell:', err);
            reject(new Error('Falló al iniciar el proceso de descompresión via PowerShell.'));
        });
    });
}

/**
 * Procesa un buffer de ZIP escribiéndolo primero a disco
 * (Compatibilidad con código existente)
 */
export async function processZipBuffer(zipBuffer) {
    const tempFilePath = path.join(os.tmpdir(), `temp_upload_${Date.now()}.zip`);

    try {
        await fsp.writeFile(tempFilePath, zipBuffer);
        return await processZipFile(tempFilePath);
    } finally {
        try {
            await fsp.unlink(tempFilePath);
        } catch (e) { /* ignore */ }
    }
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
    MAX_IMAGES,
    MAX_FILE_SIZE,
    MAX_ZIP_SIZE,
    ALLOWED_EXTENSIONS
};
