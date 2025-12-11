# Despliegue en Vercel

Esta guía te ayudará a desplegar la plataforma Constructor en Vercel para acceso en línea.

## Arquitectura de despliegue

La aplicación se divide en tres partes independientes:

1. **Backend API** (Express.js) - Desplegado en Render/Railway
2. **Admin Panel** (React/Vite) - Desplegado en Vercel
3. **Storefront** (Next.js) - Desplegado en Vercel

## Requisitos previos

1. Cuenta en Vercel (https://vercel.com)
2. Cuenta en Supabase (ya configurada)
3. Cuenta en Render o Railway para el backend

## Paso 1: Configurar variables de entorno

### Para el Admin Panel (admin/.env.production):
```env
VITE_API_URL=https://tu-backend-url.com/api
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
```

### Para el Storefront (storefront/.env.production):
```env
NEXT_PUBLIC_API_URL=https://tu-backend-url.com/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
```

## Paso 2: Desplegar el Admin Panel

1. Ve a https://vercel.com/new
2. Selecciona el repositorio de tu proyecto
3. Configura las variables de entorno en la sección "Environment Variables"
4. Selecciona el directorio `admin` como root directory
5. Haz clic en "Deploy"

## Paso 3: Desplegar el Storefront

1. Ve a https://vercel.com/new
2. Selecciona el mismo repositorio
3. Configura las variables de entorno
4. Selecciona el directorio `storefront` como root directory
5. Haz clic en "Deploy"

## Paso 4: Desplegar el Backend (en Render/Railway)

### Usando Render:

1. Ve a https://render.com/
2. Crea una nueva Web Service
3. Conecta tu repositorio
4. Selecciona el directorio `backend` como root directory
5. Configura las variables de entorno:
   ```env
   SUPABASE_URL=tu-supabase-url
   SUPABASE_ANON_KEY=tu-anon-key
   JWT_SECRET=tu-jwt-secret
   CLOUDINARY_CLOUD_NAME=tu-cloud-name
   CLOUDINARY_API_KEY=tu-api-key
   CLOUDINARY_API_SECRET=tu-api-secret
   ```
6. Selecciona Node como entorno de ejecución
7. Comando de inicio: `npm run start`
8. Haz clic en "Create Web Service"

## Paso 5: Configurar dominios personalizados (opcional)

1. En Vercel, ve a la configuración del proyecto
2. Agrega un dominio personalizado en la sección "Domains"
3. Configura los registros DNS según las instrucciones

## Límites del plan gratuito

### Vercel:
- 100 GB de transferencia mensual
- 5000 builds por mes
- Dominios ilimitados
- SSL automático

### Supabase:
- 500 MB de almacenamiento de base de datos
- 1 GB de almacenamiento de archivos
- 5 GB de transferencia mensual

Esto es más que suficiente para tus 40 usuarios de prueba con 80,000 imágenes.

## Monitoreo y mantenimiento

1. Configura alertas de uso en Vercel y Supabase
2. Monitorea los logs de la aplicación
3. Configura backups regulares de la base de datos

## Escalabilidad

Cuando necesites más recursos:
1. Actualiza a planes de pago en Vercel y Supabase
2. Considera usar un CDN para imágenes
3. Implementa caching para mejorar el rendimiento