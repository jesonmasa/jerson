/**
 * Módulo de Cifrado Nativo para Constructor
 * ==========================================
 * Usa crypto de Node.js (sin npm externo)
 * Cifrado AES-256-GCM para máxima seguridad
 * 
 * Solo esta plataforma puede descifrar los datos.
 */

import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivo para guardar la clave maestra (¡PROTEGER ESTE ARCHIVO!)
const KEY_FILE = path.join(__dirname, '../.encryption-key');

// Configuración de cifrado
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16;  // 128 bits
const AUTH_TAG_LENGTH = 16;

/**
 * Genera una clave maestra única para esta instalación
 * Se guarda en archivo local que NO debe subirse a git
 */
async function generateMasterKey() {
    const key = crypto.randomBytes(KEY_LENGTH);
    await fs.writeFile(KEY_FILE, key.toString('hex'), 'utf8');
    console.log('🔑 Clave maestra generada y guardada de forma segura');
    return key;
}

/**
 * Obtiene la clave maestra existente o genera una nueva
 */
async function getMasterKey() {
    try {
        const keyHex = await fs.readFile(KEY_FILE, 'utf8');
        return Buffer.from(keyHex.trim(), 'hex');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return await generateMasterKey();
        }
        throw error;
    }
}

/**
 * Cifra datos sensibles con AES-256-GCM
 * @param {string|object} data - Datos a cifrar
 * @returns {string} - Datos cifrados en formato: iv:authTag:ciphertext (hex)
 */
export async function encrypt(data) {
    const key = await getMasterKey();
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
    });

    const plaintext = typeof data === 'object' ? JSON.stringify(data) : String(data);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // Formato: iv:authTag:ciphertext
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Descifra datos protegidos con AES-256-GCM
 * @param {string} encryptedData - Datos cifrados en formato iv:authTag:ciphertext
 * @returns {string|object} - Datos originales
 */
export async function decrypt(encryptedData) {
    if (!encryptedData || !encryptedData.includes(':')) {
        return encryptedData; // Retornar sin cambios si no está cifrado
    }

    const key = await getMasterKey();
    const [ivHex, authTagHex, ciphertext] = encryptedData.split(':');

    if (!ivHex || !authTagHex || !ciphertext) {
        throw new Error('Formato de datos cifrados inválido');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Intentar parsear como JSON
    try {
        return JSON.parse(decrypted);
    } catch {
        return decrypted;
    }
}

/**
 * Cifra un archivo JSON completo
 * @param {string} filePath - Ruta al archivo JSON
 */
export async function encryptFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(content);
    const encrypted = await encrypt(data);
    await fs.writeFile(filePath + '.encrypted', encrypted, 'utf8');
    console.log(`🔒 Archivo cifrado: ${filePath}.encrypted`);
}

/**
 * Descifra un archivo previamente cifrado
 * @param {string} encryptedFilePath - Ruta al archivo cifrado
 */
export async function decryptFile(encryptedFilePath) {
    const encryptedContent = await fs.readFile(encryptedFilePath, 'utf8');
    const data = await decrypt(encryptedContent);
    const originalPath = encryptedFilePath.replace('.encrypted', '');
    await fs.writeFile(originalPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`🔓 Archivo descifrado: ${originalPath}`);
    return data;
}

/**
 * Hash seguro para datos que no necesitan ser reversibles
 * (ej: tokens de sesión, verificaciones)
 */
export function hashSecure(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Genera un token seguro aleatorio
 */
export function generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Verifica si los datos están cifrados
 */
export function isEncrypted(data) {
    if (typeof data !== 'string') return false;
    const parts = data.split(':');
    return parts.length === 3 &&
        parts[0].length === IV_LENGTH * 2 &&
        parts[1].length === AUTH_TAG_LENGTH * 2;
}

// Exportar módulo por defecto
export default {
    encrypt,
    decrypt,
    encryptFile,
    decryptFile,
    hashSecure,
    generateSecureToken,
    isEncrypted
};
