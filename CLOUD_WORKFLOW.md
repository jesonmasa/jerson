# ☁️ Arquitectura y Flujo de Trabajo en la Nube
**Proyecto: Constructor Platform (Jerson)**

Este documento describe la arquitectura distribuida de la plataforma. **IMPORTANTE**: Este proyecto YA NO se ejecuta localmente para producción. Todos los servicios están desacoplados y alojados en la nube.

---

## 🏗️ Los 4 Pilares de la Arquitectura

El sistema no está en un solo lugar. Funciona como un rompecabezas donde cada pieza vive en el servidor especializado para su tarea:

| Componente | Servicio | URL / Estado | Función |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | `jerson-storefront.vercel.app` <br> `jerson-admin.vercel.app` | Muestra la interfaz visual (React/Next.js/Vite) al cliente. |
| **Backend** | **Render** | `constructor-backend-gelt.onrender.com` | El "cerebro". Procesa lógica, seguridad y conecta todo. |
| **Base de Datos**| **Supabase** | `bmiuogfvzycwsfkbphpg.supabase.co` | Guarda usuarios, productos, pedidos, etc. (PostgreSQL). |
| **Multimedia** | **Cloudinary** | `res.cloudinary.com/dpksutdjn` | Almacena y optimiza todas las imágenes subidas. |

---

## 🔄 Flujo de Datos (Cómo funciona por dentro)

Cuando un usuario interactúa con la plataforma, esto es lo que sucede:

1.  **Visita**: El usuario entra a `jerson-storefront.vercel.app`. **Vercel** le envía la página.
2.  **Datos**: La página pide productos. El navegador hace una petición a **Render** (`/api/products`).
3.  **Consulta**: **Render** le pregunta a **Supabase**: "¿Qué productos tengo?".
4.  **Respuesta**: **Supabase** devuelve los datos de texto y los links de las imágenes (que apuntan a **Cloudinary**).
5.  **Renderizado**: El usuario ve los productos con imágenes cargando ultra-rápido desde **Cloudinary**.

**Nada de esto pasa por tu computadora local.**

---

## 🚀 Flujo de Trabajo para Desarrollo (Cómo hacer cambios)

Para seguir trabajando y escalando, sigue estrictamente este ciclo. **NO toques la base de datos local ni intentes correr el servidor de producción en tu PC.**

### Pasos para editar código:

1.  **Edita en Local**: Abre VS Code y haz tus cambios en los archivos (ej: cambiar un color, añadir una función).
2.  **Prueba (Opcional)**: Puedes usar `npm run dev` solo para ver cambios visuales, pero recuerda que apuntará a los servicios en la nube si las variables de entorno están configuradas.
3.  **Sube a GitHub**:
    ```bash
    git add .
    git commit -m "Descripción del cambio"
    git push origin main
    ```
4.  **Despliegue Automático**:
    *   Al hacer `git push`, **Vercel** detectará cambios en el Frontend y actualizará la página web automáticamente.
    *   Si tocaste la carpeta `backend`, **Render** detectará el cambio y reiniciará el servidor automáticamente.

### Cómo Escalar (Crecimiento)

El sistema está diseñado para ser Multi-Tenant (Múltiples tiendas en una sola instalación).

*   **Nuevos Usuarios**: Simplemente se registran. El sistema crea su `tenantId` automáticamente.
*   **Enlaces de Tiendas**: Cada usuario tiene automáticamente su tienda en `jerson-storefront.vercel.app/s/[ID-TIENDA]`.
*   **Más Tráfico**:
    *   Si la web va lenta: Aumenta el plan en **Vercel**.
    *   Si la API va lenta: Aumenta la RAM/CPU en **Render**.
    *   Si hay muchas imágenes: Compra créditos en **Cloudinary**.

---

## 🔐 Credenciales y Accesos

*   **Super Admin**: El primer usuario registrado en el sistema obtiene control total.
*   **Environment Variables**:
    *   Frontend necesita: `NEXT_PUBLIC_API_URL` (apuntando a Render).
    *   Backend necesita: `DATABASE_URL` (Supabase) y `CLOUDINARY_URL`.

---

**Resumen**: Tu computadora es ahora solo un "editor de texto". La plataforma vive en Internet.
