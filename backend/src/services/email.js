/**
 * Servicio de Email usando Nodemailer (Gmail SMTP)
 * Garantiza la entrega al usar una cuenta real de Gmail.
 */

import nodemailer from 'nodemailer';

// Configuración de Gmail (Variables de entorno)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

async function sendEmail({ to, subject, html, text }) {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn('⚠️ Faltan credenciales de Gmail (EMAIL_USER / EMAIL_PASS) en Render.');
        return { success: false, error: 'Credenciales faltantes' };
    }

    try {
        console.log(`📤 Enviando email vía Gmail a ${to}...`);

        const info = await transporter.sendMail({
            from: `"Constructor App" <${EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
            text: text
        });

        console.log(`✅ Email enviado: ${info.messageId}`);
        return { success: true, id: info.messageId };

    } catch (error) {
        console.error('❌ Error Gmail:', error);
        return { success: false, error: error.message };
    }
}

// ==========================================
// FUNCIONES DE PLANTILLA (Iguales que antes)
// ==========================================

export async function sendVerificationEmail(email, code, name = '') {
    const subject = `🔐 Tu código de verificación: ${code}`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Hola ${name},</h2>
            <p>Tu código de verificación es:</p>
            <h1 style="background: #eee; padding: 10px; display: inline-block;">${code}</h1>
            <p>Este código expira en 15 minutos.</p>
        </div>
    `;
    return await sendEmail({ to: email, subject, html, text: `Tu código: ${code}` });
}

export async function sendWelcomeEmail(email, name, storeName) {
    const subject = `🎉 Bienvenido a Constructor`;
    return await sendEmail({
        to: email,
        subject,
        html: `<h1>Bienvenido ${name}!</h1><p>Tu tienda ${storeName} ha sido creada.</p>`,
        text: `Bienvenido a Constructor`
    });
}

export async function sendOrderNotification(email, orderData) {
    return await sendEmail({
        to: email,
        subject: `Nuevo Pedido #${orderData.orderId}`,
        html: `<p>Tienes un nuevo pedido.</p>`,
        text: `Tienes un nuevo pedido`
    });
}

export async function sendPendingDeliveryNotification(shipment, order) {
    const clientEmail = order.customer?.email || order.email;
    if (!clientEmail) return;
    return await sendEmail({
        to: clientEmail,
        subject: `Pedido en camino`,
        html: `<p>Tu pedido va en camino.</p>`,
        text: `Tu pedido va en camino`
    });
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendOrderNotification,
    sendPendingDeliveryNotification
};
