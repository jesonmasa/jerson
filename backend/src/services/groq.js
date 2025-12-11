/**
 * Groq AI Integration Module (Native - No NPM)
 * Interactúa con la API de Groq para análisis de imágenes
 */

import https from 'https';

// Configuración
const GROQ_CONFIG = {
    apiKey: process.env.GROQ_API_KEY,
    model: 'meta-llama/llama-4-scout-17b-16e-instruct' // Modelo Llama 4 Scout actualizado
};

// Verificar que la configuración esté presente
if (!GROQ_CONFIG.apiKey) {
    console.warn('⚠️ Groq API Key not set. AI image analysis will not work. Set GROQ_API_KEY in .env if needed.');
} else {
    console.log('✅ Groq configured securely from environment variables');
}

/**
 * Analiza una imagen usando Groq Vision
 * @param {string} imageInput - URL pública de la imagen O base64 data URL
 * @returns {Promise<Object>} - Resultado del análisis (categoría, nombre, etc.)
 */
export async function analyzeImage(imageInput) {
    return new Promise((resolve, reject) => {
        // Determinar si es base64 o URL
        const isBase64 = imageInput.startsWith('data:image/');
        const imageUrl = isBase64 ? imageInput : imageInput;

        const prompt = `
            Analiza esta imagen para un E-commerce.
            Devuelve SOLO un objeto JSON (sin markdown, sin explicaciones) con este formato:
            {
                "category": "Categoría > Subcategoría sugerida (Ej: Calzado > Deportivo)",
                "productName": "Nombre del producto optimizado para SEO (corto y descriptivo)",
                "seoFileName": "nombre-archivo-seo-friendly (kebab-case, sin extensión)",
                "description": "Descripción corta y atractiva para venta",
                "altText": "Texto alternativo descriptivo para accesibilidad",
                "attributes": {
                    "color": "Color principal",
                    "material": "Material inferido",
                    "style": "Estilo inferido"
                }
            }
        `;

        const postData = JSON.stringify({
            model: GROQ_CONFIG.model,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        { type: "image_url", image_url: { url: imageUrl } }
                    ]
                }
            ],
            temperature: 0.1, // Baja temperatura para respuestas más deterministas y JSON válido
            max_tokens: 1024,
            response_format: { type: "json_object" } // Forzar JSON
        });

        const requestOptions = {
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_CONFIG.apiKey}`,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(requestOptions, (res) => {
            let data = '';

            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);

                    if (result.error) {
                        console.error('❌ Groq API Error:', result.error);
                        // No fallar toda la subida si falla la IA, devolver null
                        resolve(null);
                        return;
                    }

                    if (result.choices && result.choices.length > 0) {
                        const content = result.choices[0].message.content;
                        try {
                            const jsonContent = JSON.parse(content);
                            console.log('🧠 Groq Analysis:', JSON.stringify(jsonContent, null, 2));
                            resolve(jsonContent);
                        } catch (e) {
                            console.error('❌ Error parsing Groq JSON content:', e);
                            resolve(null);
                        }
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    console.error('❌ Error parsing Groq response:', e);
                    resolve(null);
                }
            });
        });

        req.on('error', (e) => {
            console.error('❌ Network Error (Groq):', e.message);
            resolve(null); // Fail gracefully
        });

        req.write(postData);
        req.end();
    });
}

export default {
    analyzeImage
};
