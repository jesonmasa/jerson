
import 'dotenv/config';
import { uploadImage } from './src/services/cloudinary.js';

// 1x1 Red Pixel PNG
const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwftQAAAABJRU5ErkJggg==";

(async () => {
    try {
        console.log("🚀 Starting Bulk Upload Simulation...");
        // This functionality matches exactly what bulk-upload.js does
        const result = await uploadImage(base64Image, {
            public_id: 'test_bulk_sim_' + Date.now(),
            folder: 'test_folder',
            // format: 'webp', // Removed in production code
            quality: 'auto',
            transformation: 'c_limit,w_1000'
        });

        console.log("\n✅ Upload Result:");
        console.log("URL:", result.url);

    } catch (error) {
        console.error("❌ Test Failed:", error);
        process.exit(1);
    }
})();
