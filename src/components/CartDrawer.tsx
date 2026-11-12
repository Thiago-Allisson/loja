import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { formatCurrency } from '../utils/formatters';
import { COUPONS } from '../data/products';
import { X, Trash2, ArrowRight, Tag, ShoppingBag, Check, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping threshold
  const freeShippingThreshold = 299;
  const differenceToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon?.discountPercentage) {
    discountAmount = (subtotal * appliedCoupon.discountPercentage) / 100;
  } else if (appliedCoupon?.fixedDiscount) {
    discountAmount = appliedCoupon.fixedDiscount;
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponCodeInput.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === cleanCode);
    if (found) {
      onApplyCoupon(found);
      setCouponError(null);
      setCouponCodeInput('');
    } else {
      setCouponError('Cupom inválido. Tente BEMVINDO10 ou FRETEGRATIS.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-50 border-l border-stone-200 flex flex-col shadow-2xl">
          
          {/* Cart Header */}
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-lg font-serif font-semibold text-stone-900">
                Sua Sacola
              </h2>
              <span className="text-xs text-stone-500 font-mono">
                ({items.reduce((s, i) => s + i.quantity, 0)} itens)
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-stone-100 px-6 py-3 border-b border-stone-200">
            <div className="flex items-center justify-between text-xs text-stone-700 font-medium mb-1.5">
              {differenceToFreeShipping === 0 ? (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Parabéns! Você ganhou Frete Grátis
                </span>
              ) : (
                <span>
                  Faltam <strong className="text-stone-900">{formatCurrency(differenceToFreeShipping)}</strong> para Frete Grátis
                </span>
              )}
              <span className="text-stone-500 font-mono">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  differenceToFreeShipping === 0 ? 'bg-emerald-600' : 'bg-stone-900'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-200">
            {items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-stone-300 stroke-1" />
                <p className="text-stone-700 font-serif text-base">Sua sacola está vazia</p>
                <p className="text-stone-400 text-xs max-w-xs">
                  Descubra peças essenciais com alfaiataria impecável e adicione-as aqui.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 bg-stone-900 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors"
                >
                  Explorar Coleção
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded bg-stone-200 border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-medium text-stone-900 line-clamp-2">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          aria-label="Remover item"
                          className="text-stone-400 hover:text-stone-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-1 flex items-center gap-3 text-xs text-stone-500">
                        <span>Tam: <strong className="text-stone-800">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-stone-300"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          {item.selectedColor.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-300 rounded bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-mono text-xs tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-stone-900 tabular-nums">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Input & Order Summary */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 p-6 bg-stone-100/60 space-y-4">
              {/* Coupon Bar */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Cupom <strong>{appliedCoupon.code}</strong> aplicado ({appliedCoupon.description})
                      </span>
                    </div>
                    <button
                      onClick={() => onApplyCoupon(null)}
                      className="text-stone-500 hover:text-stone-800 underline text-[11px]"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="Cupom (ex: BEMVINDO10)"
                        className="flex-1 text-xs px-3 py-2 bg-white border border-stone-300 rounded-md focus:outline-none focus:border-stone-900 uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-medium rounded-md transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Financial values */}
              <div className="space-y-1.5 text-xs text-stone-600 border-t border-stone-200/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Desconto ({appliedCoupon?.code})</span>
                    <span className="font-mono tabular-nums">
                      - {formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete estimado</span>
                  <span className="text-stone-700">
                    {subtotal >= freeShippingThreshold || appliedCoupon?.freeShipping
                      ? 'Grátis'
                      : 'Calculado no checkout'}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Previsto</span>
                  <span className="tabular-nums font-mono text-lg">
                    {formatCurrency(Math.max(0, subtotal - discountAmount))}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 px-4 bg-stone-900 text-stone-50 font-semibold text-xs uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-stone-500">
                <span>Pagamento 100% seguro · PIX, Cartão em até 6x e Boleto</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
