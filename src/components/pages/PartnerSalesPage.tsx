import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Activity, CheckCircle2, ArrowRight,
  Users, Scale, Landmark
} from 'lucide-react';

// Quiet, Editorial Causal Topology Watermark (Static & Subdued)
const CausalTopologyVisual = () => {
  const nodes = [
    { id: 1, x: 150, y: 130, label: 'Posicionamento Estratégico' },
    { id: 2, x: 420, y: 170, label: 'Atendimento Consultivo' },
    { id: 3, x: 280, y: 290, label: 'Inteligência Executiva' },
    { id: 4, x: 580, y: 230, label: 'Decisões Melhores' },
    { id: 5, x: 740, y: 140, label: 'Leitura Executiva' },
    { id: 6, x: 480, y: 370, label: 'Clareza Executiva' },
    { id: 7, x: 720, y: 340, label: 'Diferenciação Consultiva' }
  ];

  const links = [
    { from: 1, to: 2 },
    { from: 1, to: 3 },
    { from: 2, to: 4 },
    { from: 3, to: 6 },
    { from: 4, to: 5 },
    { from: 6, to: 7 },
    { from: 4, to: 6 },
    { from: 2, to: 3 },
    { from: 5, to: 7 }
  ];

  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.06] overflow-hidden flex items-center justify-center">
      <svg className="w-full h-full max-w-[1200px] max-h-[600px] text-white" viewBox="0 0 900 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Connection Lines */}
        {links.map((link, i) => {
          const fromNode = nodes.find(n => n.id === link.from);
          const toNode = nodes.find(n => n.id === link.to);
          if (!fromNode || !toNode) return null;

          return (
            <line 
              key={i}
              x1={fromNode.x} 
              y1={fromNode.y} 
              x2={toNode.x} 
              y2={toNode.y} 
              stroke="rgba(255, 255, 255, 0.3)" 
              strokeWidth="0.75"
            />
          );
        })}

        {/* Static Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="2"
              fill="#FFFFFF"
            />
            <text
              x={node.x}
              y={node.y + 20}
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.55)"
              fontSize="8"
              letterSpacing="0.08em"
              className="font-sans font-medium uppercase select-none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export function PartnerSalesPage({ onLoginClick }: { onLoginClick: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCTAClick = (message: string) => {
    window.open(`https://wa.me/554131514537?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-[#03080F] text-white relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary">
      {/* Background Ambient Effects */}
      <div className="fixed top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-secondary/2 blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-[-15%] right-[-5%] w-[50%] h-[50%] rounded-full bg-white/1 blur-[180px] pointer-events-none z-0" />
      
      {/* Navbar Premium */}
      <nav className="fixed top-0 inset-x-0 h-20 z-50 border-b border-white/5 backdrop-blur-xl bg-[#03080F]/70 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between gap-8">
          
          {/* Logo Signature */}
          <div className="flex items-center gap-0 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="w-[48px] h-[48px] flex items-center justify-center relative -translate-y-[2px]">
              <img src="/logo.png" alt="Illumine Icon" className="relative z-10 w-full h-full object-contain" />
            </div>
            <div className="flex flex-col items-start w-fit">
              <span 
                className="text-[38px] tracking-[-0.06em] text-white leading-[0.8] block" 
                style={{ fontFamily: '"Tilt Warp", sans-serif' }}
              >
                illumine
              </span>
              <div 
                className="flex justify-between w-full text-[7px] text-white uppercase mt-[2px] whitespace-nowrap font-medium" 
                style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '2px', paddingRight: '0.5px' }}
              >
                {"Governance".split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Simple Executive Navigation List */}
          <div className="hidden lg:flex items-center gap-12">
            <button 
              onClick={() => scrollToSection('problema')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O Desafio
            </button>
            <button 
              onClick={() => scrollToSection('o-que-enxergar')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O que ver
            </button>
            <button 
              onClick={() => scrollToSection('poder-consultivo')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Poder Consultivo
            </button>
            <button 
              onClick={() => scrollToSection('competencias')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Estruturas
            </button>
            <button 
              onClick={() => navigate('/empresas')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer"
            >
              Empresas
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-6 shrink-0">
            <button 
              onClick={onLoginClick} 
              className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-secondary transition-colors cursor-pointer"
            >
              Área Restrita
            </button>
            <button 
              onClick={() => handleCTAClick('Olá. Gostaria de conversar com a Illumine sobre como a estrutura de inteligência estratégica e governança da Governance pode apoiar nossa atuação.')}
              className="h-10 px-5 rounded-md border border-white/20 hover:border-white text-white font-bold text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Conversar com a Illumine</span>
            </button>
          </div>

        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-48 pb-36 px-6 relative overflow-hidden z-10 border-b border-white/5 min-h-[92vh] flex items-center">
        <CausalTopologyVisual />
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[9px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              INFRAESTRUTURA DE INTELIGÊNCIA EXECUTIVA
            </span>
            
            <p className="text-secondary text-xs sm:text-sm font-semibold tracking-widest uppercase max-w-2xl mx-auto leading-relaxed mt-2 select-none">
              A complexidade das empresas evoluiu. A estrutura da maioria dos advisors não.
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white leading-[1.15]">
              Sua estrutura atual é suficiente para sustentar decisões estratégicas em organizações cada vez mais complexas?
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed font-sans"
          >
            A Illumine conecta contadores, consultores, advisors e especialistas à Governance — uma estrutura proprietária de inteligência executiva capaz de transformar dados operacionais em direcionamento estratégico, ampliar profundidade analítica e elevar o nível da atuação consultiva.
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => scrollToSection('porque-governance')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
            >
              <span>Conhecer a Governance</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleCTAClick('Olá. Gostaria de conversar com a Illumine sobre como a estrutura de inteligência estratégica e governança da Governance pode apoiar nossa atuação.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Conversar com a Illumine</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. EXECUTIVE TENSION QUESTIONS & CORE MARKET GAP */}
      <section id="problema" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-6xl mx-auto space-y-24">
          
          {/* Tension Questions Row */}
          <div className="border-b border-white/5 pb-16 space-y-12">
            <h3 className="text-xl md:text-2xl font-display font-medium text-white/90">
              O problema raramente aparece primeiro nos números.
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                "Seus clientes recebem relatórios. Mas recebem clareza para decisões críticas?",
                "Quantas decisões estratégicas estão sendo tomadas hoje sem leitura estrutural suficiente?",
                "O crescimento da empresa está realmente aumentando valor ou apenas aumentando complexidade?",
                "Sua estrutura atual consegue identificar fragilidades antes da deterioração financeira?"
              ].map((question, qIdx) => (
                <div key={qIdx} className="space-y-3 pl-4 border-l border-secondary/40">
                  <p className="text-sm font-medium text-white/80 leading-relaxed font-sans">{question}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Market Gap Content */}
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3">
                O GARGALO DO MERCADO
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
                A maioria dos escritórios possui dados. Poucos possuem estrutura para interpretação executiva.
              </h2>
            </div>
            <div className="space-y-8 text-white/70 text-base md:text-lg leading-relaxed font-sans">
              <div>
                <p className="font-medium text-white/95 mb-4">
                  O problema normalmente não está:
                </p>
                <ul className="space-y-4 pl-4 border-l border-white/10">
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1.5 shrink-0 select-none">•</span>
                    <span>na ausência de informações;</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1.5 shrink-0 select-none">•</span>
                    <span>mas na incapacidade de transformar dados dispersos em clareza estratégica.</span>
                  </li>
                </ul>
              </div>
              <p className="text-white/90 font-medium border-l border-secondary/30 pl-4 mt-6">
                A Governance foi criada exatamente para preencher essa lacuna.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BEYOND THE REPORTS BLOCK */}
      <section id="alem-dos-relatorios" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#03080F]/80">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              EVOLUÇÃO DOS RELATÓRIOS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              Relatórios mostram dados. Governance ajuda a interpretar a realidade por trás deles.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center pt-8">
            <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-sans">
              <p>
                A maioria das organizações possui indicadores operacionais. Poucas possuem leitura integrada sobre como as variáveis operam em conjunto.
              </p>
              <p className="text-white/95 font-medium border-l border-secondary pl-4 py-1">
                A Governance foi criada para transformar informações dispersas em clareza estratégica, ampliando a capacidade de leitura estratégica sobre a realidade da organização.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-[#060D17] border border-white/5 space-y-6">
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                Leitura integrada de sinais de fragilidade organizacional:
              </div>
              <ul className="space-y-4 font-sans text-sm text-white/85">
                {[
                  'sustentabilidade estrutural;',
                  'coerência decisória;',
                  'fragilidade organizacional;',
                  'riscos silenciosos;',
                  'capacidade real de expansão.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY GOVERNANCE EXISTS (Mecanismo de Atuação) */}
      <section id="porque-governance" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              MECANISMO DE ATUAÇÃO
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              A estrutura que dá poder ao Advisor.
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16 items-center pt-8">
            <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-sans">
              <p>
                Para atuar no nível estratégico, advisors, consultores e especialistas precisam de uma estrutura de interpretação executiva que dê suporte às discussões com fundadores, conselhos e diretores.
              </p>
              <p className="text-white/95 font-medium border-l border-secondary pl-4 py-1">
                A Governance opera como uma estrutura integrada de leitura executiva, conectando variáveis financeiras, operacionais e societárias sob uma visão estratégica unificada.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-[#060D17] border border-white/5 space-y-6">
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                A estrutura permite que consultores, contadores e advisors:
              </div>
              <ul className="space-y-4 font-sans text-sm text-white/85">
                {[
                  'sustentem reuniões mais estratégicas;',
                  'identifiquem dependências operacionais, desalinhamentos financeiros e riscos societários antes que eles comprometam a continuidade da empresa;',
                  'identifiquem fragilidades que normalmente só aparecem quando a crise já começou;',
                  'entreguem mais profundidade analítica;',
                  'ampliem retenção e valor percebido;',
                  'atuem com mais autoridade em decisões complexas.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUPERIOR EXECUTIVE READING BLOCK */}
      <section id="o-que-enxergar" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              CAPACIDADE DE LEITURA
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              O que a Governance permite enxergar.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center pt-8">
            <div className="space-y-6 text-white/70 text-base md:text-lg leading-relaxed font-sans">
              <p>
                Indicadores operacionais isolados criam pontos cegos e suprimem desvios silenciosos. A estrutura da Governance amplia seu campo de visão estratégica.
              </p>
              <p className="text-white/95 font-medium border-l border-secondary pl-4 py-1">
                Mais do que interpretar indicadores, a estrutura amplia a capacidade de leitura executiva sobre a realidade da organização.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-[#060D17] border border-white/5 space-y-6">
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2">
                A Governance amplia a capacidade de leitura sobre:
              </div>
              <ul className="space-y-3 font-sans text-sm text-white/85">
                {[
                  'crescimento sem sustentabilidade;',
                  'dependência excessiva de pessoas-chave;',
                  'desalinhamentos entre operação e financeiro;',
                  'riscos societários silenciosos;',
                  'deterioração estrutural antes da crise;',
                  'fragilidade de expansão;',
                  'conflitos invisíveis entre estratégia e execução.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONSULTATIVE POWER (Visually Elevated for Supreme Authority & Ambition) */}
      <section id="poder-consultivo" className="py-36 px-6 sm:px-8 relative z-10 border-b border-white/5 bg-[#02050A] overflow-hidden">
        {/* Subtle executive glow inside background to draw eye focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.015] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-16 text-center flex flex-col items-center justify-center">
          
          <div className="w-full space-y-6 flex flex-col items-center">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary border-l-2 border-secondary pl-3 inline-block">
              AMPLIAÇÃO DE POSICIONAMENTO
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight text-white leading-tight w-full">
              Saia do operacional e entre em conversas estratégicas.
            </h2>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed font-sans w-full max-w-3xl mx-auto pt-2 block">
              Mais do que visualizar indicadores, a estrutura ajuda parceiros a sustentarem posicionamentos executivos com mais clareza, segurança e profundidade.
            </p>
          </div>

          <div className="w-full max-w-3xl bg-[#060D17]/70 border border-white/10 rounded-xl p-8 sm:p-10 lg:p-12 shadow-2xl relative text-left mx-auto">
            <div className="absolute -top-px left-12 right-12 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />
            <p className="text-white/80 text-base md:text-lg lg:text-xl leading-relaxed font-sans w-full block">
              A Governance ajuda advisors, consultores e especialistas a ampliarem sua atuação através de{" "}
              <span className="text-white font-semibold">inteligência executiva</span>,{" "}
              <span className="text-white font-semibold">leitura executiva integrada</span>,{" "}
              <span className="text-white font-semibold">leitura organizacional</span>,{" "}
              <span className="text-white font-semibold">profundidade consultiva</span>,{" "}
              <span className="text-white font-semibold">direcionamento estratégico</span> e{" "}
              <span className="text-white font-semibold">sustentação estratégica</span>.
            </p>
          </div>

        </div>
      </section>

      {/* 7. COMPETITIVE ADVANTAGE CALLOUTS */}
      <section className="py-24 px-6 relative z-10 border-b border-white/5 bg-[#03080F]/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Transforme relatórios em direcionamento executivo.",
                desc: "Abandone a apresentação de dados brutos e passe a entregar relatórios direcionados a fundadores e conselheiros."
              },
              {
                title: "Tenha uma estrutura de inteligência por trás das suas decisões.",
                desc: "Trabalhe com a segurança de uma estrutura integrada de leitura executiva capaz de conectar riscos patrimoniais, operacionais e financeiros."
              },
              {
                title: "Amplie sua capacidade de advisory sem depender apenas de experiência intuitiva.",
                desc: "Substitua o feeling por uma metodologia estruturada para interpretar riscos patrimoniais, operacionais e decisórios de forma integrada."
              },
              {
                title: "Atenda organizações mais complexas com mais profundidade.",
                desc: "Sustente discussões estratégicas com mais clareza, profundidade e autoridade em desafios estruturais complexos."
              }
            ].map((card, i) => (
              <div key={i} className="p-6 rounded-lg bg-[#060D17]/30 border border-white/5 space-y-4 hover:border-white/10 transition-colors">
                <div className="w-1.5 h-6 bg-secondary rounded-full" />
                <h4 className="text-base font-semibold text-white tracking-tight leading-snug">{card.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed font-sans">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STRATEGIC CAPABILITIES (Extensions of Governance) */}
      <section id="competencias" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-6xl mx-auto space-y-20">
          
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
              CAMADAS DE INTELIGÊNCIA APLICADA
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
              Camadas de inteligência aplicada para ampliar sua capacidade estratégica.
            </h2>
            <p className="text-base md:text-lg text-white/75 font-sans leading-relaxed">
              A Governance integra múltiplas competências para ajudar parceiros a atuarem com mais clareza executiva, profundidade consultiva e sustentação estratégica.
            </p>
          </div>

          {/* Editorial Column-Based List (Option A Layout - Strategic Value Layers) */}
          <div className="space-y-0 pt-8 max-w-4xl mx-auto">
            {[
              {
                icon: ShieldCheck,
                title: 'Governança & Advisory',
                value: '→ suporte para decisões societárias e alinhamento executivo.',
                items: [
                  'conselhos;',
                  'acordos societários;',
                  'sucessão;',
                  'alinhamento entre sócios;',
                  'estruturação executiva;',
                  'continuidade organizacional.'
                ]
              },
              {
                icon: Scale,
                title: 'Jurídico & Compliance',
                value: '→ proteção institucional e mitigação de risco.',
                items: [
                  'blindagem patrimonial;',
                  'conformidade regulatória;',
                  'mitigação de riscos;',
                  'proteção societária;',
                  'responsabilidade executiva;',
                  'segurança jurídica organizacional.'
                ]
              },
              {
                icon: Activity,
                title: 'Inteligência Financeira',
                value: '→ clareza sobre sustentabilidade, crescimento e estrutura de capital.',
                items: [
                  'fluxo de caixa;',
                  'liquidez;',
                  'crescimento sustentável;',
                  'endividamento;',
                  'estrutura de capital;',
                  'geração de valor.'
                ]
              },
              {
                icon: Users,
                title: 'Cultura & Capital Humano',
                value: '→ fortalecimento organizacional e alinhamento de liderança.',
                items: [
                  'profissionalização;',
                  'sucessão;',
                  'governança familiar;',
                  'estruturação de liderança;',
                  'alinhamento cultural;',
                  'desenvolvimento organizacional.'
                ]
              },
              {
                icon: Landmark,
                title: 'ESG & Sustentabilidade',
                value: '→ continuidade institucional e geração sustentável de valor.',
                items: [
                  'práticas sustentáveis;',
                  'governança socioambiental;',
                  'responsabilidade institucional;',
                  'visão de longo prazo;',
                  'continuidade organizacional.'
                ]
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="py-12 border-b border-white/5 flex flex-col md:flex-row md:items-start justify-between gap-8 hover:bg-white/[0.01] px-4 transition-colors"
              >
                <div className="flex flex-col gap-2 md:w-1/2 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0">
                      <item.icon className="text-secondary" size={16} />
                    </div>
                    <h3 className="text-lg font-display font-semibold text-white tracking-tight">{item.title}</h3>
                  </div>
                  <span className="text-sm text-secondary font-medium tracking-wide pl-11 leading-normal font-sans">
                    {item.value}
                  </span>
                </div>
                <div className="md:w-1/2">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                    Suporte estratégico para:
                  </div>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/60 font-sans">
                    {item.items.map((sub, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="text-secondary select-none">•</span>
                        <span>{sub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. STRATEGIC EVOLUTION */}
      <section id="evolucao" className="py-36 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
                EVOLUÇÃO DO ADVISOR
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight text-white leading-tight">
                Transformando especialistas técnicos em operadores estratégicos mais capazes.
              </h2>
              <p className="text-white/70 text-sm md:text-base leading-relaxed font-sans">
                A Governance funciona como uma camada de inteligência executiva por trás da atuação consultiva.
              </p>
            </div>

            <div className="lg:col-span-7 bg-[#060D17]/40 border border-white/5 rounded-xl p-8 md:p-10">
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-3 mb-6">
                A Illumine foi criada para ajudar consultores, contadores e advisors a ampliarem:
              </div>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  'profundidade estratégica;',
                  'clareza executiva;',
                  'capacidade consultiva;',
                  'autoridade relacional;',
                  'sustentação analítica;',
                  'segurança em decisões complexas.'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-secondary mt-0.5 shrink-0" />
                    <span className="text-sm font-sans text-white/85 leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. PREMIUM CTA */}
      <section className="py-36 px-6 relative overflow-hidden z-10 bg-[#02050A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.01] via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
            ESTRUTURA DE ADVISORY
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-[1.15]">
            O próximo nível do advisory exige uma estrutura de interpretação mais sofisticada.
          </h2>
          
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto font-sans leading-relaxed">
            A Illumine conecta inteligência estratégica, governança e interpretação executiva para ampliar a capacidade de atuação de consultores, contadores, advisors e estruturas especializadas.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => handleCTAClick('Olá. Gostaria de compreender melhor o funcionamento da Governance — a estrutura proprietária de inteligência executiva da Illumine.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg"
            >
              <span>Conhecer a Governance</span>
            </button>
            <button
              onClick={() => handleCTAClick('Olá. Gostaria de conversar com a Illumine sobre como a estrutura de inteligência estratégica e governança da Governance pode apoiar nossa atuação.')}
              className="w-full sm:w-auto h-16 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Conversar com a Illumine</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer Minimalist */}
      <footer className="py-12 border-t border-white/5 bg-[#02050A] text-white/40 text-[10px] tracking-wider uppercase font-semibold">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display font-medium text-white/80 text-sm tracking-tight" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>illumine</span>
            <span className="text-[8px] text-white/30">|</span>
            <span>© 2026 Illumine. Todos os direitos reservados.</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">Voltar ao topo</button>
            <button onClick={() => navigate('/empresas')} className="hover:text-white transition-colors">Visualização de Empresas</button>
            <button onClick={onLoginClick} className="hover:text-white transition-colors">Acesso Restrito</button>
          </div>
        </div>
      </footer>

    </main>
  );
}
