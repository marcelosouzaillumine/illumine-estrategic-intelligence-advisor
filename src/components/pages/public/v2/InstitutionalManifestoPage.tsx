import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Target, Triangle } from 'lucide-react';

export function InstitutionalManifestoPage() {
  return (
    <div className="flex flex-col bg-[#0A0A0B] text-slate-200">
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 border-b border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-[#0A0A0B] to-[#0A0A0B] z-0 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-sm font-semibold text-primary uppercase tracking-widest mb-6">Manifesto Illumine</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            A era da informação acabou. <br className="hidden md:block" />Bem-vindos à era do contexto.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            As organizações acumularam dados infinitos, mas perderam o fio condutor da decisão estratégica.
          </p>
        </div>
      </section>

      {/* Manifesto Body */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto space-y-20">
          
          {/* O Problema */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  <Triangle className="w-6 h-6 text-slate-400" />
               </div>
               <h3 className="text-2xl font-bold text-white">O Problema</h3>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed">
              Por décadas, as empresas focaram em transações e visualizações. O ERP garantiu que a transação acontecesse com segurança. O BI garantiu que os resultados fossem visualizados.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Mas entre o registro do ERP e o gráfico do BI existe um abismo: <strong className="text-white">a decisão humana e suas premissas</strong>.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Quando um CEO olha para um dashboard indicando queda de margem, o dado responde o "quê". Ele não responde o "por que", e pior, não responde "baseado no cenário atual, o que devemos fazer?". O contexto da decisão se perdeu na memória de ex-diretores e em e-mails antigos. A empresa sofre de Amnésia Institucional.
            </p>
          </div>

          {/* A Tese */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-slate-400" />
               </div>
               <h3 className="text-2xl font-bold text-white">A Tese</h3>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed">
              Acreditamos que a próxima vantagem competitiva intransponível não será o capital, nem a posse de dados genéricos, mas a <strong className="text-white">capacidade institucional de aprender</strong>.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Organizações devem ser tratadas como organismos cognitivos. Quando uma decisão comercial falha, o aprendizado não deve ficar restrito ao diretor de vendas. Ele deve retroalimentar automaticamente as premissas de risco, fluxo de caixa e governança em todo o sistema.
            </p>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl relative">
            <h3 className="text-xl font-bold text-white mb-6">O Paradigma</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <h4 className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-4">Antes</h4>
                  <ul className="space-y-3">
                     <li className="flex items-center gap-3 text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-600" /> Informação</li>
                     <li className="flex items-center gap-3 text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-600" /> Relatório</li>
                     <li className="flex items-center gap-3 text-slate-400"><div className="w-2 h-2 rounded-full bg-slate-600" /> Reação</li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-sm font-mono text-primary uppercase tracking-widest mb-4">Illumine</h4>
                  <ul className="space-y-3">
                     <li className="flex items-center gap-3 text-white"><div className="w-2 h-2 rounded-full bg-primary" /> Contexto</li>
                     <li className="flex items-center gap-3 text-white"><div className="w-2 h-2 rounded-full bg-primary" /> Inteligência</li>
                     <li className="flex items-center gap-3 text-white"><div className="w-2 h-2 rounded-full bg-primary" /> Decisão</li>
                     <li className="flex items-center gap-3 text-white"><div className="w-2 h-2 rounded-full bg-primary" /> Aprendizado</li>
                  </ul>
               </div>
            </div>
          </div>

          {/* A Convicção */}
          <div className="space-y-6 pt-12 border-t border-white/5">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-2xl font-bold text-white">A Convicção</h3>
            </div>
            <p className="text-lg text-slate-400 leading-relaxed">
              Nossa tecnologia foi desenhada para a complexidade do alto escalão. Ela modela o futuro através de simulações sistêmicas rigorosas, correlacionando finanças, governança e operação.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Mas nós temos um compromisso inegociável com a humanidade da liderança: a inteligência artificial corporativa não existe para substituir a intuição, o relacionamento, a coragem ou o peso fiduciário do líder.
            </p>
          </div>
          
        </div>
      </section>

      {/* Assinatura Final */}
      <section className="py-32 bg-[#050506] border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '-0.02em' }}>
            A inteligência amplia.<br />
            <span className="text-slate-500">A decisão permanece humana.</span>
          </h2>
          <Link 
            to="/plataforma"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300"
          >
            Conheça a Arquitetura
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

    </div>
  );
}
