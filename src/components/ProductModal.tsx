import React, { useState } from 'react';
import { Product } from '../types';
import { formatCurrency, formatCEP, lookupAddressByCEP } from '../utils/formatters';
import { X, Check, Ruler, Truck, ShieldCheck, Star } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: { name: string; hex: string }, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [cepInput, setCepInput] = useState('');
  const [cepResult, setCepResult] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cepInput.replace(/\D/g, '');
    if (clean.length === 8) {
      const loc = lookupAddressByCEP(clean);
      if (loc) {
        setCepResult(`Entrega para ${loc.city}/${loc.state}: SEDEX (1-3 dias úteis) ou PAC Econômico (5-8 dias úteis)`);
      } else {
        setCepResult('Frete estimado: R$ 24,90 (5 dias úteis) ou Grátis acima de R$ 299');
      }
    } else {
      setCepResult('Por favor, informe um CEP válido com 8 dígitos.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-stone-50 rounded-xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 p-2 text-stone-500 hover:text-stone-900 bg-white/80 hover:bg-white rounded-full transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery / Image Left Column */}
        <div className="w-full md:w-1/2 bg-stone-200 relative min-h-[300px] md:min-h-[500px]">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {product.tag && (
            <div className="absolute top-4 left-4 bg-stone-900/90 text-stone-100 text-xs uppercase tracking-wider font-medium px-3 py-1 rounded">
              {product.tag}
            </div>
          )}
        </div>

        {/* Contiguous Purchase Module Right Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Header info */}
            <div>
              <div className="text-xs uppercase tracking-widest text-stone-500 font-medium">
                {product.categoryLabel} · SKU: {product.sku}
              </div>
              <h2 className="text-2xl font-serif font-semibold text-stone-900 mt-1">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-semibold ml-1 text-stone-800">{product.rating}</span>
                </div>
                <span className="text-stone-300">·</span>
                <span className="text-xs text-stone-500">{product.reviewsCount} avaliações de clientes</span>
              </div>
            </div>

            {/* Price Module */}
            <div className="p-4 bg-stone-100/80 rounded-lg border border-stone-200">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-950 tabular-nums">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Em até <strong className="text-stone-900">6x de {formatCurrency(product.price / 6)} sem juros</strong> no cartão ou <strong className="text-stone-900">{formatCurrency(product.price * 0.95)}</strong> à vista no PIX (5% OFF).
              </p>
            </div>

            {/* Color selection */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-stone-600 font-medium">Cor:</span>
                <span className="font-semibold text-stone-900">{selectedColor.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition-all ${
                      selectedColor.name === c.name
                        ? 'border-stone-900 bg-white font-medium shadow-sm'
                        : 'border-stone-200 bg-stone-100 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size selection & Size guide */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-stone-600 font-medium">Tamanho:</span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="inline-flex items-center gap-1 text-stone-700 hover:text-stone-950 underline font-medium"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guia de Medidas</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-2 text-xs font-semibold rounded border transition-all ${
                      selectedSize === s
                        ? 'border-stone-900 bg-stone-900 text-stone-50'
                        : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Tabela de medidas rápida */}
              {showSizeGuide && (
                <div className="mt-3 p-3 bg-stone-100 rounded-md text-xs text-stone-700 border border-stone-200 space-y-1">
                  <div className="font-semibold text-stone-900 mb-1">Tabela de Medidas (cm):</div>
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono border-b border-stone-200 pb-1 font-medium">
                    <span>Tam</span>
                    <span>Busto/Tórax</span>
                    <span>Cintura</span>
                    <span>Quadril</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                    <span>PP</span>
                    <span>84 - 88</span>
                    <span>66 - 70</span>
                    <span>92 - 96</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                    <span>P</span>
                    <span>88 - 94</span>
                    <span>70 - 76</span>
                    <span>96 - 102</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                    <span>M</span>
                    <span>94 - 100</span>
                    <span>76 - 82</span>
                    <span>102 - 108</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-mono">
                    <span>G</span>
                    <span>100 - 108</span>
                    <span>82 - 90</span>
                    <span>108 - 116</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper & Buy Button */}
            <div className="pt-2 flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-md bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2.5 text-stone-600 hover:text-stone-900 font-bold"
                >
                  -
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2.5 text-stone-600 hover:text-stone-900 font-bold"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className={`flex-1 py-3 px-4 rounded-md font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm ${
                  addedSuccess
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-900 text-stone-50 hover:bg-stone-800'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Adicionado à Sacola!</span>
                  </>
                ) : (
                  <span>Adicionar à Sacola · {formatCurrency(product.price * quantity)}</span>
                )}
              </button>
            </div>

            {/* Description & Composition */}
            <div className="pt-4 border-t border-stone-200 text-xs space-y-2">
              <p className="text-stone-600 leading-relaxed">{product.description}</p>
              <div className="text-stone-700 space-y-1 pt-1 font-mono text-[11px]">
                <p><strong>Composição:</strong> {product.details.composition}</p>
                <p><strong>Caimento:</strong> {product.details.fit}</p>
                <p><strong>Cuidados:</strong> {product.details.care}</p>
              </div>
            </div>

            {/* Shipping Simulator */}
            <div className="pt-3 border-t border-stone-200">
              <form onSubmit={handleSimulateShipping} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={cepInput}
                    onChange={(e) => setCepInput(formatCEP(e.target.value))}
                    placeholder="Calcular Frete (CEP: 01414-001)"
                    maxLength={9}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:border-stone-900"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-medium rounded-md transition-colors"
                >
                  Calcular
                </button>
              </form>
              {cepResult && (
                <div className="mt-2 text-[11px] text-stone-600 flex items-center gap-1.5 bg-stone-100 p-2 rounded">
                  <Truck className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                  <span>{cepResult}</span>
                </div>
              )}
            </div>

          </div>

          {/* Bottom assurance footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
              Garantia e Autenticidade
            </span>
            <span>30 Dias para Devolução Grátis</span>
          </div>
        </div>
      </div>
    </div>
  );
};
