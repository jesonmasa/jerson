/**
 * Servicio de Email usando Nodemailer (Gmail SMTP)
 * Garantiza la entrega al usar una cuenta real de Gmail.
 */

import nodemailer from 'nodemailer';

// Configuración de Gmail
// NOTA: Se usan credenciales directas como respaldo si fallan las variables de entorno
const EMAIL_USER = process.env.EMAIL_USER || 'fonsecakiran@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'tcle bejc fxky odws';

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
        // Remitente actualizado a URA MARKET
        console.log(`📤 Enviando email URA MARKET a ${to}...`);

        const info = await transporter.sendMail({
            from: `"URA MARKET" <${EMAIL_USER}>`,
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
// FUNCIONES DE PLANTILLA (URA MARKET)
// ==========================================

export async function sendVerificationEmail(email, code, name = '') {
    const subject = `🔐 Código de verificación - URA MARKET`;

    // Diseño del correo
    const html = `
        <div style="font-family: 'Segoe UI', sans-serif; padding: 40px; border: 1px solid #efefef; border-radius: 12px; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #E53E3E; margin: 0; font-size: 32px; letter-spacing: -1px;">URA <span style="color: #333; font-weight: normal;">MARKET</span></h1>
            </div>
            
            <div style="background-color: #fff9f9; padding: 30px; border-radius: 12px; border: 1px solid #ffebeb;">
                <h2 style="color: #333; margin-top: 0; font-size: 20px;">Hola ${name},</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    Estás a un paso de comenzar. Usa este código para verificar tu cuenta en URA MARKET:
                </p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <div style="background: #E53E3E; color: white; display: inline-block; padding: 15px 40px; font-size: 36px; font-weight: bold; border-radius: 8px; letter-spacing: 6px; box-shadow: 0 4px 10px rgba(229, 62, 62, 0.3);">
                        ${code}
                    </div>
                </div>
                
                <p style="color: #888; font-size: 14px; text-align: center;">
                    Este código de seguridad expira en 15 minutos.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #aaa; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
                &copy; ${new Date().getFullYear()} URA MARKET. Todos los derechos reservados.
            </div>
        </div>
    `;

    return await sendEmail({ to: email, subject, html, text: `Tu código URA MARKET es: ${code}` });
}

export async function sendWelcomeEmail(email, name, storeName) {
    const subject = `🎉 ¡Bienvenido a URA MARKET!`;
    const html = `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #E53E3E; text-align: center;">URA MARKET</h1>
            <h2>¡Hola ${name}! 👋</h2>
            <p>¡Felicidades! Tu cuenta ha sido creada exitosamente.</p>
            <p>Tu tienda <strong>${storeName}</strong> ya está lista en nuestra plataforma.</p>
            <br>
            <p>Atentamente,<br>El equipo de URA MARKET</p>
        </div>
    `;
    return await sendEmail({
        to: email,
        subject,
        html,
        text: `Bienvenido a URA MARKET, ${name}.`
    });
}

export async function sendOrderNotification(email, orderData) {
    return await sendEmail({
        to: email,
        subject: `🛒 Nuevo Pedido #${orderData.orderId} - URA MARKET`,
        html: `<p>Tienes un nuevo pedido en URA MARKET.</p>`,
        text: `Tienes un nuevo pedido`
    });
}

export async function sendPendingDeliveryNotification(shipment, order) {
    const clientEmail = order.customer?.email || order.email;
    if (!clientEmail) return;
    return await sendEmail({
        to: clientEmail,
        subject: `📦 Tu pedido va en camino - URA MARKET`,
        html: `<p>Tu pedido ${order.id} va en camino.</p>`,
        text: `Tu pedido va en camino`
    });
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendOrderNotification,
    sendPendingDeliveryNotification
};
