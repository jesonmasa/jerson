/**
 * Servicio de Email - Híbrido (Resend + Gmail)
 * Prioridad: Resend (Si existe RESEND_API_KEY) > Gmail (Nodemailer)
 */

import nodemailer from 'nodemailer';

// CONFIGURACIÓN NODEMAILER (GMAIL)
// Se usa como fallback si no hay Resend, o si el usuario prefiere Gmail.
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        // Fallback a credenciales directas si no hay variables de entorno
        user: process.env.EMAIL_USER || 'fonsecakiran@gmail.com',
        pass: process.env.EMAIL_PASS || 'tclebejcfxkyodws' // Contraseña sin espacios
    }
});

// ==========================================
// 1. MÉTODO: RESEND (Recomendado)
// ==========================================
async function sendViaResend({ to, subject, html, text }) {
    console.log('⚡ Intentando enviar vía Resend API...');

    if (!process.env.RESEND_API_KEY) {
        throw new Error('No hay RESEND_API_KEY configurada');
    }

    // Si estamos en modo prueba (sin dominio), Resend solo permite enviar a un email verificado.
    // Usaremos el email "from" configurado o el de onboarding si no hay dominio.
    const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: `URA MARKET <${fromEmail}>`,
                to: [to],
                subject: subject,
                html: html,
                text: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error en API Resend');
        }

        console.log(`✅ Email enviado por Resend ID: ${data.id}`);
        return { success: true, id: data.id, provider: 'resend' };

    } catch (error) {
        console.error('❌ Falló Resend:', error.message);
        throw error; // Re-lanzar para que el fallback de Gmail lo intente
    }
}

// ==========================================
// 2. MÉTODO: GMAIL (Fallback)
// ==========================================
async function sendViaGmail({ to, subject, html, text }) {
    console.log('⚡ Intentando enviar vía Gmail (Nodemailer)...');

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return { success: false, error: 'Faltan credenciales de Gmail (EMAIL_USER / EMAIL_PASS)' };
    }

    try {
        // Envolver en una promesa con timeout de 15 segundos
        const sendPromise = transporter.sendMail({
            from: `"URA MARKET" <${process.env.EMAIL_USER || 'fonsecakiran@gmail.com'}>`, // Asegurar remitente
            to: to,
            subject: subject,
            html: html,
            text: text
        });

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Tiempo de espera agotado al enviar email (Gmail)')), 15000)
        );

        const info = await Promise.race([sendPromise, timeoutPromise]);

        console.log(`✅ Email enviado por Gmail ID: ${info.messageId}`);
        return { success: true, id: info.messageId, provider: 'gmail' };

    } catch (error) {
        console.error('❌ Falló Gmail:', error);
        return { success: false, error: error.message };
    }
}

// ==========================================
// FUNCIÓN PRINCIPAL
// ==========================================
async function sendEmail(params) {
    // 1. Intentar Resend primero si hay API KEY
    if (process.env.RESEND_API_KEY) {
        try {
            return await sendViaResend(params);
        } catch (error) {
            console.warn('⚠️ Falló Resend, intentando fallback a Gmail...');
        }
    }

    // 2. Fallback a Gmail
    return await sendViaGmail(params);
}

// ==========================================
// PLANTILLAS
// ==========================================

export async function sendVerificationEmail(email, code, name = '') {
    const subject = `🔐 Código de verificación`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h1 style="color: #E53E3E;">URA MARKET</h1>
            <p>Hola ${name || 'Usuario'}, usa este código para verificar tu cuenta:</p>
            <div style="background: #f4f4f4; padding: 20px; font-size: 32px; letter-spacing: 5px; font-weight: bold; text-align: center; border-radius: 8px; margin: 20px 0;">
                ${code}
            </div>
            <p style="color: #666; font-size: 14px;">Este código expira en 15 minutos.</p>
        </div>
    `;
    return await sendEmail({ to: email, subject, html, text: `Tu código es: ${code}` });
}

export async function sendWelcomeEmail(email, name, storeName) {
    const subject = `🎉 Bienvenido/a a URA MARKET`;
    const html = `<h1>Bienvenido ${name}</h1><p>Tu tienda ${storeName} ha sido creada correctamente.</p>`;
    return await sendEmail({ to: email, subject, html, text: `Bienvenido a URA MARKET` });
}

export async function sendOrderNotification(email, orderData) {
    return await sendEmail({ to: email, subject: `Nuevo Pedido #${orderData.orderId}`, html: `<p>Tienes un nuevo pedido.</p>`, text: `Nuevo pedido` });
}

export async function sendPendingDeliveryNotification(shipment, order) {
    const clientEmail = order.customer?.email || order.email;
    if (!clientEmail) return;
    return await sendEmail({ to: clientEmail, subject: `Tu pedido está en camino`, html: `<p>Tu pedido va en camino.</p>`, text: `Tu pedido va en camino` });
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendOrderNotification,
    sendPendingDeliveryNotification
};
