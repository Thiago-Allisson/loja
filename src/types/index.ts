export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: 'alfaiataria' | 'vestidos' | 'casacos' | 'basicos' | 'linho';
  categoryLabel: string;
  tag?: string;
  rating: number;
  reviewsCount: number;
  description: string;
  details: {
    composition: string;
    fit: string;
    modelInfo: string;
    care: string;
  };
  sizes: string[];
  colors: {
    name: string;
    hex: string;
  }[];
  image: string;
  secondaryImage?: string;
  inStock: boolean;
  sku: string;
}

export interface CartItem {
  id: string; // unique item id: productId-size-color
  product: Product;
  selectedSize: string;
  selectedColor: {
    name: string;
    hex: string;
  };
  quantity: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  courier: string;
  days: string;
  price: number;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  fixedDiscount?: number;
  freeShipping?: boolean;
  description: string;
}

export interface CustomerAddress {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export type PaymentMethodType = 'pix' | 'credit_card' | 'boleto';

export interface CreditCardData {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
  installments: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  address: CustomerAddress;
  shippingOption: ShippingOption;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'approved' | 'preparing' | 'shipped';
  pixCode?: string;
  boletoCode?: string;
  installmentsText?: string;
}
