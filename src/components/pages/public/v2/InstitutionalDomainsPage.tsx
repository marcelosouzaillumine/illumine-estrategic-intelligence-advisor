import React from 'react';
import { ArrowRight, Activity, ShieldCheck, PieChart, Users, TrendingUp, Lightbulb, Target, Combine, Database, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstitutionalHero } from '@/components/ui/public/InstitutionalHero';
import { InstitutionalSection } from '@/components/ui/public/InstitutionalSection';
import { InstitutionalTitle } from '@/components/ui/public/InstitutionalTitle';
import { InstitutionalCard } from '@/components/ui/public/InstitutionalCard';

export function InstitutionalDomainsPage() {
  const domains = [
    {
      id: 1,
      name: "Governance Intelligence™",
      tagline: "Governança, decisões e accountability institucional",
      icon: ShieldCheck,
      description: "Acompanha a qualidade das decisões estratégicas, seus fundamentos, responsáveis e impactos esperados.",
      questions: [
        "Quais decisões críticas foram tomadas?",
        "Quais premissas sustentaram essas decisões?",
        "Os resultados confirmaram as expectativas?",
        "O conhecimento institucional está sendo preservado?"
      ],
      applications: ["Decision Memory", "Executive Briefs", "Board Reports", "Governance Score"]
    },
    {
      id: 2,
      name: "Financial Intelligence™",
      tagline: "A visão financeira integrada da organização",
      icon: PieChart,
      description: "Transforma demonstrações financeiras em inteligência executiva. Conecta Balanço Patrimonial, DRE, Fluxo de Caixa, Capital de Giro e Rentabilidade.",
      highlight: "O que está pressionando o valor econômico da organização e quais decisões podem alterar essa trajetória.",
      applications: ["Financial Digital Twin™", "Cenários de EBITDA", "Simulações de caixa", "Stress Testing financeiro"]
    },
    {
      id: 3,
      name: "Operational Intelligence™",
      tagline: "A eficiência real por trás dos resultados",
      icon: Activity,
      description: "Analisa como processos, recursos e capacidade operacional impactam desempenho financeiro. Conecta produtividade, custos e gargalos.",
      questions: [
        "Onde existe desperdício?",
        "Quais processos drenam margem?",
        "Onde existe capacidade oculta?"
      ]
    },
    {
      id: 4,
      name: "Commercial Intelligence™",
      tagline: "Transformando mercado em previsibilidade",
      icon: TrendingUp,
      description: "Integra informações comerciais para compreender geração e sustentabilidade da receita. Analisa carteira, concentração e margens.",
      highlight: "O crescimento atual está criando valor ou apenas aumentando complexidade?"
    },
    {
      id: 5,
      name: "People Intelligence™",
      tagline: "Pessoas como capacidade estratégica",
      icon: Users,
      description: "Avalia a relação entre estrutura organizacional, produtividade e geração de valor. Analisa o custo da estrutura e retenção de conhecimento."
    },
    {
      id: 6,
      name: "Risk Intelligence™",
      tagline: "Antecipação de vulnerabilidades estratégicas",
      icon: ShieldCheck,
      description: "Identifica riscos financeiros, operacionais e institucionais antes que se tornem crises através de análise de dependências e concentração."
    },
    {
      id: 7,
      name: "Institutional Intelligence™",
      tagline: "O conhecimento que permanece na organização",
      icon: Combine,
      description: "Transforma experiência acumulada em ativo institucional. Combate a Amnésia Institucional™ preservando contexto e aprendizados."
    },
    {
      id: 8,
      name: "Mission Intelligence™",
      tagline: "Alinhamento entre propósito e execução",
      icon: Target,
      description: "Garante que estratégia, cultura e operação permaneçam conectadas através do alinhamento de indicadores-chave e objetivos."
    },
    {
      id: 9,
      name: "Innovation Intelligence™",
      tagline: "Evolução contínua baseada em aprendizado",
      icon: Lightbulb,
      description: "Transforma dados, experimentos e resultados em capacidade de adaptação. Analisa hipóteses estratégicas e novos cenários."
    }
  ];

  return (
    <div className="flex flex-col bg-[#050506] text-slate-200">
      
      {/* 1. Hero */}
      <InstitutionalHero
        tagline="Domínios de Inteligência Illumine™"
        title={
          <span className="text-4xl md:text-5xl lg:text-6xl max-w-5xl mx-auto block leading-tight">
            A inteligência que compreende a organização como um sistema integrado.
          </span>
        }
        subtitle={
          <span className="text-xl md:text-2xl lg:text-3xl font-normal max-w-4xl mx-auto block mt-6 leading-relaxed">
            Empresas complexas não falham por falta de indicadores isolados. Elas perdem valor quando decisões tomadas em uma área geram impactos não percebidos em outras.
          </span>
        }
        description={
          <p className="text-xl md:text-2xl text-slate-400 font-medium">
            A Illumine conecta múltiplas dimensões da organização para revelar relações causais, riscos ocultos e oportunidades estratégicas.
          </p>
        }
        showScrollIndicator={true}
      >
        <div className="mt-12">
          <Link 
            to="/plataforma"
            className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
          >
            Explorar a Plataforma
            <ArrowRight size={20} />
          </Link>
        </div>
      </InstitutionalHero>

      {/* 2. Arquitetura dos Domínios & Map */}
      <InstitutionalSection variant="darker">
        <InstitutionalTitle 
          chapter="Arquitetura dos Domínios"
          title="9 Domínios de Inteligência™"
          subtitle="Cada domínio representa uma perspectiva da organização, mas a inteligência surge da conexão entre eles."
        />
        
        <div className="max-w-6xl mx-auto px-6 relative py-12">
          
          {/* Central Animated Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent -translate-x-1/2 hidden lg:block" />

          {/* Top Core Map */}
          <div className="flex justify-center mb-32 relative z-10">
            <InstitutionalCard className="p-10 border-amber-500/30 bg-amber-500/5 shadow-[0_0_80px_rgba(255,150,0,0.1)] text-center w-full max-w-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent z-0 animate-pulse" />
              <Combine className="w-20 h-20 text-amber-500 mx-auto mb-6 relative z-10" />
              <h3 className="text-3xl font-bold text-white mb-3 relative z-10">Executive Intelligence Core™</h3>
              <p className="text-amber-500/80 text-sm font-semibold tracking-widest uppercase mb-10 relative z-10">
                O motor central de processamento sistêmico
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5 relative z-10 text-xs font-semibold tracking-widest uppercase">
                <span className="text-slate-400">Dados</span>
                <ArrowRight className="w-4 h-4 text-amber-500/50" />
                <span className="text-slate-300">Contexto</span>
                <ArrowRight className="w-4 h-4 text-amber-500/50" />
                <span className="text-amber-500 font-bold">Relações</span>
                <ArrowRight className="w-4 h-4 text-amber-500/50" />
                <span className="text-slate-300">Insights</span>
                <ArrowRight className="w-4 h-4 text-amber-500/50" />
                <span className="text-white font-bold">Decisão</span>
              </div>
            </InstitutionalCard>
          </div>

          {/* Alternating Domains List */}
          <div className="space-y-12 lg:space-y-24">
            {domains.map((domain, idx) => (
              <div key={domain.id} className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Center Node on Timeline */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#050506] border-2 border-amber-500/50 z-10 hidden lg:block shadow-[0_0_15px_rgba(255,150,0,0.3)]" />
                
                {/* Empty space for the alternating side */}
                <div className="hidden lg:block lg:w-1/2" />
                
                {/* Content Card */}
                <div className="w-full lg:w-1/2">
                  <InstitutionalCard className="p-8 md:p-10" hoverable={false}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <domain.icon className="w-6 h-6 text-slate-300" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest block mb-1">
                          {domain.id}. {domain.name}
                        </span>
                        <h4 className="text-xl md:text-2xl font-bold text-white">{domain.tagline}</h4>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-lg leading-relaxed mb-6">
                      {domain.description}
                    </p>

                    {domain.highlight && (
                      <div className="p-6 bg-white/5 border border-white/5 rounded-2xl mb-6">
                        <p className="text-white font-medium italic">"{domain.highlight}"</p>
                      </div>
                    )}

                    {domain.questions && (
                      <div className="mb-6">
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">A Illumine responde:</p>
                        <ul className="space-y-2">
                          {domain.questions.map((q, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                              <span className="text-amber-500 mt-1 font-bold">?</span> {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {domain.applications && (
                      <div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">Aplicações:</p>
                        <div className="flex flex-wrap gap-2">
                          {domain.applications.map((app, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-400">
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </InstitutionalCard>
                </div>
              </div>
            ))}
          </div>
        </div>
      </InstitutionalSection>

      {/* 3. Bloco Diferencial */}
      <InstitutionalSection variant="dark">
        <InstitutionalTitle 
          chapter="O Valor do Sistema"
          title="A inteligência não está nos domínios. Está nas conexões."
          subtitle="Sistemas tradicionais analisam áreas isoladas. A Illumine interpreta as relações entre elas."
        />
        
        <div className="max-w-4xl mx-auto px-6">
          <InstitutionalCard className="p-10 md:p-16 border-white/10 bg-white/5">
            <div className="flex flex-col gap-6 relative">
              
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <p className="text-xl text-slate-300 font-medium">Uma decisão comercial altera <span className="text-white font-bold">receita</span>.</p>
              </div>
              
              <div className="w-px h-8 bg-white/20 absolute left-6 top-10 ml-[-0.5px]" />
              
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500 mt-4">
                  <Activity className="w-5 h-5" />
                </div>
                <p className="text-xl text-slate-300 font-medium mt-4">A receita altera <span className="text-white font-bold">margem</span>.</p>
              </div>

              <div className="w-px h-8 bg-white/20 absolute left-6 top-[6.5rem] ml-[-0.5px]" />
              
              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500 mt-4">
                  <Scale className="w-5 h-5" />
                </div>
                <p className="text-xl text-slate-300 font-medium mt-4">A margem altera <span className="text-white font-bold">caixa</span>.</p>
              </div>

              <div className="w-px h-8 bg-white/20 absolute left-6 top-[11.5rem] ml-[-0.5px]" />

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10 transition-colors group-hover:border-amber-500/50 group-hover:text-amber-500 mt-4">
                  <Database className="w-5 h-5" />
                </div>
                <p className="text-xl text-slate-300 font-medium mt-4">O caixa altera <span className="text-white font-bold">capacidade de investimento</span>.</p>
              </div>

              <div className="w-px h-8 bg-white/20 absolute left-6 top-[16.5rem] ml-[-0.5px]" />

              <div className="flex items-center gap-6 group">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 z-10 text-amber-500 mt-4">
                  <Target className="w-5 h-5" />
                </div>
                <p className="text-xl text-white font-medium mt-4">A capacidade de investimento altera a <span className="text-amber-500 font-bold">estratégia</span>.</p>
              </div>

            </div>

            <div className="mt-16 pt-8 border-t border-white/10 text-center">
              <p className="text-2xl font-medium text-white leading-relaxed">
                A Illumine captura essa cadeia de impacto e transforma complexidade organizacional em clareza executiva.
              </p>
            </div>
          </InstitutionalCard>
        </div>
      </InstitutionalSection>

      {/* 4. CTA Final */}
      <InstitutionalSection variant="glow" className="pt-40 pb-40 text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 leading-tight">
            Descubra onde sua organização perde valor antes que isso apareça nos resultados.
          </h2>
          <Link 
            to="/assessment"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg"
          >
            Realizar Assessment Executivo
            <ArrowRight size={20} />
          </Link>
        </div>
      </InstitutionalSection>

    </div>
  );
}
