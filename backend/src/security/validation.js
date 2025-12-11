/**
 * Módulo de Validación y Sanitización Nativo
 * ==========================================
 * Sin dependencias npm - Solo JavaScript puro
 */

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    //.replace(/\//g, '&#x2F;'); // Allow forward slashes for URLs
}

/**
 * Sanitiza HTML preservando estructura pero eliminando scripts
 */
export function sanitizeHtml(html) {
    if (!html || typeof html !== 'string') return '';

    return html
        // Eliminar scripts
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Eliminar eventos inline
        .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/\s*on\w+\s*=\s*[^\s>]+/gi, '')
        // Eliminar javascript: URLs
        .replace(/javascript\s*:/gi, '')
        // Eliminar data: URLs peligrosos
        .replace(/data\s*:\s*text\/html/gi, '')
        // Eliminar expresiones CSS maliciosas
        .replace(/expression\s*\(/gi, '')
        .replace(/url\s*\(\s*["']?\s*javascript/gi, '');
}

/**
 * Valida que un string sea un ID válido (alfanumérico + guiones)
 */
export function isValidId(id) {
    if (!id || typeof id !== 'string') return false;
    return /^[a-zA-Z0-9_-]+$/.test(id) && id.length <= 100;
}

/**
 * Valida email básico
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

/**
 * Valida número de teléfono
 */
export function isValidPhone(phone) {
    if (!phone || typeof phone !== 'string') return false;
    const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
    return /^\+?[0-9]{7,15}$/.test(cleaned);
}

/**
 * Valida precio
 */
export function isValidPrice(price) {
    const num = parseFloat(price);
    return !isNaN(num) && num >= 0 && num <= 999999.99;
}

/**
 * Valida y limpia datos de producto
 */
export function validateProduct(data) {
    const errors = [];
    const cleaned = {};

    if (!data.name || typeof data.name !== 'string' || data.name.length < 1) {
        errors.push('Nombre requerido');
    } else {
        cleaned.name = sanitizeText(data.name.substring(0, 200));
    }

    if (!data.category || typeof data.category !== 'string') {
        errors.push('Categoría requerida');
    } else {
        cleaned.category = sanitizeText(data.category.substring(0, 100));
    }

    if (data.price !== undefined && data.price !== null && data.price !== '') {
        if (!isValidPrice(data.price)) {
            errors.push('Precio inválido');
        } else {
            cleaned.price = parseFloat(data.price);
        }
    }

    if (data.description) {
        cleaned.description = sanitizeText(String(data.description).substring(0, 5000));
    }

    if (data.stock !== undefined) {
        const stock = parseInt(data.stock);
        cleaned.stock = isNaN(stock) || stock < 0 ? 0 : Math.min(stock, 999999);
    }

    if (data.discount !== undefined && data.discount !== null && data.discount !== '') {
        const discount = parseInt(data.discount);
        cleaned.discount = isNaN(discount) || discount < 0 || discount > 100 ? 0 : discount;
    }

    if (data.colorImages) {
        cleaned.colorImages = data.colorImages;
    }

    if (data.colors) {
        cleaned.colors = data.colors;
    }

    if (data.sizes) {
        cleaned.sizes = data.sizes;
    }

    if (data.image) {
        cleaned.image = sanitizeText(data.image);
    }

    if (data.status) {
        cleaned.status = sanitizeText(data.status);
    }

    if (data.subtitle) {
        cleaned.subtitle = sanitizeText(data.subtitle);
    }

    return { isValid: errors.length === 0, errors, data: cleaned };
}

/**
 * Valida y limpia datos de orden
 */
export function validateOrder(data) {
    const errors = [];
    const cleaned = {};

    if (!data.customer_name || data.customer_name.length < 2) {
        errors.push('Nombre de cliente requerido');
    } else {
        cleaned.customer_name = sanitizeText(data.customer_name.substring(0, 200));
    }

    if (data.customer_email && !isValidEmail(data.customer_email)) {
        errors.push('Email inválido');
    } else if (data.customer_email) {
        cleaned.customer_email = data.customer_email.toLowerCase();
    }

    if (data.customer_phone && !isValidPhone(data.customer_phone)) {
        errors.push('Teléfono inválido');
    } else if (data.customer_phone) {
        cleaned.customer_phone = data.customer_phone;
    }

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
        errors.push('Carrito vacío');
    } else {
        cleaned.items = data.items.map(item => ({
            id: sanitizeText(String(item.id)),
            name: sanitizeText(String(item.name || '').substring(0, 200)),
            quantity: Math.max(1, Math.min(parseInt(item.quantity) || 1, 999)),
            price: isValidPrice(item.price) ? parseFloat(item.price) : 0
        }));
    }

    if (data.shipping_address) {
        cleaned.shipping_address = {
            address: sanitizeText(String(data.shipping_address.address || '').substring(0, 500))
        };
    }

    return { isValid: errors.length === 0, errors, data: cleaned };
}

/**
 * Middleware para log de seguridad
 */
export function securityLogger(req, res, next) {
    const logData = {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        method: req.method,
        path: req.path,
        userAgent: req.headers['user-agent']?.substring(0, 200) || 'unknown'
    };

    // Solo log en desarrollo o si es sospechoso
    const isSuspicious =
        req.path.includes('..') ||
        req.path.includes('<') ||
        req.path.includes('script');

    if (isSuspicious) {
        console.warn('⚠️ Actividad sospechosa:', logData);
    }

    next();
}

export default {
    sanitizeText,
    sanitizeHtml,
    isValidId,
    isValidEmail,
    isValidPhone,
    isValidPrice,
    validateProduct,
    validateOrder,
    securityLogger
};
