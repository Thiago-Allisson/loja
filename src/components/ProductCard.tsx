import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: { name: string; hex: string }) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultSize = product.sizes[1] || product.sizes[0];
    const defaultColor = product.colors[selectedColorIndex] || product.colors[0];
    onQuickAdd(product, defaultSize, defaultColor);

    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1500);
  };

  return (
    <article
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-stone-50 cursor-pointer transition-all duration-200"
    >
      {/* Product Image Frame (4:3 aspect ratio, 65-75% card visual weight) */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden rounded-lg bg-stone-200/70 border border-stone-200/80">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Quiet editorial text tag (no colored pill badges) */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-stone-900/90 text-stone-100 text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded">
            {product.tag}
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={handleQuickAddClick}
            className={`flex-1 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1.5 shadow-md ${
              addedFeedback
                ? 'bg-stone-950 text-emerald-400'
                : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Adicionado!</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Sacola Rápida</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            aria-label="Ver detalhes da peça"
            className="p-2.5 bg-white/95 text-stone-800 hover:text-stone-950 rounded-md shadow-md hover:bg-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="mt-3.5 flex flex-col space-y-1.5">
        {/* Category & Color dots */}
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="uppercase tracking-widest text-[11px] font-medium">
            {product.categoryLabel}
          </span>
          
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((color, idx) => (
              <button
                key={color.name}
                title={color.name}
                onClick={() => setSelectedColorIndex(idx)}
                className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                  selectedColorIndex === idx
                    ? 'ring-1 ring-stone-900 ring-offset-1 scale-110'
                    : 'border-stone-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base font-medium text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Price & Installments with Tabular Numerals */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="text-base font-semibold text-stone-900 tabular-nums">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-stone-400 line-through tabular-nums">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="text-xs text-stone-500 font-normal">
            ou 6x de {formatCurrency(product.price / 6)}
          </span>
        </div>

        {/* Available sizes subtle hint */}
        <div className="text-[11px] text-stone-400 pt-0.5">
          Tamanhos: {product.sizes.join(' · ')}
        </div>
      </div>
    </article>
  );
};
