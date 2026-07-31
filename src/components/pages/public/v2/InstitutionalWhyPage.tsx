import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function InstitutionalWhyPage() {
  return (
    <div className="flex flex-col bg-[#0A0A0B] text-slate-200">
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-sm font-semibold text-primary uppercase tracking-widest mb-6">Business Case</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Por que a Illumine?
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Se a sua organização já possui um ERP e ferramentas avançadas de visualização de dados (BI), 
            por que investir em uma Executive Intelligence Platform™?
          </p>
        </div>
      </section>

      {/* Comparisons */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto space-y-24">
          
          {/* vs ERP */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">O limite do ERP</h3>
              <p className="text-slate-400 mb-6">
                Sistemas integrados de gestão são projetados para <strong className="text-white">registro e conformidade</strong>. Eles garantem que a transação aconteceu, mas não capturam a justificativa estratégica da transação.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">O ERP diz: "Compramos X por Y."</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">A Illumine responde: "Compramos X por Y porque o comitê antecipou risco de ruptura logística, baseado no cenário Z."</span>
                </li>
              </ul>
            </div>
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5 h-full flex items-center justify-center">
               <span className="text-slate-500 font-mono text-sm uppercase tracking-widest">Transação vs Racionalidade</span>
            </div>
          </div>

          {/* vs BI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 p-8 bg-white/5 rounded-2xl border border-white/5 h-full flex items-center justify-center">
               <span className="text-slate-500 font-mono text-sm uppercase tracking-widest">Observação vs Intervenção</span>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-bold text-white mb-4">A ilusão do BI</h3>
              <p className="text-slate-400 mb-6">
                Sistemas de BI (Business Intelligence) oferecem dashboards lindamente desenhados, mas que são estruturalmente passivos. Eles são retrovisores olhando para o mês passado.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">O BI diz: "O Ebitda caiu 4%."</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">A Illumine responde: "O Ebitda caiu 4%. Se a premissa comercial atual se mantiver, a quebra de covenant ocorrerá no mês 7. Veja os três cenários de mitigação e convoque o conselho."</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Papel da IA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">IA com Supervisão Humana</h3>
              <p className="text-slate-400 mb-6">
                Muitas soluções tentam substituir analistas gerando respostas autônomas. Na governança corporativa, isso é um risco. A Illumine usa IA para identificar anomalias, conectar documentos, e preparar contextos.
              </p>
              <p className="text-slate-400">
                Mas <strong className="text-white">a deliberação</strong> e o compromisso ético-estratégico sempre passam por validação humana (Executive Advisors e Conselheiros). É inteligência aumentada, não inteligência substitutiva.
              </p>
            </div>
            <div className="p-8 bg-white/5 rounded-2xl border border-white/5 h-full flex items-center justify-center">
               <span className="text-slate-500 font-mono text-sm uppercase tracking-widest">Augmentation vs Automation</span>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white/5 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8">
            Pronto para elevar o padrão da sua governança?
          </h2>
          <Link 
            to="/assessment"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300"
          >
            Solicitar Diagnóstico Executivo
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
