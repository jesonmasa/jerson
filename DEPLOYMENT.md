# Despliegue de la Plataforma Constructor

Esta guía explica cómo desplegar la plataforma Constructor en línea para acceso público.

## Componentes de la aplicación

1. **Backend API** (Express.js) - Lógica de negocio y conexión a base de datos
2. **Admin Panel** (React/Vite) - Panel de administración para crear tiendas
3. **Storefront** (Next.js) - Tiendas públicas para los clientes

## Opciones de despliegue

### Backend API
- **Recomendado**: Render.com (gratuito)
- Alternativas: Railway.app, Fly.io

### Frontend (Admin Panel y Storefront)
- **Recomendado**: Vercel (gratuito)
- Alternativas: Netlify

## Despliegue paso a paso

### 1. Preparación

Asegúrate de tener:
- Cuenta en Vercel (https://vercel.com)
- Cuenta en Render (https://render.com)
- Cuenta en Supabase (ya configurada)
- Repositorio Git del proyecto

### 2. Desplegar Backend en Render

1. Ve a https://render.com/
2. Crea una nueva Web Service
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: constructor-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
5. Agrega las variables de entorno:
   ```env
   SUPABASE_URL=tu-url-de-supabase
   SUPABASE_ANON_KEY=tu-anon-key
   JWT_SECRET=clave-secreta-segura
   CLOUDINARY_CLOUD_NAME=tu-cloud-name
   CLOUDINARY_API_KEY=tu-api-key
   CLOUDINARY_API_SECRET=tu-api-secret
   ```
6. Haz clic en "Create Web Service"

### 3. Desplegar Admin Panel en Vercel

1. Ve a https://vercel.com/new
2. Selecciona tu repositorio
3. Configura:
   - **Project Name**: constructor-admin
   - **Root Directory**: admin
4. Agrega las variables de entorno:
   ```env
   VITE_API_URL=https://tu-backend-en-render.onrender.com/api
   VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
   ```
5. Haz clic en "Deploy"

### 4. Desplegar Storefront en Vercel

1. Ve a https://vercel.com/new
2. Selecciona tu repositorio
3. Configura:
   - **Project Name**: constructor-storefront
   - **Root Directory**: storefront
4. Agrega las variables de entorno:
   ```env
   NEXT_PUBLIC_API_URL=https://tu-backend-en-render.onrender.com/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name
   ```
5. Haz clic en "Deploy"

## Configuración de dominios personalizados

### En Vercel:
1. Ve a la configuración del proyecto
2. Sección "Domains"
3. Agrega tu dominio personalizado
4. Configura los registros DNS según las instrucciones

### En Render:
1. Ve a la configuración del servicio
2. Sección "Custom Domains"
3. Agrega tu dominio personalizado

## Monitoreo y mantenimiento

### Logs:
- Vercel: Dashboard > Project > Logs
- Render: Dashboard > Service > Logs

### Métricas:
- Uso de recursos en Supabase
- Tráfico en Vercel
- Rendimiento en Render

## Escalabilidad

### Cuando necesites más recursos:

1. **Base de datos**: Actualiza tu plan de Supabase
2. **Backend**: Cambia a plan de pago en Render
3. **Frontend**: Actualiza en Vercel si superas los límites
4. **Almacenamiento**: Considera un CDN para imágenes

### Límites gratuitos:

| Servicio | Límite |
|----------|--------|
| Vercel | 100GB transferencia/mes |
| Supabase DB | 500MB |
| Supabase Storage | 1GB |
| Render | 500 horas/mes |

## Troubleshooting

### Problemas comunes:

1. **Variables de entorno no cargadas**:
   - Verifica que todas las variables estén configuradas
   - Asegúrate de que no haya espacios extra

2. **Errores de CORS**:
   - Configura los orígenes permitidos en el backend
   - Verifica las URLs en las variables de entorno

3. **Conexión a base de datos**:
   - Verifica las credenciales de Supabase
   - Asegúrate de que las tablas estén creadas

### Soporte:

- Documentación oficial de cada plataforma
- Comunidad de desarrolladores
- Soporte técnico de los servicios utilizados

## Siguientes pasos

1. Configura monitoreo de errores (Sentry, LogRocket)
2. Implementa analytics (Google Analytics, Plausible)
3. Configura CI/CD para despliegues automáticos
4. Optimiza el rendimiento con caching