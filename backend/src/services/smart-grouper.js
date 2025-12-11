/**
 * Smart Grouper Service
 * Detecta colores automáticamente en nombres de archivos y agrupa productos
 */

// Lista completa de colores en español (singular y plural, variaciones comunes)
const COLORS_ES = [
    // Básicos
    'rojo', 'roja', 'rojos', 'rojas',
    'azul', 'azules',
    'verde', 'verdes',
    'amarillo', 'amarilla', 'amarillos', 'amarillas',
    'negro', 'negra', 'negros', 'negras',
    'blanco', 'blanca', 'blancos', 'blancas',
    'gris', 'grises',
    'rosa', 'rosas', 'rosado', 'rosada',
    'morado', 'morada', 'morados', 'moradas',
    'naranja', 'naranjas', 'anaranjado', 'anaranjada',
    'cafe', 'café', 'marron', 'marrón', 'brown',
    'beige', 'beis', 'crema',

    // Tonos de azul
    'celeste', 'celestes',
    'turquesa',
    'aqua', 'agua',
    'marino', 'marina', 'navy',
    'azulino', 'azulina',
    'cobalto',
    'indigo', 'índigo',

    // Tonos de rosa/rojo
    'fucsia', 'fucsias',
    'magenta',
    'coral',
    'salmon', 'salmón',
    'vino', 'vinotinto', 'burdeos', 'burgundy',
    'cereza',
    'carmesi', 'carmesí',
    'escarlata',

    // Tonos de verde
    'oliva', 'olivo', 'olive',
    'menta', 'mint',
    'esmeralda',
    'lima', 'lime',
    'jade',
    'musgo',
    'militar',
    'bosque', 'forest',

    // Metálicos
    'dorado', 'dorada', 'dorados', 'doradas', 'oro', 'gold',
    'plateado', 'plateada', 'plateados', 'plateadas', 'plata', 'silver',
    'bronce', 'bronze',
    'cobre', 'copper',
    'metalico', 'metálico',

    // Neutros y otros
    'hueso', 'ivory', 'marfil',
    'chocolate',
    'caramelo',
    'mostaza', 'mustard',
    'terracota',
    'lila', 'lavanda', 'lavender',
    'violeta', 'violet', 'violetas',
    'purpura', 'púrpura', 'purple',
    'ocre',
    'arena', 'sand',
    'nude',
    'natural',
    'multicolor', 'multi',

    // Patrones (tratados como "color" para agrupación)
    'animal', 'leopardo', 'zebra', 'cebra', 'tigre',
    'floral', 'flores',
    'rayas', 'rayado', 'striped',
    'cuadros', 'plaid', 'checkered',
    'lunares', 'polka',
    'estampado', 'print'
];

// Colores compuestos (dos palabras)
const COMPOUND_COLORS = [
    'azul marino', 'azul cielo', 'azul rey', 'azul electrico', 'azul eléctrico',
    'azul petroleo', 'azul petróleo', 'azul oscuro', 'azul claro',
    'verde militar', 'verde oliva', 'verde menta', 'verde esmeralda',
    'verde oscuro', 'verde claro', 'verde limón', 'verde limon',
    'rojo vino', 'rojo cereza', 'rojo oscuro', 'rojo claro',
    'rosa pastel', 'rosa chicle', 'rosa palo', 'rosa viejo',
    'gris oscuro', 'gris claro', 'gris perla', 'gris oxford',
    'marron oscuro', 'marrón oscuro', 'marron claro', 'marrón claro',
    'blanco hueso', 'blanco roto', 'blanco perla',
    'negro mate', 'negro brillante',
    'oro rosa', 'rose gold'
];

// Mapa de tipos de producto → Categoría (singular → plural)
// Usamos la primera palabra del nombre para determinar la categoría
const PRODUCT_TYPE_TO_CATEGORY = {
    // Ropa superior
    'camisa': 'Camisas',
    'camiseta': 'Camisetas',
    'blusa': 'Blusas',
    'polo': 'Polos',
    'sueter': 'Suéteres',
    'sweater': 'Suéteres',
    'chaqueta': 'Chaquetas',
    'jacket': 'Chaquetas',
    'buzo': 'Buzos',
    'hoodie': 'Buzos',
    'chompa': 'Chompas',
    'top': 'Tops',
    'crop': 'Tops',
    'chaleco': 'Chalecos',
    'blazer': 'Blazers',
    'saco': 'Sacos',

    // Ropa inferior
    'pantalon': 'Pantalones',
    'jean': 'Jeans',
    'jeans': 'Jeans',
    'short': 'Shorts',
    'bermuda': 'Bermudas',
    'falda': 'Faldas',
    'leggins': 'Leggins',
    'legging': 'Leggins',

    // Conjuntos y vestidos
    'conjunto': 'Conjuntos',
    'set': 'Conjuntos',
    'vestido': 'Vestidos',
    'enterizo': 'Enterizos',
    'overol': 'Overoles',
    'mameluco': 'Mamelucos',
    'pijama': 'Pijamas',

    // Accesorios
    'morral': 'Morrales',
    'bolso': 'Bolsos',
    'cartera': 'Carteras',
    'mochila': 'Mochilas',
    'maleta': 'Maletas',
    'billetera': 'Billeteras',
    'cinturon': 'Cinturones',
    'correa': 'Correas',
    'gorra': 'Gorras',
    'sombrero': 'Sombreros',
    'bufanda': 'Bufandas',
    'pañuelo': 'Pañuelos',
    'gafas': 'Gafas',
    'lentes': 'Lentes',
    'reloj': 'Relojes',
    'collar': 'Collares',
    'pulsera': 'Pulseras',
    'anillo': 'Anillos',
    'aretes': 'Aretes',
    'arete': 'Aretes',

    // Calzado
    'zapato': 'Zapatos',
    'tenis': 'Tenis',
    'zapatilla': 'Zapatillas',
    'sandalia': 'Sandalias',
    'bota': 'Botas',
    'botin': 'Botines',
    'chancla': 'Chanclas',
    'tacones': 'Tacones',
    'tacon': 'Tacones',

    // Ropa interior
    'boxer': 'Boxers',
    'calzon': 'Calzones',
    'brasier': 'Brasieres',
    'bra': 'Brasieres',
    'media': 'Medias',
    'calcetín': 'Calcetines',
    'calcetin': 'Calcetines',

    // Otros
    'body': 'Bodys',
    'bikini': 'Bikinis',
    'traje': 'Trajes',
    'corbata': 'Corbatas',
    'guante': 'Guantes',
    'mascara': 'Máscaras',
    'gorro': 'Gorros'
};

/**
 * Extrae la categoría de la primera palabra del nombre del producto
 * @param {string} productName - Nombre del producto
 * @returns {string} - Categoría detectada o 'General'
 */
export function extractCategoryFromName(productName) {
    if (!productName) return 'General';

    const normalized = normalize(productName);
    const words = normalized.split(' ');

    // Buscar en las primeras 2 palabras
    for (let i = 0; i < Math.min(2, words.length); i++) {
        const word = words[i];
        if (PRODUCT_TYPE_TO_CATEGORY[word]) {
            return PRODUCT_TYPE_TO_CATEGORY[word];
        }
    }

    // Si no encontramos match, usar la primera palabra capitalizada + 's'
    const firstWord = words[0];
    if (firstWord && firstWord.length > 2) {
        // Agregar 's' o 'es' según la última letra
        const lastChar = firstWord.slice(-1);
        let plural;
        if (['a', 'e', 'i', 'o', 'u'].includes(lastChar)) {
            plural = firstWord + 's';
        } else {
            plural = firstWord + 'es';
        }
        return capitalize(plural);
    }

    return 'General';
}

/**
 * Normaliza un string para comparación
 * Remueve acentos, convierte a minúsculas, reemplaza separadores
 */
function normalize(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[-_\.]/g, ' ')          // Separadores a espacios
        .replace(/\s+/g, ' ')             // Múltiples espacios a uno
        .trim();
}

/**
 * Capitaliza la primera letra de cada palabra
 */
function capitalize(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Extrae el color del nombre de un archivo
 * @param {string} fileName - Nombre del archivo (sin extensión)
 * @returns {{ baseName: string, color: string|null, originalColor: string|null }}
 */
export function extractColorFromName(fileName) {
    const normalized = normalize(fileName);
    const words = normalized.split(' ');

    // 1. Primero buscar colores compuestos (2 palabras) al final
    if (words.length >= 2) {
        const lastTwo = words.slice(-2).join(' ');
        for (const compound of COMPOUND_COLORS) {
            if (normalize(compound) === lastTwo) {
                const baseName = words.slice(0, -2).join(' ');
                return {
                    baseName: baseName || fileName,
                    color: capitalize(compound),
                    originalColor: lastTwo
                };
            }
        }
    }

    // 2. Buscar color simple al final
    const lastWord = words[words.length - 1];
    for (const color of COLORS_ES) {
        if (normalize(color) === lastWord) {
            const baseName = words.slice(0, -1).join(' ');
            return {
                baseName: baseName || fileName,
                color: capitalize(color),
                originalColor: lastWord
            };
        }
    }

    // 3. Buscar color en cualquier posición (menos preciso, pero útil)
    for (let i = words.length - 1; i >= Math.max(0, words.length - 3); i--) {
        const word = words[i];
        for (const color of COLORS_ES) {
            if (normalize(color) === word) {
                // Solo aceptar si está entre las últimas 3 palabras
                const baseName = [...words.slice(0, i), ...words.slice(i + 1)].join(' ');
                return {
                    baseName: baseName || fileName,
                    color: capitalize(color),
                    originalColor: word
                };
            }
        }
    }

    // No se encontró color
    return {
        baseName: normalized,
        color: null,
        originalColor: null
    };
}

/**
 * Agrupa imágenes por producto basándose en el nombre base
 * @param {Array} images - Array de objetos { fileName, category, imageBuffer, ... }
 * @returns {Map<string, Object>} - Mapa de grupos de productos
 */
export function groupImagesByProduct(images) {
    const groups = new Map();

    for (const image of images) {
        // Obtener nombre sin extensión
        const fileNameWithoutExt = image.fileName
            .replace(/\.[^/.]+$/, '')  // Quitar extensión
            .split(/[\/\\]/).pop();    // Solo el nombre, sin path

        const { baseName, color } = extractColorFromName(fileNameWithoutExt);
        const displayName = capitalize(baseName.replace(/[-_]/g, ' '));

        // Detectar categoría: primero usar la del ZIP, si no, detectar del nombre
        let category = image.category;
        if (!category || category === 'Sin Categoría' || category === 'General') {
            // Detectar categoría de la primera palabra del nombre del producto
            category = extractCategoryFromName(displayName);
        }

        // Usar categoría + nombre base como clave de grupo
        const groupKey = `${category.toUpperCase()}::${baseName.toUpperCase()}`;

        if (!groups.has(groupKey)) {
            groups.set(groupKey, {
                category: category,
                baseName: baseName,
                displayName: displayName,
                variants: [],
                colors: new Set()
            });
        }

        const group = groups.get(groupKey);
        group.variants.push({
            ...image,
            detectedColor: color
        });

        if (color) {
            group.colors.add(color);
        }
    }

    return groups;
}

/**
 * Genera un resumen de los grupos para preview
 * @param {Map} groups - Resultado de groupImagesByProduct
 * @returns {Array} - Array de objetos para mostrar en UI
 */
export function generateGroupingSummary(groups) {
    const summary = [];

    for (const [key, group] of groups) {
        summary.push({
            groupKey: key,
            name: group.displayName,
            category: group.category,
            imageCount: group.variants.length,
            colors: Array.from(group.colors),
            firstImage: group.variants[0]?.fileName
        });
    }

    return summary.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

export default {
    extractColorFromName,
    extractCategoryFromName,
    groupImagesByProduct,
    generateGroupingSummary,
    COLORS_ES,
    COMPOUND_COLORS,
    PRODUCT_TYPE_TO_CATEGORY
};
