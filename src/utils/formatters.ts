export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatCEP(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 8);
  if (clean.length > 5) {
    return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  }
  return clean;
}

export function formatCPF(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 11);
  if (clean.length > 9) {
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
  }
  if (clean.length > 6) {
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6)}`;
  }
  if (clean.length > 3) {
    return `${clean.slice(0, 3)}.${clean.slice(3)}`;
  }
  return clean;
}

export function formatPhone(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 11);
  if (clean.length > 6) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length > 2) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2)}`;
  }
  return clean;
}

export function formatCardNumber(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < clean.length; i += 4) {
    parts.push(clean.slice(i, i + 4));
  }
  return parts.join(' ');
}

export function formatCardExpiry(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 4);
  if (clean.length >= 2) {
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  }
  return clean;
}

// Brazilian CEP mock resolver
export function lookupAddressByCEP(cep: string): {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
} | null {
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return null;

  const prefix = clean.slice(0, 2);
  if (prefix === '01' || prefix === '02' || prefix === '03' || prefix === '04' || prefix === '05') {
    return {
      street: 'Rua Oscar Freire',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP'
    };
  }
  if (prefix === '20' || prefix === '21' || prefix === '22' || prefix === '23') {
    return {
      street: 'Avenida Atlântica',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ'
    };
  }
  if (prefix === '30' || prefix === '31') {
    return {
      street: 'Avenida Afonso Pena',
      neighborhood: 'Savassi',
      city: 'Belo Horizonte',
      state: 'MG'
    };
  }
  if (prefix === '70' || prefix === '71') {
    return {
      street: 'SQS 308 Bloco F',
      neighborhood: 'Asa Sul',
      city: 'Brasília',
      state: 'DF'
    };
  }
  if (prefix === '80' || prefix === '81' || prefix === '82') {
    return {
      street: 'Avenida Batel',
      neighborhood: 'Batel',
      city: 'Curitiba',
      state: 'PR'
    };
  }
  if (prefix === '90' || prefix === '91') {
    return {
      street: 'Rua Padre Chagas',
      neighborhood: 'Moinhos de Vento',
      city: 'Porto Alegre',
      state: 'RS'
    };
  }
  if (prefix === '65' || prefix === '64') {
    return {
      street: 'Avenida dos Holandeses',
      neighborhood: 'Calhau',
      city: 'São Luís',
      state: 'MA'
    };
  }

  // Generic fallback
  return {
    street: 'Avenida Brasil',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP'
  };
}

// Generate realistic PIX EMV payload string
export function generatePixPayload(amount: number, orderId: string): string {
  const formattedAmount = amount.toFixed(2);
  return `00020126580014br.gov.bcb.pix0136pagamentos@alviverdestore.com.br520400005303986540${formattedAmount.length.toString().padStart(2, '0')}${formattedAmount}5802BR5916ALVIVERDE STORE6009SAO PAULO62070503***6304${orderId.slice(-4)}`;
}

// Generate realistic barcode line for Boleto
export function generateBoletoCode(amount: number): string {
  const cents = Math.round(amount * 100).toString().padStart(10, '0');
  return `34191.79001 01043.510047 91020.150008 8 98200000${cents.slice(-6)}`;
}
