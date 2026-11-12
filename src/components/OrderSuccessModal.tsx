import React from 'react';
import { Order } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  CheckCircle,
  Truck,
  Printer,
  ShoppingBag,
  Clock,
  PackageCheck,
  CreditCard,
  QrCode,
  FileText
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onContinueShopping,
}) => {
  if (!order) return null;

  const isApproved = order.status === 'approved';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        
        {/* Header with Success confirmation */}
        <div className="bg-stone-900 text-stone-50 p-6 sm:p-8 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-400">
              Pedido Confirmado #{order.orderNumber}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white">
              {isApproved ? 'Pagamento Aprovado com Sucesso!' : 'Pedido Realizado com Sucesso!'}
            </h2>
            <p className="text-xs text-stone-300 max-w-md mx-auto">
              Enviamos os detalhes da compra e o comprovante para <strong>{order.address.email}</strong>.
            </p>
          </div>
        </div>

        {/* Timeline tracker */}
        <div className="p-6 bg-stone-50 border-b border-stone-200">
          <div className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-4">
            Status do Rastreio
          </div>

          <div className="relative flex items-center justify-between text-xs">
            <div className="flex flex-col items-center text-center z-10">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <span className="mt-1.5 font-semibold text-stone-900">Realizado</span>
              <span className="text-[10px] text-stone-500">{order.createdAt.split(' ')[0]}</span>
            </div>

            <div className="flex-1 h-0.5 bg-emerald-600 -mt-6 mx-2" />

            <div className="flex flex-col items-center text-center z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  isApproved ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}
              >
                {isApproved ? '✓' : <Clock className="w-3.5 h-3.5" />}
              </div>
              <span className="mt-1.5 font-semibold text-stone-900">
                {isApproved ? 'Aprovado' : 'Aguardando'}
              </span>
              <span className="text-[10px] text-stone-500">
                {isApproved ? 'Instantâneo' : 'Até 1 dia útil'}
              </span>
            </div>

            <div className="flex-1 h-0.5 bg-stone-300 -mt-6 mx-2" />

            <div className="flex flex-col items-center text-center z-10 opacity-60">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="mt-1.5 font-medium text-stone-700">Separação</span>
              <span className="text-[10px] text-stone-400">Atelier SP</span>
            </div>

            <div className="flex-1 h-0.5 bg-stone-200 -mt-6 mx-2" />

            <div className="flex flex-col items-center text-center z-10 opacity-60">
              <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="mt-1.5 font-medium text-stone-700">Envio</span>
              <span className="text-[10px] text-stone-400">{order.shippingOption.courier}</span>
            </div>
          </div>
        </div>

        {/* Printable receipt details */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[45vh] overflow-y-auto">
          
          {/* Order Summary Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider">
              Itens do Pedido
            </h4>

            <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg p-3 bg-stone-50">
              {order.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-12 object-cover rounded bg-stone-200 shrink-0"
                    />
                    <div>
                      <p className="font-medium text-stone-900">{item.product.name}</p>
                      <p className="text-stone-500 text-[11px]">
                        Tamanho: {item.selectedSize} · Cor: {item.selectedColor.name} · Qtd: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono font-semibold tabular-nums text-stone-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Payment details grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
              <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Endereço de Entrega
              </p>
              <p className="text-stone-700">{order.address.fullName}</p>
              <p className="text-stone-600">
                {order.address.street}, {order.address.number} {order.address.complement && `(${order.address.complement})`}
              </p>
              <p className="text-stone-600">
                {order.address.neighborhood} · {order.address.city} - {order.address.state}
              </p>
              <p className="text-stone-600 font-mono">CEP: {order.address.cep}</p>
              <p className="text-stone-500 pt-1">
                Método: {order.shippingOption.name} ({order.shippingOption.days})
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
              <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                {order.paymentMethod === 'pix' ? (
                  <QrCode className="w-3.5 h-3.5 text-emerald-700" />
                ) : order.paymentMethod === 'credit_card' ? (
                  <CreditCard className="w-3.5 h-3.5 text-stone-700" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-stone-700" />
                )}
                <span>Método de Pagamento</span>
              </p>

              <p className="text-stone-700 uppercase font-medium">
                {order.paymentMethod === 'pix'
                  ? 'PIX Instantâneo'
                  : order.paymentMethod === 'credit_card'
                  ? 'Cartão de Crédito'
                  : 'Boleto Bancário'}
              </p>

              {order.installmentsText && (
                <p className="text-stone-600">{order.installmentsText}</p>
              )}

              <div className="pt-2 border-t border-stone-200 space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums">{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Desconto:</span>
                    <span className="font-mono tabular-nums">- {formatCurrency(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span className="font-mono tabular-nums">
                    {order.shippingCost === 0 ? 'Grátis' : formatCurrency(order.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200 text-sm">
                  <span>Total Pago:</span>
                  <span className="font-mono tabular-nums">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-stone-300 rounded-md text-xs font-medium text-stone-700 hover:bg-white transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Comprovante</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onContinueShopping();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-stone-900 text-stone-50 rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continuar Comprando</span>
          </button>
        </div>

      </div>
    </div>
  );
};
