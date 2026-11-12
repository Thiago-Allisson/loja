import React from 'react';
import { ShoppingBag, Search, Clock, Heart } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onSelectCategory: (cat: string) => void;
  activeCategory: string;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenOrders,
  onSelectCategory,
  activeCategory,
  onOpenSearch
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top micro-announcement banner */}
      <div className="bg-stone-900 text-stone-100 text-xs py-1.5 px-4 text-center tracking-wider uppercase font-medium">
        <span>Frete grátis para todo o Brasil em compras acima de R$ 299 · 5% OFF no PIX</span>
      </div>

      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title, one line wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectCategory('todos');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl font-serif font-semibold tracking-widest text-emerald-950 hover:text-emerald-800 whitespace-nowrap shrink-0 transition-colors"
        >
          ALVIVERDE STORE
        </a>

        {/* Zone 2: 4-5 nav links, 1-2 word labels, single-line, clean hover underlines */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectCategory('todos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeCategory === 'todos' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Coleção
            {activeCategory === 'todos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('alfaiataria')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeCategory === 'alfaiataria' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Alfaiataria
            {activeCategory === 'alfaiataria' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('vestidos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeCategory === 'vestidos' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Vestidos
            {activeCategory === 'vestidos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('casacos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeCategory === 'casacos' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Casacos
            {activeCategory === 'casacos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>
          <button
            onClick={() => onSelectCategory('linho')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeCategory === 'linho' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Linho Nobre
            {activeCategory === 'linho' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
            )}
          </button>
        </nav>

        {/* Zone 3: Actions & Shopping Bag */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            aria-label="Buscar produtos"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenOrders}
            aria-label="Meus Pedidos"
            title="Meus Pedidos"
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors relative"
          >
            <Clock className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCart}
            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-50 bg-stone-900 rounded-md hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Sacola</span>
            <span className="bg-stone-100 text-stone-900 font-mono text-[11px] font-bold px-1.5 py-0.2 rounded">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
