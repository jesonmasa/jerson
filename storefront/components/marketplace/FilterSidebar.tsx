'use client';
import { useState } from 'react';

interface FilterSidebarProps {
    categories: string[];
    onFilterChange: (filters: any) => void;
    className?: string;
}

export default function FilterSidebar({ categories, onFilterChange, className = '' }: FilterSidebarProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000);

    const handleCategoryClick = (category: string) => {
        const newCategory = selectedCategory === category ? '' : category;
        setSelectedCategory(newCategory);
        onFilterChange({ category: newCategory, minPrice, maxPrice });
    };

    const handlePriceApply = () => {
        onFilterChange({ category: selectedCategory, minPrice, maxPrice });
    };

    return (
        <aside className={`w-full md:w-64 flex-shrink-0 ${className}`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Filtros</h3>

                {/* Categorías */}
                <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Categorías</h4>
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => handleCategoryClick('')}
                                className={`text-sm w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === '' ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                Todas
                            </button>
                        </li>
                        {categories.map(cat => (
                            <li key={cat}>
                                <button
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`text-sm w-full text-left px-3 py-2 rounded-lg transition ${selectedCategory === cat ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Rango de Precio */}
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Precio</h4>
                    <div className="flex items-center space-x-2 mb-4">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Min"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                            placeholder="Max"
                        />
                    </div>
                    <button
                        onClick={handlePriceApply}
                        className="w-full py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition"
                    >
                        Filtrar Precio
                    </button>
                </div>
            </div>
        </aside>
    );
}
