# 📘 PROYECTO CONSTRUCTOR - Documento Maestro

> **Versión:** 2.0  
> **Última actualización:** 2025-12-08  
> **Estado:** En desarrollo - Preparando para lanzamiento

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 INTERNET (Público)                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐    ┌──────────────────┐                  │
│  │   MARKETPLACE    │    │  TIENDA INDIV.   │                  │
│  │   (AliExpress)   │    │  /store/[id]     │                  │
│  │   localhost:3000 │    │  20 plantillas   │                  │
│  └────────┬─────────┘    └────────┬─────────┘                  │
│           │                       │                             │
│           └───────────┬───────────┘                             │
│                       ▼                                         │
│           ┌──────────────────────┐                              │
│           │   🔧 BACKEND API     │                              │
│           │   localhost:3001     │                              │
│           │   (Express + JSON)   │                              │
│           └──────────┬───────────┘                              │
│                      │                                          │
│      ┌───────────────┼───────────────┐                         │
│      ▼               ▼               ▼                         │
│  ┌────────┐    ┌──────────┐    ┌──────────┐                    │
│  │ SUPER  │    │ TENDEROS │    │COMPRADOR │                    │
│  │ ADMIN  │    │ (Owners) │    │ (Clientes)│                    │
│  │ Panel  │    │  Panel   │    │   Gmail   │                    │
│  │  5173  │    │  5173    │    │   (NEW)   │                    │
│  └────────┘    └──────────┘    └──────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👥 ROLES Y PERMISOS

### 1. 👑 SUPER ADMIN (Dios del Sistema)
**¿Quién es?** Tú, el dueño de la plataforma.

| Funcionalidad | Estado | Notas |
|---------------|--------|-------|
| Ver todos los usuarios | ✅ Funciona | `/api/super-admin/users` |
| Ver todas las tiendas | ✅ Funciona | Con productos y órdenes |
| Ver estadísticas globales | ✅ Funciona | Total tenants, suscripciones |
| Modificar suscripciones | ✅ Funciona | Cambiar plan, estado |
| Ver ingresos por plan | ✅ Funciona | `/api/super-admin/revenue` |
| Ver productos más/menos vendidos | ⚠️ Parcial | Necesita analytics avanzado |
| Ver compradores por tienda | ❌ Falta | No hay registro de compradores |

---

### 2. 🏪 TENDERO (Owner - Dueño de Tienda)
**¿Quién es?** Cualquier persona que se registra para vender.

| Funcionalidad | Estado | Notas |
|---------------|--------|-------|
| Registro con verificación email | ✅ Funciona | Código 6 dígitos por email |
| Login/Logout | ✅ Funciona | JWT token 7 días |
| Dashboard con estadísticas | ✅ Funciona | Ventas, órdenes, productos |
| Crear/Editar/Eliminar productos | ✅ Funciona | CRUD completo |
| Subir imágenes a Cloudinary | ✅ Funciona | Individual y desde galería |
| Subir ZIP con múltiples imágenes | ✅ Funciona | Procesamiento background |
| Galería de imágenes | ✅ Funciona | Ver, copiar URL, eliminar |
| Elegir plantilla (20 opciones) | ✅ Funciona | Builder con preview |
| Configurar logo y banner | ✅ Funciona | Subida de imagen |
| Configurar redes sociales | ✅ Funciona | Facebook, Instagram, WhatsApp |
| Configurar nombre de tienda | ✅ Funciona | En Builder |
| Productos en oferta → Marketplace | ✅ Funciona | Automático si discount > 0 |
| Campos textos secciones | ❌ FALTA | Sobre Nosotros, Políticas, etc. |
| Límite 50 imágenes por ZIP | ❌ FALTA | Actualmente sin límite visual |
| Clientes (customers) | ⚠️ PARCIAL | Usa datos hardcodeados, no conectado a backend |
| Aislamiento de datos | ✅ Funciona | Cada tenant separado |

---

### 3. 🛒 COMPRADOR (Cliente Final)
**¿Quién es?** Personas que compran productos.

| Funcionalidad | Estado | Notas |
|---------------|--------|-------|
| Ver Marketplace (home) | ✅ Funciona | Estilo AliExpress |
| Ver tienda individual | ✅ Funciona | 20 plantillas |
| Agregar al carrito | ✅ Funciona | LocalStorage |
| Checkout por WhatsApp | ✅ Funciona | Mensaje automático |
| Lista de deseos | ✅ Funciona | En marketplace |
| Registro con Gmail | ❌ FALTA | No implementado |
| Ver historial de compras | ❌ FALTA | No hay sistema |
| Ofertas personalizadas | ❌ FALTA | Requiere registro |

---

## ✅ CHECKLIST DE LANZAMIENTO

### BACKEND (API)
- [x] Sistema multi-tenant funcionando
- [x] Autenticación JWT
- [x] Rutas v2 con aislamiento de datos
- [x] Subida a Cloudinary
- [x] Procesamiento de ZIP
- [x] CORS configurado
- [x] Rate limiting
- [x] Headers de seguridad
- [ ] Registro de compradores
- [ ] Tracking de ventas por comprador

### ADMIN PANEL
- [x] Login/Registro owner
- [x] Dashboard con gráficos
- [x] CRUD Productos
- [x] CRUD Categorías
- [x] Galería de imágenes
- [x] Builder (20 plantillas)
- [x] Configuración (nombre, logo, redes)
- [x] Banner de tienda
- [ ] Campos de texto para secciones
- [ ] Límite visible "máx 50 imágenes"

### STOREFRONT
- [x] Marketplace estilo AliExpress
- [x] 20 plantillas de tienda
- [x] Carrito funcional
- [x] Checkout por WhatsApp
- [x] Carrusel 3D de ofertas
- [x] Filtros (precio, categoría)
- [x] Vista rápida de producto
- [ ] Registro/Login de compradores
- [ ] Botón usuario con Gmail
- [ ] Secciones de texto (Políticas, etc.)

---

## 🔧 FUNCIONALIDADES FALTANTES (Por Implementar)

### 1️⃣ Registro de Compradores con Gmail
**Prioridad:** ALTA

- Botón "Inicia sesión con Gmail" en storefront
- Al estar logueado, mostrar nombre del usuario + botón cerrar sesión
- NO da acceso a ningún panel, solo identifica al comprador
- Guardar: email, nombre, compras realizadas

### 2️⃣ Campos de Texto para Secciones (Builder)
**Prioridad:** ALTA

- 4 campos de texto en Builder:
  - **Sobre Nosotros** (textarea)
  - **Políticas de Envío** (textarea)
  - **Políticas de Devolución** (textarea)
  - **Términos y Condiciones** (textarea)
- Estos textos se muestran en el footer o en páginas dedicadas

### 3️⃣ Límite Visual de Imágenes por ZIP
**Prioridad:** MEDIA

- Mostrar texto: "Máximo 50 imágenes por ZIP, recomendado 30"
- Validar en frontend antes de enviar
- Mostrar error claro si se excede

### 4️⃣ Analytics Avanzado para Super Admin
**Prioridad:** MEDIA

- Productos más vendidos (global)
- Productos menos vendidos
- Tiendas con más ventas
- Compradores más activos

---

## 📁 ESTRUCTURA DE DATOS

### Tenant (Tienda)
```
/backend/data/tenants/tenant_[uuid]/
├── config.json      ← Configuración de la tienda
├── products.json    ← Productos del tendero
├── orders.json      ← Órdenes recibidas
├── categories.json  ← Categorías propias
└── analytics.json   ← Estadísticas
```

### Global
```
/backend/data/global/
└── platform.json    ← Usuarios, suscripciones, stats
```

---

## 🚀 ORDEN DE IMPLEMENTACIÓN SUGERIDO

1. **INMEDIATO** - Campos de texto (Sobre Nosotros, Políticas)
2. **INMEDIATO** - Límite 50 imágenes por ZIP con mensaje
3. **PRÓXIMO** - Registro de compradores con Gmail
4. **DESPUÉS** - Analytics avanzado Super Admin
5. **FINAL** - Ofertas personalizadas por comprador

---

## ✏️ NOTAS PARA EL DESARROLLADOR

> [!IMPORTANT]
> Antes de modificar cualquier archivo, verificar que no afecte otras partes del sistema.

> [!WARNING]
> El storefront usa puerto 3001 para el backend. Si cambias el puerto del backend, actualizar `storefront/lib/api.ts`.

> [!TIP]
> Para probar cambios:
> 1. Ejecutar `start.bat` en la raíz
> 2. Admin: `http://localhost:5173`
> 3. Storefront: `http://localhost:3000`
> 4. Backend: `http://localhost:3001/health`
