/**
 * Setup Script for Supabase Integration
 * This script helps initialize the Supabase integration
 */

import { writeFile } from 'fs/promises'
import { join } from 'path'

async function setupSupabase() {
  console.log('🔧 Constructor Supabase Setup Script')
  console.log('=====================================\n')
  
  // Create .env file template
  const envContent = `# ==================================
# CONFIGURACIÓN DEL SERVIDOR
# ==================================
PORT=3001
NODE_ENV=development
JWT_SECRET=change-this-to-a-very-secure-random-string-in-production

# ==================================
# SERVICIOS EXTERNOS
# ==================================

# Resend - Servicio de Email (https://resend.com)
# Obtén tu API key gratis en: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxx
FROM_EMAIL=Constructor <noreply@tudominio.com>

# Google reCAPTCHA v3 (https://www.google.com/recaptcha/admin)
# Crea tus claves en: https://www.google.com/recaptcha/admin/create
RECAPTCHA_SITE_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Stripe - Pagos y Suscripciones (https://stripe.com)
# Obtén tus claves en: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx

# Cloudinary - Gestión de Imágenes (ya configurado)
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret

# Supabase - Base de datos y autenticación
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ==================================
# SUPER ADMIN
# ==================================
# Email del super administrador de la plataforma
SUPER_ADMIN_EMAIL=tu-email@gmail.com
SUPER_ADMIN_PASSWORD=constructor123
`

  try {
    // Write .env file
    await writeFile(join(process.cwd(), 'backend', '.env'), envContent)
    console.log('✅ Archivo .env creado en backend/.env')
    console.log('   Recuerda actualizar los valores con tus credenciales reales\n')
    
    // Instructions
    console.log('📋 SIGUIENTES PASOS:')
    console.log('1. Crea un proyecto en Supabase (https://supabase.com)')
    console.log('2. Obten tus credenciales del proyecto')
    console.log('3. Actualiza backend/.env con tus credenciales reales')
    console.log('4. Ejecuta el SQL de backend/src/database/supabaseSchema.sql en Supabase')
    console.log('5. Instala dependencias: cd backend && npm install')
    console.log('6. Inicia el servidor: npm run dev\n')
    
    console.log('📖 Lee SUPABASE_SETUP.md para instrucciones detalladas')
    
  } catch (error) {
    console.error('❌ Error creando archivos:', error.message)
    process.exit(1)
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSupabase()
}

export default setupSupabase