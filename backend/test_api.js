import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const zipPath = path.resolve(__dirname, 'test_payload.zip');
const API_URL = 'http://localhost:3001/api/bulk-upload/preview';

async function testPreview() {
    console.log(`Testing API: ${API_URL}`);
    console.log(`File: ${zipPath}`);

    if (!fs.existsSync(zipPath)) {
        console.error('Test zip not found. Run create_test_zip.ps1 first.');
        return;
    }

    try {
        const form = new FormData();
        form.append('file', fs.createReadStream(zipPath));

        const response = await fetch(API_URL, {
            method: 'POST',
            body: form
        });

        console.log(`Response Status: ${response.status} ${response.statusText}`);

        const text = await response.text();
        console.log('Response Body:', text);

    } catch (error) {
        console.error('FETCH ERROR:', error);
    }
}

testPreview();
