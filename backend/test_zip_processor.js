import { processZipFile } from './src/services/zip-processor.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zipPath = path.resolve(__dirname, 'test_payload.zip');

console.log('Testing zip processing on:', zipPath);

processZipFile(zipPath)
    .then(res => console.log('Success:', res))
    .catch(err => {
        if (err.message.includes('No se encontraron imágenes')) {
            console.log('TEST PASSED: Extraction worked, but no images found (expected).');
        } else {
            console.error('TEST FAILED:', err);
        }
    });
