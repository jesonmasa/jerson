import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// CARGAR ENV PRIMERO
dotenv.config();

import path from 'path';
import os from 'os'; // Importante para Vercel
import { fileURLToPath } from 'url';
import { securityLogger } from './security/validation.js';

// Import routes
import productsRouter from './routes/products.js';
import pagesRouter from './routes/pages.js';
import categoriesRouter from './routes/categories.js';
import ordersRouter from './routes/orders.js';
import statsRouter from './routes/stats.js';
import uploadRouter from './routes/upload.js';
import bulkUploadRouter from './routes/bulk-upload.js';
import shipmentsRouter from './routes/shipments.js';
import galleryRouter from './routes/gallery.js';

// NEW: Multi-tenant routes
import authV2Router from './routes/supabase-auth.js';
import superAdminRouter from './routes/super-admin.js';
import subscriptionsRouter from './routes/subscriptions.js';
import marketplaceRouter from './routes/marketplace.js';

// NEW: Multi-tenant data routes (v2)
import productsV2Router from './routes/products-v2.js';
import ordersV2Router from './routes/orders-v2.js';
import categoriesV2Router from './routes/categories-v2.js';
import configV2Router from './routes/config-v2.js';

// Initialize multi-tenant database (Supabase or file-based)
import { platform } from './database/db.js';
platform.init().then(() => console.log('✅ Database ready'));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Logger de seguridad (detecta actividad sospechosa)
app.use(securityLogger);

// ============================================
// CORS - Orígenes Permitidos (PRIMERO)
// ============================================
app.use(cors({
  origin: true, // Permitir cualquier origen temporalmente para debug
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ============================================
// SEGURIDAD - IMPLEMENTACIÓN NATIVA (Sin npm)
// ============================================

// Rate Limiting Manual con Map
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
const RATE_LIMIT_MAX = 5000; // Aumentado para desarrollo/carga masiva

const rateLimiter = (req, res, next) => {
  if (req.method === 'OPTIONS') return next(); // No limitar pre-flight

  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return next();
  }

  const record = rateLimitStore.get(ip);

  if (now - record.startTime > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, startTime: now });
    return next();
  }

  if (record.count < RATE_LIMIT_MAX) {
    record.count++;
    return next();
  }

  console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
  return res.status(429).json({
    error: 'Demasiadas solicitudes. Estás enviando muchas peticiones muy rápido.'
  });
};

// Limpiar IPs antiguas cada 30 min
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now - record.startTime > RATE_LIMIT_WINDOW * 2) {
      rateLimitStore.delete(ip);
    }
  }
}, 30 * 60 * 1000);

// Headers de Seguridad Nativos (Sin Helmet)
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
};

app.use(rateLimiter);
app.use(securityHeaders);

// Body parsing - Aumentado a 200mb para soportar ZIPs grandes en base64
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
// Uploads: En Vercel no hay persistencia local, pero definimos ruta para compatibilidad
// En producción real, los uploads van directo a Cloudinary
app.use('/uploads', express.static(path.join(os.tmpdir(), 'uploads')));

// Routes - Support both /api prefix and root paths for Vercel flexibility
const routes = [
  { path: '/products', router: productsRouter },
  { path: '/pages', router: pagesRouter },
  { path: '/categories', router: categoriesRouter },
  { path: '/orders', router: ordersRouter },
  { path: '/stats', router: statsRouter },
  { path: '/upload', router: uploadRouter },
  { path: '/bulk-upload', router: bulkUploadRouter },
  { path: '/shipments', router: shipmentsRouter },
  { path: '/gallery', router: galleryRouter },

  // Auth & Multi-tenant
  { path: '/auth', router: authV2Router },
  { path: '/super-admin', router: superAdminRouter },
  { path: '/subscriptions', router: subscriptionsRouter },
  { path: '/marketplace', router: marketplaceRouter },

  // V2 Routes
  { path: '/v2/products', router: productsV2Router },
  { path: '/v2/orders', router: ordersV2Router },
  { path: '/v2/categories', router: categoriesV2Router },
  { path: '/v2/config', router: configV2Router }
];

// Mount all routes
routes.forEach(({ path, router }) => {
  app.use(`/api${path}`, router); // Standard /api/resource
  app.use(path, router);          // Fallback /resource (if Vercel rewrite strips api)
});

// ALERTA: Ruta de DIAGNÓSTICO TEMPORAL (Borrar en producción final)
import { sendVerificationEmail } from './services/email.js';

app.get('/api/test-email-live', async (req, res) => {
  const targetEmail = req.query.email;
  if (!targetEmail) return res.json({ error: 'Falta ?email=tucorreo@gmail.com' });

  try {
    console.log(`🧪 Diagnosticando email para: ${targetEmail}`);

    // Verificar variables de entorno
    const user = process.env.EMAIL_USER ? 'CONFIGURADO' : 'FALTANTE';
    const pass = process.env.EMAIL_PASS ? 'CONFIGURADO' : 'FALTANTE';

    if (user === 'FALTANTE' || pass === 'FALTANTE') {
      return res.json({ success: false, error: 'Variables de entorno no encontradas en Render', details: { user, pass } });
    }

    // Intentar envío real
    const result = await sendVerificationEmail(targetEmail, '123456(PRUEBA)', 'Tester');

    res.json({
      success: result.success,
      id: result.id,
      error: result.error,
      envStatus: { user, pass }
    });

  } catch (e) {
    res.json({ success: false, error: e.message, stack: e.stack });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Constructor API', security: 'native', multiTenant: true });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`❌ [${new Date().toISOString()}]:`, err.message);
  res.status(err.status || 500).json({ error: 'Error interno' });
});

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada en Backend Vercel (${req.originalUrl})` });
});

// Exportar app para Vercel
export default app;

// Solo escuchar si se ejecuta directamente (no importado por Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Backend: http://localhost:${PORT}`);
    console.log(`🔒 Seguridad nativa activa`);
    console.log('✅✅✅ SERVER FIXED KEY ACTIVE - RESTART SUCCESSFUL ✅✅✅');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Puerto ${PORT} en uso.`);
    } else {
      console.error('❌ Error:', err);
    }
  });
}
