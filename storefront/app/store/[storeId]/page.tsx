'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { getStoreConfig } from '../../../lib/api';
import UnifiedTheme from '../../../components/themes/UnifiedTheme';
import { themeConfigs } from '../../../lib/themeConfigs';

// Componente para cargar la tienda específica
function StoreContent() {
    const params = useParams();
    const storeId = params.storeId as string;

    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        if (!storeId) return;

        // Fetch Config, Products AND Categories in parallel
        Promise.all([
            getStoreConfig(storeId),
            import('../../../lib/api').then(({ getStoreProducts }) => getStoreProducts(storeId)).catch(() => []),
            import('../../../lib/api').then(({ getStoreCategories }) => getStoreCategories(storeId)).catch(() => [])
        ])
            .then(([configData, productsData, categoriesData]) => {
                setConfig(configData);
                setProducts(productsData || []);
                setCategories(categoriesData || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error cargando tienda:", err);
                console.log("Store ID attempted:", storeId);
                // Save error message to state
                setConfig({ error: err.message || 'Error desconocido' });
                setError(true);
                setLoading(false);
            });
    }, [storeId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error || !config) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-center px-4">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Tienda no encontrada</h1>
                <p className="text-gray-600 mb-6">La tienda que buscas no existe o ha sido desactivada.</p>

                {/* Debug Info */}
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg max-w-lg w-full mb-6 text-left">
                    <p className="font-bold text-red-800 text-sm mb-2">Información de Depuración:</p>
                    <p className="text-xs text-red-600 font-mono break-all">ID: {storeId}</p>
                    <p className="text-xs text-red-600 font-mono break-all">Error: {config?.error || 'Sin datos de configuración'}</p>
                </div>

                <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Volver al Marketplace
                </a>
            </div>
        );
    }

    // Usar el themeId de la configuración de la tienda
    const themeId = config.themeId || 'tienda-mascotas';
    const specificTheme = themeConfigs[themeId];

    return (
        <UnifiedTheme
            config={config}
            colors={specificTheme}
            themeName={specificTheme?.name}
            initialProducts={products}
            initialCategories={categories}
        />
    );
}

export default function StorePage() {
    return <StoreContent />;
}
