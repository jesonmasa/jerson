
// Native fetch is used

const API_URL = 'http://localhost:3001/api/pages/main';

async function testBackend() {
    console.log('Testing Backend API...');

    // 1. GET current page
    try {
        console.log('1. GET /api/pages/main');
        const res = await fetch(API_URL);
        if (res.ok) {
            const data = await res.json();
            console.log('   Success! Data:', data ? 'Found' : 'Empty');
        } else {
            console.log('   Failed:', res.status, res.statusText);
        }
    } catch (err) {
        console.log('   Error:', err.message);
    }

    // 2. POST new page data
    try {
        console.log('2. POST /api/pages/main');
        const payload = {
            html: '<h1>Test Page</h1><p>Created by test script</p>',
            css: 'h1 { color: red; }'
        };
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            console.log('   Success! Response:', data);
        } else {
            console.log('   Failed:', res.status, res.statusText);
            const text = await res.text();
            console.log('   Error details:', text);
        }
    } catch (err) {
        console.log('   Error:', err.message);
    }

    // 3. GET page again to verify
    try {
        console.log('3. GET /api/pages/main (Verification)');
        const res = await fetch(API_URL);
        if (res.ok) {
            const data = await res.json();
            console.log('   Success! Data matches:', data.html.includes('Test Page'));
        } else {
            console.log('   Failed:', res.status, res.statusText);
        }
    } catch (err) {
        console.log('   Error:', err.message);
    }
}

testBackend();
