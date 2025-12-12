/**
 * Rutas de Autenticación con Supabase Auth
 * Usa el sistema de autenticación integrado de Supabase
 * - Registro con verificación de email automática
 * - Login con JWT de Supabase
 * - Recuperación de contraseña
 */

import express from 'express';
import { supabase } from '../database/supabaseClient.js';
import { platform } from '../database/db.js';

const router = express.Router();

// URL de redirección después de verificar email
const REDIRECT_URL = process.env.FRONTEND_URL || 'https://jerson-storefront.vercel.app';

// ============================================
// REGISTRO - Con verificación de email de Supabase
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        console.log('📧 Iniciando registro con Supabase Auth:', email);

        // Validaciones
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Registrar con Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name,
                    role: 'owner'
                },
                emailRedirectTo: `${REDIRECT_URL}/auth/callback`
            }
        });

        if (error) {
            console.error('❌ Error de Supabase Auth:', error.message);

            if (error.message.includes('already registered')) {
                return res.status(400).json({ error: 'Este email ya está registrado' });
            }

            return res.status(400).json({ error: error.message });
        }

        console.log('✅ Usuario registrado en Supabase Auth:', data.user?.id);

        // Crear registro en nuestra tabla de usuarios también
        if (data.user) {
            try {
                await platform.createUser({
                    id: data.user.id,
                    email: email,
                    name: name,
                    role: 'owner',
                    emailVerified: false, // Se marcará true cuando verifique
                    supabaseAuthId: data.user.id
                });
                console.log('✅ Usuario creado en tabla platform_users');
            } catch (dbError) {
                console.warn('⚠️ Error creando en platform_users:', dbError.message);
                // No es crítico, el usuario ya existe en Supabase Auth
            }
        }

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Registro exitoso. Revisa tu email para verificar tu cuenta.',
            user: {
                id: data.user?.id,
                email: email,
                emailConfirmed: data.user?.email_confirmed_at ? true : false
            },
            // Si el email ya está confirmado (modo desarrollo), enviar sesión
            session: data.session ? {
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token
            } : null
        });

    } catch (error) {
        console.error('❌ Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// ============================================
// LOGIN - Con Supabase Auth
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('🔐 Intentando login con Supabase Auth:', email);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        // Login con Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('❌ Error de login:', error.message);

            if (error.message.includes('Invalid login credentials')) {
                return res.status(401).json({ error: 'Credenciales inválidas' });
            }
            if (error.message.includes('Email not confirmed')) {
                return res.status(403).json({
                    error: 'Email no verificado',
                    code: 'EMAIL_NOT_VERIFIED',
                    message: 'Por favor verifica tu email antes de iniciar sesión'
                });
            }

            return res.status(401).json({ error: error.message });
        }

        console.log('✅ Login exitoso:', data.user?.email);

        // Obtener datos adicionales del usuario de nuestra tabla
        let userData = null;
        try {
            userData = await platform.findUserByEmail(email);
        } catch (e) {
            console.warn('⚠️ Usuario no encontrado en platform_users');
        }

        // Respuesta exitosa
        res.json({
            success: true,
            token: data.session.access_token,
            refreshToken: data.session.refresh_token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || userData?.name || 'Usuario',
                role: data.user.user_metadata?.role || userData?.role || 'owner',
                tenantId: userData?.tenantId || data.user.id,
                emailVerified: data.user.email_confirmed_at ? true : false
            }
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// ============================================
// OBTENER USUARIO ACTUAL
// ============================================
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Token no proporcionado' });
        }

        // Verificar token con Supabase
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        // Obtener datos adicionales
        let userData = null;
        try {
            userData = await platform.findUserByEmail(data.user.email);
        } catch (e) {
            // No es crítico
        }

        res.json({
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.user_metadata?.name || userData?.name || 'Usuario',
                role: data.user.user_metadata?.role || userData?.role || 'owner',
                tenantId: userData?.tenantId || data.user.id,
                emailVerified: data.user.email_confirmed_at ? true : false
            }
        });

    } catch (error) {
        console.error('❌ Error en /me:', error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
});

// ============================================
// RECUPERAR CONTRASEÑA
// ============================================
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        console.log('🔑 Solicitando recuperación de contraseña para:', email);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${REDIRECT_URL}/auth/reset-password`
        });

        if (error) {
            console.error('❌ Error en recuperación:', error.message);
            // No revelar si el email existe o no
        }

        // Siempre responder igual
        res.json({
            success: true,
            message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña'
        });

    } catch (error) {
        console.error('❌ Error en forgot-password:', error);
        res.status(500).json({ error: 'Error al procesar solicitud' });
    }
});

// ============================================
// RESTABLECER CONTRASEÑA
// ============================================
router.post('/reset-password', async (req, res) => {
    try {
        const { newPassword } = req.body;
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Actualizar contraseña con el token
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            console.error('❌ Error actualizando contraseña:', error.message);
            return res.status(400).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });

    } catch (error) {
        console.error('❌ Error en reset-password:', error);
        res.status(500).json({ error: 'Error al restablecer contraseña' });
    }
});

// ============================================
// LOGOUT
// ============================================
router.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.warn('⚠️ Error en logout:', error.message);
        }

        res.json({ success: true, message: 'Sesión cerrada' });

    } catch (error) {
        res.status(500).json({ error: 'Error al cerrar sesión' });
    }
});

// ============================================
// REENVIAR EMAIL DE VERIFICACIÓN
// ============================================
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        console.log('📧 Reenviando email de verificación a:', email);

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
            options: {
                emailRedirectTo: `${REDIRECT_URL}/auth/callback`
            }
        });

        if (error) {
            console.error('❌ Error reenviando:', error.message);
            return res.status(400).json({ error: error.message });
        }

        res.json({
            success: true,
            message: 'Email de verificación reenviado'
        });

    } catch (error) {
        console.error('❌ Error en resend-verification:', error);
        res.status(500).json({ error: 'Error al reenviar email' });
    }
});

export default router;
