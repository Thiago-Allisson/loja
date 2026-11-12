import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

interface CatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: { name: string; hex: string }) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onQuickAdd,
  searchQuery,
  onSearchChange
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const categories = [
    { id: 'todos', label: 'Todos os Itens' },
    { id: 'alfaiataria', label: 'Alfaiataria' },
    { id: 'vestidos', label: 'Vestidos' },
    { id: 'casacos', label: 'Casacos' },
    { id: 'basicos', label: 'Básicos Premium' },
    { id: 'linho', label: 'Linho & Malha' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
          return false;
        }
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchCat = p.categoryLabel.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }
        // Size filter
        if (selectedSizeFilter !== 'all') {
          const hasSize = p.sizes.some((s) => s.includes(selectedSizeFilter));
          if (!hasSize) return false;
        }
        // Max price filter
        if (p.price > maxPrice) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, selectedSizeFilter, maxPrice, sortBy]);

  const clearAllFilters = () => {
    onSelectCategory('todos');
    onSearchChange('');
    setSelectedSizeFilter('all');
    setMaxPrice(1000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'todos' ||
    searchQuery !== '' ||
    selectedSizeFilter !== 'all' ||
    maxPrice < 1000 ||
    sortBy !== 'featured';

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      
      {/* Catalog Header & Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-stone-500">
            Catálogo Oficial
          </div>
          <h2 className="text-3xl font-serif font-medium text-stone-900 mt-1">
            Peças Selecionadas
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Mostrando {filteredProducts.length} de {products.length} criações artesanais
          </p>
        </div>

        {/* Search input in catalog */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por linho, blazer, seda..."
              className="w-full text-xs pl-9 pr-8 py-2.5 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-stone-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border border-stone-300 rounded-md bg-white text-stone-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Categories Bar & Quick Sorting */}
      <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200/70">
        
        {/* Interactive Segmented Filter Controls (functional buttons with click handlers) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-stone-900 text-stone-50 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200/70'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Sorting & Filter Tools */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-stone-300 rounded-md px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-900"
            >
              <option value="featured">Destaques da Coleção</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="rating">Melhor Avaliados</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-950 underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Filter Row (Size & Price Range) */}
      <div className={`pt-4 pb-6 border-b border-stone-200/70 flex flex-wrap items-center justify-between gap-6 ${showFiltersMobile ? 'block' : 'hidden md:flex'}`}>
        
        {/* Sizing Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Filtrar Tamanho:</span>
          <div className="flex items-center gap-1">
            {['all', 'PP', 'P', 'M', 'G', 'GG'].map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSizeFilter(sz)}
                className={`w-7 h-7 text-[11px] font-semibold rounded border transition-colors ${
                  selectedSizeFilter === sz
                    ? 'border-stone-900 bg-stone-900 text-stone-50'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                {sz === 'all' ? 'Ver' : sz}
              </button>
            ))}
          </div>
        </div>

        {/* Price slider */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-stone-500 font-medium">Preço Máximo:</span>
          <input
            type="range"
            min={300}
            max={1000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-32 accent-stone-900 cursor-pointer"
          />
          <span className="font-mono font-semibold text-stone-900 tabular-nums">
            até R$ {maxPrice}
          </span>
        </div>
      </div>

      {/* Product Grid (3-column desktop / 2-column mobile as per Section 2.A) */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickAdd={onQuickAdd}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <p className="text-lg font-serif text-stone-800">
            Nenhuma peça encontrada com os filtros selecionados.
          </p>
          <p className="text-sm text-stone-500 max-w-md">
            Tente buscar por termos mais genéricos ou redefinir suas preferências de tamanho e preço.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-2 px-4 py-2 bg-stone-900 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors"
          >
            Limpar Todos os Filtros
          </button>
        </div>
      )}
    </section>
  );
};
