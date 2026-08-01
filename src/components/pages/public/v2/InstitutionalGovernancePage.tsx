import React from 'react';
import { ArrowRight, ShieldCheck, Database, GitBranch, Eye, Users, FileSearch, ArrowDown, Activity, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstitutionalHero } from '@/components/ui/public/InstitutionalHero';
import { InstitutionalSection } from '@/components/ui/public/InstitutionalSection';
import { InstitutionalTitle } from '@/components/ui/public/InstitutionalTitle';
import { InstitutionalCard } from '@/components/ui/public/InstitutionalCard';

export function InstitutionalGovernancePage() {
  const principles = [
    {
      title: "Evidências antes de conclusões",
      description: "Nenhuma recomendação deve existir sem evidências que a sustentem.",
      icon: FileSearch
    },
    {
      title: "Explicabilidade",
      description: "Cada recomendação apresenta os fatores considerados, as premissas adotadas e o raciocínio utilizado para chegar à conclusão.",
      icon: Eye
    },
    {
      title: "Rastreabilidade",
      description: "Todo processo decisório pode ser reconstruído posteriormente, preservando contexto, dados e justificativas.",
      icon: GitBranch
    },
    {
      title: "Memória Institucional",
      description: "As decisões deixam de depender exclusivamente das pessoas e passam a integrar o patrimônio intelectual da organização.",
      icon: Database
    },
    {
      title: "Supervisão Humana",
      description: "A responsabilidade permanece com os executivos. A plataforma amplia a análise, mas não substitui o julgamento.",
      icon: Users
    }
  ];

  const explainableQuestions = [
    {
      q: "O que foi identificado?",
      a: "O diagnóstico produzido pelo modelo institucional."
    },
    {
      q: "Por que essa conclusão foi alcançada?",
      a: "Os fatores, evidências e relações que influenciaram a recomendação."
    },
    {
      q: "Qual poderá ser o impacto?",
      a: "As possíveis consequências financeiras, operacionais e estratégicas caso as premissas permaneçam inalteradas."
    }
  ];

  const memoryItems = [
    "Objetivos originais",
    "Premissas utilizadas",
    "Evidências consideradas",
    "Alternativas avaliadas",
    "Responsáveis",
    "Impactos esperados",
    "Resultados obtidos"
  ];

  const evidenceItems = [
    "Origem dos dados",
    "Atualização das informações",
    "Completude dos registros",
    "Consistência histórica",
    "Nível de confiança da análise"
  ];

  return (
    <div className="flex flex-col bg-[#050506] text-slate-200">
      
      {/* Hero */}
      <InstitutionalHero
        tagline="Governança & Confiança"
        title={
          <span className="text-4xl md:text-5xl lg:text-5xl max-w-4xl mx-auto block leading-tight">
            Toda recomendação pode ser explicada. Toda decisão pode ser rastreada. Todo contexto pode ser preservado.
          </span>
        }
        subtitle={
          <span className="text-lg md:text-xl lg:text-2xl font-normal max-w-4xl mx-auto block mt-6 leading-relaxed text-slate-300">
            A Illumine foi desenvolvida para organizações que precisam tomar decisões relevantes com transparência, responsabilidade fiduciária e confiança institucional. Ela não substitui o julgamento humano. Ela amplia sua capacidade de decidir com base em evidências, contexto e memória organizacional.
          </span>
        }
        showScrollIndicator={true}
      >
        <div className="mt-12">
          <a href="#principios" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2">
            Conheça nossa Arquitetura de Confiança
            <ArrowRight size={20} />
          </a>
        </div>
      </InstitutionalHero>

      {/* Section 1: O Desafio */}
      <InstitutionalSection variant="darker">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ShieldCheck className="w-16 h-16 text-amber-500 mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
            O problema não é apenas decidir.<br/>
            <span className="text-slate-400">É conseguir explicar, justificar e preservar o contexto de cada decisão.</span>
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed mb-8">
            Em organizações complexas, decisões relevantes envolvem múltiplas áreas, diferentes premissas e impactos que se estendem por anos. Quando esse contexto se perde, a organização perde sua capacidade de aprender, evoluir e responder com consistência aos desafios futuros.
          </p>
          <p className="text-2xl text-white font-medium">
            A governança moderna exige mais do que registros. Exige inteligência institucional.
          </p>
        </div>
      </InstitutionalSection>

      {/* Section 2: Princípios */}
      <InstitutionalSection variant="dark" id="principios">
        <InstitutionalTitle 
          chapter="Princípios Fundacionais"
          title="A confiança não é um recurso. É uma arquitetura."
          subtitle="A Illumine foi construída sobre princípios que orientam todo o funcionamento da plataforma."
        />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {principles.map((principle, idx) => (
            <InstitutionalCard key={idx} className="p-8 border-t-4 border-t-amber-500/50 hover:border-t-amber-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                <principle.icon className="w-6 h-6 text-amber-500" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{principle.title}</h4>
              <p className="text-slate-400 leading-relaxed">{principle.description}</p>
            </InstitutionalCard>
          ))}
        </div>
      </InstitutionalSection>

      {/* Section 3: Trust Architecture™ */}
      <InstitutionalSection variant="darker">
        <InstitutionalTitle 
          chapter="Trust Architecture™"
          title="Uma arquitetura projetada para decisões críticas."
          subtitle="Cada camada preserva sua origem, suas evidências e sua contribuição para o resultado final."
        />

        <div className="max-w-6xl mx-auto px-6 py-20">
          <style>{`
            @keyframes flowRight {
              0% { left: 0%; transform: translateY(-50%); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { left: 100%; transform: translateY(-50%); opacity: 0; }
            }
            @keyframes nodePulseGlow {
              0%, 100% { border-color: rgba(255,255,255,0.1); box-shadow: none; }
              50% { border-color: rgba(245, 157, 63, 0.5); box-shadow: 0 0 25px rgba(245, 157, 63, 0.2); }
            }
            .custom-scrollbar::-webkit-scrollbar { height: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 999px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(245,157,63,0.3); border-radius: 999px; }
          `}</style>
          
          <div className="w-full overflow-x-auto pb-12 pt-8 custom-scrollbar">
            <div className="min-w-[800px] flex items-center justify-between relative px-8">
              
              {/* Horizontal Track Background */}
              <div className="absolute top-12 left-16 right-16 h-[2px] bg-white/10 -translate-y-1/2 z-0" />
              
              {/* Horizontal Moving Energy Pulse */}
              <div className="absolute top-12 left-16 right-16 h-[2px] -translate-y-1/2 z-0 overflow-hidden">
                <div 
                  className="absolute top-1/2 w-32 h-[6px] bg-amber-500 blur-[3px] rounded-full"
                  style={{ animation: 'flowRight 4s infinite cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              </div>

              {/* Flow Nodes */}
              {[
                { label: 'Dados', icon: Database },
                { label: 'Contexto', icon: GitBranch },
                { label: 'Análise', icon: Activity },
                { label: 'Recomendação', icon: Lightbulb },
                { label: 'Decisão Humana', icon: Users }
              ].map((step, idx, arr) => {
                const Icon = step.icon;
                const isLast = idx === arr.length - 1;
                
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10 w-36 group">
                    {/* Node Circle */}
                    <div 
                      className={`w-24 h-24 rounded-full border-2 flex items-center justify-center transition-all duration-700
                        ${isLast ? 'bg-amber-500 border-amber-500 text-black shadow-[0_0_40px_rgba(245,157,63,0.4)]' : 'bg-[#0A0A0B] border-white/10 text-slate-400 group-hover:border-amber-500/50 group-hover:text-amber-500'}`}
                      style={!isLast ? { animation: `nodePulseGlow 4s infinite cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.8}s` } : {}}
                    >
                      <Icon className={`w-8 h-8 ${isLast ? 'text-black' : 'transition-colors duration-300'}`} />
                    </div>
                    
                    {/* Label below node */}
                    <div className="mt-6 text-center">
                      <span className={`text-lg tracking-wide font-medium ${isLast ? 'text-amber-500' : 'text-slate-300'}`}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </InstitutionalSection>

      {/* Section 4: Explainable Intelligence™ */}
      <InstitutionalSection variant="dark">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-semibold text-amber-500 uppercase tracking-widest block mb-4">Transparência Algorítmica</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Explainable Intelligence™</h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              Toda recomendação gerada pela plataforma é desenhada para responder a três perguntas fundamentais da liderança executiva.
            </p>
          </div>
          
          <div className="space-y-6">
            {explainableQuestions.map((item, idx) => (
              <InstitutionalCard key={idx} className="p-6 md:p-8 bg-white/5 border-white/10">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                  <span className="text-amber-500">?</span> {item.q}
                </h4>
                <p className="text-slate-400 pl-6 border-l-2 border-white/10 ml-2 mt-4 py-1">{item.a}</p>
              </InstitutionalCard>
            ))}
          </div>
        </div>
      </InstitutionalSection>

      {/* Section 5 & 6: Memória e Evidência */}
      <InstitutionalSection variant="darker">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <InstitutionalCard className="p-10 border-white/5 bg-black/40">
            <Database className="w-10 h-10 text-amber-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Institutional Decision Memory™</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Organizações aprendem quando suas decisões permanecem acessíveis. A Illumine preserva o contexto de decisões relevantes, incluindo:
            </p>
            <ul className="space-y-3">
              {memoryItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-500 font-medium italic">
              Ao longo do tempo, esse histórico se transforma em um ativo institucional que fortalece a consistência das decisões futuras.
            </p>
          </InstitutionalCard>

          <InstitutionalCard className="p-10 border-white/5 bg-black/40">
            <FileSearch className="w-10 h-10 text-amber-500 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Evidência e Integridade</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Confiança começa pela qualidade das informações. Cada análise considera fatores cruciais para garantir a integridade do processo:
            </p>
            <ul className="space-y-3">
              {evidenceItems.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-500 font-medium italic">
              Isso permite que executivos compreendam não apenas a conclusão, mas também a robustez das evidências que a sustentam.
            </p>
          </InstitutionalCard>

        </div>
      </InstitutionalSection>

      {/* Section 7: Segurança e Privacidade */}
      <InstitutionalSection variant="dark">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ShieldCheck className="w-12 h-12 text-slate-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">Segurança e Privacidade</h2>
          <p className="text-xl text-slate-400 leading-relaxed mb-6">
            Inteligência exige proteção.
          </p>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto mb-6">
            A arquitetura da Illumine incorpora princípios de segurança e proteção da informação compatíveis com ambientes corporativos, preservando a confidencialidade, a integridade e a disponibilidade dos dados utilizados nas análises.
          </p>
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
            A plataforma foi concebida para operar com controles de acesso, rastreabilidade de ações e mecanismos de proteção compatíveis com organizações que tratam informações estratégicas.
          </p>
        </div>
      </InstitutionalSection>

      {/* Section 8: A decisão humana */}
      <InstitutionalSection variant="darker">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
            A melhor inteligência continua sendo a <br/>
            <span className="text-amber-500">inteligência humana.</span>
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto font-medium mb-6">
            A Illumine não automatiza a responsabilidade.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto mb-6">
            Ela amplia a capacidade analítica dos executivos ao conectar dados, contexto e conhecimento institucional em uma visão integrada, preservando a autonomia e a responsabilidade de quem decide.
          </p>
          <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
            A tecnologia reduz o esforço necessário para compreender cenários complexos. O julgamento, a responsabilidade e a decisão permanecem com a liderança.
          </p>
        </div>
      </InstitutionalSection>

      {/* Final CTA */}
      <InstitutionalSection variant="glow" className="pt-40 pb-40 text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Confiança não nasce da tecnologia.<br/>
            <span className="text-3xl md:text-4xl text-slate-300 mt-4 block font-normal">Nasce da capacidade de compreender, justificar e preservar cada decisão.</span>
          </h2>
          <p className="text-xl text-slate-400 mb-16 max-w-3xl mx-auto">
            É por isso que a Illumine foi concebida como uma plataforma de Executive Intelligence, onde inteligência artificial, governança corporativa e julgamento humano atuam de forma complementar para fortalecer decisões estratégicas.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              to="/assessment"
              className="w-full sm:w-auto px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg inline-flex justify-center items-center gap-2"
            >
              Agendar uma Demonstração Executiva
              <ArrowRight size={20} />
            </Link>
            <Link 
              to="/plataforma"
              className="w-full sm:w-auto px-10 py-5 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 text-lg text-center"
            >
              Conhecer a Plataforma
            </Link>
          </div>
        </div>
      </InstitutionalSection>

    </div>
  );
}
