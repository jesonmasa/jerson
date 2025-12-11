
import 'dotenv/config';
import { uploadImage, deleteImage } from './src/services/cloudinary.js';

// 1x1 Red Pixel PNG
const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwftQAAAABJRU5ErkJggg==";

(async () => {
    try {
        console.log("🚀 Starting Real Upload Test (Backend Context)...");
        const result = await uploadImage(base64Image, {
            public_id: 'test_webp_conversion_v2'
        });

        console.log("\n✅ Upload Result:");
        console.log("URL:", result.url);
        console.log("Format:", result.format);
        console.log("Public ID:", result.public_id);

        let success = true;

        if (result.format === 'webp') {
            console.log("PASS: Format is webp");
        } else {
            console.error(`FAIL: Format is ${result.format}, expected webp`);
            success = false;
        }

        if (result.url.includes('q_auto') && result.url.includes('f_webp')) {
            console.log("PASS: URL contains optimization parameters (q_auto, f_webp)");
        } else {
            console.error(`FAIL: URL does not contain optimization parameters. URL: ${result.url}`);
            success = false;
        }

        console.log("\n🧹 Cleaning up...");
        await deleteImage(result.public_id);
        console.log("Cleanup done.");

        if (!success) process.exit(1);

    } catch (error) {
        console.error("❌ Test Failed:", error);
        process.exit(1);
    }
})();
