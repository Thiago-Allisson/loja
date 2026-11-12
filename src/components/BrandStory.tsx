import React from 'react';
import { Sparkles, Scissors, Leaf, Award } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="bg-stone-100/80 border-t border-stone-200 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-widest text-emerald-800">
              O Manifesto ALVIVERDE
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900 leading-tight">
              A elegância mora na substância e no silêncio da perfeição.
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Recusamos o ciclo descartável do fast fashion. Nossas coleções nascem a partir de fibras 100% naturais selecionadas em cooperativas éticas e tecidas em teares tradicionais.
            </p>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Cada costura é pensada para durar décadas, com entretelas de crina natural na alfaiataria, reforços em pontos de tensão e acabamentos internos invisíveis.
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs text-stone-800 font-medium">
              <div>
                <span className="block font-serif text-2xl font-bold text-stone-900">100%</span>
                <span className="text-stone-500 text-[11px]">Fibras Naturais</span>
              </div>
              <div className="w-px h-8 bg-stone-300" />
              <div>
                <span className="block font-serif text-2xl font-bold text-stone-900">30</span>
                <span className="text-stone-500 text-[11px]">Dias para Troca</span>
              </div>
              <div className="w-px h-8 bg-stone-300" />
              <div>
                <span className="block font-serif text-2xl font-bold text-stone-900">5★</span>
                <span className="text-stone-500 text-[11px]">Avaliação Média</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-stone-800" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Linho Italiano & Seda Pura</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Linho europeu com respirabilidade térmica inata e seda Mulberry 19 mommes com toque suave na pele.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-stone-800" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Corte & Alfaiataria Precisa</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Modelagem que respeita a anatomia com drapeados naturais e silhuetas que valorizam qualquer ocasião.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                <Award className="w-5 h-5 text-stone-800" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Acabamento Impecável</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Botões em madrepérola e chifre natural, costuras francesas e forros em viscose pura de alta respirabilidade.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-3">
              <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-stone-800" />
              </div>
              <h3 className="text-sm font-semibold text-stone-900">Entrega Expressa Segura</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Embalagens recicláveis personalizadas com caixa rígida protetora, papel de seda e rastreamento em tempo real.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
