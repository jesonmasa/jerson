/**
 * Servicio de Email usando Nodemailer (Gmail)
 * Envía correos reales para verificación y notificaciones.
 */

import nodemailer from 'nodemailer';

// Configuración de Gmail
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS; // Contraseña de App (NO tu contraseña normal)
const FROM_EMAIL = process.env.FROM_EMAIL || `"Constructor Platform" <${EMAIL_USER}>`;

// Crear el transportador (reusable)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

/**
 * Enviar email genérico
 */
async function sendEmail({ to, subject, html, text }) {
    if (!EMAIL_USER || !EMAIL_PASS) {
        console.warn('⚠️ Credenciales de Email (EMAIL_USER / EMAIL_PASS) no configuradas en el servidor.');
        console.log(`📧 [MOCK - NO SE ENVIÓ] Para: ${to} | Asunto: ${subject}`);
        console.log(`   Contenido: ${text}`);
        return { success: false, mock: true, error: 'Credenciales faltantes' };
    }

    try {
        const info = await transporter.sendMail({
            from: FROM_EMAIL,
            to,
            subject,
            html,
            text
        });

        console.log(`✅ Email enviado a ${to}: ${info.messageId}`);
        return { success: true, id: info.messageId };

    } catch (error) {
        console.error('❌ Error enviando email:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Enviar código de verificación por email
 */
export async function sendVerificationEmail(email, code, name = '') {
    const subject = `🔐 Tu código de verificación: ${code}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Constructor</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">Plataforma E-commerce</p>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1a1a2e; margin: 0 0 20px; font-size: 24px;">¡Hola${name ? ` ${name}` : ''}! 👋</h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Gracias por registrarte en Constructor. Usa el siguiente código para verificar tu cuenta:
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 30px; text-align: center; margin: 0 0 30px;">
                <span style="font-size: 36px; font-weight: 700; color: white; letter-spacing: 8px;">${code}</span>
            </div>
            
            <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                ⏰ Este código expira en <strong>15 minutos</strong>.
            </p>
            
            <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 0;">
                Si no solicitaste este código, puedes ignorar este email.
            </p>
        </div>
        
        <div style="text-align: center; padding: 30px 20px;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Constructor. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>
    `;

    const text = `
Hola${name ? ` ${name}` : ''}!

Tu código de verificación es: ${code}

Este código expira en 15 minutos.

Si no solicitaste este código, puedes ignorar este email.

- Constructor
    `;

    return await sendEmail({ to: email, subject, html, text });
}

/**
 * Enviar email de bienvenida después del registro
 */
export async function sendWelcomeEmail(email, name, storeName) {
    const subject = `🎉 ¡Bienvenido a Constructor, ${name}!`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px 16px 0 0; padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Bienvenido!</h1>
        </div>
        
        <div style="background: white; padding: 40px; border-radius: 0 0 16px 16px;">
            <h2 style="color: #1a1a2e; margin: 0 0 20px;">Hola ${name},</h2>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
                Tu cuenta ha sido creada exitosamente. Tu tienda "<strong>${storeName}</strong>" está lista para ser configurada.
            </p>
            
            <h3 style="color: #1a1a2e; margin: 30px 0 15px;">Próximos pasos:</h3>
            <ul style="color: #4a5568; font-size: 14px; line-height: 2;">
                <li>✅ Elige una plantilla para tu tienda</li>
                <li>📦 Sube tus productos</li>
                <li>🎨 Personaliza tu marca</li>
                <li>🚀 ¡Empieza a vender!</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5173" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: 600;">
                    Ir a mi Panel
                </a>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    return await sendEmail({ to: email, subject, html, text: `Bienvenido ${name}! Tu tienda ${storeName} está lista.` });
}

/**
 * Enviar notificación de nuevo pedido
 */
export async function sendOrderNotification(email, orderData) {
    const subject = `🛒 Nuevo pedido #${orderData.orderId}`;

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f7fa; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
        <h1 style="color: #1a1a2e;">🛒 Nuevo Pedido</h1>
        <p><strong>Pedido:</strong> #${orderData.orderId}</p>
        <p><strong>Cliente:</strong> ${orderData.customerName}</p>
        <p><strong>Total:</strong> ${orderData.total}</p>
        <p><strong>Items:</strong> ${orderData.itemCount} productos</p>
    </div>
</body>
</html>
    `;

    return await sendEmail({ to: email, subject, html, text: `Nuevo pedido #${orderData.orderId}` });
}

/**
 * Enviar notificación de pedido pendiente de entrega
 */
export async function sendPendingDeliveryNotification(shipment, order) {
    const subject = `📦 Seguimiento de tu pedido #${order.id}`;

    // Obtener email del cliente (del objeto order o shipment)
    const clientEmail = order.customer?.email || order.email || shipment.email;
    if (!clientEmail) {
        console.warn('⚠️ No se encontró email para enviar notificación de seguimiento');
        return { success: false, error: 'No email found' };
    }

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f7fa; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
        <h1 style="color: #1a1a2e;">📦 Estado de tu Envío</h1>
        <p>Hola,</p>
        <p>Tu pedido <strong>#${order.id}</strong> está en camino.</p>
        <p>Estado actual: <strong>${shipment.status === 'in_transit' ? 'En tránsito' : shipment.status}</strong></p>
        <p>Si tienes alguna duda, contáctanos.</p>
    </div>
</body>
</html>
    `;

    return await sendEmail({
        to: clientEmail,
        subject,
        html,
        text: `Tu pedido #${order.id} está en camino.`
    });
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendOrderNotification,
    sendPendingDeliveryNotification
};
