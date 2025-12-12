### Configuración de Variables de Entorno en Vercel

Para que el sistema de correos funcione (Gmail) y la base de datos (Supabase) se conecte, debes configurar estas variables en el panel de Vercel (**Importante**: No las compartas):

1.  Ve a tu proyecto en Vercel -> Settings -> Environment Variables.
2.  Agrega las siguientes (copia los valores de tu `.env` o credenciales):

**Correos (Gmail):**
| Key | Value |
| :--- | :--- |
| `EMAIL_USER` | `fonsecakiran@gmail.com` |
| `EMAIL_PASS` | `tclebejcfxkyodws` |
| `RESEND_API_KEY` | *(Opcional, si usas Resend)* |

**Base de Datos (Supabase):**
| Key | Value |
| :--- | :--- |
| `SUPABASE_URL` | *Tu URL de Supabase* |
| `SUPABASE_KEY` | *Tu Anon/Service Role Key* |

**Cloudinary (Imágenes):**
| Key | Value |
| :--- | :--- |
| `CLOUDINARY_CLOUD_NAME` | `dpksutdjn` |
| `CLOUDINARY_API_KEY` | `989912644265934` |
| `CLOUDINARY_API_SECRET` | `4sL8s2iOQG-y3_LlbJpPOB92yvo` |

**Seguridad:**
| Key | Value |
| :--- | :--- |
| `JWT_SECRET` | *Genera una clave segura larga* |

--- 
*Nota: El sistema ya está configurado para leer estas variables automáticamente.*
