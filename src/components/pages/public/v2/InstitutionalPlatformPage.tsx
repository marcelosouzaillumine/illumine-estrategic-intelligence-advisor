import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Target, LineChart, Briefcase, Users, LayoutDashboard, Compass } from 'lucide-react';
import { SystemicIntelligenceShowcase } from './showcases/SystemicIntelligenceShowcase';
import { ExecutiveInsightCard } from './components/ExecutiveInsightCard';

export function InstitutionalPlatformPage() {
  const dominios = [
    { icon: Compass, title: "Inteligência Estratégica", desc: "Acompanhamento e desdobramento da tese em OKRs." },
    { icon: LineChart, title: "Inteligência Financeira", desc: "Digital Twin contábil com simulação de cenários futuros." },
    { icon: Box, title: "Inteligência Sistêmica", desc: "Modelagem DFC e impacto de caixa no longo prazo." },
    { icon: Briefcase, title: "Inteligência Operacional", desc: "Métricas de esforço (EFOS) e saúde da operação." },
    { icon: LayoutDashboard, title: "Inteligência de Governança", desc: "Observabilidade institucional e aderência ao risco." },
    { icon: Users, title: "Inteligência de Pessoas", desc: "Custo de quadro e produtividade cruzada com faturamento." },
  ];

  return (
    <div className="flex flex-col bg-[#0A0A0B] text-slate-200">
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 rounded-[100%] blur-[100px] -z-10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-sm font-semibold text-primary uppercase tracking-widest mb-6">A Plataforma</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Seis domínios. Uma visão.
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A arquitetura da Illumine captura a totalidade da sua organização através de 6 domínios interconectados, 
            operando como a fundação de inteligência do seu negócio.
          </p>
        </div>
      </section>

      {/* Domínios (Bento Grid Style) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-3xl font-bold text-white mb-4">Arquitetura de Domínios</h3>
            <p className="text-slate-400">Cada domínio é autossuficiente na análise, mas integrado na recomendação.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dominios.map((d, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-8 hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <d.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{d.title}</h4>
                <p className="text-slate-400 text-sm">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Twin & Arquitetura Visual (Showcase) */}
      <section className="py-32 px-6 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-white mb-6">O Institutional Digital Twin™</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Em vez de apenas ler bases de dados, a Illumine cria um "Gêmeo Digital" da sua organização. 
              Ao alterar a premissa de custo logístico, você não vê apenas a alteração de uma linha; você visualiza 
              o impacto automático no fluxo de caixa (DFC), no valuation e na necessidade de capital de giro (DLPA) no longo prazo.
            </p>
            <ul className="space-y-4 mb-10">
              <li className="flex items-center gap-3 text-slate-300">
                <Target className="w-5 h-5 text-primary" />
                Visibilidade completa do balanço patrimonial
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Target className="w-5 h-5 text-primary" />
                Motor de inferência para "War Gaming"
              </li>
            </ul>
            <ExecutiveInsightCard 
               author="Arquiteto de Sistemas Fiduciários"
               text="A correlação em tempo real entre o Atrito Sistêmico e a Perda de EBITDA torna o que era subjetivo em um dado exato e auditável."
               date="Governança em Camadas"
            />
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="scale-90 origin-right lg:scale-100">
               <SystemicIntelligenceShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">Plataforma Viva (Roadmap)</h3>
            <p className="text-slate-400">Como uma plataforma de inteligência institucional, a Illumine evolui em ciclos curtos.</p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            
            {/* Phase 1 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0A0A0B] text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2.5 h-2.5 bg-primary rounded-full" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-lg">Consolidação Sistêmica</h4>
                  <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded-full">Disponível</span>
                </div>
                <p className="text-sm text-slate-400">Implantação de observabilidade institucional: DRE, DFC, DLPA, Executive Intelligence View™, EFOS e Arquitetura de Governança.</p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary/30 bg-primary/10 text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-6 rounded-2xl border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-lg">Agentes Cognitivos</h4>
                  <span className="text-xs font-mono text-amber-500 bg-amber-500/10 px-2 py-1 rounded-full">Em Homologação</span>
                </div>
                <p className="text-sm text-slate-400">Lançamento do Executive Copilot, Geração de Board Reports (Atas Dinâmicas) e análise interpretativa automatizada.</p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0A0A0B] text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <div className="w-2.5 h-2.5 bg-slate-600 rounded-full" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-6 rounded-2xl border border-white/5 opacity-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white text-lg">Predictive War Gaming</h4>
                  <span className="text-xs font-mono text-slate-400 bg-white/10 px-2 py-1 rounded-full">Próximo</span>
                </div>
                <p className="text-sm text-slate-400">Criação de cenários complexos ramificados (Stress Testing Institucional) e observabilidade preditiva do risco.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white/5 border-t border-white/5 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8">
            A tecnologia não define a estratégia, mas garante a execução.
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
