
import { sendVerificationEmail } from './services/email.js';

async function test() {
    console.log('Iniciando prueba de envío de email...');
    try {
        const result = await sendVerificationEmail('jersonmasa7@gmail.com', '123456', 'Jerson Test');
        console.log('Resultado:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
