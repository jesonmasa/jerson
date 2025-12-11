# 📘 DOCUMENTACIÓN MAESTRA DEL SISTEMA "CONSTRUCTOR"

> **Versión del Documento:** 1.0.0
> **Fecha:** 2025-12-07
> **Estado del Sistema:** Limpio y Optimizado 🧹

---

## 🏗️ 1. Arquitectura del Proyecto (Monorepo)

El sistema está construido como un **Monorepo** moderno, separando claramente las responsabilidades en tres aplicaciones principales y un backend compartido.

### Estructura de Directorios (Limpia)
```
/constructor
├── 📂 admin         # Panel de Administración (React + Vite)
├── 📂 backend       # Servidor API y Base de Datos (Express + Node)
├── 📂 storefront    # Tienda Pública y Marketplace (Next.js 14)
├── 📂 shared        # Utilidades compartidas (si aplica)
└── 📂 plantillas    # Archivos HTML crudos de plantillas (referencia)
```

---

## 🧠 2. Backend (El Cerebro)

El backend maneja la lógica multi-tenant (múltiples tiendas en un solo sistema) y la seguridad.

### Base de Datos (JSON Nativo)
El sistema NO usa SQL ni MongoDB, sino un sistema de **Base de Datos JSON de Alto Rendimiento** diseñado a medida.
- **Ruta:** `backend/data/`
- **Global:** `backend/data/global/platform.json` (Usuarios, Suscripciones, Configuración Global).
- **Tenants:** `backend/data/tenants/[tenantId]/` (Cada tienda tiene su propia carpeta aislada).
    - `config.json`: Configuración de la tienda (logo, nombre, tema).
    - `products.json`: Catálogo de productos.
    - `orders.json`: Historial de pedidos.

### API Routes (Endpoints Activos)
> **Nota:** Se han eliminado rutas obsoletas (`stores.js`, `auth legacy`).

| Método | Ruta Base | Descripción | Tipo |
| :--- | :--- | :--- | :--- |
| **AUTH** | `/api/auth` | Login/Registro Multi-tenant (v2) | Público |
| **MARKETPLACE** | `/api/marketplace` | **NUEVO:** Agregador global de productos (AliExpress style) | Público |
| **TIENDAS** | `/api/v2/config/store/:id` | Obtener configuración de una tienda específica | Público |
| **PRODUCTOS** | `/api/v2/products/store/:id` | Obtener productos de una tienda específica | Público |
| **ADMIN** | `/api/super-admin` | Panel de control del dueño de la plataforma | Privado (SuperAdmin) |
| **GESTIÓN** | `/api/v2/products` | CRUD de productos (contexto autenticado) | Privado (Owner) |

---

## 🛍️ 3. Storefront (La Cara Pública)

El storefront es una aplicación **Next.js 14** híbrida que funciona como:
1.  **Marketplace Global:** La página de inicio (`/`) agrega productos de todas las tiendas.
2.  **Tiendas Individuales:** Las rutas `/store/[storeId]` cargan dinámicamente el tema y productos de cada cliente.

### Componentes Clave (Limpio y Unificado)
> Se eliminó la carpeta duplicada `src` y temas antiguos.

- **UnifiedTheme (`components/themes/UnifiedTheme.tsx`)**: 
    - El "Motor de Renderizado" principal.
    - Incluye carrusel 3D, lógica de carrito, checkout por WhatsApp y diseño responsive.
- **Marketplace Components (`components/marketplace/`)**:
    - `FilterSidebar`: Filtros de precio y categoría.
    - `FlashDeals`: Sección de ofertas con contador.
    - `QuickViewModal`: Vista rápida de productos.

---

## ⚙️ 4. Admin Panel (El Control)

Aplicación **React + Vite** para que los dueños de tiendas gestionen su negocio.
- **Constructor Visual:** Integra GrapesJS para editar la apariencia.
- **Importador:** Permite subir productos masivamente (CSV/Excel).
- **Dashboard:** Estadísticas en tiempo real.

---

## 🚀 5. Guía de Despliegue y Mantenimiento

### Comandos de Limpieza
Si el proyecto crece mucho en disco, ejecuta estos comandos para borrar cachés temporales (¡NO BORRA CÓDIGO!):
```bash
# Limpiar instalaciones de node (reinstalar después)
rm -rf node_modules
rm -rf backend/node_modules
rm -rf storefront/.next
rm -rf admin/dist
```

### Cómo Iniciar
El archivo `start.bat` en la raíz orquesta todo:
1.  Inicia Backend (Puerto 3001/9000).
2.  Inicia Storefront (Puerto 3000).
3.  Inicia Admin (Puerto 5173).

---
**✅ Informe de Limpieza:**
- Se eliminaron 4 archivos de backend obsoletos que causaban conflicto.
- Se eliminó 1 directorio entero duplicado (`storefront/src`) reduciendo peso y confusión.
- Se verificó la compilación del Storefront exitosamente.
