/**
 * Rutas de Suscripciones - Sistema Local (Sin Stripe)
 * Simula pagos para desarrollo local
 */

import express from 'express';
import { platform } from '../database/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Planes disponibles
const PLANS = {
    // Plan Básico eliminado por solicitud del usuario

    pro: {
        id: 'pro',
        name: 'Plan Pro',
        price: 24.99,
        currency: 'USD',
        features: [
            '500 productos',
            '20 plantillas',
            'Soporte prioritario',
            'Analytics avanzados',
            'Dominio personalizado'
        ],
        limits: {
            products: 500,
            templates: 20
        }
    },
    enterprise: {
        id: 'enterprise',
        name: 'Plan Enterprise',
        price: 79.99,
        currency: 'USD',
        features: [
            'Productos ilimitados',
            'Todas las plantillas',
            'Soporte 24/7',
            'API completa',
            'Multi-tienda',
            'White label'
        ],
        limits: {
            products: -1, // Ilimitado
            templates: -1
        }
    }
};

// ============================================
// OBTENER PLANES DISPONIBLES
// ============================================
router.get('/plans', (req, res) => {
    res.json({
        plans: Object.values(PLANS)
    });
});

// ============================================
// OBTENER SUSCRIPCIÓN ACTUAL
// ============================================
router.get('/current', authenticate, async (req, res) => {
    try {
        const subscription = await platform.getSubscription(req.user.id);

        if (!subscription) {
            return res.json({ subscription: null, hasSubscription: false });
        }

        const plan = PLANS[subscription.planId];

        res.json({
            hasSubscription: true,
            subscription: {
                ...subscription,
                plan: plan || null
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener suscripción' });
    }
});

// ============================================
// SUSCRIBIRSE A UN PLAN (SIMULADO - SIN STRIPE)
// ============================================
router.post('/subscribe', authenticate, async (req, res) => {
    try {
        const { planId, paymentDetails } = req.body;

        // Validar plan
        const plan = PLANS[planId];
        if (!plan) {
            return res.status(400).json({ error: 'Plan no válido' });
        }

        // Verificar si ya tiene suscripción activa
        const existing = await platform.getSubscription(req.user.id);
        if (existing && existing.status === 'active') {
            return res.status(400).json({
                error: 'Ya tienes una suscripción activa',
                currentPlan: existing.planName
            });
        }

        // SIMULACIÓN: En producción aquí iría la integración con Stripe
        // Por ahora, simplemente activamos la suscripción
        console.log('📦 [MOCK PAYMENT] Procesando pago simulado...');
        console.log('   Plan:', plan.name);
        console.log('   Usuario:', req.user.email);
        console.log('   Detalles de pago (mock):', paymentDetails || 'No proporcionados');

        // Calcular fecha de fin (30 días desde hoy)
        const currentPeriodEnd = new Date();
        currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

        // Crear suscripción
        const subscription = await platform.createSubscription(req.user.id, {
            planId: plan.id,
            planName: plan.name,
            priceMonthly: plan.price,
            stripeCustomerId: `mock_cus_${Date.now()}`, // ID simulado
            stripeSubscriptionId: `mock_sub_${Date.now()}`, // ID simulado
            currentPeriodEnd: currentPeriodEnd.toISOString()
        });

        console.log('✅ [MOCK PAYMENT] Suscripción activada exitosamente');

        res.json({
            success: true,
            message: `¡Bienvenido al ${plan.name}!`,
            subscription: {
                id: subscription.id,
                planId: subscription.planId,
                planName: subscription.planName,
                status: subscription.status,
                currentPeriodEnd: subscription.currentPeriodEnd,
                features: plan.features,
                limits: plan.limits
            }
        });

    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ error: 'Error al procesar suscripción' });
    }
});

// ============================================
// CAMBIAR DE PLAN
// ============================================
router.post('/change-plan', authenticate, async (req, res) => {
    try {
        const { planId } = req.body;

        const plan = PLANS[planId];
        if (!plan) {
            return res.status(400).json({ error: 'Plan no válido' });
        }

        const subscription = await platform.getSubscription(req.user.id);
        if (!subscription) {
            return res.status(400).json({ error: 'No tienes suscripción activa' });
        }

        // Actualizar suscripción
        const updated = await platform.updateSubscription(subscription.id, {
            planId: plan.id,
            planName: plan.name,
            priceMonthly: plan.price
        });

        res.json({
            success: true,
            message: `Plan cambiado a ${plan.name}`,
            subscription: updated
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al cambiar plan' });
    }
});

// ============================================
// CANCELAR SUSCRIPCIÓN
// ============================================
router.post('/cancel', authenticate, async (req, res) => {
    try {
        const subscription = await platform.getSubscription(req.user.id);

        if (!subscription) {
            return res.status(400).json({ error: 'No tienes suscripción activa' });
        }

        // Marcar como cancelada (sigue activa hasta fin del período)
        await platform.updateSubscription(subscription.id, {
            status: 'canceled',
            canceledAt: new Date().toISOString()
        });

        res.json({
            success: true,
            message: 'Suscripción cancelada. Tendrás acceso hasta el fin del período actual.',
            accessUntil: subscription.currentPeriodEnd
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar suscripción' });
    }
});

// ============================================
// REACTIVAR SUSCRIPCIÓN
// ============================================
router.post('/reactivate', authenticate, async (req, res) => {
    try {
        const data = await platform.read();
        const subscription = data.subscriptions.find(
            s => s.userId === req.user.id && s.status === 'canceled'
        );

        if (!subscription) {
            return res.status(400).json({ error: 'No tienes suscripción cancelada' });
        }

        await platform.updateSubscription(subscription.id, {
            status: 'active',
            canceledAt: null
        });

        res.json({
            success: true,
            message: 'Suscripción reactivada'
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al reactivar suscripción' });
    }
});

export default router;
