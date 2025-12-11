
import dotenv from 'dotenv';
dotenv.config(); // Cargar .env

import { uploadImage } from './src/services/cloudinary.js';

async function testUpload() {
    console.log('--- TEST CLOUDINARY ---');
    console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '*******' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING');
    console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '*******' : 'MISSING');

    // Imagen base64 de un pixel rojo de 1x1
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    try {
        console.log('Subiendo imagen de prueba...');
        const result = await uploadImage(base64Image, {
            folder: 'test_folder',
            public_id: 'test_upload_' + Date.now()
        });

        console.log('✅ ÉXITO! Imagen subida.');
        console.log('URL:', result.url || result.secure_url);
        console.log('Public ID:', result.public_id);
    } catch (error) {
        console.error('❌ ERROR AL SUBIR:', error);
        console.error('Detalles:', error.message);
    }
}

testUpload();
