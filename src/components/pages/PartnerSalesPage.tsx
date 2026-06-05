import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Activity, CheckCircle2, ArrowRight,
  Users, Scale, Landmark, Building, BrainCircuit, Target,
  ChevronRight, HeartHandshake, ArrowUpRight, Sparkles,
  BarChart3, Briefcase
} from 'lucide-react';

// Quiet, Editorial Causal Topology Watermark (Static & Subdued)
const CausalTopologyVisual = () => {
  const nodes = [
    { id: 1, x: 150, y: 130, label: 'Capacidade Diagnóstica' },
    { id: 2, x: 420, y: 170, label: 'Aconselhamento Estratégico' },
    { id: 3, x: 280, y: 290, label: 'Inteligência Fiduciária' },
    { id: 4, x: 580, y: 230, label: 'Decisões Críticas' },
    { id: 5, x: 740, y: 140, label: 'Clareza Executiva' },
    { id: 6, x: 480, y: 370, label: 'Continuidade Institucional' },
    { id: 7, x: 720, y: 340, label: 'Geração de Valor' }
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
              r="2.5"
              fill="#FF8552"
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
  const [showSticky, setShowSticky] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      if (window.scrollY > 600) setShowSticky(true);
      else setShowSticky(false);
    };
    window.addEventListener('scroll', handleScroll);

    // Add or update meta description tag dynamically for SEO
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', 'Illumine Advisors: Uma infraestrutura de Governança Institucional Inteligente que amplia a capacidade diagnóstica e de aconselhamento de advisors estratégicos.');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = (message: string) => {
    window.open(`https://wa.me/554131514537?text=${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const eixos = [
    { name: 'Financeiro', desc: 'Leitura de liquidez, custos operacionais invisíveis e estrutura fiduciária.', impact: 'Fiduciário' },
    { name: 'Operacional', desc: 'Mapeamento de gargalos reais que impactam no capital de giro do cliente.', impact: 'Sistêmico' },
    { name: 'Pessoas', desc: 'Análise de dependências críticas de liderança e preparo para a sucessão.', impact: 'Continuidade' },
    { name: 'Mercado', desc: 'Estudo da resiliência a ciclos econômicos e pressões competitivas.', impact: 'Estratégico' },
    { name: 'Governança', desc: 'Exame de alçadas decisórias e aderência a acordos societários.', impact: 'Decisório' },
    { name: 'Estratégia', desc: 'Conexão entre o modelo operacional de curto prazo e metas de longo prazo.', impact: 'Direcionamento' },
    { name: 'Institucional', desc: 'Preservação de legado, marcas e governança constitucional.', impact: 'Reputacional' }
  ];

  const intelligences = [
    {
      id: 0,
      title: 'Inteligência Econômica',
      question: 'A organização do cliente gera valor real?',
      icon: <BarChart3 size={20} className="text-secondary" />,
      desc: 'Identifica se o crescimento do cliente realmente produz valor sustentável ou se o crescimento está destruindo caixa de maneira oculta.',
      insights: ['Retorno sobre Capital Empregado (ROIC)', 'Geração de Caixa vs. Lucro Contábil', 'Custos Operacionais Invisíveis']
    },
    {
      id: 1,
      title: 'Inteligência Fiduciária',
      question: 'O patrimônio e o caixa do cliente estão protegidos?',
      icon: <ShieldCheck size={20} className="text-secondary" />,
      desc: 'Avalia a capacidade de preservar recursos, a solvência do negócio no longo prazo e a blindagem contra contingências fiscais e trabalhistas.',
      insights: ['Exposição a Garantias e Fianças', 'Análise de Solvência de Longo Prazo', 'Mitigação de Contingências Críticas']
    },
    {
      id: 2,
      title: 'Inteligência Institucional',
      question: 'A continuidade e o legado do negócio estão assegurados?',
      icon: <Building size={20} className="text-secondary" />,
      desc: 'Analisa a robustez da governança familiar, plano de transição de herdeiros ou gestores e independência dos fundadores.',
      insights: ['Sólidos Mecanismos de Sucessão', 'Proteção e Governança do Legado', 'Autonomia contra Dependência de Fundadores']
    },
    {
      id: 3,
      title: 'Inteligência Causal',
      question: 'Quais os gargalos invisíveis no modelo de negócio?',
      icon: <BrainCircuit size={20} className="text-secondary" />,
      desc: 'Mapeia os gargalos operacionais e físicos que provocam a drenagem silenciosa de capital de giro e reduzem a margem real.',
      insights: ['Elasticidade Operacional dos Custos', 'Gargalos Físicos com Efeito Financeiro', 'Causas de Drenagem de Capital de Giro']
    },
    {
      id: 4,
      title: 'Inteligência Constitucional',
      question: 'As decisões societárias respeitam as alçadas e acordos?',
      icon: <Scale size={20} className="text-secondary" />,
      desc: 'Verifica a aderência a acordos de sócios e limites de alçada, garantindo governança constitucional e segurança decisória.',
      insights: ['Aderência a Acordos de Sócios', 'Auditoria Ativa de Alçadas Decisórias', 'Conformidade com Princípios Fiduciários']
    },
    {
      id: 5,
      title: 'Inteligência Missional',
      question: 'A operação está alinhada ao propósito fundador?',
      icon: <Target size={20} className="text-secondary" />,
      desc: 'Mede a coesão entre o propósito original (legado) e a execução estratégica diária, evitando o desvio gradual de missão.',
      insights: ['Mapeamento de Desvios de Missão', 'Coerência Decisória com o Propósito', 'Índice de Alinhamento da Liderança']
    },
    {
      id: 6,
      title: 'Inteligência Prospectiva',
      question: 'O cliente está pronto para o próximo ciclo de mercado?',
      icon: <Activity size={20} className="text-secondary" />,
      desc: 'Avalia a elasticidade do modelo de negócio frente a volatilidades econômicas e radar de tendências futuras.',
      insights: ['Stress Tests de Impacto Macroeconômico', 'Preparação para Riscos de Mercado', 'Planos de Contingência Estratégica']
    }
  ];

  return (
    <main className="min-h-screen bg-[#03080F] text-white relative overflow-x-hidden font-sans selection:bg-secondary/20 selection:text-secondary antialiased">
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
                className="flex justify-between w-full text-[7px] text-white uppercase mt-[2px] whitespace-nowrap font-semibold" 
                style={{ fontFamily: '"Work Sans", sans-serif', paddingLeft: '2px', paddingRight: '0.5px' }}
              >
                {"Governance".split('').map((char, i) => (
                  <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="hidden lg:flex items-center gap-10">
            <button 
              onClick={() => scrollToSection('cenario')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O Novo Cenário
            </button>
            <button 
              onClick={() => scrollToSection('perguntas')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              As Perguntas
            </button>
            <button 
              onClick={() => scrollToSection('papel-illumine')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              O Papel do Governance
            </button>
            <button 
              onClick={() => scrollToSection('enxergar')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Capacidades
            </button>
            <button 
              onClick={() => scrollToSection('inteligencias')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              As 7 Inteligências
            </button>
            <button 
              onClick={() => scrollToSection('publico-alvo')} 
              className="text-[11px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Para Quem
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
              onClick={() => handleCTAClick('Olá! Desejo agendar uma conversa estratégica sobre a infraestrutura do Illumine Governance™ para advisors.')}
              className="h-10 px-5 rounded-md border border-white/20 hover:border-white text-white font-bold text-[9px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Conversa Estratégica</span>
            </button>
          </div>

        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section id="hero" className="pt-48 pb-24 px-6 relative overflow-hidden z-10 border-b border-white/5 min-h-[90vh] flex items-center">
        <CausalTopologyVisual />
        <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-[9px] font-bold uppercase tracking-widest mb-2 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Illumine Advisors
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
              Sua experiência está evoluindo na mesma velocidade que a complexidade dos seus clientes?
            </h1>
            
            <div className="max-w-3xl mx-auto pt-4 space-y-6">
              <p className="text-lg md:text-xl text-white/75 font-sans leading-relaxed">
                Empresas familiares, holdings, hospitais, indústrias e organizações orientadas por propósito produzem volumes crescentes de informações. 
                O desafio já não é acessar dados. O desafio é interpretar corretamente o que esses dados significam para o futuro da organização. 
                O <span className="text-white font-semibold">Illumine Governance™</span> foi desenvolvido para ampliar a capacidade analítica, estratégica e fiduciária de advisors que desejam atuar em outro nível.
              </p>
              
              <div className="py-4 px-6 bg-[#060D17]/40 border border-white/5 rounded-xl max-w-2xl mx-auto">
                <p className="text-sm italic text-secondary font-medium font-sans">
                  "Sua experiência continua sendo essencial. Mas agora ela pode ser ampliada por uma camada de Governança Institucional Inteligente."
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => scrollToSection('cenario')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-[#03080F] font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
            >
              <span>Conhecer a Jornada de Advisors</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => handleCTAClick('Olá! Desejo agendar uma conversa estratégica sobre a infraestrutura do Illumine Governance™ para advisors.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-white transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Agendar Conversa Estratégica</span>
            </button>
          </motion.div>

        </div>
      </section>

      {/* 2. O NOVO CENÁRIO */}
      <section id="cenario" className="py-28 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
            O Novo Cenário
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
            O conhecimento deixou de ser o diferencial.
          </h2>
          <div className="w-12 h-[1px] bg-secondary/60 mx-auto" />
          
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4 text-left">
            {[
              { role: "Consultores", desc: "possuem conhecimento." },
              { role: "Contadores", desc: "possuem conhecimento." },
              { role: "Advogados", desc: "possuem conhecimento." },
              { role: "Conselheiros", desc: "possuem conhecimento." }
            ].map((item, idx) => (
              <div key={idx} className="p-5 bg-[#060D17]/40 border border-white/5 rounded-lg text-center">
                <span className="block text-white font-bold uppercase tracking-wider text-xs mb-1">{item.role}</span>
                <span className="text-xs text-white/50 font-sans">{item.desc}</span>
              </div>
            ))}
          </div>

          <p className="text-lg md:text-xl text-white/80 leading-relaxed font-sans max-w-2xl mx-auto pt-6">
            O mercado está saturado de especialistas. O diferencial agora é a <span className="text-white font-semibold">capacidade de transformar informação em discernimento estratégico</span>.
          </p>
        </div>
      </section>

      {/* 3. A NOVA PERGUNTA DO ADVISOR */}
      <section id="perguntas" className="py-28 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              A Nova Pergunta do Advisor
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">
              O advisor moderno precisa responder perguntas mais difíceis
            </h2>
            <p className="text-sm text-white/50 max-w-xl mx-auto font-sans leading-relaxed">
              Responder essas perguntas exige mais do que experiência operacional. Exige uma nova camada de inteligência institucional.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { id: 1, text: "O crescimento está destruindo caixa?" },
              { id: 2, text: "A governança suporta o próximo ciclo?" },
              { id: 3, text: "Existem riscos invisíveis de continuidade?" },
              { id: 4, text: "O propósito continua conectado à execução?" },
              { id: 5, text: "A organização está preparada para o futuro?" }
            ].map((card) => (
              <motion.div 
                key={card.id}
                whileHover={{ y: -4 }}
                className="p-6 bg-[#060D17] border border-white/5 rounded-xl flex flex-col justify-between min-h-[160px] hover:border-white/10 transition-all relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-3 text-[36px] font-display font-bold text-white/5 select-none leading-none group-hover:text-secondary/10 transition-colors">
                  0{card.id}
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary/80 mt-1" />
                <h5 className="font-display font-medium text-white text-sm sm:text-base leading-snug pr-4">
                  {card.text}
                </h5>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. O PAPEL DO ILLUMINE GOVERNANCE™ */}
      <section id="papel-illumine" className="py-28 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block">
                Uma camada adicional de inteligência
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white leading-tight">
                Amplie sua capacidade diagnóstica sem substituir sua autoridade.
              </h2>
              <div className="p-6 border-l-2 border-secondary bg-[#060D17]/35 rounded-r-xl">
                <p className="text-sm md:text-base italic text-white/90 leading-relaxed font-sans">
                  "Sua experiência continua sendo essencial. Mas agora ela pode ser ampliada por uma camada de Governança Institucional Inteligente."
                </p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6 text-white/60 text-sm leading-relaxed font-sans lg:border-l lg:border-white/5 pl-0 lg:pl-8">
              <p>
                O <span className="text-white font-semibold">Illumine Governance™</span> não substitui sua experiência, sua especialidade e muito menos seu relacionamento de confiança com seus clientes.
              </p>
              <p>
                Ele atua como uma infraestrutura adicional que amplia sua capacidade de interpretação fiduciária e de governança.
              </p>
              <p className="text-white/80 font-medium">
                Transformando dados dispersos em clareza executiva para decisões críticas em conselhos e diretorias.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. O QUE VOCÊ PASSA A ENXERGAR */}
      <section id="enxergar" className="py-28 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              Visão Expandida
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">
              Amplie sua capacidade diagnóstica
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-sans">
              Com o Illumine Governance™ você passa a identificar com precisão cirúrgica:
            </p>
          </div>

          <div className="bg-[#060D17] border border-white/10 rounded-2xl p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                "riscos de continuidade institucional",
                "dependências críticas de liderança",
                "fragilidades de governança",
                "desalinhamentos entre missão e execução",
                "pressões futuras de liquidez",
                "conflitos estruturais invisíveis",
                "ameaças ao legado organizacional",
                "vetores de criação e destruição de valor",
                "riscos ESG relevantes",
                "oportunidades estratégicas ocultas"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 py-1 group">
                  <div className="text-secondary flex-shrink-0 mt-[4px] group-hover:scale-110 transition-transform">
                    <CheckCircle2 size={13} className="stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-white/80 tracking-wide">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 6. AS 7 INTELIGÊNCIAS (Accordion Premium) */}
      <section id="inteligencias" className="py-28 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="space-y-6 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              Infraestrutura de Interpretação
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">
              As 7 Inteligências ampliam sua capacidade de aconselhamento
            </h2>
            <p className="text-sm text-white/60 max-w-2xl mx-auto leading-relaxed">
              Enquanto muitos profissionais analisam indicadores isolados, o Illumine Governance™ interpreta o impacto desses indicadores sobre o futuro e a continuidade da organização.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch pt-4">
            
            {/* ONDE OBSERVAMOS: 7 Eixos (Esquerda) */}
            <div className="lg:col-span-5 flex flex-col h-full space-y-4">
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-secondary tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Onde Observamos
              </div>

              <div className="bg-[#050B13]/60 border border-white/5 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden flex-1 flex flex-col justify-between">
                <div className="absolute -top-12 -left-12 w-24 h-24 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
                
                {/* Mobile / Tablet Eixos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-2">
                  {eixos.map((eixo, idx) => {
                    const isSelected = activeTab === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`px-3 py-2 text-left border rounded-lg transition-all duration-300 ${
                          isSelected
                            ? 'bg-[#081220] border-secondary/40 text-white shadow-md shadow-secondary/5'
                            : 'bg-[#060D17]/40 border-white/5 text-white/50 hover:border-white/12 hover:text-white/80'
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-secondary' : 'bg-white/20'}`} />
                            <span className="text-[9px] font-mono uppercase tracking-wider font-semibold">{eixo.name}</span>
                          </div>
                          <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest pl-2.5">
                            {eixo.impact}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop Eixos (Vertical dashboard layout) */}
                <div className="hidden lg:flex flex-col flex-1 justify-between relative py-2 gap-4">
                  <div className="absolute left-[17px] top-4 bottom-4 w-[1px] bg-white/5 pointer-events-none" />
                  
                  {eixos.map((eixo, idx) => {
                    const isSelected = activeTab === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`relative pl-10 pr-4 py-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-[#081220]/80 border-white/10 text-white shadow-lg'
                            : 'bg-transparent border-transparent text-white/40 hover:text-white/70'
                        }`}
                      >
                        <div className="absolute left-[17px] top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                          <div className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                            isSelected 
                              ? 'bg-secondary border-secondary scale-110 shadow-lg shadow-secondary/50' 
                              : 'bg-[#03080F] border-white/20'
                          }`} />
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h5 className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-white font-semibold' : 'text-white/60'}`}>
                              {eixo.name}
                            </h5>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider ${
                              isSelected ? 'bg-secondary/15 text-secondary font-medium' : 'bg-white/5 text-white/30'
                            }`}>
                              Impacto: {eixo.impact}
                            </span>
                          </div>
                          <p className={`text-[11px] leading-normal transition-opacity duration-300 font-sans ${isSelected ? 'text-white/75' : 'text-white/35'}`}>
                            {eixo.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COMO INTERPRETAMOS: 7 Inteligências Accordion (Direita) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-white/50 tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                Como Interpretamos
              </div>

              <div className="space-y-3 flex-1 flex flex-col justify-start">
                <div className="space-y-3">
                  {intelligences.map((intel, idx) => {
                    const isOpen = activeTab === idx;
                    return (
                      <div 
                        key={idx}
                        className={`border transition-all duration-300 rounded-xl overflow-hidden ${
                          isOpen 
                            ? 'bg-[#060D17]/90 border-white/10 shadow-2xl backdrop-blur-md' 
                            : 'bg-[#040910]/45 border-white/5 hover:border-white/12 hover:bg-[#060D17]/25'
                        }`}
                      >
                        {/* Header Trigger */}
                        <button
                          onClick={() => setActiveTab(isOpen ? -1 : idx)}
                          className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <span className={`p-3 rounded-xl transition-all duration-300 ${
                              isOpen 
                                ? 'bg-secondary/10 text-secondary scale-110 shadow-lg shadow-secondary/5' 
                                : 'bg-white/5 text-white/70'
                            }`}>
                              {intel.icon}
                            </span>
                            <div>
                              <h5 className={`text-sm sm:text-base font-bold uppercase tracking-wider transition-colors duration-300 ${
                                isOpen ? 'text-white' : 'text-white/75'
                              }`}>
                                {intel.title}
                              </h5>
                              <p className={`text-[10px] font-mono mt-0.5 transition-colors duration-300 ${
                                isOpen ? 'text-secondary/90' : 'text-white/40'
                              }`}>
                                {intel.question}
                              </p>
                            </div>
                          </div>
                          <ChevronRight 
                            size={16} 
                            className={`text-white/35 transition-transform duration-300 ${isOpen ? 'rotate-90 text-secondary' : ''}`} 
                          />
                        </button>

                        {/* Body Details */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-6">
                                <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl font-sans">
                                  {intel.desc}
                                </p>

                                <div className="space-y-3">
                                  <span className="text-[9px] font-mono uppercase text-secondary/80 tracking-wider block font-semibold">
                                    Mapeamento de Sinais do Advisor:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {intel.insights.map((insight, i) => (
                                      <div 
                                        key={i} 
                                        className="px-3 py-2 bg-[#03080F]/60 border border-white/5 text-[10px] text-white/80 transition-all duration-200 rounded-lg flex items-center gap-2 cursor-default hover:bg-[#03080F]/95 hover:border-white/10"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary/80 flex-shrink-0 animate-pulse" />
                                        <span className="font-sans leading-tight">{insight}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Architecture Flow */}
          <div className="pt-8 border-t border-white/5 mt-12 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[9px] font-mono tracking-widest text-white/30 uppercase">
            <span>Sinais Organizacionais</span>
            <ArrowRight size={10} className="text-secondary/70" />
            <span>Framework ESGIM™</span>
            <ArrowRight size={10} className="text-secondary/70" />
            <span>7 Eixos Analíticos</span>
            <ArrowRight size={10} className="text-secondary/70" />
            <span>7 Inteligências de Aconselhamento</span>
            <ArrowRight size={10} className="text-secondary/70" />
            <span className="text-secondary font-semibold">Discernimento Estratégico</span>
          </div>

        </div>
      </section>

      {/* 7. PARA QUEM FOI CRIADO */}
      <section id="publico-alvo" className="py-28 px-6 relative z-10 border-b border-white/5 bg-[#02050A]">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
              A Nova Geração
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-medium tracking-tight text-white">
              Advisors que desejam atuar em outro nível
            </h2>
            <p className="text-sm text-white/50 max-w-[576px] mx-auto font-sans leading-relaxed">
              A nova geração de advisors estratégicos para organizações complexas. Desenvolvido para profissionais que conduzem agendas decisórias fiduciárias e de conselho:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              "Consultores Empresariais",
              "Conselheiros de Administração",
              "Escritórios Contábeis",
              "Escritórios Jurídicos",
              "Especialistas ESG",
              "CFOs Fracionados",
              "Mentores Empresariais",
              "Especialistas em Empresas Familiares",
              "Consultores de Sucessão"
            ].map((profile, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-[#060D17] border border-white/5 rounded-xl hover:border-white/10 hover:bg-[#07111E] transition-all flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-secondary/80" />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                  {profile}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FILOSOFIA DO PROGRAMA (JORNADA) */}
      <section className="py-28 px-6 relative z-10 border-b border-white/5 bg-[#03080F]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
            Filosofia da Jornada
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-medium tracking-tight text-white leading-tight">
            Não estamos formando uma estrutura comercial tradicional.
          </h2>
          <div className="w-12 h-[1px] bg-secondary/60 mx-auto" />
          <p className="text-xl md:text-2xl text-white/95 leading-relaxed font-sans max-w-3xl mx-auto">
            Estamos desenvolvendo uma <span className="text-secondary font-medium">comunidade de advisors</span> capazes de interpretar organizações complexas com maior profundidade.
          </p>
          <div className="pt-2 max-w-2xl mx-auto">
            <p className="text-sm text-white/50 leading-relaxed font-sans">
              O objetivo não é vender tecnologia. O objetivo é ampliar a capacidade de aconselhamento de profissionais qualificados que influenciam decisões importantes no topo das organizações.
            </p>
          </div>
        </div>
      </section>

      {/* 9. DESENVOLVIDO PELA ILLUMINE (Assinatura Metodológica) */}
      <section className="py-20 px-6 relative z-10 bg-[#02050A] border-b border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="relative p-8 md:p-12 bg-[#040911]/45 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm group">
            {/* Glowing accents */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary/[0.02] rounded-full blur-3xl pointer-events-none group-hover:bg-secondary/[0.04] transition-colors duration-500" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              
              {/* Left Side: Brand Signature / Seal */}
              <div className="md:col-span-4 flex flex-col items-center md:items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative shadow-xl hover:border-white/20 transition-all duration-300">
                  <img src="/logo.png" alt="Illumine Signature Logo" className="w-10 h-10 object-contain" />
                  <div className="absolute -inset-0.5 rounded-2xl border border-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-secondary uppercase block">
                    Assinatura Metodológica
                  </span>
                  <h5 className="text-xl font-display font-medium text-white tracking-tight">
                    Desenvolvido pela Illumine
                  </h5>
                </div>
              </div>

              {/* Center Divider line */}
              <div className="hidden md:block md:col-span-1 justify-self-center">
                <div className="w-px h-16 bg-white/10" />
              </div>

              {/* Right Side: Editorial Statement */}
              <div className="md:col-span-7 text-center md:text-left">
                <p className="text-sm text-white/70 leading-relaxed font-sans font-light">
                  O <span className="text-white font-medium">Illumine Governance™</span> é uma solução proprietária desenvolvida pela <span className="text-white font-medium">Illumine Consultoria e Mentoria Empresarial</span>. 
                  Sua arquitetura combina governança, inteligência institucional, análise causal e frameworks proprietários desenvolvidos para apoiar decisões críticas em organizações complexas.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA FINAL */}
      <section className="py-24 px-6 relative overflow-hidden z-10 bg-[#03080F]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">
            Nova Geração de Aconselhamento
          </span>
          <div className="space-y-4">
            <h5 className="text-sm font-mono uppercase tracking-widest text-white/40">
              O futuro do aconselhamento
            </h5>
            <p className="text-2xl sm:text-3xl md:text-4xl font-display font-medium text-white leading-tight max-w-3xl mx-auto">
              O futuro do aconselhamento não pertence a quem possui mais dados. Pertence a quem consegue interpretá-los melhor.
            </p>
            <p className="text-sm md:text-base text-white/75 max-w-2xl mx-auto leading-relaxed font-sans">
              Amplie sua capacidade diagnóstica. Amplie sua capacidade de influência. Amplie o valor fiduciário e estratégico que você entrega aos seus clientes.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <button
              onClick={() => handleCTAClick('Olá! Acessei a página de Advisors e desejo iniciar a Jornada de Advisors Illumine.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-white text-[#03080F] font-bold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl cursor-pointer"
            >
              <span>Tornar-se Advisor Illumine</span>
            </button>
            <button
              onClick={() => handleCTAClick('Olá! Desejo agendar uma conversa estratégica sobre a infraestrutura do Illumine Governance™ para advisors.')}
              className="w-full sm:w-auto h-14 px-8 rounded-md bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 hover:border-white transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Agendar Conversa Estratégica</span>
            </button>
          </div>
        </div>
      </section>

      {/* STICKY FLOATING CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex items-center"
          >
            <a
              href={`https://wa.me/554131514537?text=${encodeURIComponent("Olá! Desejo iniciar a Jornada de Advisors Illumine e conhecer a infraestrutura de Governança Institucional Inteligente.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 h-14 bg-white text-[#03080F] font-bold text-[10px] uppercase tracking-widest rounded-full shadow-2xl hover:bg-white/90 transition-all cursor-pointer border border-white/10 no-underline font-sans"
            >
              <Briefcase size={14} className="text-secondary" />
              <span>Jornada de Advisors</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Minimalist */}
      <footer className="py-16 border-t border-white/5 bg-[#02050A] text-white/40 text-[10px] tracking-wider uppercase font-semibold">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="font-display font-medium text-white/80 text-sm tracking-tight" style={{ fontFamily: '"Tilt Warp", sans-serif' }}>illumine</span>
              <span className="text-[8px] text-white/30">|</span>
              <span>© 2026 Illumine Governance™. Todos os direitos reservados.</span>
            </div>
            <div className="flex gap-6 font-semibold">
              <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors">Voltar ao Topo</button>
              <button onClick={() => navigate('/empresas')} className="hover:text-white transition-colors">Empresas</button>
              <button onClick={onLoginClick} className="hover:text-white transition-colors">Acesso Restrito</button>
            </div>
          </div>
        </div>
      </footer>

    </main>
  );
}
