/**
 * Servicio de Email - MODO GMAIL FORZADO (URA MARKET)
 */

import nodemailer from 'nodemailer';

// CREDENCIALES INCRUSTADAS (HARDCODED)
// Esto asegura que funcione sin variables de entorno.
const FORCE_USER = 'fonsecakiran@gmail.com';
const FORCE_PASS = 'tcle bejc fxky odws';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: FORCE_USER,
        pass: FORCE_PASS
    }
});

async function sendEmail({ to, subject, html, text }) {
    console.log('⚡ INTENTANDO ENVIAR EMAIL REAL VÍA GMAIL...');
    console.log(`   De: ${FORCE_USER}`);
    console.log(`   Para: ${to}`);

    try {
        const info = await transporter.sendMail({
            from: `"URA MARKET" <${FORCE_USER}>`,
            to: to,
            subject: subject,
            html: html,
            text: text
        });

        console.log(`✅✅✅ EMAIL ENVIADO EXITOSAMENTE ✅✅✅`);
        console.log(`🆔 Message ID: ${info.messageId}`);
        return { success: true, id: info.messageId };

    } catch (error) {
        console.error('❌❌❌ ERROR FATAL GMAIL:', error);
        return { success: false, error: error.message };
    }
}

// PLANTILLAS URA MARKET

export async function sendVerificationEmail(email, code, name = '') {
    const subject = `🔐 Código de verificación - URA MARKET`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #E53E3E; text-align: center;">URA MARKET</h1>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                <h2>Hola ${name || 'Usuario'},</h2>
                <p>Tu código de verificación es:</p>
                <div style="background: #E53E3E; color: white; padding: 15px; font-size: 32px; font-weight: bold; border-radius: 5px; display: inline-block; margin: 20px 0;">
                    ${code}
                </div>
                <p style="color: #666; font-size: 12px;">Expira en 15 minutos.</p>
            </div>
            <p style="text-align: center; color: #999; font-size: 10px; margin-top: 20px;">© URA MARKET</p>
        </div>
    `;
    return await sendEmail({ to: email, subject, html, text: `Tu código: ${code}` });
}

export async function sendWelcomeEmail(email, name, storeName) {
    const subject = `🎉 Bienvenido a URA MARKET`;
    const html = `<h1 style="color: #E53E3E;">URA MARKET</h1><p>Bienvenido ${name}, tu tienda ${storeName} está lista.</p>`;
    return await sendEmail({ to: email, subject, html, text: `Bienvenido a URA MARKET` });
}

export async function sendOrderNotification(email, orderData) {
    return await sendEmail({ to: email, subject: `Nuevo Pedido #${orderData.orderId}`, html: `<p>Nuevo pedido</p>`, text: `Nuevo pedido` });
}

export async function sendPendingDeliveryNotification(shipment, order) {
    const clientEmail = order.customer?.email || order.email;
    if (!clientEmail) return;
    return await sendEmail({ to: clientEmail, subject: `Pedido en camino`, html: `<p>Tu pedido va en camino</p>`, text: `Tu pedido va en camino` });
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendOrderNotification,
    sendPendingDeliveryNotification
};
