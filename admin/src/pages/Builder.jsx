import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { themeConfigs } from '../../../storefront/lib/themeConfigs';

const API_URL = import.meta.env.VITE_API_URL;
const STOREFRONT_URL = import.meta.env.VITE_STOREFRONT_URL;

if (!API_URL || !STOREFRONT_URL) {
    console.warn('⚠️ Faltan variables de entorno (VITE_API_URL o VITE_STOREFRONT_URL).');
}

// Lista de plantillas disponibles (20 temas)
const AVAILABLE_THEMES = [
    { id: 'tienda-ropa-1', name: 'Tienda Ropa', category: 'Moda' },
    { id: 'tienda-zapatillas', name: 'Zapatillas', category: 'Calzado' },
    { id: 'tienda-electronica', name: 'Electrónica', category: 'Tecnología' },
    { id: 'tienda-joyeria', name: 'Joyería', category: 'Accesorios' },
    { id: 'tienda-celulares', name: 'Celulares', category: 'Tecnología' },
    { id: 'tienda-perfumes', name: 'Perfumes', category: 'Belleza' },
    { id: 'tienda-suplementos', name: 'Suplementos', category: 'Salud' },
    { id: 'tienda-bolsos', name: 'Bolsos', category: 'Accesorios' },
    { id: 'tienda-vitaminas', name: 'Vitaminas', category: 'Salud' },
    { id: 'tienda-cacao', name: 'Cacao & Café', category: 'Alimentos' },
    { id: 'tienda-calzado-2', name: 'Calzado Premium', category: 'Calzado' },
    { id: 'tienda-motocicletas', name: 'Motocicletas', category: 'Vehículos' },
    { id: 'tienda-juegos', name: 'Videojuegos', category: 'Entretenimiento' },
    { id: 'tienda-accesorios', name: 'Accesorios', category: 'General' },
    { id: 'tienda-accesorios-2', name: 'Accesorios Premium', category: 'General' },
    { id: 'tienda-online-accesorios', name: 'Tienda Online', category: 'E-commerce' },
    { id: 'tiendas-moda', name: 'Moda Express', category: 'Moda' },
    { id: 'tienda-movil-moda', name: 'Moda Móvil', category: 'Moda' },
    { id: 'mascotas-3', name: 'Mascotas Premium', category: 'Mascotas' }
].map(theme => ({
    ...theme,
    colors: themeConfigs[theme.id] ? { primary: themeConfigs[theme.id].primary, secondary: themeConfigs[theme.id].secondary } : { primary: '#cccccc', secondary: '#999999' } // Fallback colors
}));

const GlobalConfig = () => {
    const { token, user, logout } = useAuthStore(); // Extract user
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const configRes = await fetch(`${API_URL}/config`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (configRes.status === 401) {
                logout();
                window.location.href = '/login';
                return;
            }

            if (!configRes.ok) {
                throw new Error('Error cargando configuración');
            }

            const configData = await configRes.json();
            setConfig(configData);
        } catch (error) {
            console.error('Error cargando config:', error);
            setMessage('❌ Error cargando configuración. Verifica tu conexión.');
        }
        setLoading(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch(`${API_URL}/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });
            setMessage('✅ Configuración guardada correctamente');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('❌ Error al guardar');
        }
        setSaving(false);
    };

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (network, value) => {
        setConfig(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [network]: value }
        }));
    };

    const handlePublish = async (themeId, themeName) => {
        try {
            const res = await fetch(`${API_URL}/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...config, themeId, isPublished: true })
            });
            if (res.ok) {
                setConfig({ ...config, themeId });
                setMessage(`✅ Plantilla "${themeName}" publicada exitosamente`);
                setTimeout(() => setMessage(''), 3000);

                // Open live store
                if (user?.tenantId) {
                    const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL;
                    window.open(`${storefrontUrl}/store/${user.tenantId}`, '_blank');
                }
            }
        } catch (err) {
            console.error('Error publicando:', err);
            setMessage('❌ Error al publicar');
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando configuración...</div>;
    if (!config) return <div className="p-8 text-center text-red-500">Error: No se pudo cargar la configuración. Intenta recargar la página.</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">🛠️ Constructor & Configuración</h1>
                {message && <div className="bg-green-100 text-green-800 px-4 py-2 rounded animate-pulse">{message}</div>}
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda: Datos del Negocio */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">🏪 Identidad</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre de la Tienda</label>
                                <input
                                    type="text"
                                    value={config.storeName || ''}
                                    onChange={(e) => handleChange('storeName', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                                <input
                                    type="email"
                                    value={config.contactEmail || ''}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Teléfono / WhatsApp</label>
                                <input
                                    type="text"
                                    value={config.contactPhone || ''}
                                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Texto del Pie de Página</label>
                                <textarea
                                    value={config.footerText || ''}
                                    onChange={(e) => handleChange('footerText', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Banner Image Upload */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">🖼️ Imagen del Banner</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            📐 Tamaño recomendado: <strong>1920 x 600 px</strong> para escritorio
                            <br />
                            📱 La imagen se adaptará automáticamente en móviles
                        </p>

                        {/* Preview del banner actual */}
                        {config.bannerImage && (
                            <div className="mb-4 relative">
                                <img
                                    src={config.bannerImage}
                                    alt="Banner preview"
                                    className="w-full h-32 object-cover rounded-lg border"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleChange('bannerImage', '')}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full text-xs hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* File input for upload */}
                        <div className="space-y-3">
                            <input
                                id="banner-upload-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        // Guardar archivo temporalmente en el estado
                                        handleChange('_tempBannerFile', file);
                                    }
                                }}
                                className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition"
                            />

                            {/* Botón de Optimizar */}
                            {config._tempBannerFile && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const file = config._tempBannerFile;
                                        if (!file) return;

                                        setMessage('⏳ Subiendo y optimizando imagen con Cloudinary...');

                                        // Convert file to base64
                                        const reader = new FileReader();
                                        reader.onload = async () => {
                                            const base64 = reader.result;

                                            try {
                                                // Usar la URL de la API definida en la constante superior o fallback seguro a vacío (fallará si no hay env, que es lo esperado)
                                                const res = await fetch(`${API_URL}/upload`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({
                                                        image: base64,
                                                        folder: 'banners',
                                                        format: 'webp',
                                                        quality: 'auto',
                                                        width: 1920,  // Optimizar a tamaño recomendado
                                                        height: 600,
                                                        crop: 'fill',
                                                        source: 'builder' // Identificar origen
                                                    })
                                                });
                                                const data = await res.json();
                                                console.log('Upload response:', data);

                                                if (data.success && data.data?.url) {
                                                    const imageUrl = data.data.url;

                                                    // Update state
                                                    const updatedConfig = {
                                                        ...config,
                                                        bannerImage: imageUrl,
                                                        _tempBannerFile: null // Limpiar archivo temporal
                                                    };
                                                    setConfig(updatedConfig);

                                                    // Auto-save to backend
                                                    await fetch(`${API_URL}/config`, {
                                                        method: 'PUT',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify(updatedConfig)
                                                    });

                                                    setMessage('✅ Imagen optimizada y guardada correctamente');

                                                    // Limpiar input
                                                    document.getElementById('banner-upload-input').value = '';
                                                } else {
                                                    console.error('Upload failed:', data);
                                                    setMessage('❌ Error al subir imagen: ' + (data.error || 'Error desconocido'));
                                                }
                                            } catch (err) {
                                                console.error('Error uploading:', err);
                                                setMessage('❌ Error al subir imagen');
                                            }
                                            setTimeout(() => setMessage(''), 5000);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                >
                                    🚀 Optimizar con Cloudinary AI
                                </button>
                            )}
                            <p className="text-xs text-gray-400">
                                Formatos: JPG, PNG, WebP. Máximo 5MB.
                            </p>

                            {/* URL input alternativo */}
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">O pegar URL de imagen:</label>
                                <input
                                    type="url"
                                    value={config.bannerImage || ''}
                                    onChange={(e) => handleChange('bannerImage', e.target.value)}
                                    placeholder="https://ejemplo.com/banner.jpg"
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">🔗 Redes Sociales</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
                                <input
                                    type="text"
                                    value={config.socialLinks?.facebook || ''}
                                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="https://facebook.com/tienda"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Instagram URL</label>
                                <input
                                    type="text"
                                    value={config.socialLinks?.instagram || ''}
                                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="https://instagram.com/tienda"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4">📝 Secciones de Texto</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sobre Nosotros</label>
                                <textarea
                                    value={config.aboutText || ''}
                                    onChange={(e) => handleChange('aboutText', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
                                    placeholder="Cuéntanos sobre tu historia..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Contacto (Texto Adicional)</label>
                                <textarea
                                    value={config.contactText || ''}
                                    onChange={(e) => handleChange('contactText', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
                                    placeholder="Texto para la sección de contacto..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Políticas de Envío</label>
                                <textarea
                                    value={config.shippingPoliciesText || ''}
                                    onChange={(e) => handleChange('shippingPoliciesText', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
                                    placeholder="Tus políticas de envío..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Políticas de Devolución</label>
                                <textarea
                                    value={config.returnPoliciesText || ''}
                                    onChange={(e) => handleChange('returnPoliciesText', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
                                    placeholder="Tus políticas de devolución..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Términos y Condiciones</label>
                                <textarea
                                    value={config.termsText || ''}
                                    onChange={(e) => handleChange('termsText', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
                                    placeholder="Tus términos y condiciones..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Políticas y Privacidad</label>
                                <textarea
                                    value={config.policiesText || ''}
                                    onChange={(e) => handleChange('policiesText', e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 h-24"
                                    placeholder="Tus políticas de privacidad..."
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg"
                    >
                        {saving ? 'Guardando...' : '💾 Guardar Cambios'}
                    </button>
                </div>

                {/* Columna Derecha: Selector de Plantillas */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">🎨 Seleccionar Plantilla (Diseño)</h2>
                            <span className="text-sm text-gray-500">Todas las plantillas mantienen tus productos y datos.</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {AVAILABLE_THEMES.map((theme) => (
                                <div
                                    key={theme.id}
                                    className={`relative border-2 rounded-xl overflow-hidden transition-all duration-200 ${config.themeId === theme.id
                                        ? 'border-primary-500 ring-2 ring-primary-200 scale-[1.02]'
                                        : 'border-gray-200 hover:border-primary-300'
                                        }`}
                                >
                                    {/* Preview Gradient */}
                                    <div
                                        className="aspect-video flex items-center justify-center text-white font-bold text-lg"
                                        style={{
                                            background: theme.colors
                                                ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%)`
                                                : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)'
                                        }}
                                    >
                                        {theme.name}
                                    </div>

                                    {/* Info and Buttons */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800">{theme.name}</h3>
                                        <p className="text-sm text-gray-500 mb-3">{theme.category}</p>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => window.open(`${STOREFRONT_URL}?preview=${theme.id}`, '_blank')}
                                                className="flex-1 py-2 px-3 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1"
                                            >
                                                👁️ Vista Previa
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handlePublish(theme.id, theme.name)}
                                                disabled={config.themeId === theme.id}
                                                className="flex-1 py-2 px-3 text-sm font-medium text-white rounded-lg transition flex items-center justify-center gap-1"
                                                style={{
                                                    background: theme.colors?.primary || '#6366f1',
                                                    opacity: config.themeId === theme.id ? 0.6 : 1
                                                }}
                                            >
                                                🚀 {config.themeId === theme.id ? 'Publicada' : 'Publicar'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Active Badge */}
                                    {config.themeId === theme.id && (
                                        <div className="absolute top-2 right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg text-sm">
                                            ✓ Activa
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default GlobalConfig;
