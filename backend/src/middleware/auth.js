/**
 * Middleware de autenticación y aislamiento de tenant
 */

import jwt from 'jsonwebtoken';
import { platform } from '../database/db.js';

// JWT Secret from environment variable for security
const JWT_SECRET = process.env.JWT_SECRET;

// If no JWT secret is provided, the application should fail to start
if (!JWT_SECRET) {
    throw new Error('❌ JWT_SECRET is required in environment variables. Please configure it before starting the server.');
}

console.log('✅ JWT Secret configured securely from environment variables');

/**
 * Middleware de autenticación JWT
 * Verifica el token y adjunta el usuario y tenantId al request
 */
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            // console.error('❌ Auth failed: No token provided');
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await platform.findUserById(decoded.userId);
            if (!user) {
                return res.status(401).json({ error: 'Usuario no encontrado' });
            }

            req.user = user;
            req.tenantId = user.tenantId;
            next();
        } catch (jwtError) {
            console.error('❌ JWT Verify Error:', jwtError.message);

            return res.status(401).json({
                error: 'Token inválido',
                debug: jwtError.message
            });
        }
    } catch (error) {
        console.error('❌ Auth Middleware Critical Error:', error);
        return res.status(500).json({ error: 'Error de autenticación crítico' });
    }
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero adjunta usuario si existe
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await platform.findUserById(decoded.userId);
            if (user) {
                req.user = user;
                req.tenantId = user.tenantId;
            }
        }
        next();
    } catch {
        next();
    }
};

/**
 * Middleware para rutas de Super Admin
 * Solo permite acceso a usuarios con rol super_admin
 */
export const superAdminOnly = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación requerida' });
    }

    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Acceso denegado. Solo Super Admin.' });
    }

    next();
};

/**
 * Middleware para verificar suscripción activa
 * Bloquea acceso si el usuario no tiene membresía activa
 */
export const requireSubscription = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación requerida' });
    }

    // Super admin no requiere suscripción
    if (req.user.role === 'super_admin') {
        return next();
    }

    const subscription = await platform.getSubscription(req.user.id);

    if (!subscription) {
        return res.status(402).json({
            error: 'Suscripción requerida',
            message: 'Necesitas una membresía activa para acceder',
            code: 'SUBSCRIPTION_REQUIRED'
        });
    }

    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
        return res.status(402).json({
            error: 'Suscripción inactiva',
            message: 'Tu membresía ha expirado o fue cancelada',
            code: 'SUBSCRIPTION_INACTIVE'
        });
    }

    // Verificar si la suscripción no ha expirado
    if (new Date(subscription.currentPeriodEnd) < new Date()) {
        return res.status(402).json({
            error: 'Suscripción expirada',
            message: 'Tu membresía ha expirado',
            code: 'SUBSCRIPTION_EXPIRED'
        });
    }

    req.subscription = subscription;
    next();
};

/**
 * Middleware para verificar email verificado
 */
export const requireVerifiedEmail = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación requerida' });
    }

    if (!req.user.emailVerified) {
        return res.status(403).json({
            error: 'Email no verificado',
            message: 'Por favor verifica tu email antes de continuar',
            code: 'EMAIL_NOT_VERIFIED'
        });
    }

    next();
};

/**
 * Middleware para extraer tenantId de la URL (para storefront público)
 * Formato: /store/:tenantId/...
 */
export const extractTenantFromUrl = (req, res, next) => {
    const tenantId = req.params.tenantId;

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID requerido' });
    }

    req.tenantId = tenantId;
    next();
};

/**
 * Generar token JWT para un usuario
 */
export const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            tenantId: user.tenantId,
            role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export default {
    authenticate,
    optionalAuth,
    superAdminOnly,
    requireSubscription,
    requireVerifiedEmail,
    extractTenantFromUrl,
    generateToken
};
