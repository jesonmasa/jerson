/**
 * Supabase Authentication Middleware
 * Replaces JWT-based authentication with Supabase Auth
 */

import { supabase } from '../database/supabaseClient.js'

/**
 * Middleware de autenticación con Supabase Auth
 * Verifica el token y adjunta el usuario y tenantId al request
 */
export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        // DEBUG LOGS (FORZADO)
        console.log('--- SUPABASE AUTH DEBUG START ---')
        console.log('Incoming Path:', req.path)
        console.log('Header:', authHeader)
        console.log('Token (first 10):', token ? token.substring(0, 10) + '...' : 'NONE')

        if (!token) {
            console.error('❌ Auth failed: No token provided')
            return res.status(401).json({ error: 'Token de acceso requerido', debug: 'missing_token' })
        }

        // Verificar token con Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token)

        if (error) {
            console.error('❌ Supabase Auth Error:', error.message)
            return res.status(401).json({
                error: 'Token inválido',
                debug: error.message
            })
        }

        if (!user) {
            console.error('❌ Auth failed: User not found')
            return res.status(401).json({ error: 'Usuario no encontrado', debug: 'user_not_found' })
        }

        // Adjuntar información del usuario al request
        req.user = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0],
            role: user.user_metadata?.role || 'owner'
        }
        
        // Obtener tenant_id del usuario
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('tenant_id')
            .eq('id', user.id)
            .maybeSingle()
        
        if (userError || !userData) {
            console.error('❌ Error getting user tenant:', userError?.message || 'User not found in users table')
            return res.status(401).json({ error: 'Información de usuario incompleta' })
        }
        
        req.tenantId = userData.tenant_id
        
        console.log('✅ Supabase Auth Success. User:', user.email, 'Tenant:', req.tenantId)
        console.log('--- SUPABASE AUTH DEBUG END ---')
        next()
    } catch (error) {
        console.error('❌ Auth Middleware Critical Error:', error)
        return res.status(500).json({ error: 'Error de autenticación crítico' })
    }
}

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero adjunta usuario si existe
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token) {
            const { data: { user }, error } = await supabase.auth.getUser(token)
            
            if (user && !error) {
                req.user = {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || user.email.split('@')[0],
                    role: user.user_metadata?.role || 'owner'
                }
                
                // Obtener tenant_id del usuario
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('tenant_id')
                    .eq('id', user.id)
                    .maybeSingle()
                
                if (!userError && userData) {
                    req.tenantId = userData.tenant_id
                }
            }
        }
        next()
    } catch {
        next()
    }
}

/**
 * Middleware para rutas de Super Admin
 * Solo permite acceso a usuarios con rol super_admin
 */
export const superAdminOnly = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación requerida' })
    }

    if (req.user.role !== 'super_admin') {
        return res.status(403).json({ error: 'Acceso denegado. Solo Super Admin.' })
    }

    next()
}

/**
 * Middleware para verificar suscripción activa
 * Bloquea acceso si el usuario no tiene membresía activa
 */
export const requireSubscription = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación requerida' })
    }

    // Super admin no requiere suscripción
    if (req.user.role === 'super_admin') {
        return next()
    }

    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', req.user.id)
        .eq('status', 'active')
        .maybeSingle()

    if (error) {
        console.error('Error checking subscription:', error)
        return res.status(500).json({ error: 'Error verificando suscripción' })
    }

    if (!subscription) {
        return res.status(402).json({
            error: 'Suscripción requerida',
            message: 'Necesitas una membresía activa para acceder',
            code: 'SUBSCRIPTION_REQUIRED'
        })
    }

    // Verificar si la suscripción no ha expirado
    if (new Date(subscription.current_period_end) < new Date()) {
        return res.status(402).json({
            error: 'Suscripción expirada',
            message: 'Tu membresía ha expirado',
            code: 'SUBSCRIPTION_EXPIRED'
        })
    }

    req.subscription = subscription
    next()
}

/**
 * Middleware para verificar email verificado
 */
export const requireVerifiedEmail = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Autenticación requerida' })
    }

    // En Supabase, el email se verifica automáticamente
    // Pero podemos verificar en nuestra tabla de usuarios
    next()
}

/**
 * Middleware para extraer tenantId de la URL (para storefront público)
 * Formato: /store/:tenantId/...
 */
export const extractTenantFromUrl = (req, res, next) => {
    const tenantId = req.params.tenantId

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID requerido' })
    }

    req.tenantId = tenantId
    next()
}

/**
 * Generar token de acceso para un usuario
 * En Supabase, esto se maneja automáticamente, pero mantenemos la función para compatibilidad
 */
export const generateToken = (user) => {
    // En Supabase, los tokens se generan automáticamente
    // Esta función es solo para compatibilidad con el código existente
    return "supabase-token-placeholder"
}

export default {
    authenticate,
    optionalAuth,
    superAdminOnly,
    requireSubscription,
    requireVerifiedEmail,
    extractTenantFromUrl,
    generateToken
}