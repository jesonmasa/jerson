# 🚀 Documentación de Despliegue - Constructor Platform

## ✅ Estado Actual (11 Diciembre 2024)

### Repositorio GitHub
- **URL**: https://github.com/fonsecakiran/constructor-platform
- **Rama**: main

---

## 🗄️ PASO 1: Base de Datos (COMPLETADO ✅)

### Supabase
- **URL**: `https://bmiuogfvzycwsfkbphpg.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaXVvZ2Z2enljd3Nma2JwaHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODkwOTMsImV4cCI6MjA4MTA2NTA5M30.ZoUOuiEzKTykL418jpsUlFTrVTv515Fnam0FS-l795g`
- **Tablas creadas**: users, tenants, products, orders, categories, customers, pages, gallery, shipments, analytics, subscriptions, verification_codes

---

## 🖼️ PASO 2: Imágenes (COMPLETADO ✅)

### Cloudinary
- **Cloud Name**: `dpksutdjn`
- **API Key**: `458575866594946`
- **API Secret**: `19HyPOA8mpmSr3pYUvSDEgV3guU`

---

## 🔧 PASO 3: Backend en Render (EN PROGRESO 🔄)

### URL del Backend
- **URL**: `https://constructor-backend-gelt.onrender.com`
- **API Base**: `https://constructor-backend-gelt.onrender.com/api`

### Variables de Entorno Configuradas:
```
NODE_ENV = production
SUPABASE_URL = https://bmiuogfvzycwsfkbphpg.supabase.co
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtaXVvZ2Z2enljd3Nma2JwaHBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0ODkwOTMsImV4cCI6MjA4MTA2NTA5M30.ZoUOuiEzKTykL418jpsUlFTrVTv515Fnam0FS-l795g
JWT_SECRET = constructor-platform-secret-2024
CLOUDINARY_CLOUD_NAME = dpksutdjn
CLOUDINARY_API_KEY = 458575866594946
CLOUDINARY_API_SECRET = 19HyPOA8mpmSr3pYUvSDEgV3guU
```

### Configuración en Render:
- **Directorio raíz**: `backend`
- **Comando de construcción**: `npm install`
- **Comando de inicio**: `npm run start`

### Para verificar si funciona:
Visita: `https://constructor-backend-gelt.onrender.com/health`
Debería devolver: `{"status":"ok","message":"Constructor API"}`

---

## 🎨 PASO 4: Admin Panel en Vercel (COMPLETADO ✅)

### URL del Admin Panel
- **URL Principal**: `https://jerson-admin.vercel.app`

### Configuración:
- **Project Name**: `jerson-admin`
- **Root Directory**: `admin`
- **Framework Preset**: Vite
- **Variables de entorno**:
   ```
   VITE_API_URL = https://constructor-backend-gelt.onrender.com/api
   VITE_CLOUDINARY_CLOUD_NAME = dpksutdjn
   ```

---

## 🛒 PASO 5: Storefront en Vercel (COMPLETADO ✅)

### URL del Storefront
- **URL Principal**: `https://jerson-storefront.vercel.app`

### Configuración:
- **Project Name**: `jerson-storefront`
- **Root Directory**: `storefront`
- **Framework Preset**: Next.js
- **Variables de entorno**:
   ```
   NEXT_PUBLIC_API_URL = https://constructor-backend-gelt.onrender.com/api
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = dpksutdjn
   ```

---

## 📊 Arquitectura Final

```
┌─────────────────────────────────────────────────────────────────┐
│                          INTERNET                                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
     ┌─────────────────────────┼─────────────────────────┐
     │                         │                         │
     ▼                         ▼                         ▼
┌─────────────┐        ┌─────────────┐         ┌─────────────────┐
│   Admin     │        │ Storefront  │         │    Backend      │
│   Panel     │        │   (Next.js) │         │   (Express)     │
│  (Vite)     │        │             │         │                 │
├─────────────┤        ├─────────────┤         ├─────────────────┤
│   VERCEL    │        │   VERCEL    │         │    RENDER       │
└──────┬──────┘        └──────┬──────┘         └────────┬────────┘
       │                      │                         │
       └──────────────────────┼─────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │          SUPABASE               │
            │    (PostgreSQL Database)        │
            └─────────────────────────────────┘
                              │
                              ▼
            ┌─────────────────────────────────┐
            │         CLOUDINARY              │
            │       (Image Storage)           │
            └─────────────────────────────────┘
```

---

## 🔐 Credenciales Importantes (GUARDAR EN LUGAR SEGURO)

### Supabase
- URL: `https://bmiuogfvzycwsfkbphpg.supabase.co`
- Dashboard: https://supabase.com/dashboard

### Cloudinary
- Cloud Name: `dpksutdjn`
- Dashboard: https://cloudinary.com/console

### GitHub
- Repositorio: https://github.com/fonsecakiran/constructor-platform

### Render (Backend)
- Dashboard: https://dashboard.render.com
- URL API: `https://constructor-backend-gelt.onrender.com/api`

---

## 📝 Notas Adicionales

1. **Render Free Tier**: El servidor se "duerme" después de 15 min de inactividad. La primera petición tarda ~30 segundos en despertar.

2. **Para actualizar el código**:
   ```bash
   git add -A
   git commit -m "Tu mensaje"
   git push origin main
   ```
   Render y Vercel se actualizan automáticamente.

3. **Super Admin por defecto**:
   - Email: `admin@constructor.test`
   - Password: `constructor123`
   (Solo en desarrollo, cambia esto en producción)

---

## ❓ Problemas Comunes

### El backend no responde:
1. Verifica en Render Dashboard que el servicio esté "Live"
2. Revisa los logs en "Registros"
3. Espera 30 segundos si el servidor estaba dormido

### Las imágenes no suben:
1. Verifica las credenciales de Cloudinary
2. Revisa los logs del backend

### Error de autenticación:
1. Verifica que JWT_SECRET sea el mismo en backend y que el token no haya expirado

---

## 🎯 Próximos Pasos (cuando regreses)

1. [ ] Verificar que el backend en Render esté "Live"
2. [ ] Desplegar Admin Panel en Vercel
3. [ ] Desplegar Storefront en Vercel
4. [ ] Probar el flujo completo
5. [ ] Configurar dominios personalizados (opcional)
