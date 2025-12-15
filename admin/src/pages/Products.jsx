import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const Products = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL) console.warn('Falta VITE_API_URL');
    // Obtener token del store global de Zustand (persistido)
    const { token } = useAuthStore();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [publishingAll, setPublishingAll] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        subtitle: '',
        price: '',
        discount: '',
        description: '',
        image: '',
        category: '',
        stock: 0,
        sizes: '',
        colors: []
    });

    // Cargar productos y categorías al montar
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = async () => {
        try {
            if (!token) {
                console.error('No token found in store');
                return;
            }
            const response = await fetch(`${API_URL}/products`, {
                headers: { 'Authorization': `Bearer ${token} ` }
            });
            if (response.ok) {
                const data = await response.json();
                setProducts(Array.isArray(data) ? data : []);
            } else {
                console.error('Error loading products:', response.status);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const loadCategories = async () => {
        try {
            if (!token) return;
            const response = await fetch(`${API_URL}/categories`, {
                headers: { 'Authorization': `Bearer ${token} ` }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Subida de imágenes a Cloudinary
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }

        setUploading(true);
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Data = reader.result;
                // Upload usa ruta base distinta (/api/upload vs /api/v2/...)
                // Ajustamos para quitar el /v2 si es necesario o unificamos. 
                // ASUMIENDO BASE: VITE_API_URL = .../api/v2. Upload suele estar en .../api/upload
                // TRUCO: Reemplazar '/v2' por '' si existe para ir a la raiz de api
                const baseUrl = API_URL.replace('/v2', '');
                const response = await fetch(`${baseUrl}/upload`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token} `
                    },
                    body: JSON.stringify({
                        image: base64Data,
                        folder: 'productos',
                        source: 'product' // Identificar origen
                    })
                });
                const result = await response.json();
                if (result.success) {
                    setFormData({ ...formData, image: result.data.url });
                    alert('✅ Imagen subida correctamente');
                } else {
                    alert('Error al subir imagen: ' + (result.error || 'Error desconocido'));
                }
                setUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error al subir la imagen');
            setUploading(false);
        }
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            subtitle: '',
            price: '',
            discount: '',
            description: '',
            image: '',
            category: '',
            stock: 0,
            sizes: '',
            colors: []
        });
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);

        // Convertir colorImages al formato del formulario [{name, image}]
        let colorsForForm = [];
        if (product.colorImages && typeof product.colorImages === 'object') {
            colorsForForm = Object.entries(product.colorImages).map(([colorName, imageUrl]) => ({
                name: colorName,
                image: imageUrl,
                discount: product.variantDiscounts ? product.variantDiscounts[colorName] : ''
            }));
        } else if (product.colors && Array.isArray(product.colors)) {
            colorsForForm = product.colors.map(colorName => ({
                name: typeof colorName === 'string' ? colorName : colorName.name || '',
                image: typeof colorName === 'object' ? colorName.image || '' : '',
                discount: typeof colorName === 'object' ? colorName.discount || '' : ''
            }));
        }

        setFormData({
            name: product.name,
            subtitle: product.subtitle || '',
            price: product.price !== null ? product.price : '',
            discount: product.discount || '',
            description: product.description || '',
            image: product.image || '',
            category: product.category || '',
            stock: product.stock || 0,
            sizes: product.sizes ? product.sizes.join(', ') : '',
            colors: colorsForForm
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Producto eliminado correctamente');
                loadProducts();
            } else {
                alert('Error al eliminar producto');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // LOGICA PRINCIPAL: Publicar / Despublicar
    const handlePublish = async (product) => {
        const isPublished = product.status === 'published';
        const newStatus = isPublished ? 'draft' : 'published';

        console.log(`Intentando cambiar estado a: ${newStatus} para producto ${product.id}`);

        if (!token) {
            alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
            return;
        }

        try {
            let response;
            if (newStatus === 'published') {
                // Usar bulk-publish para publicar (más robusto)
                response = await fetch(`${API_URL}/v2/products/bulk-publish`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ ids: [product.id] })
                });
            } else {
                // Usar draft endpoint para despublicar
                response = await fetch(`${API_URL}/v2/products/${product.id}/draft`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
            }

            if (response.ok) {
                alert(newStatus === 'published' ? '✅ Producto publicado' : '📝 Producto movido a borrador');
                loadProducts();
            } else {
                if (response.status === 401) {
                    alert('⚠️ Error de Autenticación (401). Tu sesión no es válida. Por favor haz Logout y vuelve a entrar.');
                } else {
                    const txt = await response.text();
                    alert(`Error del servidor: ${response.status} - ${txt}`);
                }
            }
        } catch (error) {
            console.error('Error publishing:', error);
            alert('Error de conexión al servidor.');
        }
    };

    const handlePublishAll = async () => {
        const draftProducts = products.filter(p => p.status !== 'published');
        if (draftProducts.length === 0) return alert('Todos los productos ya están publicados');
        if (!confirm(`¿Publicar ${draftProducts.length} productos?`)) return;

        setPublishingAll(true);
        try {
            const ids = draftProducts.map(p => p.id);
            const response = await fetch(`${API_URL}/products/bulk-publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ids })
            });

            if (response.ok) {
                alert('🚀 Todos los productos publicados');
                loadProducts();
            } else {
                alert('Error al publicar productos');
            }
        } catch (error) {
            console.error('Error publishing all:', error);
        } finally {
            setPublishingAll(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) return alert('La categoría es obligatoria');

        try {
            const url = editingProduct
                ? `${API_URL}/products/${editingProduct.id}`
                : `${API_URL}/products`;

            const method = editingProduct ? 'PUT' : 'POST';

            // Preparar colores y descuentos
            const colorNames = formData.colors.filter(c => c.name).map(c => c.name);
            const colorImages = {};
            const variantDiscounts = {};

            formData.colors.forEach(c => {
                if (c.name && c.image) {
                    colorImages[c.name] = c.image;
                    if (c.discount) variantDiscounts[c.name] = c.discount;
                }
            });

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
                    colors: colorNames,
                    colorImages: colorImages,
                    variantDiscounts: variantDiscounts
                }),
            });

            if (response.ok) {
                alert(editingProduct ? 'Producto actualizado' : 'Producto creado');
                setShowModal(false);
                loadProducts();
            } else {
                alert('Error al guardar producto');
            }
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    // Render Filters and List
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header/Filters */}
            <div className="card_custom p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedCategory === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>Todos</button>
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat.name)} className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedCategory === cat.name ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'}`}>{cat.name}</button>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={handlePublishAll} disabled={publishingAll} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                            {publishingAll ? '...' : 'Publicar Todos'}
                        </button>
                        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            + Nuevo
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 bg-gray-50 relative flex items-center justify-center">
                            {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl">📦</span>
                            )}
                            {product.status === 'published' && (
                                <span className="absolute top-2 right-2 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Publicado</span>
                            )}
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                                <p className="text-sm text-gray-500">{product.subtitle || 'Sin subtítulo'}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">${product.price}</span>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">Stock: {product.stock}</span>
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => handlePublish(product)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium ${product.status === 'published' ? 'bg-gray-100 text-gray-600' : 'bg-green-600 text-white'}`}
                                >
                                    {product.status === 'published' ? 'Despublicar' : 'Publicar'}
                                </button>
                                <button onClick={() => handleEdit(product)} className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg">✏️</button>
                                <button onClick={() => handleDelete(product.id)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg">🗑️</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Creación/Edición */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Subtítulo</label>
                                <input type="text" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full border rounded-lg p-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Precio</label>
                                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full border rounded-lg p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stock</label>
                                    <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })} className="w-full border rounded-lg p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Categoría</label>
                                <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full border rounded-lg p-2">
                                    <option value="">Seleccionar...</option>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>

                            {/* SECCIÓN DE VARIANTES (Mejorada) */}
                            {formData.colors && formData.colors.length > 0 && (
                                <div className="border-t border-b py-4 my-2">
                                    <label className="block text-sm font-bold mb-2">Variantes y Colores</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Solo mostrar variantes que NO sean la imagen principal para evitar duplicados visuales */}
                                        {formData.colors.filter(variant => variant.image !== formData.image).map((variant, idx) => (
                                            <div
                                                key={idx}
                                                className="relative p-2 rounded-lg border flex flex-col items-center gap-2 group transition-all hover:scale-105"
                                                style={{
                                                    ...getColorStyle(variant.name),
                                                }}
                                            >
                                                {/* Botón para hacer principal */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        // Hacer esta variante la imagen principal
                                                        // NO modificamos el array de colores, simplemente actualizamos la portada
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            image: variant.image
                                                        }));
                                                    }}
                                                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 text-xs z-10 cursor-pointer hover:bg-yellow-100"
                                                    title="Establecer como imagen principal"
                                                >
                                                    ⭐
                                                </button>

                                                <img
                                                    src={variant.image || 'https://via.placeholder.com/100'}
                                                    className="w-16 h-16 object-cover rounded bg-white"
                                                    alt={variant.name}
                                                />
                                                <span className="text-xs font-bold px-1 rounded bg-white/80">{variant.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">* Click en la estrella para establecer como imagen principal.</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Imagen URL</label>
                                <div className="flex gap-2">
                                    <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border rounded-lg p-2" placeholder="https://..." />
                                    <label className="px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                                        📷 <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                                    </label>
                                </div>
                                {formData.image && (
                                    <div className="mt-2 relative inline-block">
                                        <img src={formData.image} className="h-20 rounded border" alt="preview" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, image: '' })}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            title="Eliminar imagen"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
                                <button type="submit" className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper para colores
const getColorStyle = (colorName) => {
    if (!colorName) return {};
    const lower = colorName.toLowerCase();
    const map = {
        'negro': '#000000', 'blanco': '#ffffff', 'rojo': '#ef4444', 'azul': '#3b82f6',
        'verde': '#22c55e', 'amarillo': '#eab308', 'naranja': '#f97316', 'morado': '#a855f7',
        'rosa': '#ec4899', 'gris': '#6b7280', 'marron': '#78350f', 'celeste': '#0ea5e9',
        'beige': '#f5f5dc', 'turquesa': '#14b8a6', 'lila': '#c084fc'
    };
    const hex = map[lower] || colorName;

    // Si es blanco o muy claro, poner borde
    const isLight = lower === 'blanco' || lower === 'beige' || lower === 'amarillo';

    return {
        backgroundColor: hex,
        color: isLight ? 'black' : 'white',
        border: isLight ? '1px solid #ddd' : 'none'
    };
};

export default Products;
