import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleDot } from 'lucide-react';
import { ExecutiveInsightCard } from './components/ExecutiveInsightCard';

export function InstitutionalThesisPage() {
  return (
    <div className="flex flex-col bg-[#0A0A0B] text-slate-200">
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 border-b border-white/5 relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-sm font-semibold text-primary uppercase tracking-widest mb-6">Nossa Tese</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            A decisão executiva <br className="hidden md:block" />nunca foi tão solitária.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Conselhos e diretorias têm acesso a mais dados do que nunca, mas operam com menos contexto do que precisariam. Nossa tese é que a próxima grande vantagem competitiva não será ter mais dados, mas ter melhor memória e capacidade de interpretação institucional.
          </p>
          <div className="flex justify-center">
            <ExecutiveInsightCard 
               author="Board Memo"
               text="A erosão do contexto estratégico nas grandes corporações drena até 25% do valuation em atritos e perdas não mapeadas."
               date="2026 Institutional Audit"
            />
          </div>
        </div>
      </section>

      {/* Tese Body */}
      <section className="py-24 px-6 relative">
        <div className="max-w-3xl mx-auto space-y-16">
          
          <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
            <h3 className="text-2xl font-bold text-white mb-4">O Fim da Era da Informação Passiva</h3>
            <p>
              Por duas décadas, as empresas focaram em capturar informações. Implementaram ERPs para garantir transações seguras. 
              Implementaram sistemas de BI para visualizar essas transações.
            </p>
            <p>
              Mas a visualização de um dado não carrega o contexto estratégico da organização. 
              Saber que o faturamento caiu não explica <strong className="text-white">por que</strong> a decisão que causou essa queda foi tomada seis meses antes.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden xl:block">
              <ExecutiveInsightCard 
                 author="Learning Loop Engine"
                 text="Amnésia Institucional mitigada. Histórico preservado na memória central fiduciária."
                 date="Continuous Intelligence"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <CircleDot className="text-primary w-6 h-6" />
              O Institutional Learning Loop™
            </h3>
            <p className="text-slate-400">
              Na Illumine, acreditamos que organizações não devem apenas operar; elas devem aprender. 
              Propomos uma arquitetura que captura as consequências das decisões operacionais e as realimenta nas 
              deliberações estratégicas do Conselho. O erro de ontem vira a premissa calibrada de amanhã.
            </p>
          </div>

          <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
            <h3 className="text-2xl font-bold text-white mb-4">Inteligência que Amplia</h3>
            <p>
              A Inteligência Artificial corporativa não deve ser projetada para substituir a intuição e a coragem do líder executivo. 
              O papel da tecnologia é reduzir a sobrecarga cognitiva e assegurar que a governança está sendo respeitada, liberando a mente do executivo para o que importa: <strong className="text-white">visão, estratégia e relacionamento</strong>.
            </p>
            <p>
              Nós não construímos apenas uma tecnologia. Nós desenvolvemos a primeira Executive Intelligence Platform™ do mundo, desenhada especificamente para suportar a complexidade do alto escalão.
            </p>
          </div>
          
        </div>
      </section>

      {/* Assinatura Final */}
      <section className="py-24 bg-white/5 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '-0.02em' }}>
            A inteligência amplia.<br />
            <span className="text-slate-500">A decisão permanece humana.</span>
          </h2>
          <Link 
            to="/plataforma"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
          >
            Entenda a Arquitetura da Plataforma
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
