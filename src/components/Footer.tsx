import React, { useState } from 'react';
import { Mail, ShieldCheck, Check, ArrowRight } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenOrders: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenOrders }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSuccess(false), 4000);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-serif font-bold tracking-widest text-white">
              ALVIVERDE STORE
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Loja oficial de moda contemporânea, alfaiataria e vestuário esportivo e casual. Peças desenhadas com materiais de excelência e conforto superior.
            </p>
            <div className="text-xs text-stone-400 space-y-1">
              <p>São Paulo · Rua Oscar Freire, Jardins</p>
              <p>Atendimento: contato@alviverdestore.com.br</p>
              <p>Segunda a Sexta, das 09h às 18h</p>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-200">
              Coleções
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('alfaiataria')}
                  className="hover:text-white transition-colors"
                >
                  Alfaiataria Nobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('vestidos')}
                  className="hover:text-white transition-colors"
                >
                  Vestidos em Seda
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('casacos')}
                  className="hover:text-white transition-colors"
                >
                  Casacos & Trench Coats
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('linho')}
                  className="hover:text-white transition-colors"
                >
                  Puro Linho Italiano
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('basicos')}
                  className="hover:text-white transition-colors"
                >
                  Básicos Essenciais
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-200">
              Atendimento & Suporte
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenOrders} className="hover:text-white transition-colors">
                  Acompanhar Meus Pedidos
                </button>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Política de Trocas e Devoluções
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Tabela e Guia de Medidas
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Cuidados com Tecidos Nobres
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Certificado de Sustentabilidade
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-200">
              Atelier Newsletter
            </h4>
            <p className="text-xs text-stone-400">
              Receba convites de pré-venda e ganhe 10% OFF no primeiro pedido com o cupom <strong>BEMVINDO10</strong>.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="w-full text-xs px-3 py-2 bg-stone-800 text-stone-100 border border-stone-700 rounded-l-md focus:outline-none focus:border-stone-400 placeholder:text-stone-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-white text-stone-900 rounded-r-md text-xs font-semibold hover:bg-stone-200 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {newsletterSuccess && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Inscrição confirmada com sucesso!</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Payment badges & Security seals */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] text-stone-500">Formas de Pagamento:</span>
            <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded font-mono text-[11px]">
              PIX (5% OFF)
            </span>
            <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded font-mono text-[11px]">
              Visa
            </span>
            <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded font-mono text-[11px]">
              Mastercard
            </span>
            <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded font-mono text-[11px]">
              Elo
            </span>
            <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded font-mono text-[11px]">
              Boleto
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Compra 100% Segura · SSL 256 bits</span>
            </span>
            <span>·</span>
            <span>CNPJ: 42.108.924/0001-89</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-[11px] text-stone-500">
          © {new Date().getFullYear()} ALVIVERDE STORE. Todos os direitos reservados :). Moda contemporânea e vestuário autoral.
        </div>
      </div>
    </footer>
  );
};
