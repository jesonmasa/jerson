import React, { useState, useEffect } from 'react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/v2/categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL; // Asegurar alcance
            const response = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategory }),
            });

            if (response.ok) {
                setNewCategory('');
                loadCategories();
            } else {
                alert('Error al crear categoría');
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/v2/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                loadCategories();
            } else {
                alert('Error al eliminar categoría');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Gestión de Categorías
                </h2>

                {/* Create Form */}
                <form onSubmit={handleCreate} className="flex gap-4 mb-8">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Nombre de la nueva categoría..."
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                    />
                    <button
                        type="submit"
                        className="btn btn-primary whitespace-nowrap"
                        disabled={!newCategory.trim()}
                    >
                        ➕ Agregar Categoría
                    </button>
                </form>

                {/* Categories List */}
                {loading ? (
                    <p className="text-center text-gray-500">Cargando categorías...</p>
                ) : categories.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No hay categorías creadas aún.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all"
                            >
                                <span className="font-semibold text-gray-700">{category.name}</span>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Eliminar categoría"
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
