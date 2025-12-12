
const https = require('https');

const data = JSON.stringify({
    email: 'jersonmasa7+cloudtest3@gmail.com',
    password: 'TestPassword123!',
    name: 'Cloud Tester'
});

const options = {
    hostname: 'jerson-backend.vercel.app',
    path: '/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Enviando solicitud a:', options.hostname + options.path);

const req = https.request(options, (res) => {
    console.log(`Estado: ${res.statusCode}`);

    let responseBody = '';
    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Respuesta:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
