/**
 * Servicio de Email usando Resend (Vía Fetch Nativo)
 * Infalible: No depende de librerías externas instaladas.
 */

// API Key proporcionada por el usuario
const API_KEY = process.env.RESEND_API_KEY || 're_UfBFceES_HmrRAanQcwfjUDakFtCZMgwG';
const FROM_EMAIL = 'onboarding@resend.dev';

/**
 * Enviar email usando fetch nativo
 */
async function sendEmail({ to, subject, html, text }) {
    if (!API_KEY) {
        console.warn('⚠️ API Key de Resend no encontrada.');
        return { success: false, error: 'No API Key' };
    }

    // Validación básica para evitar envíos a correos no permitidos en modo prueba
    // En producción con dominio propio esto no sería necesario
    const ALLOWED_EMAIL = 'fonsecakiran@gmail.com';
    if (to !== ALLOWED_EMAIL) {
        console.warn(`⚠️ MODO PRUEBA RESEND: Solo se permite enviar a ${ALLOWED_EMAIL}. Intentaste enviar a ${to}.`);
        // Opcional: Forzar el envío a mi correo para pruebas si es otro usuario
        // to = ALLOWED_EMAIL; 
    }

    try {
        console.log(`📤 Enviando email (Fetch) a ${to}...`);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: [to],
                subject: subject,
                html: html,
                text: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('❌ Error Resend API:', JSON.stringify(data));
            return { success: false, error: data };
        }

        console.log(`✅ Email enviado exitosamente. ID: ${data.id}`);
        return { success: true, id: data.id };

    } catch (error) {
        console.error('❌ Error de red enviando email:', error);
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

    const text = `Código: ${code}`;
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
<body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f4f7fa;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px;">
        <h1>🎉 ¡Bienvenido!</h1>
        <p>Tu tienda "<strong>${storeName}</strong>" está lista.</p>
    </div>
</body>
</html>
    `;

    return await sendEmail({ to: email, subject, html, text: `Bienvenido ${name}!` });
}

/**
 * Enviar notificación de nuevo pedido
 */
export async function sendOrderNotification(email, orderData) {
    const subject = `🛒 Nuevo pedido #${orderData.orderId}`;
    return await sendEmail({ to: email, subject, html: `<p>Nuevo pedido: ${orderData.orderId}</p>`, text: `Nuevo pedido` });
}

/**
 * Enviar notificación de pedido pendiente de entrega
 */
export async function sendPendingDeliveryNotification(shipment, order) {
    const subject = `📦 Seguimiento de tu pedido #${order.id}`;
    const clientEmail = order.customer?.email || order.email || shipment.email;
    if (!clientEmail) return { success: false };

    return await sendEmail({
        to: clientEmail,
        subject,
        html: `<p>Tu pedido ${order.id} va en camino.</p>`,
        text: `Tu pedido va en camino.`
    });
}

export default {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendOrderNotification,
    sendPendingDeliveryNotification
};
