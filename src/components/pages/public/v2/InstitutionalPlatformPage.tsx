import React from 'react';
import { Database, LineChart, Cpu, MessageSquare, Brain, ArrowRight, Layers, ShieldCheck, Activity, Eye, Zap, Network, History, FileCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InstitutionalHero } from '@/components/ui/public/InstitutionalHero';
import { InstitutionalSection } from '@/components/ui/public/InstitutionalSection';
import { InstitutionalTitle } from '@/components/ui/public/InstitutionalTitle';
import { InstitutionalCard } from '@/components/ui/public/InstitutionalCard';

export function InstitutionalPlatformPage() {
  return (
    <div className="flex flex-col bg-[#050506] text-slate-200">
      
      {/* 1. Hero Conceitual */}
      <InstitutionalHero
        tagline="Plataforma"
        title="Executive Intelligence Platform™"
        subtitle="A infraestrutura de inteligência entre a organização e suas decisões estratégicas."
        description={
          <>
            <p className="mb-6">
              As empresas modernas possuem sistemas para registrar transações, ferramentas para visualizar indicadores e modelos de inteligência artificial capazes de responder perguntas.
            </p>
            <p className="mb-6 text-slate-400">
              Mas decisões estratégicas exigem algo além de informação.<br />
              <strong className="text-white">Exigem contexto.</strong>
            </p>
            <p className="mb-8">
              A Illumine cria uma camada de inteligência institucional que conecta dados corporativos, conhecimento organizacional e julgamento executivo para transformar informações dispersas em decisões mais claras, explicáveis e sustentáveis.
            </p>
            <p className="text-white font-medium text-2xl">
              A inteligência amplia.<br />
              <span className="text-slate-500">A decisão permanece humana.</span>
            </p>
          </>
        }
        showScrollIndicator={true}
      >
        <div className="mt-12">
          <Link 
            to="/dominios"
            className="px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-full hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center gap-2"
          >
            Conhecer os Domínios
            <ArrowRight size={20} />
          </Link>
        </div>
      </InstitutionalHero>

      {/* 2. Problema/contexto */}
      <InstitutionalSection variant="dark">
        <InstitutionalTitle 
          chapter="O problema que a plataforma resolve"
          title={<>Organizações não sofrem pela falta de dados.<br/>Sofrem pela falta de contexto.</>}
        />
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg text-slate-400 leading-relaxed">
            <div>
              <p className="mb-6">
                A maior parte das empresas possui milhares de informações distribuídas entre:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> sistemas financeiros;</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> ERPs;</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> CRMs;</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> planilhas e documentos;</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> relatórios e reuniões;</li>
                <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> experiências individuais dos líderes.</li>
              </ul>
              <p className="text-white font-medium text-xl">O problema não é acessar informações.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <p className="mb-6 text-white font-medium">O problema é compreender:</p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1">?</span>
                  <span>por que algo aconteceu;</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1">?</span>
                  <span>quais decisões levaram ao cenário atual;</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1">?</span>
                  <span>quais riscos estão emergindo;</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="text-amber-500 font-bold mt-1">?</span>
                  <span>quais consequências uma nova decisão pode gerar.</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-16 text-center">
            <p className="text-2xl font-medium text-white p-8 border border-white/10 rounded-2xl bg-white/5 inline-block">
              A Illumine foi criada para preencher esse espaço entre informação e decisão.
            </p>
          </div>
        </div>
      </InstitutionalSection>

      {/* 3. Cinco camadas da plataforma */}
      <InstitutionalSection variant="darker">
        <InstitutionalTitle 
          chapter="Arquitetura da Illumine"
          title={<>Cinco camadas.<br/>Uma inteligência integrada.</>}
          subtitle="A plataforma combina cinco capacidades fundamentais para construir uma visão institucional da organização."
        />
        <div className="max-w-6xl mx-auto px-6 space-y-8">
          
          <InstitutionalCard className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Database className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <span className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-2 block">1. Camada de Dados</span>
              <h3 className="text-3xl font-bold text-white mb-4">Intelligence Foundation™</h3>
              <p className="text-xl text-slate-300 font-medium mb-4">A base institucional de conhecimento.</p>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Toda inteligência depende da qualidade do contexto. A Intelligence Foundation™ reúne e organiza informações provenientes das diferentes áreas da organização, criando uma base confiável para análise executiva. Transformamos dados fragmentados em uma base institucional confiável.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Dados financeiros', 'Informações operacionais', 'Indicadores comerciais', 'Documentos institucionais', 'Histórico decisório', 'Premissas estratégicas'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-slate-400">{tag}</span>
                ))}
              </div>
            </div>
          </InstitutionalCard>

          <InstitutionalCard className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Cpu className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <span className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-2 block">2. Camada Analítica</span>
              <h3 className="text-3xl font-bold text-white mb-4">Intelligence Engine™</h3>
              <p className="text-xl text-slate-300 font-medium mb-4">O motor que interpreta relações e identifica padrões.</p>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Dados isolados mostram eventos. Inteligência revela relações. O Intelligence Engine™ analisa tendências, correlações, desvios, riscos, impactos sistêmicos e oportunidades. Ele conecta diferentes dimensões da organização para responder perguntas que relatórios tradicionais não conseguem responder:
              </p>
              <div className="space-y-2 border-l-2 border-amber-500/50 pl-6 my-6 text-lg text-white font-medium">
                <p>“Por que isso aconteceu?”</p>
                <p>“Qual impacto essa decisão pode gerar?”</p>
                <p>“Quais riscos estamos deixando de observar?”</p>
              </div>
            </div>
          </InstitutionalCard>

          <InstitutionalCard className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Brain className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <span className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-2 block">3. Camada de Memória</span>
              <h3 className="text-3xl font-bold text-white mb-4">Institutional Learning Architecture™</h3>
              <p className="text-xl text-slate-300 font-medium mb-4">A memória estratégica da organização.</p>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Empresas acumulam experiências, mas frequentemente perdem aprendizado. Quando líderes deixam uma organização, desaparecem contextos, premissas, análises, consequências e aprendizados obtidos. A Institutional Learning Architecture™ transforma decisões em ativos permanentes de conhecimento.
              </p>
              <p className="text-white font-medium text-lg">
                A decisão de ontem transforma-se no conhecimento estratégico de amanhã.
              </p>
            </div>
          </InstitutionalCard>

          <InstitutionalCard className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <Network className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <span className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-2 block">4. Camada de Conselho</span>
              <h3 className="text-3xl font-bold text-white mb-4">Executive Advisory™</h3>
              <p className="text-xl text-slate-300 font-medium mb-4">Inteligência aumentada para decisões complexas.</p>
              <p className="text-slate-400 mb-6 leading-relaxed">
                A Illumine não substitui executivos, conselheiros ou especialistas. Ela fornece uma infraestrutura avançada de contexto, análise e simulação para apoiar decisões de alta complexidade. A plataforma amplia a capacidade de CEOs, equipes executivas, conselhos e advisors independentes.
              </p>
              <p className="text-white font-medium text-lg">
                A tecnologia amplia a análise. O julgamento permanece humano.
              </p>
            </div>
          </InstitutionalCard>

          <InstitutionalCard className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <div className="w-full">
              <span className="text-amber-500 font-mono text-sm tracking-widest uppercase mb-2 block">5. Camada de Governança</span>
              <h3 className="text-3xl font-bold text-white mb-4">Trust Architecture™</h3>
              <p className="text-xl text-slate-300 font-medium mb-8">A camada de confiança da inteligência corporativa.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
                  <h5 className="text-white font-bold mb-2 flex items-center gap-2"><Eye size={16} className="text-amber-500"/> Explainable Intelligence™</h5>
                  <p className="text-sm text-slate-400">Toda recomendação precisa apresentar sua origem, premissas e evidências.</p>
                </div>
                <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
                  <h5 className="text-white font-bold mb-2 flex items-center gap-2"><History size={16} className="text-amber-500"/> Decision Traceability</h5>
                  <p className="text-sm text-slate-400">O histórico da decisão permanece documentado e acessível.</p>
                </div>
                <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
                  <h5 className="text-white font-bold mb-2 flex items-center gap-2"><FileCheck size={16} className="text-amber-500"/> Audit Trail</h5>
                  <p className="text-sm text-slate-400">Registros imutáveis de análises, aprovações e aprendizados preservados.</p>
                </div>
                <div className="p-6 bg-black/50 rounded-2xl border border-white/5">
                  <h5 className="text-white font-bold mb-2 flex items-center gap-2"><Lock size={16} className="text-amber-500"/> Human Oversight & Data Gov</h5>
                  <p className="text-sm text-slate-400">A decisão final é humana. A informação fica restrita aos limites organizacionais.</p>
                </div>
              </div>
            </div>
          </InstitutionalCard>

        </div>
      </InstitutionalSection>

      {/* 4. Institutional Digital Twin™ */}
      <InstitutionalSection variant="glow">
        <InstitutionalTitle 
          chapter="Institutional Digital Twin™"
          title="Um modelo vivo da organização."
        />
        <div className="max-w-6xl mx-auto px-6">
          <InstitutionalCard variant="highlight" className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 border-amber-500/20 bg-amber-500/5">
            <div className="flex-1">
              <h3 className="text-3xl font-bold text-white mb-6">A Illumine não apenas analisa dados históricos. Ela cria uma representação dinâmica da organização.</h3>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                O Institutional Digital Twin™ permite simular alterações de custos, mudanças estratégicas, investimentos, expansão, cenários financeiros e impactos operacionais antes que eles ocorram.
              </p>
              <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
                <p className="text-amber-500 font-mono text-sm mb-4">EXEMPLO SISTÊMICO</p>
                <p className="text-white mb-4">Uma alteração no custo logístico não é vista apenas como uma variação operacional. A plataforma analisa seus efeitos em cadeia sobre:</p>
                <ul className="text-slate-300 space-y-2 flex flex-wrap gap-4">
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> Margem EBITDA</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> Fluxo de Caixa</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> Capital de Giro</li>
                  <li className="flex items-center gap-2"><ArrowRight size={14} className="text-amber-500"/> Financiamento</li>
                </ul>
              </div>
              <p className="text-xl font-medium text-white mt-8">A organização deixa de apenas olhar o passado e passa a compreender possibilidades futuras.</p>
            </div>
            <div className="w-full md:w-1/3 aspect-square relative flex items-center justify-center">
               <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-[80px]" />
               <Activity className="w-32 h-32 text-amber-500 relative z-10 opacity-80" />
               <div className="absolute w-full h-full border border-amber-500/20 rounded-full animate-[spin_10s_linear_infinite] border-dashed" />
               <div className="absolute w-[120%] h-[120%] border border-amber-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            </div>
          </InstitutionalCard>
        </div>
      </InstitutionalSection>

      {/* 5. Exemplo de decisão transformada */}
      <InstitutionalSection variant="darker">
        <InstitutionalTitle 
          chapter="Executive Intelligence in Practice"
          title="Da informação para a decisão."
        />
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
              {/* Before */}
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 md:text-right">
                <span className="inline-block px-3 py-1 bg-white/10 text-slate-300 rounded-full text-sm font-medium mb-6">Relatório Tradicional (Antes)</span>
                <p className="text-2xl font-serif italic text-slate-400">
                  "O EBITDA caiu 8% no trimestre."
                </p>
              </div>

              {/* After */}
              <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 relative mt-8 md:mt-24 shadow-[0_0_50px_rgba(255,150,0,0.05)]">
                <div className="absolute -top-4 -left-4 md:-left-8 bg-[#050506] p-2 rounded-full border border-white/10 hidden md:block">
                  <ArrowRight className="w-6 h-6 text-amber-500" />
                </div>
                <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm font-medium mb-6">Com Illumine Executive Intelligence</span>
                <p className="text-2xl font-serif text-white leading-relaxed">
                  "A Illumine identificou que a pressão sobre o EBITDA tem origem em três vetores principais: aumento de custos logísticos, ineficiências operacionais e desalinhamentos estratégicos. A interação desses fatores está drenando geração de caixa, reduzindo margem operacional e restringindo a capacidade da organização de financiar seu próximo ciclo de crescimento."
                </p>
              </div>
            </div>
          </div>
        </div>
      </InstitutionalSection>

      {/* 6. Evolução contínua */}
      <InstitutionalSection variant="dark">
        <InstitutionalTitle 
          chapter="Evolução Contínua"
          title="A plataforma evolui com a organização."
          subtitle="A Illumine é construída como uma infraestrutura viva de inteligência institucional."
        />
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <InstitutionalCard className="p-8 border-t-4 border-t-amber-500 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-amber-500/20 text-amber-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Disponível</div>
            <h4 className="text-xl font-bold text-white mb-4 mt-6">Consolidação Sistêmica</h4>
            <p className="text-slate-400 text-sm">Observabilidade financeira, operacional e institucional integrada em tempo real.</p>
          </InstitutionalCard>
          
          <InstitutionalCard className="p-8 border-t-4 border-t-white/60 relative overflow-hidden opacity-90">
            <div className="absolute top-4 right-4 bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Em evolução</div>
            <h4 className="text-xl font-bold text-white mb-4 mt-6">Cognitive Agents</h4>
            <p className="text-slate-400 text-sm">Agentes inteligentes para análise interpretativa e geração de relatórios executivos.</p>
          </InstitutionalCard>

          <InstitutionalCard className="p-8 border-t-4 border-t-slate-500 relative overflow-hidden opacity-60">
            <div className="absolute top-4 right-4 bg-white/10 text-slate-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Próxima evolução</div>
            <h4 className="text-xl font-bold text-white mb-4 mt-6">Predictive Intelligence</h4>
            <p className="text-slate-400 text-sm">Simulações avançadas, cenários ramificados e antecipação de riscos estruturais.</p>
          </InstitutionalCard>
        </div>
      </InstitutionalSection>

      {/* 7. Encerramento / CTA final */}
      <InstitutionalSection variant="glow" className="pt-40 pb-40 text-center">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Zap className="w-12 h-12 text-amber-500 mx-auto mb-8 opacity-80" />
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            A próxima vantagem competitiva será a capacidade de aprender.
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-medium mb-16 leading-relaxed">
            Empresas vencedoras não serão apenas aquelas que possuem mais dados. Serão aquelas capazes de transformar experiências, decisões e informações em inteligência institucional.
          </p>
          
          <div className="mb-16">
            <p className="text-amber-500 font-mono tracking-widest uppercase mb-4 text-sm">A Illumine constrói essa capacidade.</p>
            <h3 className="text-3xl text-white font-bold mb-2">Executive Intelligence Platform™</h3>
            <p className="text-slate-500 text-xl">A inteligência amplia. A decisão permanece humana.</p>
          </div>

          <Link 
            to="/assessment"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-semibold rounded-full hover:bg-slate-200 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] text-lg"
          >
            Realizar Diagnóstico Executivo™
            <ArrowRight size={20} />
          </Link>
        </div>
      </InstitutionalSection>

    </div>
  );
}
