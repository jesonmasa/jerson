/**
 * Rutas de Autenticación v2 - Sistema Completo
 * - Registro con verificación de email
 * - Login con JWT
 * - Verificación de código
 * - Recuperación de contraseña
 */

import express from 'express';
import bcrypt from 'bcryptjs';
import { platform } from '../database/db.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { sendVerificationEmail, sendWelcomeEmail } from '../services/email.js';
import { verifyCaptcha } from '../services/captcha.js';

const router = express.Router();

// ============================================
// REGISTRO - PASO 1: Iniciar registro
// ============================================
router.post('/register/init', async (req, res) => {
    try {
        const { email, name, captchaToken } = req.body;

        // Validaciones
        if (!email || !name) {
            return res.status(400).json({ error: 'Email y nombre son requeridos' });
        }

        if (!email.includes('@') || !email.includes('.')) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        // Verificar captcha (opcional en desarrollo)
        if (captchaToken) {
            const captchaResult = await verifyCaptcha(captchaToken, 'register');
            if (!captchaResult.success && !captchaResult.mock) {
                return res.status(403).json({
                    error: 'Verificación de seguridad fallida',
                    details: captchaResult.error
                });
            }
        }

        // Verificar si usuario ya existe
        const existingUser = await platform.findUserByEmail(email);
        if (existingUser) {
            if (existingUser.emailVerified) {
                return res.status(400).json({ error: 'Este email ya está registrado' });
            }
            // Si existe pero no verificado, permitir reenviar código
        }

        // Generar y enviar código de verificación
        const code = await platform.createVerificationCode(email);
        await sendVerificationEmail(email, code, name);

        res.json({
            success: true,
            message: 'Código de verificación enviado',
            email: email.substring(0, 3) + '***@' + email.split('@')[1]
        });

    } catch (error) {
        console.error('Register init error:', error);
        res.status(500).json({ error: 'Error al iniciar registro' });
    }
});

// ============================================
// REGISTRO - PASO 2: Verificar código y completar
// ============================================
router.post('/register/verify', async (req, res) => {
    try {
        const { email, code, name, password } = req.body;

        // Validaciones
        if (!email || !code || !name || !password) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar código
        const verification = await platform.verifyCode(email, code);
        if (!verification.valid) {
            return res.status(400).json({ error: verification.error });
        }

        // Verificar si usuario ya existe y está verificado
        const existingUser = await platform.findUserByEmail(email);
        if (existingUser && existingUser.emailVerified) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Verificar si es el primer usuario (será Super Admin)
        const allUsers = await platform.getAllUsers();
        const isFirstUser = allUsers.length === 0;

        // Crear usuario
        const user = await platform.createUser({
            email,
            password: hashedPassword,
            name,
            role: isFirstUser ? 'super_admin' : 'owner'
        });

        // Log especial si es super admin
        if (isFirstUser) {
            console.log('🎉 ¡SUPER ADMIN CREADO!');
            console.log(`   Email: ${email}`);
            console.log(`   Accede a /super-admin después de iniciar sesión`);
        }

        // Marcar email como verificado
        await platform.updateUser(user.id, { emailVerified: true });

        // Generar token
        const token = generateToken(user);

        // Enviar email de bienvenida
        await sendWelcomeEmail(email, name, `${name}'s Store`);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tenantId: user.tenantId,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Register verify error:', error);
        res.status(500).json({ error: 'Error al completar registro' });
    }
});

// ============================================
// REENVIAR CÓDIGO
// ============================================
router.post('/resend-code', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const code = await platform.createVerificationCode(email);
        await sendVerificationEmail(email, code);

        res.json({
            success: true,
            message: 'Código reenviado'
        });

    } catch (error) {
        console.error('Resend code error:', error);
        res.status(500).json({ error: 'Error al reenviar código' });
    }
});

// ============================================
// LOGIN
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password, captchaToken } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Verificar captcha (opcional)
        if (captchaToken) {
            const captchaResult = await verifyCaptcha(captchaToken, 'login');
            if (!captchaResult.success && !captchaResult.mock) {
                return res.status(403).json({ error: 'Verificación de seguridad fallida' });
            }
        }

        // Buscar usuario
        const user = await platform.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Verificar si email está verificado
        if (!user.emailVerified) {
            // Enviar nuevo código
            const code = await platform.createVerificationCode(email);
            await sendVerificationEmail(email, code, user.name);

            return res.status(403).json({
                error: 'Email no verificado',
                code: 'EMAIL_NOT_VERIFIED',
                message: 'Hemos enviado un nuevo código de verificación a tu email'
            });
        }

        // Generar token
        const token = generateToken(user);

        // Obtener info de suscripción
        const subscription = await platform.getSubscription(user.id);

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                tenantId: user.tenantId,
                role: user.role,
                emailVerified: user.emailVerified
            },
            subscription: subscription ? {
                planId: subscription.planId,
                planName: subscription.planName,
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd
            } : null
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// ============================================
// OBTENER USUARIO ACTUAL
// ============================================
router.get('/me', authenticate, async (req, res) => {
    try {
        const subscription = await platform.getSubscription(req.user.id);

        res.json({
            user: {
                id: req.user.id,
                email: req.user.email,
                name: req.user.name,
                tenantId: req.user.tenantId,
                role: req.user.role,
                emailVerified: req.user.emailVerified,
                createdAt: req.user.createdAt
            },
            subscription: subscription ? {
                planId: subscription.planId,
                planName: subscription.planName,
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd
            } : null
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// ============================================
// CAMBIAR CONTRASEÑA
// ============================================
router.post('/change-password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Contraseñas requeridas' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar contraseña actual
        const user = await platform.findUserById(req.user.id);
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        // Actualizar contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await platform.updateUser(req.user.id, { password: hashedPassword });

        res.json({ success: true, message: 'Contraseña actualizada' });

    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar contraseña' });
    }
});

// ============================================
// RECUPERAR CONTRASEÑA - PASO 1
// ============================================
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const user = await platform.findUserByEmail(email);

        // Siempre responder igual para no revelar si el email existe
        if (user) {
            const code = await platform.createVerificationCode(email);
            await sendVerificationEmail(email, code, user.name);
        }

        res.json({
            success: true,
            message: 'Si el email existe, recibirás un código de recuperación'
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al procesar solicitud' });
    }
});

// ============================================
// RECUPERAR CONTRASEÑA - PASO 2
// ============================================
router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Verificar código
        const verification = await platform.verifyCode(email, code);
        if (!verification.valid) {
            return res.status(400).json({ error: verification.error });
        }

        // Buscar usuario
        const user = await platform.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Actualizar contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await platform.updateUser(user.id, { password: hashedPassword });

        res.json({ success: true, message: 'Contraseña restablecida exitosamente' });

    } catch (error) {
        res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
});

export default router;
