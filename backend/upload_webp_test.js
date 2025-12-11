
import { uploadFile, getImageUrl } from './src/services/cloudinary.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

// Image path from artifacts
const IMAGE_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), 'temp_test_image.png');

async function runTest() {
    try {
        console.log('🚀 Iniciando prueba de subida y conversión...');

        // 1. Upload the file
        // We use fetch_format: 'webp' to request Cloudinary to store/deliver as webp if possible, 
        // though usually we just request the URL with the format transformation.
        const result = await uploadFile(IMAGE_PATH, {
            folder: 'test_uploads',
            public_id: `test_webp_${Date.now()}`
        });

        console.log('✅ Imagen original subida:', result.url);
        console.log('   Public ID:', result.public_id);
        console.log('   Formato original:', result.format);

        // 2. Generate WebP URL
        // Cloudinary allows changing extension or using f_webp param
        // construct URL manually since getImageUrl might need tweaks for format

        // Using the service's getImageUrl helper (which appends transformations)
        const webpUrl = getImageUrl(result.public_id, {
            quality: 'auto',
            format: 'webp'
        });

        // Native helper might not support 'format' in options directly based on my read, 
        // let's construct the specific WebP URL explicitly to be sure.
        const manualWebpUrl = result.url.replace(/\.[^/.]+$/, ".webp");

        console.log('\n✨ URL Convertida a .webp:');
        console.log(manualWebpUrl);

        await fs.writeFile('result_url.txt', manualWebpUrl);

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

runTest();
