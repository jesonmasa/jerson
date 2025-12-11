# Configuración de Supabase para Constructor

Esta guía te ayudará a configurar Supabase como backend para la plataforma Constructor.

## Paso 1: Crear una cuenta de Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project" o "Sign in"
3. Crea un nuevo proyecto con el nombre que prefieras (ej. "constructor-platform")

## Paso 2: Obtener las credenciales

Una vez creado el proyecto, obtén las siguientes credenciales:

1. **Project URL**: En la sección "Project Settings" > "General"
2. **anon key**: En la sección "Project Settings" > "API"
3. **service_role key**: En la sección "Project Settings" > "API" (usar con cuidado)

## Paso 3: Configurar las variables de entorno

Crea un archivo `.env` en la carpeta `backend` con el siguiente contenido:

```env
# Supabase Configuration
SUPABASE_URL=tu_project_url_aqui
SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# JWT Secret (aún necesario para compatibilidad)
JWT_SECRET=una_clave_secreta_segura

# Cloudinary (si ya lo estabas usando)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

## Paso 4: Crear las tablas de la base de datos

1. En el dashboard de Supabase, ve a la sección "SQL Editor"
2. Copia y pega el contenido del archivo `backend/src/database/supabaseSchema.sql`
3. Ejecuta el script para crear todas las tablas

## Paso 5: Configurar la autenticación

1. Ve a la sección "Authentication" > "Settings"
2. Habilita "Email Confirmations" si deseas verificar emails
3. Configura los dominios permitidos si es necesario

## Paso 6: Configurar políticas de seguridad (RLS)

Para producción, deberás configurar las políticas de Row Level Security:

1. Para cada tabla, habilita RLS
2. Crea políticas que permitan a los usuarios acceder solo a sus datos

Ejemplo para la tabla `products`:
```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own products
CREATE POLICY "Users can only access their own products" 
ON products 
FOR ALL 
USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));
```

## Paso 7: Probar la conexión

1. Asegúrate de haber instalado las dependencias:
   ```bash
   cd backend
   npm install
   ```

2. Inicia el servidor:
   ```bash
   npm run dev
   ```

3. Verifica que no haya errores en la consola

## Beneficios de usar Supabase

1. **Base de datos PostgreSQL**: Más robusta que el sistema de archivos
2. **Autenticación integrada**: Sistema de usuarios y login completo
3. **Almacenamiento de archivos**: Para imágenes y otros recursos
4. **Funciones serverless**: Para lógica personalizada
5. **Tiempo real**: Suscripciones a cambios en la base de datos
6. **API automática**: Endpoints REST y GraphQL generados automáticamente

## Límites del plan gratuito

- 500 MB de almacenamiento de base de datos
- 1 GB de almacenamiento de archivos
- 5 GB de transferencia mensual
- Proyecto único gratuito

Esto es más que suficiente para tus 40 usuarios de prueba con 80,000 imágenes.