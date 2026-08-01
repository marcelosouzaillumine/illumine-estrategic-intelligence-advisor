import React from 'react';
import { ArrowRight, Combine, Brain, Eye, Activity, Database, Users, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstitutionalHero } from '@/components/ui/public/InstitutionalHero';
import { InstitutionalSection } from '@/components/ui/public/InstitutionalSection';
import { InstitutionalTitle } from '@/components/ui/public/InstitutionalTitle';
import { InstitutionalCard } from '@/components/ui/public/InstitutionalCard';

export function InstitutionalWhyPage() {
  const comparisons = [
    { old: "Organizam dados", new: "Constrói contexto executivo" },
    { old: "Geram dashboards", new: "Apoia decisões" },
    { old: "Automatizam tarefas", new: "Preserva inteligência institucional" },
    { old: "Respondem perguntas", new: "Explica causas e consequências" },
    { old: "Operam por departamentos", new: "Compreende sistemas organizacionais" },
    { old: "Mostram indicadores", new: "Revela relações causais" },
    { old: "Dependem das pessoas lembrarem", new: "Preserva memória institucional" }
  ];

  const capabilities = [
    {
      title: "Contexto antes da resposta",
      description: "A plataforma interpreta o cenário completo antes de produzir recomendações.",
      icon: Brain
    },
    {
      title: "Memória Institucional™",
      description: "Cada decisão preserva contexto, evidências, responsáveis, resultados e aprendizados.",
      icon: Database
    },
    {
      title: "Inteligência Sistêmica™",
      description: "Uma alteração operacional repercute automaticamente sobre caixa, margem, capital de giro, valuation e risco.",
      icon: Combine
    },
    {
      title: "Explainable Intelligence™",
      description: "Cada recomendação informa evidências utilizadas, nível de confiança, premissas e limitações.",
      icon: Eye
    },
    {
      title: "Evolução Contínua",
      description: "A plataforma aprende com decisões anteriores para aperfeiçoar análises futuras.",
      icon: Activity
    }
  ];

  const profiles = [
    "Empresas de médio e grande porte",
    "Holdings e Grupos empresariais",
    "Organizações familiares em profissionalização",
    "Organizações com múltiplas unidades de negócio",
    "Instituições de saúde de alta complexidade",
    "Instituições de ensino",
    "Organizações do terceiro setor de alta complexidade"
  ];

  const results = [
    "Maior qualidade das decisões estratégicas",
    "Redução da dependência de conhecimento individual",
    "Maior transparência fiduciária e prestação de contas",
    "Alinhamento real entre estratégia e execução",
    "Inteligência institucional acumulativa",
    "Governança baseada inteiramente em evidências"
  ];

  return (
    <div className="flex flex-col bg-[#050506] text-slate-200">
      
      {/* Hero */}
      <InstitutionalHero
        tagline="Por que Illumine"
        title={
          <span className="text-4xl md:text-5xl lg:text-7xl max-w-5xl mx-auto block leading-tight">
            Nem toda inteligência foi construída para apoiar decisões estratégicas.
          </span>
        }
        subtitle={
          <span className="text-xl md:text-2xl lg:text-3xl font-normal max-w-4xl mx-auto block mt-6 leading-relaxed">
            A maioria das plataformas organiza dados, automatiza processos ou responde perguntas. A Illumine foi desenvolvida para apoiar decisões de alta complexidade, preservando contexto, memória institucional e governança.
          </span>
        }
        showScrollIndicator={true}
      >
        <div className="mt-12">
          <a href="#diferencial" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2">
            Conheça a Arquitetura de Governança
            <ArrowRight size={20} />
          </a>
        </div>
      </InstitutionalHero>

      {/* Section 1: Fragmentação */}
      <InstitutionalSection variant="darker" id="diferencial">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            O problema não é tecnologia.<br/><span className="text-amber-500">É fragmentação.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-16 leading-relaxed">
            Hoje uma organização utiliza dezenas de sistemas especializados. Cada solução resolve uma parte do problema. Nenhuma compreende a organização como um todo.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['ERP', 'CRM', 'BI', 'RH', 'Fiscal', 'Projetos', 'IA Generativa'].map((sys, idx) => (
              <div key={idx} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 font-mono text-sm">
                {sys}
              </div>
            ))}
          </div>
        </div>
      </InstitutionalSection>

      {/* Section 2: O que torna a Illumine diferente */}
      <InstitutionalSection variant="dark">
        <InstitutionalTitle 
          chapter="O Novo Paradigma"
          title="O que torna a Illumine diferente"
          subtitle="A evolução do software departamental para a inteligência institucional."
        />
        
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#0A0A0B] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="grid grid-cols-2 border-b border-white/10 bg-black/40">
              <div className="p-6 md:p-8 text-center border-r border-white/10">
                <span className="text-slate-500 font-semibold tracking-widest uppercase text-sm">Soluções Tradicionais</span>
              </div>
              <div className="p-6 md:p-8 text-center bg-amber-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">Executive Intelligence™</span>
              </div>
            </div>
            
            {/* Rows */}
            <div className="divide-y divide-white/5">
              {comparisons.map((comp, idx) => (
                <div key={idx} className="grid grid-cols-2 hover:bg-white/5 transition-colors">
                  <div className="p-6 md:p-8 flex items-center justify-center text-center border-r border-white/10">
                    <span className="text-slate-400 line-through decoration-slate-600 decoration-1">{comp.old}</span>
                  </div>
                  <div className="p-6 md:p-8 flex items-center justify-center text-center bg-amber-500/[0.02]">
                    <span className="text-white font-medium flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500 hidden md:block" />
                      {comp.new}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </InstitutionalSection>

      {/* Section 3: Arquitetura de Decisão */}
      <InstitutionalSection variant="darker">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Não é mais uma IA.<br/><span className="text-slate-400">É uma arquitetura de decisão.</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              A Illumine não conversa apenas com documentos soltos. Ela gera contexto institucional conectando os fragmentos espalhados pela empresa.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Dados Financeiros', 'Processos', 'Indicadores', 'Decisões', 'Premissas', 'Consequências', 'Aprendizado'].map((item, idx) => (
                <span key={idx} className="px-4 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-sm font-medium">
                  {item}
                </span>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center">
             <div className="w-full max-w-md aspect-square rounded-full border border-white/5 relative flex items-center justify-center">
                <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-12 rounded-full border border-amber-500/20 animate-[spin_40s_linear_infinite_reverse]" />
                <div className="w-32 h-32 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center relative z-10 shadow-[0_0_50px_rgba(255,150,0,0.1)]">
                   <Combine className="w-12 h-12 text-amber-500" />
                </div>
                {/* Floating nodes */}
                <div className="absolute top-[10%] left-[20%] w-3 h-3 bg-white/40 rounded-full blur-[1px]" />
                <div className="absolute bottom-[20%] right-[15%] w-4 h-4 bg-amber-500/40 rounded-full blur-[1px]" />
                <div className="absolute top-[40%] right-[5%] w-2 h-2 bg-white/30 rounded-full blur-[1px]" />
             </div>
          </div>
        </div>
      </InstitutionalSection>

      {/* Section 4: 5 Capacidades */}
      <InstitutionalSection variant="dark">
        <InstitutionalTitle 
          chapter="Tecnologia Proprietária"
          title="Cinco capacidades exclusivas"
          subtitle="O que possibilita que a plataforma interprete a organização como um sistema."
        />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <InstitutionalCard key={idx} className="p-8 border-t-4 border-t-white/10 hover:border-t-amber-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                <cap.icon className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{cap.title}</h4>
              <p className="text-slate-400 leading-relaxed">{cap.description}</p>
            </InstitutionalCard>
          ))}
        </div>
      </InstitutionalSection>

      {/* Section 5: Liderança */}
      <InstitutionalSection variant="darker">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
            <Users className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            A tecnologia não substitui a liderança. <br/>
            <span className="text-amber-500">Ela amplia sua capacidade de decidir.</span>
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            A decisão permanece humana. A Illumine amplia a capacidade analítica dos executivos, preserva conhecimento institucional e fornece evidências para decisões de maior qualidade.
          </p>
        </div>
      </InstitutionalSection>

      {/* Section 6 & 7: Para Quem & Resultados */}
      <InstitutionalSection variant="dark" className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Para Quem */}
          <div>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest block mb-4">Maturidade Institucional</span>
            <h3 className="text-3xl font-bold text-white mb-4">Para quem foi construída</h3>
            <p className="text-slate-400 mb-8">Não por segmentos. Por complexidade.</p>
            
            <ul className="space-y-4">
              {profiles.map((profile, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-6 h-6 mt-0.5 rounded bg-white/5 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  </div>
                  <span className="text-slate-300 text-lg">{profile}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resultados */}
          <div>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest block mb-4">Geração de Valor</span>
            <h3 className="text-3xl font-bold text-white mb-4">O resultado esperado</h3>
            <p className="text-slate-400 mb-8">Ao implantar a Illumine, a organização passa a operar com:</p>
            
            <div className="grid gap-4">
              {results.map((result, idx) => (
                <InstitutionalCard key={idx} className="p-4 flex items-center gap-4 bg-black/40 border-white/5">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span className="text-white font-medium">{result}</span>
                </InstitutionalCard>
              ))}
            </div>
          </div>

        </div>
      </InstitutionalSection>

      {/* CTA Final */}
      <InstitutionalSection variant="glow" className="pt-40 pb-40 text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Toda decisão importante deixa consequências.
          </h2>
          <p className="text-2xl text-slate-300 mb-16">
            Sua organização está preservando também o contexto que levou a essa decisão?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/assessment"
              className="w-full sm:w-auto px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg inline-flex justify-center items-center gap-2"
            >
              Realizar Assessment Executivo
              <ArrowRight size={20} />
            </Link>
            <a 
              href="mailto:contact@illumine.com"
              className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg text-center"
            >
              Conversar com um Executive Advisor
            </a>
          </div>
        </div>
      </InstitutionalSection>

    </div>
  );
}
