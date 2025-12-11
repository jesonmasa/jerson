# 📂 Documentación Maestra del Proyecto "Constructor"

Esta documentación unifica toda la información del sistema, incluyendo inicio rápido, políticas de seguridad, estructura del proyecto y planes de desarrollo.

---

## 🏗️ 1. Visión General (README)

**Constructor** es un constructor de plataformas de comercio electrónico diseñado específicamente para negocios de moda, belleza y cuidado personal. Construido para superar a Shopify en características especializadas y experiencia de usuario.

### 🎯 Visión
Crear la mejor solución de comercio electrónico para:
- Tiendas de moda (ropa, zapatos, accesorios)
- Marcas de belleza (cosméticos, cuidado de la piel)
- Perfumerías
- Productos de cuidado personal

### 🚀 Características Principales

#### Constructor Visual (Implementado)
- **Constructor de páginas drag-and-drop** impulsado por GrapesJS
- **Componentes específicos de la industria**:
  - Secciones Hero para Moda y Belleza
  - Grillas de productos con tarjetas especializadas
  - Controles deslizantes de testimonios
  - Formularios de suscripción a boletines
- **Plantillas responsivas mobile-first
- **Vista previa en tiempo real** y cambio de dispositivo

#### Panel de Administración (En Progreso)
- **Gestión de Tiendas**: Crear y gestionar múltiples tiendas
- **Gestión de Productos**: Añadir y editar productos
- **Integración del Constructor de Páginas**: Crear páginas para cada tienda sin problemas

#### E-commerce Core (Planeado)
- Seguimiento de inventario
- Procesamiento de pedidos
- Cuentas de clientes
- Panel de análisis

### 🏗️ Arquitectura
```
constructor/
├── backend/       # Express.js + Supabase (Backend con base de datos PostgreSQL)
├── admin/         # React + Vite + GrapesJS (Admin y Constructor)
├── storefront/    # Next.js (Tiendas cara al cliente)
└── shared/        # Tipos y utilidades compartidos
```

### 🛠️ Stack Tecnológico
- **Backend**: Express.js, Supabase (PostgreSQL)
- **Admin**: React, GrapesJS, Vite, TailwindCSS
- **Storefront**: Next.js 14, React, TailwindCSS
- **Infraestructura**: Node.js

---

## 🚀 2. Guía de Inicio Rápido

### Opción 1: Desarrollo Local

Simplemente haz **doble clic** en:
```
start.bat
```

**¿Qué hace el script?**
1. ✅ Verifica que Node.js esté instalado
2. ✅ Instala dependencias si es necesario
3. ✅ Inicia Backend (Puerto 3001)
4. ✅ Inicia Admin Panel (Puerto 5173)
5. ✅ Inicia Storefront (Puerto 3000)
6. ✅ Abre navegadores automáticamente
7. ✅ Configura Hot Reload en todos los servicios

**Resultado**:
Verás 3 terminales y 2 pestañas del navegador abiertas (Storefront y Admin).

### Opción 2: Despliegue en Línea

Consulta el archivo `DEPLOYMENT.md` para instrucciones detalladas sobre cómo desplegar la aplicación en línea usando Vercel y Render.

### Opción 3: Inicio Manual

```bash
# Todos los servicios
npm run dev

# O individualmente
npm run dev:backend
npm run dev:admin
npm run dev:storefront
```

### 🔄 Hot Reload Automático
Todos los servicios tienen hot reload activado:
- **Backend**: Nodemon reinicia al guardar `.js`
- **Admin**: Vite HMR actualiza instantáneamente
- **Storefront**: Next.js Fast Refresh preserva el estado

### 🛑 Detener Servicios
- **Si usaste start.bat**: Cierra las ventanas de terminal
- **Si usaste npm run dev**: Presiona `Ctrl+C`

### 🐛 Solución de Problemas Comunes
- **Puerto en uso**: `npx kill-port 3000 3001 5173`
- **Node.js no encontrado**: Instalar Node.js 20+

---

## 🔐 3. Política de Seguridad

Este proyecto implementa seguridad nativa sin depender excesivamente de librerías externas.

### Amenazas Protegidas
1. **Inyección de Datos**: Validación regex `/^[a-zA-Z0-9_-]+$/`, sanitización HTML nativa.
2. **XSS (Cross-Site Scripting)**: Eliminación de `<script>`, bloqueo de eventos inline.
3. **Scraping / Robo de Datos**: Rate Limiting (100 req/15min por IP), CORS restrictivo.
4. **Fuerza Bruta**: Rate limiting, bcrypt (salt 10), JWT (7 días).
5. **Headers Seguros**: `X-Frame-Options`, `X-Content-Type-Options`, etc.

### Cifrado End-to-End
- **Contraseñas**: bcrypt.
- **Datos JSON**: AES-256-GCM (Datos en reposo cifrados).
- **Tokens**: JWT firmado con HMAC-SHA256.

### Tecnologías Nativas (Sin NPM extra)
- Rate Limiting con `Map` de JS.
- Headers HTTP manuales.
- Cifrado con `crypto` de Node.js.

---

## 📦 4. Plan: Sistema de Carga Masiva + Hoja de Datos

Este es el plan técnico para las próximas implementaciones avanzadas.

### Resumen del Sistema
1. **Subida Masiva**: Archivos `.zip` con hasta 100 imágenes -> Generan productos en borrador.
2. **Hoja de Datos (DataSheet)**: Interfaz tipo Excel para editar productos rápidamente.
3. **Sistema de Envíos**: Rastreo con conteo regresivo y cambio de estados.
4. **Notificaciones**: Email al tendero cuando hay entregas pendientes.

### Módulo 1: Carga Masiva ZIP
- Usuario sube `.zip`.
- Backend descomprime, sube a Cloudinary.
- Crea productos "Borrador" usando el nombre del archivo como nombre del producto.
- Reglas: Max 100MB ZIP, 5MB por imagen.

### Módulo 2: Hoja de Datos (DataSheet)
Nueva página en Admin con 3 pestañas:
1. **Productos**: Tabla editable (Nombre, Precio, Stock, Estado).
2. **Pedidos**: Lista de órdenes y compradores.
3. **Envíos**: Control de despacho con contador de días restantes.

### Módulo 3: Sistema de Envíos
Flujo: Pendiente -> En Camino -> Entregado / No Entregado.
- **Entregado**: Resta stock, completa pedido.
- **No Entregado**: Pide motivo, no resta stock.
- **Conteo Regresivo**: Calcula días restantes para alerta.

### Módulo 4: Notificaciones
- Emails transaccionales nativos (SMTP/HTTP) para alertar al tendero de pedidos nuevos o pendientes de marcar como entregados.

### Estructuras de Datos Clave
- **products.json**: id, name, price, image, category, stock, status (draft/published).
- **orders.json**: id, items, total, customer, status.
- **shipments.json**: id, orderId, status, shippedAt, estimatedDays.

---
*Documentación consolidada generada automáticamente.*
