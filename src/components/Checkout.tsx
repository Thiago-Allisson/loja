import React, { useState, useEffect } from 'react';
import { CartItem, Coupon, ShippingOption, CustomerAddress, PaymentMethodType, CreditCardData, Order } from '../types';
import {
  formatCurrency,
  formatCEP,
  formatCPF,
  formatPhone,
  formatCardNumber,
  formatCardExpiry,
  lookupAddressByCEP,
  generatePixPayload,
  generateBoletoCode,
} from '../utils/formatters';
import { SHIPPING_OPTIONS } from '../data/products';
import { PixQrCode } from './PixQrCode';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  FileText,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface CheckoutProps {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  onBackToCart: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({
  items,
  appliedCoupon,
  onBackToCart,
  onOrderCompleted,
}) => {
  // Step navigation: 1 = Address/Shipping, 2 = Payment
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Address and personal data
  const [address, setAddress] = useState<CustomerAddress>({
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Shipping selection
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(SHIPPING_OPTIONS[0]);

  // Payment selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('pix');

  // Credit card form state
  const [cardData, setCardData] = useState<CreditCardData>({
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
    installments: 1,
  });
  const [cardErrors, setCardErrors] = useState<Record<string, string>>({});
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // PIX state
  const [pixTimeRemaining, setPixTimeRemaining] = useState(900); // 15 mins
  const [copiedPix, setCopiedPix] = useState(false);
  const [pixGenerated, setPixGenerated] = useState(false);

  // Boleto state
  const [copiedBoleto, setCopiedBoleto] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Free shipping check
  const isFreeShipping = subtotal >= 299 || appliedCoupon?.freeShipping;
  const currentShippingCost = isFreeShipping ? 0 : selectedShipping.price;

  // Coupon discount
  let couponDiscount = 0;
  if (appliedCoupon?.discountPercentage) {
    couponDiscount = (subtotal * appliedCoupon.discountPercentage) / 100;
  } else if (appliedCoupon?.fixedDiscount) {
    couponDiscount = appliedCoupon.fixedDiscount;
  }

  // PIX 5% extra discount
  const baseForPix = Math.max(0, subtotal - couponDiscount + currentShippingCost);
  const pixDiscount = paymentMethod === 'pix' ? baseForPix * 0.05 : 0;

  const grandTotal = Math.max(0, subtotal - couponDiscount + currentShippingCost - pixDiscount);

  // Mock order ID
  const orderId = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
  const pixCode = generatePixPayload(grandTotal, orderId);
  const boletoBarcode = generateBoletoCode(grandTotal);

  // Timer for PIX expiration
  useEffect(() => {
    if (paymentMethod === 'pix' && activeStep === 2) {
      const interval = setInterval(() => {
        setPixTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [paymentMethod, activeStep]);

  // Handle CEP automatic resolution
  const handleCepChange = (val: string) => {
    const formatted = formatCEP(val);
    setAddress((prev) => ({ ...prev, cep: formatted }));

    const clean = formatted.replace(/\D/g, '');
    if (clean.length === 8) {
      const lookup = lookupAddressByCEP(clean);
      if (lookup) {
        setAddress((prev) => ({
          ...prev,
          street: lookup.street,
          neighborhood: lookup.neighborhood,
          city: lookup.city,
          state: lookup.state,
        }));
        setAddressErrors((prev) => {
          const updated = { ...prev };
          delete updated.cep;
          return updated;
        });
      }
    }
  };

  // Validate Step 1 (Address & personal data)
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!address.fullName.trim()) errs.fullName = 'Informe o nome completo';
    if (!address.email.includes('@')) errs.email = 'E-mail válido obrigatório';
    if (address.cpf.replace(/\D/g, '').length !== 11) errs.cpf = 'CPF com 11 dígitos obrigatório';
    if (address.phone.replace(/\D/g, '').length < 10) errs.phone = 'Telefone para contato obrigatório';
    if (address.cep.replace(/\D/g, '').length !== 8) errs.cep = 'CEP obrigatório';
    if (!address.street.trim()) errs.street = 'Logradouro obrigatório';
    if (!address.number.trim()) errs.number = 'Número obrigatório';
    if (!address.city.trim()) errs.city = 'Cidade obrigatória';
    if (!address.state.trim()) errs.state = 'Estado obrigatório';

    setAddressErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setActiveStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Validate credit card if chosen
  const validateCard = () => {
    const errs: Record<string, string> = {};
    const cleanNum = cardData.number.replace(/\D/g, '');
    if (cleanNum.length !== 16) errs.number = 'Número de cartão inválido (16 dígitos)';
    if (!cardData.holderName.trim()) errs.holderName = 'Nome no cartão obrigatório';
    const cleanExp = cardData.expiry.replace(/\D/g, '');
    if (cleanExp.length !== 4) errs.expiry = 'Validade inválida (MM/AA)';
    if (cardData.cvv.replace(/\D/g, '').length < 3) errs.cvv = 'CVV inválido';

    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit order
  const handleFinalizeOrder = (simulatedApproval = false) => {
    if (paymentMethod === 'credit_card') {
      if (!validateCard()) return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: orderId,
        createdAt: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items,
        address,
        shippingOption: selectedShipping,
        paymentMethod,
        subtotal,
        discount: couponDiscount + pixDiscount,
        shippingCost: currentShippingCost,
        total: grandTotal,
        status: simulatedApproval || paymentMethod === 'credit_card' ? 'approved' : 'pending',
        pixCode: paymentMethod === 'pix' ? pixCode : undefined,
        boletoCode: paymentMethod === 'boleto' ? boletoBarcode : undefined,
        installmentsText:
          paymentMethod === 'credit_card'
            ? `${cardData.installments}x de ${formatCurrency(grandTotal / cardData.installments)}`
            : undefined,
      };

      onOrderCompleted(newOrder);
    }, 1200);
  };

  const copyToClipboard = (text: string, type: 'pix' | 'boleto') => {
    navigator.clipboard.writeText(text);
    if (type === 'pix') {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    } else {
      setCopiedBoleto(true);
      setTimeout(() => setCopiedBoleto(false), 2500);
    }
  };

  // Card brand detector
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (clean.startsWith('5')) return 'Mastercard';
    if (clean.startsWith('6')) return 'Elo';
    return 'Cartão';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      
      {/* Top back button & breadcrumbs */}
      <div className="flex items-center justify-between pb-6 border-b border-stone-200">
        <button
          onClick={onBackToCart}
          className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Sacola</span>
        </button>

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`font-semibold ${
              activeStep === 1 ? 'text-stone-900' : 'text-stone-400'
            }`}
          >
            1. Entrega & Dados
          </span>
          <span className="text-stone-300">/</span>
          <span
            className={`font-semibold ${
              activeStep === 2 ? 'text-stone-900' : 'text-stone-400'
            }`}
          >
            2. Pagamento Seguro
          </span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Main Column: Steps Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: Personal Data & Shipping */}
          {activeStep === 1 ? (
            <form onSubmit={handleProceedToPayment} className="space-y-8">
              
              {/* Section 1: Personal Data */}
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">
                    Dados do Comprador
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      placeholder="Ex: Carlos Eduardo de Souza"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.fullName ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                    {addressErrors.fullName && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {addressErrors.fullName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      E-mail para Confirmação *
                    </label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      placeholder="carlos@exemplo.com.br"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.email ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                    {addressErrors.email && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {addressErrors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      CPF *
                    </label>
                    <input
                      type="text"
                      value={address.cpf}
                      onChange={(e) => setAddress({ ...address, cpf: formatCPF(e.target.value) })}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.cpf ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                    {addressErrors.cpf && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {addressErrors.cpf}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: formatPhone(e.target.value) })
                      }
                      placeholder="(11) 98765-4321"
                      maxLength={15}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.phone ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                    {addressErrors.phone && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {addressErrors.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Address */}
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <h3 className="text-base font-semibold text-stone-900">
                      Endereço de Entrega
                    </h3>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Busca automática por CEP
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={address.cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="01414-001"
                      maxLength={9}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.cep ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                    {addressErrors.cep && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {addressErrors.cep}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Logradouro (Rua / Avenida) *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Rua Oscar Freire"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.street ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                    {addressErrors.street && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {addressErrors.street}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={address.number}
                      onChange={(e) => setAddress({ ...address, number: e.target.value })}
                      placeholder="1200"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.number ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                    {addressErrors.number && (
                      <span className="text-[11px] text-red-500 mt-1 block">
                        {addressErrors.number}
                      </span>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Complemento (Apto, Bloco)
                    </label>
                    <input
                      type="text"
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      placeholder="Apto 42B"
                      className="w-full text-xs px-3.5 py-2.5 rounded-md border border-stone-300 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={address.neighborhood}
                      onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                      placeholder="Jardins"
                      className="w-full text-xs px-3.5 py-2.5 rounded-md border border-stone-300 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="São Paulo"
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.city ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900`}
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      UF *
                    </label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                      placeholder="SP"
                      maxLength={2}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-md border ${
                        addressErrors.state ? 'border-red-500' : 'border-stone-300'
                      } focus:outline-none focus:border-stone-900 uppercase`}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Shipping Method Selection */}
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">
                    Opção de Envio
                  </h3>
                </div>

                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedShipping.id === opt.id
                          ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping.id === opt.id}
                          onChange={() => setSelectedShipping(opt)}
                          className="accent-stone-900"
                        />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">
                            {opt.name} ({opt.courier})
                          </p>
                          <p className="text-[11px] text-stone-500">{opt.days}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900 tabular-nums">
                          {isFreeShipping ? (
                            <span className="text-emerald-700">Grátis</span>
                          ) : opt.price === 0 ? (
                            <span className="text-emerald-700">Grátis</span>
                          ) : (
                            formatCurrency(opt.price)
                          )}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit to Step 2 */}
              <button
                type="submit"
                className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Prosseguir para o Pagamento</span>
                <Lock className="w-4 h-4" />
              </button>

            </form>
          ) : (
            /* STEP 2: Payment Method System */
            <div className="space-y-6">
              
              <div className="bg-white p-6 sm:p-7 rounded-xl border border-stone-200 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <h3 className="text-base font-semibold text-stone-900">
                      Escolha a Forma de Pagamento
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="text-xs text-stone-600 hover:text-stone-950 underline"
                  >
                    Alterar Endereço
                  </button>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`py-3 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>PIX (5% OFF)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`py-3 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Cartão de Crédito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`py-3 px-3 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === 'boleto'
                        ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Boleto Bancário</span>
                  </button>
                </div>

                {/* METHOD 1: PIX Flow */}
                {paymentMethod === 'pix' && (
                  <div className="p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-stone-200">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprovação instantânea + 5% de desconto aplicado</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-600 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          Expira em {Math.floor(pixTimeRemaining / 60)}:
                          {(pixTimeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-2">
                      <PixQrCode value={pixCode} size={170} />

                      <div className="space-y-3 flex-1 text-xs">
                        <p className="text-stone-700 leading-relaxed">
                          1. Abra o aplicativo do seu banco.<br />
                          2. Escolha pagar via <strong>PIX com QR Code</strong> ou <strong>PIX Copia e Cola</strong>.<br />
                          3. Aponte a câmera ou cole o código abaixo.
                        </p>

                        <div className="space-y-1.5">
                          <label className="text-[11px] font-medium text-stone-600">
                            Código PIX Copia e Cola:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              readOnly
                              value={pixCode}
                              className="w-full text-[11px] font-mono px-3 py-2 bg-white border border-stone-300 rounded text-stone-600 truncate"
                            />
                            <button
                              type="button"
                              onClick={() => copyToClipboard(pixCode, 'pix')}
                              className="px-3.5 py-2 bg-stone-900 text-stone-50 rounded text-xs font-semibold uppercase hover:bg-stone-800 flex items-center gap-1 shrink-0"
                            >
                              {copiedPix ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleFinalizeOrder(true)}
                        className="flex-1 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isProcessing ? (
                          <span>Verificando pagamento...</span>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Já paguei! Confirmar Pedido</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFinalizeOrder(false)}
                        className="py-3.5 px-4 border border-stone-300 text-stone-700 hover:text-stone-900 text-xs font-medium rounded-md hover:bg-white"
                      >
                        Pagar Mais Tarde
                      </button>
                    </div>
                  </div>
                )}

                {/* METHOD 2: Credit Card Flow with Realistic Visual Card */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-6">
                    
                    {/* Visual Card Display */}
                    <div className="relative mx-auto max-w-sm h-48 rounded-xl p-6 text-stone-100 shadow-xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 border border-stone-700">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-7 bg-amber-400/80 rounded-sm flex items-center justify-center">
                          <div className="w-6 h-4 border border-amber-600/50 rounded-xs" />
                        </div>
                        <span className="font-serif italic text-base tracking-wider text-stone-300 font-bold">
                          {getCardBrand(cardData.number)}
                        </span>
                      </div>

                      <div className="mt-6">
                        <p className="font-mono text-base tracking-widest text-stone-100">
                          {cardData.number || '•••• •••• •••• ••••'}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-end text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                            Titular
                          </span>
                          <span className="font-mono tracking-wider uppercase truncate block max-w-[170px]">
                            {cardData.holderName || 'NOME NO CARTÃO'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                            Validade
                          </span>
                          <span className="font-mono">
                            {cardData.expiry || 'MM/AA'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card input fields */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Número do Cartão *
                        </label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) =>
                            setCardData({
                              ...cardData,
                              number: formatCardNumber(e.target.value),
                            })
                          }
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          className={`w-full text-xs px-3.5 py-2.5 rounded-md border font-mono ${
                            cardErrors.number ? 'border-red-500' : 'border-stone-300'
                          } focus:outline-none focus:border-stone-900`}
                        />
                        {cardErrors.number && (
                          <span className="text-[11px] text-red-500 mt-1 block">
                            {cardErrors.number}
                          </span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Nome Impresso no Cartão *
                        </label>
                        <input
                          type="text"
                          value={cardData.holderName}
                          onChange={(e) =>
                            setCardData({ ...cardData, holderName: e.target.value.toUpperCase() })
                          }
                          placeholder="CARLOS E SOUZA"
                          className={`w-full text-xs px-3.5 py-2.5 rounded-md border uppercase ${
                            cardErrors.holderName ? 'border-red-500' : 'border-stone-300'
                          } focus:outline-none focus:border-stone-900`}
                        />
                        {cardErrors.holderName && (
                          <span className="text-[11px] text-red-500 mt-1 block">
                            {cardErrors.holderName}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Validade (MM/AA) *
                          </label>
                          <input
                            type="text"
                            value={cardData.expiry}
                            onChange={(e) =>
                              setCardData({
                                ...cardData,
                                expiry: formatCardExpiry(e.target.value),
                              })
                            }
                            placeholder="12/28"
                            maxLength={5}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-md border font-mono ${
                              cardErrors.expiry ? 'border-red-500' : 'border-stone-300'
                            } focus:outline-none focus:border-stone-900`}
                          />
                          {cardErrors.expiry && (
                            <span className="text-[11px] text-red-500 mt-1 block">
                              {cardErrors.expiry}
                            </span>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">
                            Código CVV *
                          </label>
                          <input
                            type="password"
                            value={cardData.cvv}
                            onChange={(e) =>
                              setCardData({
                                ...cardData,
                                cvv: e.target.value.replace(/\D/g, '').slice(0, 4),
                              })
                            }
                            placeholder="123"
                            maxLength={4}
                            className={`w-full text-xs px-3.5 py-2.5 rounded-md border font-mono ${
                              cardErrors.cvv ? 'border-red-500' : 'border-stone-300'
                            } focus:outline-none focus:border-stone-900`}
                          />
                          {cardErrors.cvv && (
                            <span className="text-[11px] text-red-500 mt-1 block">
                              {cardErrors.cvv}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Opções de Parcelamento
                        </label>
                        <select
                          value={cardData.installments}
                          onChange={(e) =>
                            setCardData({ ...cardData, installments: Number(e.target.value) })
                          }
                          className="w-full text-xs px-3.5 py-2.5 rounded-md border border-stone-300 bg-white focus:outline-none focus:border-stone-900"
                        >
                          <option value={1}>
                            1x de {formatCurrency(grandTotal)} à vista sem juros
                          </option>
                          <option value={2}>
                            2x de {formatCurrency(grandTotal / 2)} sem juros
                          </option>
                          <option value={3}>
                            3x de {formatCurrency(grandTotal / 3)} sem juros
                          </option>
                          <option value={4}>
                            4x de {formatCurrency(grandTotal / 4)} sem juros
                          </option>
                          <option value={5}>
                            5x de {formatCurrency(grandTotal / 5)} sem juros
                          </option>
                          <option value={6}>
                            6x de {formatCurrency(grandTotal / 6)} sem juros
                          </option>
                          <option value={10}>
                            10x de {formatCurrency((grandTotal * 1.05) / 10)} com juros leves
                          </option>
                          <option value={12}>
                            12x de {formatCurrency((grandTotal * 1.08) / 12)} com juros leves
                          </option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleFinalizeOrder(true)}
                      className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isProcessing ? (
                        <span>Processando transação segura...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>
                            Pagar {formatCurrency(grandTotal)} no Cartão
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* METHOD 3: Boleto Bancário Flow */}
                {paymentMethod === 'boleto' && (
                  <div className="p-5 bg-stone-50 rounded-lg border border-stone-200 space-y-4">
                    <div className="text-xs text-stone-700 space-y-2">
                      <p className="font-semibold text-stone-900">
                        Boleto Bancário Registrado
                      </p>
                      <p>
                        O boleto tem vencimento em <strong>3 dias úteis</strong>. Pode ser pago em qualquer banco ou pelo aplicativo do seu smartphone.
                      </p>
                    </div>

                    {/* Barcode visual simulation */}
                    <div className="p-4 bg-white border border-stone-300 rounded space-y-2 text-center">
                      <div className="font-mono text-xs font-semibold text-stone-800 tracking-wider">
                        {boletoBarcode}
                      </div>

                      {/* Barcode lines */}
                      <div className="flex justify-center items-center gap-0.5 h-12 py-1">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-full ${
                              i % 3 === 0
                                ? 'w-1 bg-stone-900'
                                : i % 5 === 0
                                ? 'w-0.5 bg-stone-900'
                                : 'w-0.5 bg-stone-800'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(boletoBarcode, 'boleto')}
                        className="inline-flex items-center gap-1.5 text-xs text-stone-700 hover:text-stone-950 font-medium underline pt-1"
                      >
                        {copiedBoleto ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Linha Digitável Copiada!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Linha Digitável</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleFinalizeOrder(false)}
                      className="w-full py-4 px-6 bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isProcessing ? (
                        <span>Gerando seu boleto...</span>
                      ) : (
                        <>
                          <FileText className="w-4 h-4" />
                          <span>Finalizar e Gerar Boleto</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white p-6 sm:p-7 rounded-xl border border-stone-200 shadow-xs space-y-5">
            <h3 className="text-base font-semibold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Resumo do Pedido</span>
              <span className="text-xs text-stone-500 font-mono font-normal">
                {items.length} itens
              </span>
            </h3>

            {/* Items review */}
            <div className="max-h-60 overflow-y-auto divide-y divide-stone-100 pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-14 object-cover rounded bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {item.selectedSize} · {item.selectedColor.name} · Qtd: {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-stone-900 tabular-nums">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial breakdown */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal dos produtos</span>
                <span className="font-mono tabular-nums text-stone-800">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Cupom ({appliedCoupon?.code})</span>
                  <span className="font-mono tabular-nums">
                    - {formatCurrency(couponDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete ({selectedShipping.name})</span>
                <span className="font-mono tabular-nums text-stone-800">
                  {currentShippingCost === 0 ? (
                    <span className="text-emerald-700 font-semibold">Grátis</span>
                  ) : (
                    formatCurrency(currentShippingCost)
                  )}
                </span>
              </div>

              {paymentMethod === 'pix' && pixDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Desconto Especial PIX (5%)</span>
                  <span className="font-mono tabular-nums">
                    - {formatCurrency(pixDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-base font-semibold text-stone-900 pt-3 border-t border-stone-200">
                <span>Total a Pagar</span>
                <span className="font-mono tabular-nums text-xl">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Delivery address preview if filled */}
            {address.street && (
              <div className="p-3 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-600 space-y-0.5">
                <p className="font-semibold text-stone-900">Entregar em:</p>
                <p>
                  {address.street}, {address.number} {address.complement && `(${address.complement})`}
                </p>
                <p>
                  {address.neighborhood} · {address.city} - {address.state}
                </p>
                <p className="font-mono">CEP: {address.cep}</p>
              </div>
            )}

            {/* Trust badge */}
            <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ambiente criptografado com Certificado SSL 256 bits</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
