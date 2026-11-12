import React from 'react';
import { Order } from '../types';
import { formatCurrency } from '../utils/formatters';
import { X, Package, Clock, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onExplore: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder,
  onExplore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-stone-900" />
            <h3 className="text-lg font-serif font-semibold text-stone-900">
              Meus Pedidos Realizados
            </h3>
            <span className="text-xs text-stone-500 font-mono">
              ({orders.length} pedidos)
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders list */}
        <div className="p-6 max-h-[60vh] overflow-y-auto divide-y divide-stone-200">
          {orders.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center space-y-3">
              <Package className="w-12 h-12 text-stone-300 stroke-1" />
              <p className="text-base font-serif text-stone-800">
                Você ainda não realizou nenhum pedido
              </p>
              <p className="text-xs text-stone-500 max-w-sm">
                Quando você concluir uma compra pela loja, seus recibos e status de entrega aparecerão aqui.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onExplore();
                }}
                className="mt-2 px-5 py-2.5 bg-stone-900 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded-md hover:bg-stone-800 transition-colors"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                onClick={() => {
                  onSelectOrder(order);
                  onClose();
                }}
                className="py-4 hover:bg-stone-50/80 -mx-3 px-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-900">
                      Pedido #{order.orderNumber}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {order.createdAt}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-1">
                    {order.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', ')}
                  </p>

                  <div className="flex items-center gap-3 text-xs pt-0.5">
                    <span className="font-semibold text-stone-900 tabular-nums">
                      {formatCurrency(order.total)}
                    </span>
                    <span className="text-stone-300">·</span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                        order.status === 'approved'
                          ? 'text-emerald-700'
                          : 'text-amber-700'
                      }`}
                    >
                      {order.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Pagamento Aprovado</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          <span>Aguardando Pagamento</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-stone-400">
                  <span className="text-xs font-medium text-stone-600 hidden sm:inline">
                    Ver detalhes
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-md bg-white hover:bg-stone-100"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
