
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { processZipBuffer } from './src/services/zip-processor.js';
import { uploadImage } from './src/services/cloudinary.js';

// Setup paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_PATH = 'C:/Users/Usuario/.gemini/antigravity/brain/1c2631f3-4ac3-4f75-822d-c16f0c20461d/uploaded_image_1765386127167.png';
const ZIP_OUTPUT_PATH = path.join(__dirname, 'verification_test.zip');

async function runVerification() {
    console.log('🧪 Starting Bulk Upload Verification...');

    try {
        // 1. Create a ZIP file programmatically
        console.log('📦 Creating Test ZIP...');
        const zip = new AdmZip();

        // Add the test image multiple times to simulate products
        // We'll mimic the folder structure for categories
        // "Zapatillas/Nike Air.png"
        // "Camisetas/Adidas Logo.png"

        if (!fs.existsSync(IMAGE_PATH)) {
            throw new Error(`Test image not found at ${IMAGE_PATH}`);
        }

        zip.addLocalFile(IMAGE_PATH, 'Zapatillas', 'Nike Air.png');
        zip.addLocalFile(IMAGE_PATH, 'Camisetas', 'Adidas Logo.png');

        zip.writeZip(ZIP_OUTPUT_PATH);
        console.log(`✅ ZIP created at ${ZIP_OUTPUT_PATH}`);

        // 2. Simulate the Bulk Upload Logic (Extraction)
        console.log('🔓 Testing Extraction Logic...');
        const zipBuffer = fs.readFileSync(ZIP_OUTPUT_PATH);

        const result = await processZipBuffer(zipBuffer);

        console.log(`📂 Extracted ${result.totalImages} images.`);

        if (result.totalImages !== 2) {
            throw new Error(`Expected 2 images, found ${result.totalImages}`);
        }

        // 3. Simulate Cloudinary Upload for one item
        console.log('☁️ Testing Cloudinary Integration for first item...');
        const firstItem = result.products[0];
        console.log(`   Uploading: ${firstItem.name} (${firstItem.category})`);

        const uploadResult = await uploadImage(firstItem.image.base64, {
            folder: 'test_bulk_verification',
            public_id: `verify_${Date.now()}`
        });

        console.log(`✅ Upload Success! URL: ${uploadResult.url}`);
        console.log('✨ Verification Complete: System correctly extracts ZIP and uploads to Cloudinary.');

    } catch (error) {
        console.error('❌ Verification Failed:', error);
    } finally {
        // Cleanup
        if (fs.existsSync(ZIP_OUTPUT_PATH)) {
            fs.unlinkSync(ZIP_OUTPUT_PATH);
        }
    }
}

runVerification();
