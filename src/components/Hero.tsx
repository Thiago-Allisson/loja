import React from 'react';
import { ShieldCheck, Truck, RotateCcw, CreditCard, ArrowRight } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden border-b border-stone-200">
      {/* Hero Visual Campaign Showcase */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Typography & Intent */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="text-xs font-semibold tracking-widest text-stone-500 uppercase">
              Coleção Atelier 2026 · Edição I
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-serif font-medium tracking-tight text-stone-900 leading-[1.15] text-balance">
              Alfaiataria pura, tecidos nobres e silhuetas atemporais.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light">
              Criamos peças que transcendem estações. Linho italiano, seda pura e algodão de fibras longas esculpidos com maestria artesanal e proporções modernas.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 text-stone-50 text-sm font-semibold tracking-wide uppercase rounded-md hover:bg-stone-800 transition-all shadow-sm"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCategory('alfaiataria')}
                className="inline-flex items-center justify-center px-6 py-3.5 border border-stone-300 text-stone-800 text-sm font-medium tracking-wide rounded-md hover:border-stone-900 hover:bg-stone-100 transition-all"
              >
                Ver Alfaiataria
              </button>
            </div>

            <div className="pt-4 flex items-center gap-4 text-xs text-stone-500">
              <span className="font-medium text-stone-900">Produção Ética</span>
              <span aria-hidden="true">·</span>
              <span>Matérias-Primas Certificadas</span>
              <span aria-hidden="true">·</span>
              <span>Design Brasileiro</span>
            </div>
          </div>

          {/* Right Column: Hero Image with Measured Framing */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-xl overflow-hidden shadow-xl bg-stone-200 border border-stone-200/80">
              <img
                src="/src/assets/images/hero_fashion_collection_1794499847964.jpg"
                alt="Campanha Coleção ALVIVERDE STORE - Moda e Alfaiataria contemporâneas"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-stone-100 text-xs font-mono">
                <span className="tracking-widest uppercase">ALVIVERDE STORE</span>
                <span>COLEÇÃO 2026</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4-Column Trust Strip */}
      <div className="bg-stone-100/70 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-200/80 rounded-md text-stone-800 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-stone-900">Frete Grátis Brasil</p>
                <p className="text-stone-500">Em compras acima de R$ 299</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-200/80 rounded-md text-stone-800 shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-stone-900">Até 6x Sem Juros</p>
                <p className="text-stone-500">Ou 5% de desconto no PIX</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-200/80 rounded-md text-stone-800 shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-stone-900">Troca Fácil em 30 Dias</p>
                <p className="text-stone-500">Primeira devolução por nossa conta</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-stone-200/80 rounded-md text-stone-800 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-stone-900">Ateliê Certificado</p>
                <p className="text-stone-500">Puro linho, seda e algodão pima</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
