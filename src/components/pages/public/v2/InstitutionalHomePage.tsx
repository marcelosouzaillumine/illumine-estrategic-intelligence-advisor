import React from 'react';
import { Link } from 'react-router-dom';
import { ExecutiveCommandShowcase } from './showcases/ExecutiveCommandShowcase';
import { ArrowRight, Shield, Database, Brain, Activity, Clock, ShieldCheck, FileKey, Library, Combine, Cpu, Lock, ChevronRight, Zap, Network, Layers, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GovernanceShowcase } from './showcases/GovernanceShowcase';
import { SystemicIntelligenceShowcase } from './showcases/SystemicIntelligenceShowcase';
import { ExecutiveInsightCard } from './components/ExecutiveInsightCard';
import { LeadershipLayer } from './components/LeadershipLayer';

export function InstitutionalHomePage() {
  return (
    <div className="flex flex-col bg-[#0A0A0B] text-slate-200 overflow-x-hidden">
      
      {/* SEÇÃO 1 — HERO */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen opacity-50" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen opacity-40" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-white uppercase tracking-widest">Executive Intelligence Platform™</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 max-w-5xl mx-auto leading-[1.1]">
            A inteligência que transforma dados corporativos em decisões estratégicas melhores.
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            A Illumine conecta governança, finanças, estratégia e operação para criar memória institucional e ampliar a capacidade decisória de líderes e conselhos.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/assessment"
              className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              Solicitar Diagnóstico Executivo
              <ArrowRight size={18} />
            </Link>
            <Link 
              to="/plataforma"
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
            >
              Conhecer a Plataforma
            </Link>
          </div>
        </div>


      </section>

      {/* SEÇÃO 2 — O PROBLEMA */}
      <section className="py-32 border-t border-white/5 relative bg-gradient-to-b from-[#0A0A0B] to-[#0D0D11]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-20">
             <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">O Paradoxo da Informação</h2>
             <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight">
               As empresas nunca tiveram tantos dados. Mas nunca tiveram tanta dificuldade para interpretar sua própria realidade.
             </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                <Database className="w-8 h-8 text-slate-400 mb-6" />
                <h4 className="text-xl font-bold text-white mb-2">ERP: Transacional</h4>
                <p className="text-slate-400 flex-1">Registra transações e responde com precisão matemática: <strong>"O que aconteceu?"</strong></p>
             </div>
             <div className="p-8 rounded-2xl bg-white/5 border border-white/5 flex flex-col">
                <Activity className="w-8 h-8 text-slate-400 mb-6" />
                <h4 className="text-xl font-bold text-white mb-2">BI: Visual</h4>
                <p className="text-slate-400 flex-1">Visualiza indicadores e responde: <strong>"O que está acontecendo agora?"</strong></p>
             </div>
             <div className="p-8 rounded-2xl bg-white/10 border border-white/20 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck size={80} className="text-white" /></div>
                <Brain className="w-8 h-8 text-white mb-6 relative z-10" />
                <h4 className="text-xl font-bold text-white mb-2 relative z-10">Illumine: Contextual</h4>
                <p className="text-slate-200 relative z-10">
                  Preserva contexto decisório e responde: <strong>"Por que aconteceu, quais premissas sustentaram essa decisão e qual decisão deve ser tomada agora?"</strong>
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — A SOLUÇÃO */}
      <section className="py-32 bg-[#050506] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl mx-auto mb-20">
             Entre o dado corporativo e a decisão estratégica existe uma camada que historicamente nunca foi construída: <span className="text-slate-400 font-medium">inteligência institucional.</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
             {/* Camada 1 */}
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-black">
                   <Layers className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Intelligence Foundation™</h4>
                <p className="text-slate-400 leading-relaxed mb-6">
                   Criar uma base institucional de dados, documentos, histórico e contexto. (ERP, CRM, Financeiro, Operacional).
                </p>
                <div className="mt-auto px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-300">
                   "Transformamos dados fragmentados em uma base confiável."
                </div>
             </div>

             {/* Camada 2 */}
             <div className="flex flex-col items-center text-center relative">
                <div className="hidden md:block absolute top-10 -left-6 w-12 border-t border-dashed border-white/20"></div>
                <div className="hidden md:block absolute top-10 -right-6 w-12 border-t border-dashed border-white/20"></div>
                <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,100,255,0.15)]">
                   <Cpu className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Intelligence Engine™</h4>
                <p className="text-slate-400 leading-relaxed mb-6">
                   Interpretar relações, identificar padrões, detectar riscos e gerar inteligência através de motores analíticos e modelos preditivos.
                </p>
                <div className="mt-auto px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-300">
                   "O dado mostra o que aconteceu. A inteligência explica o porquê."
                </div>
             </div>

             {/* Camada 3 */}
             <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-lg shadow-black">
                   <Network className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Executive Advisory™</h4>
                <p className="text-slate-400 leading-relaxed mb-6">
                   Conectar inteligência tecnológica ao julgamento humano para conselhos, diretorias, executivos e consultores.
                </p>
                <div className="mt-auto px-4 py-2 rounded-full bg-white/5 border border-white/5 text-sm text-slate-300">
                   "A tecnologia amplia a análise. A liderança decide."
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — DIFERENCIAL (Learning Loop) */}
      <section className="py-40 relative overflow-hidden bg-[#0A0A0B]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0A0A0B] to-[#0A0A0B] z-0" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
           <div className="text-center mb-16">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Institutional Learning Architecture™</h2>
              <h3 className="text-4xl md:text-6xl font-bold text-white mb-6">A memória institucional que transforma experiência em inteligência.</h3>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div className="order-2 lg:order-1">
                 <p className="text-xl text-slate-400 mb-6 leading-relaxed">
                    Toda organização toma milhares de decisões. Poucas preservam: contexto, premissas, consequências e aprendizados.
                 </p>
                 <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                    Organizações não perdem apenas dados. Elas perdem contexto. A Illumine cria a memória institucional para que a empresa evolua a cada decisão, conectando causas e consequências, e transformando experiências passadas em inteligência futura.
                 </p>
                 <div className="inline-flex items-center gap-3 px-6 py-4 bg-primary/10 border border-primary/20 rounded-xl mt-4">
                    <Brain className="text-slate-400 w-6 h-6" />
                    <span className="text-white font-medium text-lg">A decisão de ontem se transforma no conhecimento estratégico de amanhã.</span>
                 </div>
              </div>

              {/* Animated Loop Representation */}
              <div className="order-1 lg:order-2 relative h-[500px] flex items-center justify-center">
                 {/* Central Core */}
                 <div className="absolute z-30 w-40 h-40 bg-black rounded-full border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] flex items-center justify-center flex-col gap-2">
                    <Combine className="w-8 h-8 text-white" />
                    <span className="text-[10px] font-medium text-white uppercase tracking-widest text-center">Learning<br/>Loop</span>
                 </div>

                 {/* Orbits */}
                 <div className="absolute w-[300px] h-[300px] border border-white/10 rounded-full animate-[spin_30s_linear_infinite]" />
                 <div className="absolute w-[450px] h-[450px] border border-dashed border-white/5 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

                 {/* Orbiting Nodes */}
                 <div className="absolute w-[300px] h-[300px] animate-[spin_30s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -ml-5 -mt-5 w-10 h-10 bg-zinc-900 border border-white/20 rounded-full flex items-center justify-center shadow-lg shadow-white/5">
                       <span className="text-[8px] uppercase font-bold text-slate-300">Observar</span>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -ml-5 -mb-5 w-10 h-10 bg-zinc-900 border border-white/20 rounded-full flex items-center justify-center shadow-lg shadow-white/5">
                       <span className="text-[8px] uppercase font-bold text-slate-300">Decidir</span>
                    </div>
                 </div>

                 <div className="absolute w-[450px] h-[450px] animate-[spin_40s_linear_infinite_reverse]">
                    <div className="absolute left-0 top-1/2 -mt-6 -ml-6 w-12 h-12 bg-[#0A0A0B] border border-white/20 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)] -rotate-45">
                       <div className="rotate-45 flex flex-col items-center">
                          <span className="text-[8px] uppercase tracking-widest text-slate-300 font-bold">Aprender</span>
                       </div>
                    </div>
                    <div className="absolute right-0 top-1/2 -mt-6 -mr-6 w-12 h-12 bg-[#0A0A0B] border border-amber-500/30 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(255,150,0,0.1)] rotate-45">
                       <div className="-rotate-45 flex flex-col items-center">
                          <span className="text-[8px] uppercase tracking-widest text-amber-500 font-bold">Evoluir</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SEÇÃO 5 — DOMÍNIOS (e Showcases) */}
      <section className="py-32 bg-[#050506] border-t border-white/5 relative z-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-4xl mx-auto">
               <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Executive Intelligence Network™</h2>
               <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Nove domínios sistêmicos.</h3>
               <p className="text-slate-400 text-lg mb-12">O Gêmeo Digital Institucional simula e conecta a sua organização através de 9 domínios integrados, antecipando impactos antes que eles cheguem ao DFC.</p>
               
               {/* Grid de 9 Domínios */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-24 justify-center max-w-5xl mx-auto">
                  {[
                    "Governance", "Financial", "Operational", "Commercial", "People", "Risk", "Institutional", "Mission", "Innovation"
                  ].map((domain, i) => (
                    <div key={i} className={cn(
                      "px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-slate-300 flex items-center justify-center text-center",
                      domain === "Innovation" && "lg:col-start-3" // Centraliza o último na grid de 5 colunas
                    )}>
                       {domain} Intelligence™
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-40">
               {/* Showcase 1: Executive Command */}
               <div className="space-y-8">
                  <div className="max-w-3xl">
                     <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 uppercase tracking-widest">
                        Institutional Intelligence Simulation™
                     </div>
                     <h4 className="text-3xl font-bold text-white mb-4">A decisão amparada por explicabilidade matemática.</h4>
                     <p className="text-slate-400 text-lg">Antes de uma decisão crítica de investimento, líderes podem compreender seus impactos sistêmicos no caixa, risco e valuation com rastreabilidade total.</p>
                  </div>
                  <div className="relative isolate overflow-hidden">

                     <ExecutiveCommandShowcase />
                     <div className="absolute right-4 bottom-4 w-[320px] xl:w-[384px] hidden lg:block z-30 shadow-2xl">
                        <ExecutiveInsightCard 
                           author="Risk Intelligence™"
                           text="Alerta Fiduciário: O modelo projeta uma asfixia de fluxo de caixa operacional no mês 4 caso a expansão seja financiada apenas com capital próprio."
                           date="Análise Simbólica em Tempo Real"
                           variant="float"
                        />
                     </div>
                  </div>
               </div>

               {/* Showcase 3: Systemic Intelligence */}
               <div className="space-y-8">
                  <div className="max-w-3xl ml-auto text-right">
                     <div className="inline-block px-3 py-1 mb-4 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-400 uppercase tracking-widest">
                        Institutional Intelligence Simulation™
                     </div>
                     <h4 className="text-3xl font-bold text-white mb-4">Interpretação Sistêmica e Gêmeo Digital Institucional.</h4>
                     <p className="text-slate-400 text-lg">A plataforma mapeia a fricção organizacional entre Cultura e Finanças e precifica o atrito antes que ele destrua a margem da companhia.</p>
                  </div>
                  <div className="relative isolate overflow-hidden">

                     <SystemicIntelligenceShowcase />
                     <div className="absolute left-4 bottom-4 w-[320px] xl:w-[384px] hidden lg:block z-30 shadow-2xl">
                        <ExecutiveInsightCard 
                           author="Operational Intelligence™"
                           text="Silos operacionais detectados entre Marketing e Vendas estão resultando em um atrito invisível projetado em uma perda potencial de eficiência."
                           date="Simulação Sistêmica"
                           variant="float"
                        />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* SEÇÃO 6 - A DECISÃO PERMANECE HUMANA (Leadership Layer) */}
      <section className="py-32 bg-[#0A0A0B] border-t border-white/5 relative z-20">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-4xl mx-auto">
               <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Human Oversight™</h2>
               <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">A tecnologia amplia a análise. A liderança decide.</h3>
               <p className="text-slate-400 text-lg mb-12">A Illumine não substitui o julgamento executivo. Ela fornece o contexto sistêmico e a clareza matemática necessários para decisões de alto impacto.</p>
            </div>
            <LeadershipLayer />
         </div>
      </section>

      {/* SEÇÃO 7 — TRUST ARCHITECTURE™ */}
      <section className="py-32 bg-[#0A0A0B] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-8" />
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Trust Architecture™</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
            AI-Augmented Executive Intelligence.
          </h3>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            A Illumine não automatiza julgamento executivo. Ela reduz ruído, amplia contexto e aumenta a qualidade da decisão. Construída sobre uma arquitetura de confiança fiduciária rigorosa.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Globe, title: "Human Oversight", desc: "A decisão e aprovação permanecem puramente humanas. A máquina interpreta, o humano julga." },
              { icon: FileKey, title: "Explainable Intelligence", desc: "Rastreabilidade desde o indicador agregado até a origem exata do evento gerador." },
              { icon: Clock, title: "Audit Trail", desc: "Registro imutável de aprovações, simulações e histórico de aprendizado decisório." },
              { icon: Database, title: "Data Governance", desc: "Políticas estritas de acesso e preservação do contexto organizacional." },
              { icon: Lock, title: "Fiduciary Controls", desc: "Isolamento multitenant extremo. A inteligência nunca atravessa fronteiras corporativas." },
            ].map((principle, i) => (
              <div key={i} className="text-left bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex flex-col items-start">
                <principle.icon className="w-8 h-8 text-slate-300 mb-4" />
                <h4 className="text-white font-semibold mb-2 leading-tight">{principle.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mt-auto">{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO 7 — ECOSSISTEMA & CTA */}
      <section className="py-40 relative bg-[#050506]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
             {/* Enterprise */}
             <div className="p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col items-start">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Globe size={120} /></div>
                <h4 className="text-3xl font-bold text-white mb-4 relative z-10">Illumine Enterprise™</h4>
                <p className="text-slate-400 mb-8 relative z-10 text-lg leading-relaxed flex-1">
                  A infraestrutura de inteligência institucional para empresas, grupos empresariais e organizações complexas que buscam transformar dados, contexto e conhecimento estratégico em decisões corporativas mais confiáveis, transparentes e sustentáveis.
                </p>
             </div>
             
             {/* Advisor Network */}
             <div className="p-12 rounded-3xl bg-primary/10 border border-primary/20 relative overflow-hidden flex flex-col items-start">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Network size={120} /></div>
                <h4 className="text-3xl font-bold text-white mb-4 relative z-10">Executive Advisor Network™</h4>
                <p className="text-slate-300 mb-8 relative z-10 text-lg leading-relaxed">
                  Profissionais certificados para aplicar a disciplina de Executive Intelligence Advisory™ em organizações complexas.
                </p>
                <div className="inline-block mt-auto px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-300 font-medium">
                   "Especialistas analisam partes. Executive Advisors interpretam sistemas."
                </div>
             </div>
          </div>

          <div className="text-center max-w-4xl mx-auto pt-12 border-t border-white/5">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              A inteligência amplia.<br />
              <span className="text-slate-500">A decisão permanece humana.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-12">
              Transforme a infraestrutura de inteligência da sua organização hoje.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link 
                 to="/assessment"
                 className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
               >
                 Solicitar Diagnóstico Executivo
                 <ArrowRight size={18} />
               </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
