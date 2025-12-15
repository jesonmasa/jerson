import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) console.warn('Falta VITE_API_URL');

/**
 * Página de Galería de Imágenes
 * Permite subir ZIPs, ver todas las imágenes y copiar URLs
 */
const Gallery = () => {
    const { token } = useAuthStore();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState(null);

    // Cargar imágenes
    const loadImages = useCallback(async () => {
        try {
            if (!token) return; // No intentar si no hay token
            const response = await fetch(`${API_URL}/gallery`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setImages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading gallery:', error);
            setImages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadImages();
    }, [loadImages]);

    // State for Magic Tool
    const [magicMode, setMagicMode] = useState(false);
    const [resizeOption, setResizeOption] = useState('original');
    const [upscale, setUpscale] = useState(false);
    const [removeBg, setRemoveBg] = useState(false);
    const [aiAnalyze, setAiAnalyze] = useState(false);

    // New state for progress tracking
    const [processingImages, setProcessingImages] = useState([]);

    // Subir ZIP
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setUploadProgress('❌ Por favor selecciona un archivo ZIP');
            setTimeout(() => setUploadProgress(null), 3000);
            return;
        }

        if (!file.name.endsWith('.zip')) {
            setUploadProgress('❌ Por favor selecciona un archivo ZIP válido');
            setTimeout(() => setUploadProgress(null), 3000);
            return;
        }

        // Check file size (limit to 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            setUploadProgress(`❌ El archivo ZIP es demasiado grande. Máximo permitido: 100MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
            setTimeout(() => setUploadProgress(null), 5000);
            return;
        }

        setUploading(true);
        setUploadProgress(`⏳ Analizando archivo... (${(file.size / 1024 / 1024).toFixed(1)} MB)`);

        try {
            // FIXED: Usar token del authStore en lugar de localStorage
            const formData = new FormData();
            formData.append('file', file);

            // Magic Tool options
            if (magicMode) {
                formData.append('magicMode', 'true');
                formData.append('resize', resizeOption);
                formData.append('upscale', upscale.toString());
                formData.append('removeBg', removeBg.toString());
                formData.append('aiAnalyze', aiAnalyze.toString());
            }

            const response = await fetch(`${API_URL}/gallery/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setUploadProgress(`✅ ${result.uploaded} imágenes subidas correctamente`);
                loadImages();
                setTimeout(() => setUploadProgress(null), 3000);
            } else {
                // Handle different types of errors
                if (result.maxLimit && result.currentCount) {
                    setUploadProgress(`❌ Error: Has superado el límite de ${result.maxLimit} imágenes. Tu ZIP contiene ${result.currentCount} imágenes.`);
                } else if (result.code === 'ZIP_PROCESSING_ERROR') {
                    setUploadProgress(`❌ Error al procesar el archivo ZIP: ${result.details || result.error}`);
                } else if (result.code === 'NO_FILE_UPLOADED') {
                    setUploadProgress('❌ No se ha subido ningún archivo');
                } else if (result.error && result.error.includes('ZIP')) {
                    setUploadProgress(`❌ Error en el archivo ZIP: ${result.error}`);
                } else {
                    setUploadProgress(`❌ Error: ${result.error || 'Error desconocido durante la subida'}`);
                }
                setTimeout(() => setUploadProgress(null), 5000);
            }
        } catch (error) {
            setUploadProgress(`❌ Error de red: ${error.message}`);
            setTimeout(() => setUploadProgress(null), 5000);
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    // Handle individual image upload (new feature)
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            setUploadProgress('❌ Por favor selecciona un archivo de imagen');
            setTimeout(() => setUploadProgress(null), 3000);
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            setUploadProgress('❌ Por favor selecciona un archivo de imagen válido (JPEG, PNG, GIF, WebP)');
            setTimeout(() => setUploadProgress(null), 5000);
            return;
        }

        // Check file size (limit to 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            setUploadProgress(`❌ La imagen es demasiado grande. Máximo permitido: 10MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
            setTimeout(() => setUploadProgress(null), 5000);
            return;
        }

        setUploading(true);
        setUploadProgress(`⏳ Subiendo imagen... (${(file.size / 1024).toFixed(1)} KB)`);

        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Data = reader.result;

                const response = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        image: base64Data,
                        folder: 'gallery',
                        source: 'gallery'
                    })
                });

                const result = await response.json();

                if (result.success) {
                    setUploadProgress(`✅ Imagen subida correctamente (${(file.size / 1024).toFixed(1)} KB)`);
                    loadImages();
                    setTimeout(() => setUploadProgress(null), 3000);
                } else {
                    // Handle specific Cloudinary errors
                    if (result.details && result.details.includes('Cloudinary')) {
                        setUploadProgress(`❌ Error de Cloudinary: ${result.details}`);
                    } else if (result.code === 'UPLOAD_ERROR') {
                        setUploadProgress(`❌ Error al subir la imagen: ${result.details || result.error}`);
                    } else if (result.code === 'MISSING_IMAGE_DATA') {
                        setUploadProgress('❌ No se ha proporcionado ninguna imagen');
                    } else {
                        setUploadProgress(`❌ Error: ${result.error || 'Error desconocido'}`);
                    }
                    setTimeout(() => setUploadProgress(null), 5000);
                }
            };
            reader.readAsDataURL(file);
        } catch (error) {
            setUploadProgress(`❌ Error de red: ${error.message}`);
            setTimeout(() => setUploadProgress(null), 5000);
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    // Copiar URL al portapapeles
    const copyUrl = async (url, id) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            // Fallback para navegadores que no soportan clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    // Eliminar imagen
    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar esta imagen de la galería?')) return;

        try {
            await fetch(`${API_URL}/gallery/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadImages();
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };

    // Limpiar toda la galería
    const handleClearAll = async () => {
        if (!confirm('⚠️ ¿Eliminar TODAS las imágenes de la galería? Esta acción no se puede deshacer.')) return;

        try {
            await fetch(`${API_URL}/gallery`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadImages();
        } catch (error) {
            console.error('Error clearing gallery:', error);
        }
    };

    // Filtrar imágenes
    const filteredImages = images.filter(img =>
        img.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Formatear tamaño
    const formatSize = (bytes) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="card">
                {/* FIXED: Cambio de md:flex-row a sm:flex-row y items-center a items-start sm:items-center */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            🖼️ Galería Centralizada
                        </h1>
                        <p className="text-gray-500">
                            Todas tus imágenes en un solo lugar - Banners, productos y más
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex gap-2">
                            <label className={`btn btn-primary cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                                <input
                                    type="file"
                                    accept=".zip"
                                    onChange={handleUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                {uploading ? '⏳ Procesando...' : magicMode ? '✨ Procesar ZIP (Max 10)' : '📦 Subir ZIP'}
                            </label>
                            <label className="btn btn-secondary cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                />
                                📷 Subir Imagen
                            </label>
                        </div>
                        {images.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="btn btn-ghost text-red-500 hover:bg-red-50"
                            >
                                🗑️ Limpiar Todo
                            </button>
                        )}
                    </div>
                </div>

                {/* Progress */}
                {uploadProgress && (
                    <div className={`mt-4 p-3 rounded-lg ${uploadProgress.includes('✅') ? 'bg-green-50 text-green-700' : uploadProgress.includes('❌') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                        {uploadProgress}
                    </div>
                )}
            </div>

            {/* Magic Tool Options Panel - FIXED: Separado del header en su propia card */}
            <div className="card">
                <div className={`transition-all duration-500 ease-in-out overflow-hidden rounded-2xl border ${magicMode ? 'bg-white border-violet-200 shadow-xl shadow-violet-100/50' : 'bg-gray-50 border-gray-200'}`}>
                    {/* Header Toggle */}
                    <div className={`p-4 flex items-center justify-between cursor-pointer ${magicMode ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`} onClick={() => setMagicMode(!magicMode)}>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${magicMode ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-200'}`}>
                                <span className="text-xl">✨</span>
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg ${magicMode ? 'text-white' : 'text-gray-700'}`}>Edición Mágica & IA</h3>
                                <p className={`text-xs ${magicMode ? 'text-violet-100' : 'text-gray-400'}`}>
                                    {magicMode ? 'Potenciado por Cloudinary AI + Llama 4' : 'Actívalo para mejorar tus imágenes automáticamente'}
                                </p>
                            </div>
                        </div>

                        <div className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ease-in-out ${magicMode ? 'bg-white/30' : 'bg-gray-300'}`}>
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${magicMode ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </div>

                    {/* Controls Container */}
                    <div className={`transition-all duration-500 origin-top ${magicMode ? 'max-h-[800px] opacity-100 p-6' : 'max-h-0 opacity-0 p-0'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                            {/* 1. Size Card */}
                            <div className="bg-white/50 rounded-xl p-5 border border-violet-100 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/50 transition-all duration-300 group backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-violet-100 p-2 rounded-lg text-xl group-hover:scale-110 transition-transform duration-300">📏</div>
                                    <h4 className="font-bold text-violet-900 text-lg">Redimensionar</h4>
                                </div>
                                <div className="space-y-3">
                                    {['original', '800x800', '1080x1080'].map(opt => (
                                        <label key={opt} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${resizeOption === opt ? 'bg-violet-600 border-violet-600 text-white shadow-md transform scale-[1.02]' : 'bg-white border-gray-100 text-gray-600 hover:bg-violet-50 hover:border-violet-200'}`}>
                                            <span className="font-medium text-sm capitalize">{opt === 'original' ? 'Original' : opt}</span>
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${resizeOption === opt ? 'border-white' : 'border-gray-300'}`}>
                                                {resizeOption === opt && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="size"
                                                value={opt}
                                                checked={resizeOption === opt}
                                                onChange={(e) => setResizeOption(e.target.value)}
                                                className="hidden"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* 2. Quality Card */}
                            <div className="bg-white/50 rounded-xl p-5 border border-fuchsia-100 hover:border-fuchsia-300 hover:shadow-lg hover:shadow-fuchsia-100/50 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="bg-fuchsia-100 p-2 rounded-lg text-xl group-hover:scale-110 transition-transform duration-300">💎</div>
                                    <h4 className="font-bold text-fuchsia-900 text-lg">Calidad</h4>
                                </div>
                                <label className={`relative z-10 flex flex-col gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-300 h-[140px] justify-between ${upscale ? 'bg-gradient-to-br from-fuchsia-600 to-pink-600 border-fuchsia-600 text-white shadow-md transform scale-[1.02]' : 'bg-white border-gray-100 text-gray-600 hover:bg-fuchsia-50 hover:border-fuchsia-200'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-lg">Upscale HD</div>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${upscale ? 'bg-white/20 border-white' : 'border-gray-300'}`}>
                                            {upscale && <span className="text-white text-sm">✓</span>}
                                        </div>
                                    </div>
                                    <p className={`text-xs leading-relaxed ${upscale ? 'text-fuchsia-100' : 'text-gray-400'}`}>
                                        Multiplica la resolución y mejora la nitidez usando IA. Ideal para impresiones o zoom.
                                    </p>
                                    <input type="checkbox" checked={upscale} onChange={(e) => setUpscale(e.target.checked)} className="hidden" />
                                </label>
                            </div>

                            {/* 3. Background Card */}
                            <div className="bg-white/50 rounded-xl p-5 border border-blue-100 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="bg-blue-100 p-2 rounded-lg text-xl group-hover:scale-110 transition-transform duration-300">🎨</div>
                                    <h4 className="font-bold text-blue-900 text-lg">Fondo</h4>
                                </div>
                                <label className={`relative z-10 flex flex-col gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-300 h-[140px] justify-between ${removeBg ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-600 text-white shadow-md transform scale-[1.02]' : 'bg-white border-gray-100 text-gray-600 hover:bg-blue-50 hover:border-blue-200'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-lg">Quitar Fondo</div>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${removeBg ? 'bg-white/20 border-white' : 'border-gray-300'}`}>
                                            {removeBg && <span className="text-white text-sm">✓</span>}
                                        </div>
                                    </div>
                                    <p className={`text-xs leading-relaxed ${removeBg ? 'text-blue-100' : 'text-gray-400'}`}>
                                        Elimina el fondo dejando el objeto principal sobre transparencia limpia.
                                    </p>
                                    <input type="checkbox" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} className="hidden" />
                                </label>
                            </div>

                            {/* 4. AI Brain Card */}
                            <div className="bg-white/50 rounded-xl p-5 border border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="bg-emerald-100 p-2 rounded-lg text-xl group-hover:scale-110 transition-transform duration-300">🧠</div>
                                    <h4 className="font-bold text-emerald-900 text-lg">Llama 4 Vision</h4>
                                </div>
                                <label className={`relative z-10 flex flex-col gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-300 h-[140px] justify-between ${aiAnalyze ? 'bg-gradient-to-br from-emerald-600 to-teal-600 border-emerald-600 text-white shadow-md transform scale-[1.02]' : 'bg-white border-gray-100 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="font-bold text-lg">Auto-Categorizar</div>
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${aiAnalyze ? 'bg-white/20 border-white' : 'border-gray-300'}`}>
                                            {aiAnalyze && <span className="text-white text-sm">✓</span>}
                                        </div>
                                    </div>
                                    <p className={`text-xs leading-relaxed ${aiAnalyze ? 'text-emerald-100' : 'text-gray-400'}`}>
                                        Detecta producto, sugiere categorías y mejora el SEO automáticamente.
                                    </p>
                                    <input type="checkbox" checked={aiAnalyze} onChange={(e) => setAiAnalyze(e.target.checked)} className="hidden" />
                                </label>
                            </div>

                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                                El procesamiento inteligente puede tomar unos segundos extra.
                            </span>
                            <div className="flex gap-2">
                                <span className="font-bold bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1.5 rounded-full border border-orange-200">
                                    ⚡ Límite Mágico: 10 imágenes
                                </span>
                                <span className="font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200">
                                    📦 Límite ZIP: 50 imágenes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Stats */}
            <div className="card">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="🔍 Buscar imágenes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                        />
                    </div>
                    <div className="text-gray-500">
                        📸 {filteredImages.length} de {images.length} imágenes
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="card text-center py-20">
                    <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando galería...</p>
                </div>
            ) : images.length === 0 ? (
                /* Empty State */
                <div className="card text-center py-16">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        Galería vacía
                    </h3>
                    <p className="text-gray-500 mb-6">
                        Sube un archivo ZIP con imágenes para comenzar
                    </p>
                    <label className="btn btn-primary cursor-pointer inline-block">
                        <input
                            type="file"
                            accept=".zip"
                            onChange={handleUpload}
                            className="hidden"
                        />
                        📦 Subir ZIP de imágenes
                    </label>
                </div>
            ) : (
                /* Image Grid */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map((image) => (
                        <div
                            key={image.id}
                            className="card group hover:shadow-xl transition-all duration-300 p-2"
                        >
                            {/* Image */}
                            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                                <img
                                    src={image.url}
                                    alt={image.fileName}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => copyUrl(image.url, image.id)}
                                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${copiedId === image.id ? 'bg-green-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
                                    >
                                        {copiedId === image.id ? '✅ Copiado!' : '📋 Copiar URL'}
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="px-1">
                                {/* Badge de origen */}
                                {image.source && (
                                    <div className="mb-1">
                                        {image.source === 'builder' && (
                                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                                                🎨 Banner
                                            </span>
                                        )}
                                        {image.source === 'product' && (
                                            <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full border border-amber-200">
                                                💻 Producto
                                            </span>
                                        )}
                                        {image.source === 'gallery' && (
                                            <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200">
                                                🖼️ Galería
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Nombre de IA si existe */}
                                {image.aiName && (
                                    <div className="mb-1 px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-md border border-emerald-200">
                                        <p className="text-xs font-bold text-emerald-700 truncate" title={image.aiName}>
                                            🧠 {image.aiName}
                                        </p>
                                    </div>
                                )}

                                {/* Categoría de IA si existe */}
                                {image.aiTags && (
                                    <div className="mb-1 px-2 py-1 bg-violet-50 rounded-md border border-violet-200">
                                        <p className="text-xs text-violet-600 truncate" title={image.aiTags}>
                                            🏷️ {image.aiTags}
                                        </p>
                                    </div>
                                )}

                                {/* Nombre de archivo original */}
                                <p className="text-xs font-medium text-gray-700 truncate" title={image.fileName}>
                                    {image.fileName}
                                </p>
                                <div className="flex items-center justify-between mt-1">
                                    <span className="text-xs text-gray-400">
                                        {formatSize(image.size)}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Instructions */}
            <div className="card bg-blue-50 border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">💡 Cómo funciona la galería centralizada</h3>
                <ol className="list-decimal list-inside text-blue-800 text-sm space-y-1">
                    <li>🎯 <strong>Todas las imágenes se guardan aquí automáticamente</strong> (banners, productos, ZIP)</li>
                    <li>🏷️ Cada imagen muestra su origen con un badge de color</li>
                    <li>🧠 Si usas IA, verás el nombre y categoría sugeridos</li>
                    <li>📋 Pasa el mouse sobre una imagen y haz clic en "Copiar URL"</li>
                    <li>⚙️ Pega la URL en productos, configuración o cualquier otro lugar</li>
                </ol>
            </div>
        </div>
    );
};

export default Gallery;
