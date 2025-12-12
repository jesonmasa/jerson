/**
 * Servicio de Email - SIMPLE Y DIRECTO
 * Usa Nodemailer con Gmail SMTP
 */

import nodemailer from 'nodemailer';

// CONFIGURACIÓN NODEMAILER (GMAIL) - SIMPLE Y DIRECTO
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || 'fonsecakiran@gmail.com',
        pass: process.env.EMAIL_PASS || 'tclebejcfxkyodws'
    }
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error de conexión SMTP:', error.message);
    } else {
        console.log('✅ Servidor SMTP listo para enviar emails');
    }
});

// ==========================================
// FUNCIÓN PRINCIPAL DE ENVÍO
// ==========================================
async function sendEmail({ to, subject, html, text }) {
    console.log(`📧 Enviando email a: ${to}`);
    console.log(`📧 Asunto: ${subject}`);

    try {
        const mailOptions = {
            from: `URA MARKET <${process.env.EMAIL_USER || 'fonsecakiran@gmail.com'}>`,
            to: to,
            subject: subject,
            html: html,
            text: text || 'Email de URA MARKET'
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado exitosamente:', result.messageId);
        return { success: true, id: result.messageId, provider: 'nodemailer-gmail' };

    } catch (error) {
        console.error('❌ Error enviando email:', error.message);
        console.error('❌ Detalles del error:', error);
        return { success: false, error: error.message };
    }
}

// ==========================================
// PLANTILLAS DE EMAIL
// ==========================================

export async function sendVerificationEmail(email, code, name = '') {
    console.log(`🔐 Enviando código de verificación a: ${email}`);

    const subject = `🔐 Tu código de verificación: ${code}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">URA MARKET</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                <p style="font-size: 18px; color: #333;">Hola <strong>${name || 'Usuario'}</strong>,</p>
                <p style="color: #666; font-size: 16px;">Usa el siguiente código para verificar tu cuenta:</p>
                
                <div style="background: #f8f8f8; padding: 25px; text-align: center; border-radius: 10px; margin: 30px 0; border: 2px dashed #E53E3E;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #E53E3E;">${code}</span>
                </div>
                
                <p style="color: #999; font-size: 14px; text-align: center;">Este código expira en <strong>15 minutos</strong>.</p>
                <p style="color: #999; font-size: 12px; text-align: center; margin-top: 30px;">Si no solicitaste este código, ignora este mensaje.</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                © 2025 URA MARKET - Todos los derechos reservados
            </div>
        </div>
    `;

    return await sendEmail({
        to: email,
        subject,
        html,
        text: `Tu código de verificación es: ${code}. Este código expira en 15 minutos.`
    });
}

export async function sendWelcomeEmail(email, name, storeName) {
    const subject = `🎉 ¡Bienvenido/a a URA MARKET!`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">¡Bienvenido/a!</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                <p style="font-size: 18px;">Hola <strong>${name}</strong>,</p>
                <p>Tu tienda <strong>${storeName}</strong> ha sido creada exitosamente.</p>
                <p>¡Comienza a vender hoy!</p>
            </div>
        </div>
    `;
    return await sendEmail({ to: email, subject, html, text: `Bienvenido ${name} a URA MARKET` });
}

export async function sendPasswordResetEmail(email, code, name = '') {
    console.log(`🔑 Enviando código de recuperación a: ${email}`);

    const subject = `🔑 Recupera tu contraseña - Código: ${code}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #E53E3E 0%, #C53030 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Recuperar Contraseña</h1>
            </div>
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
                <p style="font-size: 18px;">Hola <strong>${name || 'Usuario'}</strong>,</p>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                
                <div style="background: #f8f8f8; padding: 25px; text-align: center; border-radius: 10px; margin: 30px 0; border: 2px dashed #E53E3E;">
                    <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #E53E3E;">${code}</span>
                </div>
                
                <p style="color: #999; font-size: 14px; text-align: center;">Este código expira en <strong>15 minutos</strong>.</p>
            </div>
        </div>
    `;

    return await sendEmail({
        to: email,
        subject,
        html,
        text: `Tu código para recuperar tu contraseña es: ${code}`
    });
}

export async function sendOrderNotification(email, orderData) {
    return await sendEmail({
        to: email,
        subject: `📦 Nuevo Pedido #${orderData.orderId}`,
        html: `<p>Tienes un nuevo pedido.</p>`,
        text: `Nuevo pedido #${orderData.orderId}`
    });
}

export async function sendPendingDeliveryNotification(shipment, order) {
    const clientEmail = order.customer?.email || order.email;
    if (!clientEmail) return;
    return await sendEmail({
        to: clientEmail,
        subject: `🚚 Tu pedido está en camino`,
        html: `<p>Tu pedido va en camino.</p>`,
        text: `Tu pedido va en camino`
    });
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendOrderNotification,
    sendPendingDeliveryNotification
};
