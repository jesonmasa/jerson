
const http = require('http');
const fs = require('fs');
const path = require('path');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
const filePath = path.join(__dirname, 'test_payload.zip');

if (!fs.existsSync(filePath)) {
    console.error("Run create_test_zip.ps1 first!");
    process.exit(1);
}

const fileData = fs.readFileSync(filePath);

const postDataStart = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.zip"\r\nContent-Type: application/zip\r\n\r\n`);
const postDataEnd = Buffer.from(`\r\n--${boundary}--\r\n`);

const postData = Buffer.concat([postDataStart, fileData, postDataEnd]);

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/bulk-upload/preview',
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': postData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(postData);
req.end();
