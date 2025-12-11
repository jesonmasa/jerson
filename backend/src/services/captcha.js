/**
 * Servicio de Google reCAPTCHA v3
 * Verifica que el usuario no sea un bot
 */

import https from 'https';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '';
const RECAPTCHA_THRESHOLD = 0.5; // Score mínimo para pasar (0.0 = bot, 1.0 = humano)

/**
 * Verificar token de reCAPTCHA con Google
 */
export async function verifyCaptcha(token, expectedAction = null) {
    // Si no hay secret key configurada, permitir en desarrollo
    if (!RECAPTCHA_SECRET) {
        console.warn('⚠️ RECAPTCHA_SECRET_KEY no configurada. Verificación omitida.');
        return { success: true, score: 1.0, action: expectedAction, mock: true };
    }

    if (!token) {
        return { success: false, error: 'Token de captcha requerido' };
    }

    return new Promise((resolve) => {
        const postData = `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`;

        const options = {
            hostname: 'www.google.com',
            port: 443,
            path: '/recaptcha/api/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(body);

                    if (!result.success) {
                        return resolve({
                            success: false,
                            error: 'Verificación de captcha fallida',
                            errors: result['error-codes']
                        });
                    }

                    // Verificar score
                    if (result.score < RECAPTCHA_THRESHOLD) {
                        return resolve({
                            success: false,
                            error: 'Actividad sospechosa detectada',
                            score: result.score
                        });
                    }

                    // Verificar action si se especificó
                    if (expectedAction && result.action !== expectedAction) {
                        return resolve({
                            success: false,
                            error: 'Acción de captcha no coincide',
                            expected: expectedAction,
                            received: result.action
                        });
                    }

                    resolve({
                        success: true,
                        score: result.score,
                        action: result.action,
                        hostname: result.hostname
                    });
                } catch (e) {
                    resolve({
                        success: false,
                        error: 'Error procesando respuesta de captcha'
                    });
                }
            });
        });

        req.on('error', (error) => {
            console.error('reCAPTCHA error:', error);
            resolve({
                success: false,
                error: 'Error de conexión con servicio de captcha'
            });
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Middleware para verificar captcha en rutas
 */
export const captchaMiddleware = (action = null) => {
    return async (req, res, next) => {
        const token = req.body.captchaToken || req.headers['x-captcha-token'];

        const result = await verifyCaptcha(token, action);

        if (!result.success) {
            return res.status(403).json({
                error: 'Verificación de seguridad fallida',
                details: result.error,
                code: 'CAPTCHA_FAILED'
            });
        }

        req.captchaScore = result.score;
        next();
    };
};

export default {
    verifyCaptcha,
    captchaMiddleware
};
