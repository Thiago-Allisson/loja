import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Blazer Desestruturado em Linho Italiano',
    slug: 'blazer-linho-italiano',
    price: 689.0,
    originalPrice: 799.0,
    category: 'alfaiataria',
    categoryLabel: 'Alfaiataria',
    tag: 'Destaque Atelier',
    rating: 4.9,
    reviewsCount: 38,
    description: 'Confeccionado em puro linho cultivado na Itália, este blazer possui modelagem desestruturada que une a sofisticação da alfaiataria clássica ao conforto contemporâneo. Apresenta bolsos chapados, lapela notched e botões em madrepérola natural.',
    details: {
      composition: '100% Linho Italiano de Alta Densidade (Gramatura 260g/m²)',
      fit: 'Modelagem Regular Alfaiatada com caimento fluido e ombros desestruturados',
      modelInfo: 'O modelo mede 1,86m, pesa 78kg e veste tamanho M',
      care: 'Lavagem a seco especializada. Passar a ferro em temperatura média com pano de proteção.'
    },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Areia Natural', hex: '#D6C8B4' },
      { name: 'Branco Giz', hex: '#F4F2EE' },
      { name: 'Azul Meia-Noite', hex: '#1E2530' }
    ],
    image: '/src/assets/images/product_linen_blazer_1794499847573.jpg',
    inStock: true,
    sku: 'AUR-BLZ-001'
  },
  {
    id: 'prod-2',
    name: 'Trench Coat Estruturado Alfaiataria',
    slug: 'trench-coat-estruturado',
    price: 890.0,
    category: 'casacos',
    categoryLabel: 'Casacos & Outerwear',
    tag: 'Edição Limitada',
    rating: 5.0,
    reviewsCount: 24,
    description: 'Peça icônica com corte impecável de inspiração militar contemporânea. Tecido encorpado resistente à água com toque aveludado, cinto estruturado com fivela forrada, abotoamento duplo frontal e fenda traseira para mobilidade irrestrita.',
    details: {
      composition: '70% Algodão Pima Encerado, 30% Poliamida Técnica Impermeável',
      fit: 'Oversized estruturado. Permite sobreposição com malhas grossas.',
      modelInfo: 'A modelo mede 1,77m e veste tamanho P',
      care: 'Não lavar em água. Limpeza profissional suave.'
    },
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Chumbo Mineral', hex: '#373A3C' },
      { name: 'Bege Militar', hex: '#A39983' }
    ],
    image: '/src/assets/images/product_trench_coat_1794499848501.jpg',
    inStock: true,
    sku: 'AUR-CAS-002'
  },
  {
    id: 'prod-3',
    name: 'Vestido Slip Midi em Pura Seda Mulberry',
    slug: 'vestido-slip-seda-mulberry',
    price: 749.0,
    originalPrice: 820.0,
    category: 'vestidos',
    categoryLabel: 'Vestidos',
    tag: 'Mais Vendido',
    rating: 4.8,
    reviewsCount: 52,
    description: 'Vestido midi de corte enviesado que abraça as curvas de forma sutil e sofisticada. Produzido com pura seda Mulberry de 19 mommes com toque incrivelmente macio, decote em V suave e alças finas reguláveis com acabamento oculto.',
    details: {
      composition: '100% Seda Pura Mulberry Grau 6A',
      fit: 'Corte enviesado (bias cut), drapeado fluido na linha do quadril',
      modelInfo: 'A modelo mede 1,75m, busto 84cm, quadril 92cm e veste tamanho P',
      care: 'Lavar à mão em água fria com sabão neutro para seda. Secar à sombra.'
    },
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [
      { name: 'Oliva Musgo', hex: '#585E45' },
      { name: 'Champagne Perolado', hex: '#EDE6D6' },
      { name: 'Preto Absoluto', hex: '#111111' }
    ],
    image: '/src/assets/images/product_silk_dress_1794499849012.jpg',
    inStock: true,
    sku: 'AUR-VES-003'
  },
  {
    id: 'prod-4',
    name: 'Moletom Heavyweight Algodão Orgânico 450g',
    slug: 'moletom-heavyweight-organico',
    price: 450.0,
    category: 'basicos',
    categoryLabel: 'Básicos Premium',
    tag: 'Novo',
    rating: 4.9,
    reviewsCount: 19,
    description: 'Desenvolvido para durar décadas. Algodão orgânico penteado de altíssima gramatura (450g/m²) com interior escovado térmico, punhos e barra canelados com elastano duplo, capuz anatômico estruturado sem cordões visíveis.',
    details: {
      composition: '100% Algodão Orgânico Certificado GOTS',
      fit: 'Modelagem Boxy contemporânea com ombros descaídos',
      modelInfo: 'O modelo mede 1,82m e veste tamanho M',
      care: 'Lavagem em ciclo suave até 30°C. Não alvejar. Secar em varal.'
    },
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [
      { name: 'Grafite Mineral', hex: '#4A4C50' },
      { name: 'Off-White Cru', hex: '#EBE7DF' },
      { name: 'Terra Cota', hex: '#875143' }
    ],
    image: '/src/assets/images/product_oversized_hoodie_1794499849638.jpg',
    inStock: true,
    sku: 'AUR-BAS-004'
  },
  {
    id: 'prod-5',
    name: 'Calça Alfaiataria Reta com Pregas em Linho',
    slug: 'calca-alfaiataria-linho-pregas',
    price: 499.0,
    category: 'linho',
    categoryLabel: 'Linho & Malha',
    rating: 4.7,
    reviewsCount: 31,
    description: 'Equilíbrio primoroso entre rigor formal e leveza natural. Cintura alta com passantes estruturados, pregas duplas frontais que conferem volume elegante e caimento reto com acabamento em bainha invisível.',
    details: {
      composition: '65% Linho Puro, 35% Algodão Nobre',
      fit: 'Cintura alta com perna reta fluida e caimento clássico',
      modelInfo: 'O modelo veste tamanho 40 (M)',
      care: 'Lavar à mão ou em ciclo delicado. Passar com ferro a vapor.'
    },
    sizes: ['38 (PP)', '40 (P)', '42 (M)', '44 (G)', '46 (GG)'],
    colors: [
      { name: 'Areia Natural', hex: '#D6C8B4' },
      { name: 'Preto Ébano', hex: '#1C1C1E' }
    ],
    image: '/src/assets/images/product_linen_blazer_1794499847573.jpg',
    inStock: true,
    sku: 'AUR-LIN-005'
  },
  {
    id: 'prod-6',
    name: 'Camisa Algodão Egípcio 120 Fios',
    slug: 'camisa-algodao-egipcio-120-fios',
    price: 389.0,
    category: 'basicos',
    categoryLabel: 'Básicos Premium',
    tag: 'Clássico Essencial',
    rating: 4.9,
    reviewsCount: 47,
    description: 'Tecida com fibras extra-longas de algodão egípcio de 120 fios duplos, proporcionando um toque sedoso incomparável, brilho nobre e durabilidade superior. Colarinho semi-italiano com barbelas removíveis.',
    details: {
      composition: '100% Algodão Egípcio Giza 87 de Fibras Longas',
      fit: 'Tailored fit: ajustada ao tronco sem prender os movimentos',
      modelInfo: 'O modelo mede 1,84m e veste tamanho 3',
      care: 'Lavar em água fria. Passar a ferro em temperatura algodão.'
    },
    sizes: ['1 (PP)', '2 (P)', '3 (M)', '4 (G)', '5 (GG)'],
    colors: [
      { name: 'Branco Puro', hex: '#FFFFFF' },
      { name: 'Azul Claro Céu', hex: '#CFE0F0' }
    ],
    image: '/src/assets/images/product_oversized_hoodie_1794499849638.jpg',
    inStock: true,
    sku: 'AUR-BAS-006'
  }
];

export const COUPONS = [
  {
    code: 'BEMVINDO10',
    discountPercentage: 10,
    description: '10% OFF na primeira compra'
  },
  {
    code: 'AURA15',
    discountPercentage: 15,
    description: '15% OFF em compras acima de R$ 600'
  },
  {
    code: 'FRETEGRATIS',
    freeShipping: true,
    description: 'Frete Grátis para todo o Brasil'
  }
];

export const SHIPPING_OPTIONS = [
  {
    id: 'pac',
    name: 'PAC Econômico',
    courier: 'Correios',
    days: '5 a 8 dias úteis',
    price: 24.9
  },
  {
    id: 'sedex',
    name: 'SEDEX Expresso',
    courier: 'Correios',
    days: '1 a 3 dias úteis',
    price: 39.5
  },
  {
    id: 'atelier_pickup',
    name: 'Retirada no Atelier (SP)',
    courier: 'Jardins / São Paulo',
    days: 'Disponível em até 24h',
    price: 0.0
  }
];
