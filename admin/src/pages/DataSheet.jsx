import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.warn('Falta VITE_API_URL');

/**
 * Celda editable para la tabla de productos
 */
const EditableCell = ({ value, onChange, type = 'text', options = [], disabled = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        if (tempValue !== value) {
            onChange(tempValue);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
        if (e.key === 'Escape') {
            setTempValue(value);
            setIsEditing(false);
        }
    };

    if (disabled) {
        return <span className="text-gray-400">{value || '-'}</span>;
    }

    if (type === 'select') {
        return (
            <select
                value={tempValue || ''}
                onChange={(e) => {
                    setTempValue(e.target.value);
                    onChange(e.target.value);
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
                <option value="">Seleccionar...</option>
                {options.map((opt) => (
                    <option key={opt.value || opt} value={opt.value || opt}>
                        {opt.label || opt}
                    </option>
                ))}
            </select>
        );
    }

    if (!isEditing) {
        return (
            <div
                onClick={() => setIsEditing(true)}
                className="cursor-pointer px-2 py-1 hover:bg-gray-100 rounded min-h-[28px] transition-colors"
            >
                {type === 'number' && value ? `S/${parseFloat(value).toFixed(2)}` : (value || <span className="text-gray-300">Click para editar</span>)}
            </div>
        );
    }

    return (
        <input
            type={type === 'number' ? 'number' : 'text'}
            value={tempValue || ''}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full px-2 py-1 border border-primary-500 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            step={type === 'number' ? '0.01' : undefined}
        />
    );
};

/**
 * Badge de conteo regresivo para envíos
 */
const CountdownBadge = ({ countdown }) => {
    if (!countdown) return null;

    const statusColors = {
        delivered: 'bg-green-100 text-green-800 border-green-200',
        not_delivered: 'bg-red-100 text-red-800 border-red-200',
        on_track: 'bg-blue-100 text-blue-800 border-blue-200',
        soon: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        today: 'bg-orange-100 text-orange-800 border-orange-200',
        overdue: 'bg-red-100 text-red-800 border-red-200 animate-pulse'
    };

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[countdown.status] || 'bg-gray-100'}`}>
            {countdown.text}
        </span>
    );
};

/**
 * Componente de subida de archivos ZIP con Preview Inteligente
 */
const BulkUploader = ({ onUploadComplete, categories = [] }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [smartGrouping, setSmartGrouping] = useState(true); // Activado por defecto
    const [previewData, setPreviewData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.name.endsWith('.zip')) {
            setSelectedFile(file);
            if (smartGrouping) {
                await loadPreview(file);
            }
        } else {
            setError('Solo se permiten archivos .zip');
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setError(null);
            setPreviewData(null);
            if (smartGrouping) {
                await loadPreview(file);
            }
        }
    };

    const loadPreview = async (file) => {
        setLoadingPreview(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/bulk-upload/preview`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setPreviewData(data);
        } catch (err) {
            setError('Error analizando el archivo: ' + err.message);
        } finally {
            setLoadingPreview(false);
        }
    };

    const uploadFile = async (file) => {
        setUploading(true);
        setError(null);
        setProgress({ status: 'uploading', message: 'Subiendo archivo...' });

        try {
            const token = useAuthStore.getState().token;

            if (!token) {
                throw new Error('No has iniciado sesión. Por favor, logueate nuevamente.');
            }


            const formData = new FormData();
            formData.append('file', file);
            if (selectedCategory) {
                formData.append('category', selectedCategory);
            }
            formData.append('smartGrouping', smartGrouping);

            const response = await fetch(`${API_URL}/bulk-upload/multipart`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al subir archivo');
            }

            pollJobStatus(data.jobId);

        } catch (err) {
            setError(err.message);
            setUploading(false);
        }
    };

    const pollJobStatus = async (jobId) => {
        const token = useAuthStore.getState().token;
        if (!token) return; // Si no hay token, no podemos consultar

        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_URL}/bulk-upload/status/${jobId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error(`${response.status}`);
                const data = await response.json();

                let statusMessage = data.status === 'completed'
                    ? `✅ ${data.products?.length || 0} productos creados correctamente`
                    : `Procesando ${data.processed || 0}/${data.total || '?'} imágenes...`;

                if (data.status === 'saving') {
                    statusMessage = '💾 Guardando en base de datos... (Esto puede demorar unos segundos)';
                } else if (data.status === 'processing' && data.progress === 100) {
                    statusMessage = '⌛ Finalizando procesos...';
                }

                setProgress({
                    status: data.status,
                    progress: data.progress,
                    processed: data.processed,
                    total: data.total,
                    message: statusMessage
                });

                if (data.status === 'completed') {
                    // Actualizar mensaje pero NO quitar el loading todavía
                    setProgress({
                        ...progress,
                        status: 'completed',
                        progress: 100,
                        message: '✅ Procesamiento completado. Actualizando lista de productos...'
                    });

                    // Esperar a que la tabla se refresque (esto disparará el loading general de DataSheet)
                    if (onUploadComplete) {
                        try {
                            await onUploadComplete();
                        } catch (e) {
                            console.error("Error refreshing table:", e);
                        }
                    }

                    // Si el componente no se desmontó (porque DataSheet no usó loading global), limpiamos estado
                    setUploading(false);
                    setPreviewData(null);
                    setSelectedFile(null);
                } else if (data.status === 'error') {
                    setError(data.error || 'Error desconocido');
                    setUploading(false);
                } else {
                    setTimeout(checkStatus, 1000);
                }
            } catch (err) {
                console.error("Polling error:", err);
                // Si el job no existe (404) pero estábamos "saving", asumimos que terminó y el servidor reinició.
                // O si simplemente falló la red, reintentamos.
                if (err.message && err.message.includes('404')) {
                    // Si ya habíamos progresado, probablemente terminó.
                    if (progress?.status === 'saving' || progress?.progress > 90) {
                        setUploading(false);
                        setPreviewData(null);
                        setSelectedFile(null);
                        onUploadComplete?.();
                        return; // Stop polling
                    } else {
                        // Si falló muy temprano, es error real.
                        setError('El proceso se interrumpió. Por favor revisa la tabla.');
                        setUploading(false);
                        return;
                    }
                }
                setTimeout(checkStatus, 2000);
            }
        };

        checkStatus();
    };

    const handleConfirmUpload = () => {
        if (selectedFile) {
            uploadFile(selectedFile);
        }
    };

    const handleCancelPreview = () => {
        setPreviewData(null);
        setSelectedFile(null);
    };

    return (
        <div className="mb-6">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }`}
            >
                {uploading ? (
                    <div className="space-y-4">
                        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600">{progress?.message}</p>
                        {progress?.progress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-primary-500 h-2.5 rounded-full transition-all"
                                    style={{ width: `${progress.progress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                ) : loadingPreview ? (
                    <div className="space-y-4">
                        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-gray-600">Analizando archivo ZIP...</p>
                    </div>
                ) : previewData ? (
                    // VISTA PREVIA DE AGRUPACIÓN
                    <div className="text-left">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                🔍 Vista Previa de Agrupación
                            </h3>
                            <span className="text-sm text-gray-500">
                                {previewData.totalImages} imágenes → {previewData.totalProducts} productos
                            </span>
                        </div>

                        <div className="max-h-64 overflow-y-auto mb-4 rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Producto</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Categoría</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Imágenes</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Colores Detectados</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {previewData.groups.map((group, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-3 py-2 font-medium text-gray-900">{group.name}</td>
                                            <td className="px-3 py-2 text-gray-600">{group.category}</td>
                                            <td className="px-3 py-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {group.imageCount}
                                                </span>
                                            </td>
                                            <td className="px-3 py-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {group.colors.length > 0 ? group.colors.map((color, i) => (
                                                        <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            {color}
                                                        </span>
                                                    )) : (
                                                        <span className="text-gray-400 text-xs">Sin color detectado</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center gap-3">
                            <button
                                onClick={handleCancelPreview}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                ❌ Cancelar
                            </button>
                            <button
                                onClick={handleConfirmUpload}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                            >
                                ✅ Confirmar y Subir ({previewData.totalProducts} productos)
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="text-5xl mb-4">📦</div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            Carga Masiva de Productos
                        </p>

                        {/* Opciones Avanzadas */}
                        <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 text-left">Opciones de Subida</h4>

                            {/* Selector de Categoría */}
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1 text-left">
                                    Categoría para todo el ZIP (Opcional)
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                >
                                    <option value="">-- Usar carpetas del ZIP --</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Toggle Smart Grouping */}
                            <div className="flex items-start">
                                <input
                                    id="smartGrouping"
                                    type="checkbox"
                                    checked={smartGrouping}
                                    onChange={(e) => setSmartGrouping(e.target.checked)}
                                    className="h-4 w-4 mt-1 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <label htmlFor="smartGrouping" className="ml-2 block text-sm text-gray-700 text-left">
                                    <span className="font-medium">🎨 Modo Inteligente (Recomendado)</span>
                                    <span className="block text-xs text-gray-500 mt-1">
                                        Detecta colores automáticamente del nombre del archivo.<br />
                                        <strong>Ejemplo:</strong> vestido_rojo.jpg, vestido_azul.jpg → 1 Producto "Vestido" con 2 colores
                                    </span>
                                </label>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-4">
                            Arrastra un archivo ZIP o haz click para seleccionar
                        </p>
                        <input
                            type="file"
                            accept=".zip"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="zip-upload"
                        />
                        <label
                            htmlFor="zip-upload"
                            className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg cursor-pointer hover:bg-primary-600 transition-colors"
                        >
                            Seleccionar archivo ZIP
                        </label>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    ❌ {error}
                </div>
            )}

            {progress?.status === 'completed' && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex justify-between items-center">
                    <span>{progress.message}</span>
                    <button
                        onClick={() => onUploadComplete?.()}
                        className="ml-4 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                        🔄 Recargar Tabla
                    </button>
                </div>
            )}
        </div>
    );
};
const ProductsTab = ({ products, categories, onRefresh, onUpdate }) => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [filter, setFilter] = useState({ category: '', status: '', search: '' });
    const [sortBy, setSortBy] = useState({ field: 'createdAt', order: 'desc' });

    const filteredProducts = products
        .filter(p => {
            if (filter.category && p.category !== filter.category) return false;
            if (filter.status && p.status !== filter.status) return false;
            if (filter.search && !p.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            const aVal = a[sortBy.field] || '';
            const bVal = b[sortBy.field] || '';
            const order = sortBy.order === 'asc' ? 1 : -1;
            return aVal > bVal ? order : -order;
        });

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedIds.length === filteredProducts.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProducts.map(p => p.id));
        }
    };

    const handleBulkPublish = async () => {
        if (selectedIds.length === 0) return;
        try {
            const token = useAuthStore.getState().token;
            await fetch(`${API_URL}/v2/products/bulk-publish`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ids: selectedIds })
            });
            setSelectedIds([]);
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`¿Eliminar ${selectedIds.length} productos?`)) return;
        try {
            const token = useAuthStore.getState().token;
            await fetch(`${API_URL}/v2/products/bulk-delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ids: selectedIds })
            });
            setSelectedIds([]);
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCellChange = async (productId, field, value) => {
        try {
            const token = useAuthStore.getState().token;
            const product = products.find(p => p.id === productId);
            const updatedData = { ...product, [field]: value };

            await fetch(`${API_URL}/v2/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(updatedData)
            });

            onUpdate(productId, { [field]: value });
        } catch (err) {
            console.error(err);
        }
    };

    const handlePublish = async (productId) => {
        try {
            const token = useAuthStore.getState().token;
            await fetch(`${API_URL}/v2/products/${productId}/publish`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (productId) => {
        if (!confirm('¿Eliminar este producto?')) return;
        try {
            const token = useAuthStore.getState().token;
            await fetch(`${API_URL}/v2/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {/* Subida masiva */}
            <BulkUploader onUploadComplete={onRefresh} categories={categories} />

            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="🔍 Buscar productos..."
                    value={filter.search}
                    onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <select
                    value={filter.category}
                    onChange={(e) => setFilter(f => ({ ...f, category: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Todas las categorías</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                </select>
                <select
                    value={filter.status}
                    onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Todos los estados</option>
                    <option value="draft">🟡 Borrador</option>
                    <option value="published">🟢 Publicado</option>
                </select>
            </div>

            {/* Acciones masivas */}
            {selectedIds.length > 0 && (
                <div className="flex gap-2 mb-4 p-3 bg-primary-50 rounded-lg">
                    <span className="text-sm text-primary-700 font-medium flex items-center gap-2">
                        ✓ {selectedIds.length} seleccionados
                    </span>
                    <button
                        onClick={handleBulkPublish}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                        Publicar
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            )}

            {/* Tabla */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 w-10">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                                    onChange={selectAll}
                                    className="rounded"
                                />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                onClick={() => setSortBy(s => ({ field: 'name', order: s.order === 'asc' ? 'desc' : 'asc' }))}>
                                Nombre {sortBy.field === 'name' && (sortBy.order === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                                onClick={() => setSortBy(s => ({ field: 'price', order: s.order === 'asc' ? 'desc' : 'asc' }))}>
                                Precio {sortBy.field === 'price' && (sortBy.order === 'asc' ? '↑' : '↓')}
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tallas</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colores</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(product.id)}
                                        onChange={() => toggleSelect(product.id)}
                                        className="rounded"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <img
                                        src={product.image || '/placeholder.png'}
                                        alt={product.name}
                                        className="w-12 h-12 object-cover rounded-lg border"
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        value={product.name}
                                        onChange={(v) => handleCellChange(product.id, 'name', v)}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        value={product.category}
                                        type="select"
                                        options={categories.map(c => c.name)}
                                        onChange={(v) => handleCellChange(product.id, 'category', v)}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        value={product.price}
                                        type="number"
                                        onChange={(v) => handleCellChange(product.id, 'price', parseFloat(v) || null)}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        value={product.stock}
                                        type="number"
                                        onChange={(v) => handleCellChange(product.id, 'stock', parseInt(v) || 0)}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        value={product.sizes?.join(', ') || ''}
                                        onChange={(v) => handleCellChange(product.id, 'sizes', v.split(',').map(s => s.trim()).filter(Boolean))}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        value={product.colors?.join(', ') || ''}
                                        onChange={(v) => handleCellChange(product.id, 'colors', v.split(',').map(s => s.trim()).filter(Boolean))}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.status === 'published'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {product.status === 'published' ? '🟢 Publicado' : '🟡 Borrador'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        {product.status !== 'published' && (
                                            <button
                                                onClick={() => handlePublish(product.id)}
                                                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                title="Publicar"
                                            >
                                                Publicar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                            title="Eliminar"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                                    No hay productos para mostrar
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/**
 * Pestaña de Pedidos
 */
const OrdersTab = ({ orders, onRefresh }) => {
    const [filter, setFilter] = useState({ status: '', search: '' });

    const statusLabels = {
        pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
        processing: { label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
        shipped: { label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
        delivered: { label: 'Entregado', color: 'bg-green-100 text-green-800' },
        not_delivered: { label: 'No entregado', color: 'bg-red-100 text-red-800' },
        cancelled: { label: 'Cancelado', color: 'bg-gray-100 text-gray-800' }
    };

    const filteredOrders = orders.filter(o => {
        if (filter.status && o.status !== filter.status) return false;
        if (filter.search) {
            const search = filter.search.toLowerCase();
            return o.id?.toLowerCase().includes(search) ||
                o.customer?.toLowerCase().includes(search);
        }
        return true;
    });

    const handleCreateShipment = async (orderId) => {
        const days = prompt('¿Cuántos días estimados de entrega?', '3');
        if (!days) return;

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/shipments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderId, estimatedDays: parseInt(days) })
            });
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {/* Filtros */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="🔍 Buscar por ID o cliente..."
                    value={filter.search}
                    onChange={(e) => setFilter(f => ({ ...f, search: e.target.value }))}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <select
                    value={filter.status}
                    onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Todos los estados</option>
                    {Object.entries(statusLabels).map(([key, { label }]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"># Pedido</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono font-medium text-primary-600">{order.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString('es-PE')}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="max-w-[200px]">
                                        {order.items_details?.map((item, idx) => (
                                            <div key={idx} className="text-sm truncate">
                                                {item.name} x{item.quantity}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium text-green-600">
                                    S/{order.total?.toFixed(2) || '0.00'}
                                </td>
                                <td className="px-4 py-3">{order.customer || 'N/A'}</td>
                                <td className="px-4 py-3 text-sm">{order.phone || 'N/A'}</td>
                                <td className="px-4 py-3 text-sm max-w-[150px] truncate" title={order.address}>
                                    {order.address || 'N/A'}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabels[order.status]?.color || 'bg-gray-100'}`}>
                                        {statusLabels[order.status]?.label || order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {order.status === 'pending' && (
                                        <button
                                            onClick={() => handleCreateShipment(order.id)}
                                            className="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600"
                                        >
                                            📦 Marcar Enviado
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                    No hay pedidos para mostrar
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/**
 * Pestaña de Envíos
 */
const ShipmentsTab = ({ shipments, onRefresh }) => {
    const [filter, setFilter] = useState({ status: '' });

    const filteredShipments = shipments.filter(s => {
        if (filter.status && s.status !== filter.status) return false;
        return true;
    });

    const handleMarkDelivered = async (shipmentId) => {
        if (!confirm('¿Confirmar entrega? El stock se reducirá automáticamente.')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/shipments/${shipmentId}/delivered`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkNotDelivered = async (shipmentId) => {
        const reason = prompt('Motivo de no entrega (opcional):', '');
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/shipments/${shipmentId}/not-delivered`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ reason })
            });
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckPending = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/shipments/check-pending`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            alert(`Se enviaron ${data.notificationsSent} notificaciones`);
            onRefresh();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            {/* Filtros y acciones */}
            <div className="flex flex-wrap gap-4 mb-4 items-center">
                <select
                    value={filter.status}
                    onChange={(e) => setFilter(f => ({ ...f, status: e.target.value }))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                    <option value="">Todos los estados</option>
                    <option value="in_transit">En camino</option>
                    <option value="delivered">Entregado</option>
                    <option value="not_delivered">No entregado</option>
                </select>
                <button
                    onClick={handleCheckPending}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                    📧 Enviar notificaciones pendientes
                </button>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"># Pedido</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Envío</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Días Est.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conteo</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredShipments.map((shipment) => (
                            <tr key={shipment.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-mono font-medium text-primary-600">
                                    {shipment.order?.id || shipment.orderId}
                                </td>
                                <td className="px-4 py-3">{shipment.order?.customer || 'N/A'}</td>
                                <td className="px-4 py-3 text-sm max-w-[150px] truncate" title={shipment.order?.address}>
                                    {shipment.order?.address || 'N/A'}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {shipment.shippedAt
                                        ? new Date(shipment.shippedAt).toLocaleDateString('es-PE')
                                        : 'N/A'}
                                </td>
                                <td className="px-4 py-3">{shipment.estimatedDays} días</td>
                                <td className="px-4 py-3">
                                    <CountdownBadge countdown={shipment.countdown} />
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        shipment.status === 'not_delivered' ? 'bg-red-100 text-red-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {shipment.status === 'delivered' ? '✅ Entregado' :
                                            shipment.status === 'not_delivered' ? '❌ No entregado' :
                                                '📦 En camino'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {shipment.status === 'in_transit' && (
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => handleMarkDelivered(shipment.id)}
                                                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                            >
                                                ✓ Entregado
                                            </button>
                                            <button
                                                onClick={() => handleMarkNotDelivered(shipment.id)}
                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                            >
                                                ✗ No
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredShipments.length === 0 && (
                            <tr>
                                <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                    No hay envíos para mostrar
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/**
 * Página principal DataSheet
 */
const DataSheet = () => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Usar token del store EXCLUSIVAMENTE
            const token = useAuthStore.getState().token;

            // Limpieza de legacy
            // Limpieza de legacy removida: localStorage.removeItem('token');

            if (!token) {
                console.error('No token found in store or localStorage');
                setLoading(false);
                return;
            }
            const headers = { 'Authorization': `Bearer ${token}` };
            const t = Date.now();
            const [productsRes, ordersRes, shipmentsRes, categoriesRes] = await Promise.all([
                fetch(`${API_URL}/v2/products?t=${t}`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
                fetch(`${API_URL}/v2/orders?t=${t}`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
                fetch(`${API_URL}/shipments?t=${t}`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []),
                fetch(`${API_URL}/v2/categories?t=${t}`, { headers, cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => [])
            ]);

            setProducts(Array.isArray(productsRes) ? productsRes : []);
            setOrders(Array.isArray(ordersRes) ? ordersRes : []);
            setShipments(Array.isArray(shipmentsRes) ? shipmentsRes : []);
            setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleProductUpdate = (productId, updates) => {
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, ...updates } : p
        ));
    };

    const tabs = [
        { id: 'products', label: 'Productos', icon: '🏷️', count: products.length },
        { id: 'orders', label: 'Pedidos', icon: '📦', count: orders.length },
        { id: 'shipments', label: 'Envíos', icon: '🚚', count: shipments.length }
    ];

    // Contar envíos vencidos
    const overdueCount = shipments.filter(s =>
        s.status === 'in_transit' && s.countdown?.status === 'overdue'
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        📊 Hoja de Datos
                    </h1>
                    <p className="text-gray-500 mt-1">Gestiona productos, pedidos y envíos desde un solo lugar</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    🔄 Actualizar
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span className="font-medium">{tab.label}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-100'
                                }`}>
                                {tab.count}
                            </span>
                            {tab.id === 'shipments' && overdueCount > 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 animate-pulse">
                                    ⚠️ {overdueCount}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <div className="animate-fadeIn">
                    {activeTab === 'products' && (
                        <ProductsTab
                            products={products}
                            categories={categories}
                            onRefresh={fetchData}
                            onUpdate={handleProductUpdate}
                        />
                    )}
                    {activeTab === 'orders' && (
                        <OrdersTab
                            orders={orders}
                            onRefresh={fetchData}
                        />
                    )}
                    {activeTab === 'shipments' && (
                        <ShipmentsTab
                            shipments={shipments}
                            onRefresh={fetchData}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default DataSheet;
